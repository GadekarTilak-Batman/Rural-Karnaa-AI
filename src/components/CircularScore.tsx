import React from 'react';

interface CircularScoreProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  statusText?: string;
  subtext?: string;
  showBreakdownPill?: boolean;
}

export const CircularScore: React.FC<CircularScoreProps> = ({
  score,
  maxScore = 100,
  size = 180,
  strokeWidth = 14,
  statusText = 'Needs Attention',
  subtext = 'Educational Indicator',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, score / maxScore));
  const strokeDashoffset = circumference * (1 - progress);

  // Color logic
  let strokeColor = '#059669'; // Emerald
  let bgGradient = 'from-emerald-50 to-emerald-100/40 text-emerald-800';
  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';

  if (score < 50) {
    strokeColor = '#e11d48'; // Rose
    bgGradient = 'from-rose-50 to-rose-100/40 text-rose-800';
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
  } else if (score < 75) {
    strokeColor = '#d97706'; // Amber
    bgGradient = 'from-amber-50 to-amber-100/40 text-amber-800';
    badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 origin-center"
          aria-label={`Financial Health Score: ${score} out of ${maxScore}`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e7e5e4"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold tracking-tight text-stone-900">
            {score}
          </span>
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            / {maxScore}
          </span>
        </div>
      </div>

      {statusText && (
        <div className="mt-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
            {statusText}
          </span>
        </div>
      )}

      {subtext && (
        <p className="text-xs text-stone-500 mt-1 max-w-[200px]">
          {subtext}
        </p>
      )}
    </div>
  );
};
