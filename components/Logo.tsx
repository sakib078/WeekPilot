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
      {/* Circle Background */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        stroke="#D4C5A9" 
        strokeWidth="3" 
        fill="#FBF8F3" 
      />
      
      {/* W Arrow Shape - Clean Geometric Path */}
      {/* 
         Standard W coordinates: 
         Start: 26, 42
         Bottom-Left: 36, 68
         Middle-Top: 50, 40
         Bottom-Right: 64, 68
         End (Arrow Tip): 80, 26
      */}
      <path 
        d="M26 42 L36 68 L50 40 L64 68 L80 26" 
        stroke="#2E3A8C" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Arrow Head - 90 degree angle pointing North-East */}
      <path 
        d="M66 26 L80 26 L80 40" 
        stroke="#2E3A8C" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

export default Logo;