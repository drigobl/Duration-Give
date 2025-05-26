import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div className={cn(
      'bg-white rounded-lg shadow-card border border-gray-100',
      hover && 'transition-all duration-200 ease-in-out hover:shadow-card-hover',
      className
    )}>
      {children}
    </div>
  );
}