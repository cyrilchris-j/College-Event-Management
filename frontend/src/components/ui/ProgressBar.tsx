interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  color?: string; // Tailwind bg class e.g. 'bg-green-500'
  animated?: boolean;
}

export function ProgressBar({
  value,
  className = '',
  showLabel = false,
  size = 'sm',
  color,
  animated = true,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 100);

  // Determine bar color based on value if not overridden
  const barColor =
    color ??
    (clamped >= 90
      ? 'bg-red-400'
      : clamped >= 75
      ? 'bg-amber-400'
      : 'bg-green-500');

  const height = size === 'md' ? 'h-2' : 'h-1.5';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-500">Registration</span>
          <span className="text-xs font-semibold text-slate-700">{clamped}%</span>
        </div>
      )}
      <div
        className={`${height} w-full bg-slate-100 rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${clamped}% registered`}
      >
        <div
          className={[
            'h-full rounded-full',
            barColor,
            animated ? 'transition-all duration-1000 ease-out' : '',
          ].join(' ')}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
