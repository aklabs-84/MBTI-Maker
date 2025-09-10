import React, { useState, useCallback } from 'react';
import { Page, Question, MBTIResult, MbtiScores, InterpretationDetail } from './types';
import { MBTI_AXES } from './constants';
import { 
    generateQuestions as apiGenerateQuestions, 
    generateResultInterpretation, 
    generateTieBreakerQuestion,
    generateTopicSuggestions
} from './services/geminiService';
import { getFallbackQuestions } from './services/fallbackService';
import HomePage from './components/HomePage';
import LoadingSuggestionsPage from './components/LoadingSuggestionsPage';
import SuggestionPage from './components/SuggestionPage';
import LoadingQuizPage from './components/LoadingQuizPage';
import QuizPage from './components/QuizPage';
import LoadingResultPage from './components/LoadingResultPage';
import ResultPage from './components/ResultPage';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [keyword, setKeyword] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, 'L' | 'R'>>({});
  const [scores, setScores] = useState<MbtiScores>({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
  const [result, setResult] = useState<MBTIResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestionGeneration = async (newKeyword: string, style?: string) => {
    setIsLoading(true);
    setError(null);
    setKeyword(newKeyword);
    setPage('loadingSuggestions');

    try {
        const generatedSuggestions = await generateTopicSuggestions(newKeyword, style);
        setSuggestions(generatedSuggestions);
        setPage('suggestion');
    } catch (err) {
        console.error("Suggestion generation failed:", err);
        setError("AI 주제 추천에 실패했습니다. 잠시 후 다시 시도해주세요.");
        setPage('home'); // Go back to home on error to display it
    } finally {
        setIsLoading(false);
    }
  };

  const startQuiz = async (selectedTopic: string) => {
    setPage('loadingQuiz');
    setTopic(selectedTopic);
    setError(null);
    
    // Reset previous quiz state
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    setResult(null);

    try {
      const generatedQuestions = await apiGenerateQuestions(selectedTopic);
      setQuestions(generatedQuestions);
    } catch (err) {
      console.error("API failed, using fallback:", err);
      setError("AI 질문 생성에 실패했습니다. 일반 질문으로 시작합니다.");
      const fallbackQuestions = getFallbackQuestions(selectedTopic);
      setQuestions(fallbackQuestions);
    }
    
    setPage('quiz');
  };

  const calculateResult = useCallback(async (finalAnswers: Record<string, 'L' | 'R'>) => {
    setIsLoading(true);
    let finalScores: MbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    questions.forEach(q => {
      const answer = finalAnswers[q.id];
      if (answer) {
        const choice = q.choices.find(c => c.id === answer);
        if (choice) {
          finalScores[choice.polarity] += q.weight;
        }
      }
    });

    setScores(finalScores);
    
    let mbtiType = '';

    for (const axis of MBTI_AXES) {
        const [d1, d2] = axis;
        if (finalScores[d1] > finalScores[d2]) {
            mbtiType += d1;
        } else if (finalScores[d2] > finalScores[d1]) {
            mbtiType += d2;
        } else {
            try {
                const tieBreaker = await generateTieBreakerQuestion(topic, axis);
                setQuestions(prev => [...prev, tieBreaker]);
                setIsLoading(false);
                return; // Stop calculation, wait for user to answer tie-breaker
            } catch (err) {
                console.error("Tie-breaker generation failed:", err);
                mbtiType += 'X'; // Fallback for tie-breaker failure
            }
        }
    }
    
    setPage('loadingResult');

    try {
      const interpretation = await generateResultInterpretation(topic, mbtiType);
      const contributingQuestions = [...questions].sort((a, b) => b.weight - a.weight).slice(0, 3).map(q => ({
        text: q.text,
        choice: q.choices.find(c => c.id === finalAnswers[q.id])?.label || ''
      }));

      setResult({
        type: mbtiType,
        scores: finalScores,
        interpretation,
        contributingQuestions
      });
      setPage('result');
    } catch(err) {
        setError("Failed to generate result interpretation.");
        const fallbackInterpretation: InterpretationDetail = {
            title: "결과를 분석하지 못했어요",
            emoji: "😢",
            summary: `"${topic}"에 대한 당신의 MBTI 유형은 ${mbtiType} 입니다.`,
            match: { type: "N/A", description: "AI 분석에 실패하여 추천할 수 없습니다." },
            strengths: [],
            weaknesses: [],
            characteristics: ["AI 오류"]
        };
        setResult({
          type: mbtiType,
          scores: finalScores,
          interpretation: fallbackInterpretation,
          contributingQuestions: []
        });
        setPage('result');
    } finally {
        setIsLoading(false);
    }
  }, [questions, topic]);


  const handleAnswer = (questionId: string, choiceId: 'L' | 'R') => {
    const newAnswers = { ...answers, [questionId]: choiceId };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResult(newAnswers);
    }
  };
  
  const goHome = () => {
    setPage('home');
    setError(null);
  }

  const restart = () => {
    setPage('home');
    setKeyword('');
    setTopic('');
    setSuggestions([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    setResult(null);
    setError(null);
  };

  const renderPage = () => {
    switch (page) {
      case 'loadingSuggestions':
        return <LoadingSuggestionsPage keyword={keyword} />;
      case 'suggestion':
        return <SuggestionPage 
                    keyword={keyword}
                    suggestions={suggestions}
                    onSelectTopic={startQuiz}
                    onRegenerate={(style: string) => handleSuggestionGeneration(keyword, style)}
                    onBack={goHome}
                    isLoading={isLoading}
                />;
      case 'loadingQuiz':
        return <LoadingQuizPage topic={topic} />;
      case 'quiz':
        return <QuizPage
          key={currentQuestionIndex}
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          isTieBreaker={questions[currentQuestionIndex]?.weight > 1}
        />;
      case 'loadingResult':
        return <LoadingResultPage />;
      case 'result':
        return result && <ResultPage 
                            result={result} 
                            topic={topic}
                            questions={questions}
                            answers={answers}
                            onRestart={restart} 
                         />;
      case 'home':
      default:
        return <HomePage onStart={(keyword) => handleSuggestionGeneration(keyword)} isLoading={isLoading} error={error} />;
    }
  };
  
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-8 font-sans">
      {page === 'quiz' && (
        <div className="fixed top-0 left-0 w-full h-2 bg-rose-100 z-50">
            <div 
                className="h-full bg-gradient-to-r from-pink-500 to-orange-400 rounded-r-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
      )}
      <main className="w-full max-w-xl md:max-w-2xl mx-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;