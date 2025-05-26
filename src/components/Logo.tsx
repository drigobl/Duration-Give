import React, { useState } from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-2xl font-bold">GP</span>
      </div>
    );
  }

  return (
    <img
      src="/logo.svg"
      alt="Give Protocol"
      className={className}
      width={32}
      height={32}
      onError={() => setError(true)}
    />
  );
};