import React from 'react';

interface SuggestionPageProps {
    keyword: string;
    suggestions: string[];
    onSelectTopic: (topic: string) => void;
    onRegenerate: (style: string) => void;
    onBack: () => void;
    isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 rounded-full animate-pulse bg-pink-300"></div>
      <div className="w-4 h-4 rounded-full animate-pulse bg-pink-300 delay-200"></div>
      <div className="w-4 h-4 rounded-full animate-pulse bg-pink-300 delay-400"></div>
    </div>
  );

const SuggestionPage: React.FC<SuggestionPageProps> = ({ keyword, suggestions, onSelectTopic, onRegenerate, onBack, isLoading }) => {
    const styleButtons = ['재미있게', '창의적으로', '심플하게'];
    
    return (
        <div className="flex flex-col items-center w-full p-8 bg-white rounded-3xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">
                "<span className="font-bold text-pink-500">{keyword}</span>"에 대한 이런 주제는 어떠세요?
            </h2>

            <div className="w-full max-w-sm space-y-3 mb-8">
                {suggestions.map((topic, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectTopic(topic)}
                        className="w-full p-4 bg-rose-50 rounded-2xl border-2 border-rose-200 hover:border-pink-400 hover:bg-rose-100 transition-all duration-300 text-left transform hover:scale-105"
                    >
                        <p className="text-lg text-gray-700">{topic}</p>
                    </button>
                ))}
            </div>

            <div className="w-full max-w-sm">
                <p className="text-center text-gray-500 mb-3 text-sm">다른 스타일의 주제를 원하세요?</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {styleButtons.map(style => (
                        <button
                            key={style}
                            onClick={() => onRegenerate(style)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-rose-100 text-pink-600 font-semibold rounded-full border-2 border-rose-200 hover:bg-rose-200 hover:border-pink-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                             {isLoading ? <LoadingSpinner /> : style}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onBack}
                    className="w-full px-6 py-3 mt-2 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
                    disabled={isLoading}
                >
                    뒤로가기
                </button>
            </div>
        </div>
    );
};

export default SuggestionPage;