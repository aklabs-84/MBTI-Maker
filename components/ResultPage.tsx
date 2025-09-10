import React, { useState } from 'react';
import { MBTIResult, MbtiDimension, Question } from '../types';
import { MBTI_AXES } from '../constants';

interface ResultPageProps {
  result: MBTIResult;
  topic: string;
  questions: Question[];
  answers: Record<string, 'L' | 'R'>;
  onRestart: () => void;
}

const Confetti: React.FC = () => {
  const confettiCount = 80;
  const colors = ['#f472b6', '#fb923c', '#facc15', '#4ade80', '#60a5fa'];

  return (
    <div aria-hidden="true" className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: confettiCount }).map((_, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            width: `${Math.random() * 8 + 6}px`,
            height: `${Math.random() * 8 + 6}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            top: '-10%',
            left: `${Math.random() * 100}%`,
            opacity: `${Math.random() + 0.5}`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `confetti-fall ${Math.random() * 2 + 3}s cubic-bezier(0.25, 1, 0.5, 1) ${Math.random() * 2}s forwards`,
          }}
        />
      ))}
    </div>
  );
};

const DimensionBar: React.FC<{
  d1: MbtiDimension;
  d2: MbtiDimension;
  percent: number; // Percentage for the left dimension (d1)
  color: string;
}> = ({ d1, d2, percent, color }) => {
    const isLeftDominant = percent > 50;
    const isRightDominant = percent < 50;

    // Calculate the width of the bar based on how far from the 50% center it is.
    // The multiplier '2' scales it so that a 100% score for one side fills its entire half of the bar.
    // e.g., if percent is 75 (75% for d1), strength is (75-50)*2 = 50% of the left side container.
    // e.g., if percent is 25 (25% for d1), strength is (50-25)*2 = 50% of the right side container.
    const leftStrength = isLeftDominant ? (percent - 50) * 2 : 0;
    const rightStrength = isRightDominant ? (50 - percent) * 2 : 0;

    return (
        <div>
            {/* Labels */}
            <div className="flex justify-between items-center mb-1.5 text-sm font-bold">
                <span className={`transition-all duration-300 ${isLeftDominant ? 'text-gray-800 scale-110' : 'text-gray-400'}`}>{d1}</span>
                <span className="text-gray-500 text-xs font-medium">{d1} vs {d2}</span>
                <span className={`transition-all duration-300 ${isRightDominant ? 'text-gray-800 scale-110' : 'text-gray-400'}`}>{d2}</span>
            </div>
            {/* Two-sided Bar */}
            <div className="flex items-center w-full">
                {/* Left side container */}
                <div className="flex-1 bg-gray-200 rounded-l-full h-2.5 overflow-hidden">
                    <div
                        className={`${isLeftDominant ? color : ''} h-full rounded-l-full transition-all duration-500 ease-out`}
                        style={{ width: `${leftStrength}%`, marginLeft: 'auto' }}
                    ></div>
                </div>
                {/* Center divider */}
                <div className="w-0.5 h-4 bg-gray-300"></div>
                {/* Right side container */}
                <div className="flex-1 bg-gray-200 rounded-r-full h-2.5 overflow-hidden">
                     <div
                        className={`${isRightDominant ? color : ''} h-full rounded-r-full transition-all duration-500 ease-out`}
                        style={{ width: `${rightStrength}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};


const ResultPage: React.FC<ResultPageProps> = ({ result, topic, questions, answers, onRestart }) => {
    const [activeTab, setActiveTab] = useState('analysis');
    
    const shareResult = () => {
        const textToCopy = `나의 Topic MBTI 결과는 "${result.type}: ${result.interpretation.title}" 입니다!\n\n${result.interpretation.summary}\n\n여러분도 테스트해보세요!`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('결과가 클립보드에 복사되었습니다!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const handleDownload = () => {
        let content = `========================================\n`;
        content += ` AI Topic MBTI - 생성된 테스트 정보\n`;
        content += `========================================\n\n`;
    
        content += `주제: ${topic}\n\n`;
    
        content += `----------------------------------------\n`;
        content += ` 최종 MBTI 유형: ${result.type}\n`;
        content += `----------------------------------------\n\n`;
    
        content += `========================================\n`;
        content += ` 📝 생성된 질문 및 보기 전체\n`;
        content += `========================================\n\n`;
    
        questions.forEach((q, index) => {
            const userAnswerId = answers[q.id];
            content += `${index + 1}. ${q.text}\n`;
            
            q.choices.forEach(choice => {
                const isSelected = choice.id === userAnswerId;
                content += `   ${isSelected ? '▶' : '○'} ${choice.label}\n`;
            });
            content += `\n`;
        });
    
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mbti_test_${topic.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getDimensionPercentage = (d1: MbtiDimension, d2: MbtiDimension): number => {
        const score1 = result.scores[d1] || 0;
        const score2 = result.scores[d2] || 0;
        const total = score1 + score2;
        if (total === 0) return 50; // A neutral 50% if no score
        return (score1 / total) * 100;
    };

    const dimensionColors = {
        EI: 'bg-gradient-to-r from-red-400 to-orange-400',
        SN: 'bg-gradient-to-r from-yellow-400 to-lime-400',
        TF: 'bg-gradient-to-r from-green-400 to-cyan-400',
        JP: 'bg-gradient-to-r from-sky-400 to-purple-400',
    };

    return (
        <>
        <Confetti />
        <div className="flex flex-col items-center w-full p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg animate-fade-in space-y-6">
            <div className="text-center w-full">
                <p className="text-lg text-gray-500 mb-2">당신의 결과는...</p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    <span className="text-5xl mr-2">{result.interpretation.emoji}</span>
                    {result.interpretation.title}
                </h1>
                <h2 className="text-6xl md:text-7xl font-black mt-2">
                    <span className="bg-gradient-to-r from-pink-500 to-orange-400 text-transparent bg-clip-text">
                        {result.type.split('').map((char, index) => (
                            <span 
                            key={index} 
                            className="animate-pop-in"
                            style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {char === 'X' ? <span className="text-gray-300">X</span> : char}
                            </span>
                        ))}
                    </span>
                </h2>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {result.interpretation.characteristics.map((char, index) => (
                        <span key={index} className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
                            #{char}
                        </span>
                    ))}
                </div>
            </div>

            <div className="w-full p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-lg font-bold text-slate-800 text-center mb-2">나의 성향 분석</h3>
                {MBTI_AXES.map(([d1, d2]) => (
                    <DimensionBar
                        key={`${d1}${d2}`}
                        d1={d1}
                        d2={d2}
                        percent={getDimensionPercentage(d1, d2)}
                        color={dimensionColors[`${d1}${d2}` as keyof typeof dimensionColors]}
                    />
                ))}
            </div>

            <div className="w-full">
                <div className="flex border-b border-gray-200">
                    <button onClick={() => setActiveTab('analysis')} className={`flex-1 py-2 text-center font-semibold transition-colors duration-300 ${activeTab === 'analysis' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-500 hover:text-pink-400'}`}>AI 분석</button>
                    <button onClick={() => setActiveTab('details')} className={`flex-1 py-2 text-center font-semibold transition-colors duration-300 ${activeTab === 'details' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-500 hover:text-pink-400'}`}>상세 정보</button>
                </div>
                <div className="p-4 bg-slate-50 rounded-b-xl">
                    {activeTab === 'analysis' && (
                        <div className="animate-fade-in">
                            <p className="text-gray-700 leading-relaxed">{result.interpretation.summary}</p>
                        </div>
                    )}
                    {activeTab === 'details' && (
                         <div className="animate-fade-in space-y-4">
                            <div>
                                <h4 className="font-semibold text-green-600 mb-2">강점</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    {result.interpretation.strengths.map((s, i) => <li key={`s-${i}`}>{s}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-red-600 mb-2">약점</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    {result.interpretation.weaknesses.map((w, i) => <li key={`w-${i}`}>{w}</li>)}
                                </ul>
                            </div>
                            <div className="pt-2">
                                <h4 className="font-semibold text-sky-600 mb-2">찰떡궁합 MBTI</h4>
                                <div className="flex items-center space-x-4 p-3 bg-white rounded-lg border">
                                    <span className="text-2xl font-bold text-pink-500 px-3 py-1 bg-pink-100 rounded-lg">{result.interpretation.match.type}</span>
                                    <p className="text-gray-600 text-sm">{result.interpretation.match.description}</p>
                                </div>
                            </div>
                         </div>
                    )}
                </div>
            </div>

            <div className="w-full pt-4 space-y-3">
                <div className="flex space-x-3">
                    <button
                        onClick={shareResult}
                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
                    >
                        공유하기
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex-1 px-6 py-3 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-600 transition-all duration-300 transform hover:scale-105"
                    >
                        결과 다운로드
                    </button>
                </div>
                <button
                    onClick={onRestart}
                    className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                >
                    다시하기
                </button>
            </div>
        </div>
        </>
    );
};

export default ResultPage;