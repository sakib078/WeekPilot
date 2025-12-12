import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Circle Background (Beige/Gold tone) */}
      <circle cx="50" cy="50" r="48" stroke="#D4C5A9" strokeWidth="3" fill="#FBF8F3" />
      
      {/* W with Arrow Path */}
      {/* Abstract W shape that transitions into an arrow pointing top-right */}
      <path 
        d="M28 48 L40 68 L52 48 C52 48 56 40 64 40 C72 40 70 28 82 20 M82 20 L72 22 M82 20 L78 30" 
        stroke="#2E3A8C" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
      {/* Arrowhead fix to ensure it looks sharp */}
      <path 
        d="M82 20 L68 28 L82 36 Z" 
        fill="#2E3A8C"
        stroke="#2E3A8C" 
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Left stroke of W */}
      <path 
        d="M20 40 L30 68" 
        stroke="#2E3A8C" 
        strokeWidth="10" 
        strokeLinecap="round" 
      />
    </svg>
  );
};

export default Logo;