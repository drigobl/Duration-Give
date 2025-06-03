```typescript
import React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: 'pulse' | 'wave' | 'none';
  width?: number | string;
  height?: number | string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  animation = 'pulse',
  width,
  height,
  count = 1,
  className,
  ...props
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  const getAnimationClass = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'animate-shimmer';
      default:
        return '';
    }
  };

  const style = {
    width: width,
    height: height,
  };

  return (
    <>
      {items.map((index) => (
        <div
          key={index}
          className={cn(
            'bg-gray-200 rounded',
            getAnimationClass(),
            className
          )}
          style={style}
          {...props}
        />
      ))}
    </>
  );
};
```