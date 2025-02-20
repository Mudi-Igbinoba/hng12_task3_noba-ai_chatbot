import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number; // Progress value (0-100)
  size?: number; // Diameter of the circle
  strokeWidth?: number; // Thickness of the progress stroke
  className?: string;
}

export function CircularProgress({
  value,
  size = 20,
  strokeWidth = 2,
  className
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <span
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke='rgba(255, 255, 255, 0.2)'
          strokeWidth={strokeWidth}
          fill='none'
          // className='fill-secondary'
        />

        {/* Progress Indicator */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke='white'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          fill='none'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} // Rotate so it starts from top
          className='transition-all duration-300 stroke-yellow-500'
        />
      </svg>

      {/* Percentage Display */}
      {/* <span className='absolute text-black text-sm font-semibold'>
        {value}%
      </span> */}
    </span>
  );
}
