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
      {/* Circle Background - Matches bg-white and border-slate-200 theme */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        stroke="#e2e8f0" 
        strokeWidth="3" 
        fill="#ffffff" 
      />
      
      {/* W Arrow Shape - Indigo-600 (WeekPilot Blue) */}
      <path 
        d="M26 42 L36 68 L50 40 L64 68 L80 26" 
        stroke="#4f46e5" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Arrow Head - Indigo-600 */}
      <path 
        d="M66 26 L80 26 L80 40" 
        stroke="#4f46e5" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

export default Logo;