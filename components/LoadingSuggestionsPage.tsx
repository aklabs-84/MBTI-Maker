import React, { useState, useEffect } from 'react';

interface LoadingSuggestionsPageProps {
  keyword: string;
}

const MESSAGES = [
    "최고의 아이디어를 찾고 있어요...",
    "키워드를 창의적으로 조합하는 중...",
    "영감의 샘에서 아이디어를 길어오는 중...",
    "재미있는 주제를 만들기 위해 노력 중!",
];

const LoadingSuggestionsPage: React.FC<LoadingSuggestionsPageProps> = ({ keyword }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % MESSAGES.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl shadow-lg w-full mx-auto animate-fade-in">
        <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-pink-300 rounded-full animate-ping opacity-75"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-pink-500 rounded-full text-white text-4xl">
                💡
            </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{MESSAGES[messageIndex]}</h2>
        <p className="text-gray-600">
            "<span className="font-semibold text-pink-500">{keyword}</span>" 키워드에 맞는
            <br />
            재미있는 주제를 생성하는 중입니다.
        </p>
    </div>
  );
};

export default LoadingSuggestionsPage;