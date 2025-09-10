import React, { useState, useEffect } from 'react';

interface LoadingQuizPageProps {
  topic: string;
}

const MESSAGES = [
    "당신만을 위한 질문을 고르고 있어요...",
    "MBTI 요정과 비밀스럽게 소통하는 중...",
    "창의력 엔진 가동! 잠시만 기다려주세요...",
    "AI가 당신의 성향을 예측하고 있습니다...",
];

const LoadingQuizPage: React.FC<LoadingQuizPageProps> = ({ topic }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % MESSAGES.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl shadow-lg w-full max-w-md mx-auto animate-fade-in">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-pink-500 mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{MESSAGES[messageIndex]}</h2>
        <p className="text-gray-600">
            "<span className="font-semibold text-pink-500">{topic}</span>" 주제에 대한
            <br />
            맞춤 질문을 생성하는 중입니다.
        </p>
    </div>
  );
};

export default LoadingQuizPage;