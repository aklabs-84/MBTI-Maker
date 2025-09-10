import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    role="img"
    aria-labelledby="logoTitle"
  >
    <title id="logoTitle">AI Topic MBTI Logo</title>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" className="text-pink-500" stopColor="currentColor" />
        <stop offset="100%" className="text-orange-400" stopColor="currentColor" />
      </linearGradient>
    </defs>
    <path
      fill="url(#logoGradient)"
      d="M12 2.75C9.28 2.75 7.15 4.88 7.15 7.6c0 .8.18 1.58.52 2.27c.07.15.15.28.24.41c-1.29.9-2.16 2.4-2.16 4.12c0 2.22 1.4 4.1 3.25 4.67V21h1c.41 0 .75-.34.75-.75V19.5h2.5v1.75c0 .41.34.75.75.75h1v-1.95c1.85-.56 3.25-2.45 3.25-4.67c0-1.72-.87-3.22-2.16-4.12c.09-.13.17-.26.24-.41c.34-.69.52-1.47.52-2.27c0-2.72-2.13-4.85-4.85-4.85zm0 1.5A3.35 3.35 0 0 1 15.35 7.6c0 .64-.17 1.25-.46 1.79c-.58 1.05-1.53 1.9-2.89 2.26c-1.36-.36-2.3-1.21-2.89-2.26C8.82 8.85 8.65 8.24 8.65 7.6A3.35 3.35 0 0 1 12 4.25z"
    />
  </svg>
);

export default Logo;
