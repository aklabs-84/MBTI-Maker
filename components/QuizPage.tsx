import React from 'react';
import { Question } from '../types';

interface QuizPageProps {
  question: Question;
  onAnswer: (questionId: string, choiceId: 'L' | 'R') => void;
  isTieBreaker: boolean;
}

const QuizPage: React.FC<QuizPageProps> = ({ question, onAnswer, isTieBreaker }) => {
  if (!question) {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-white rounded-3xl shadow-lg">
            <div className="w-12 h-12 rounded-full animate-spin border-4 border-dashed border-pink-500 border-t-transparent"></div>
            <p className="text-lg text-gray-600">질문을 불러오는 중...</p>
        </div>
    );
  }
  
  return (
    <div className="w-full flex flex-col items-center p-8 bg-white rounded-3xl shadow-lg animate-fade-in">
      {isTieBreaker && (
        <div className="mb-4 px-4 py-1 bg-amber-100 text-amber-700 text-sm font-bold rounded-full border border-amber-300">
          🤔 마지막 결정!
        </div>
      )}

      <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-8 leading-snug">
        <span className="text-5xl block mb-4">{question.icon}</span>
        {question.text}
      </h2>

      <div className="w-full grid grid-cols-1 gap-4">
        {question.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => onAnswer(question.id, choice.id)}
            className="p-5 bg-rose-50 rounded-2xl border-2 border-rose-200 hover:border-pink-400 hover:bg-rose-100 transition-all duration-300 text-left transform hover:scale-105 active:scale-100 active:bg-rose-200"
          >
            <p className="text-lg text-gray-700">{choice.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizPage;