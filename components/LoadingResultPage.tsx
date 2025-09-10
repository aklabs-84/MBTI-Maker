import React, { useState, useEffect } from 'react';

const MESSAGES = [
    "결과를 분석하고 있어요...",
    "당신의 MBTI 유형을 해석하는 중...",
    "AI가 당신의 성향에 대한 보고서를 작성 중입니다...",
    "거의 다 됐어요! 멋진 결과가 기다리고 있습니다...",
];

const LoadingResultPage: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % MESSAGES.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl shadow-lg w-full max-w-md mx-auto animate-fade-in">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-pink-500 mb-6 border-t-transparent"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{MESSAGES[messageIndex]}</h2>
        <p className="text-gray-600">
            AI가 당신의 답변을 바탕으로
            <br />
            개인화된 분석을 생성하고 있습니다.
        </p>
    </div>
  );
};

export default LoadingResultPage;