import React, { useState } from 'react';
import Logo from './Logo';

interface HomePageProps {
  onStart: (keyword: string) => void;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-4 h-4 rounded-full animate-pulse bg-white"></div>
    <div className="w-4 h-4 rounded-full animate-pulse bg-white delay-200"></div>
    <div className="w-4 h-4 rounded-full animate-pulse bg-white delay-400"></div>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ onStart, isLoading, error }) => {
  const [keyword, setKeyword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.length < 2 || keyword.length > 20) {
      setValidationError('키워드는 2자 이상 20자 이하로 입력해주세요.');
      return;
    }
    setValidationError('');
    onStart(keyword);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl shadow-lg">
      <Logo className="w-24 h-auto mb-4" />
      <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-orange-400 text-transparent bg-clip-text">
        AI Topic MBTI
      </h1>
      <p className="text-lg text-gray-600 mb-8">키워드를 입력하고 AI가 추천하는 주제로 MBTI를 알아보세요.</p>
      
      {error && <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-2 rounded-xl mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="예: 여행, 사랑, 코딩"
          className="w-full px-4 py-3 bg-rose-100 border-2 border-rose-200 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:border-pink-400 transition-all duration-300"
          disabled={isLoading}
        />
        {validationError && <p className="text-red-500 mt-2 text-sm">{validationError}</p>}
        <button
          type="submit"
          disabled={isLoading || !keyword}
          className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-full hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isLoading ? <LoadingSpinner /> : '주제 추천받기'}
        </button>
      </form>
    </div>
  );
};

export default HomePage;