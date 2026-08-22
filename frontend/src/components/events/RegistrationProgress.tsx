import type { Event } from '@/types';
import {
  getRegistrationStatus,
  getRegistrationPercentage,
  getStatusConfig,
  getProgressBarColor,
} from '@/utils/eventHelpers';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface RegistrationProgressProps {
  event: Event;
  showCount?: boolean;
  className?: string;
}

export function RegistrationProgress({
  event,
  showCount = true,
  className = '',
}: RegistrationProgressProps) {
  const status = getRegistrationStatus(event);
  const pct = getRegistrationPercentage(event);
  const statusCfg = getStatusConfig(status);
  const barColor = getProgressBarColor(pct);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {showCount && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {event.registered_count.toLocaleString()} / {event.capacity.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-slate-700">{pct}%</span>
        </div>
      )}

      <ProgressBar value={pct} color={barColor} />

      <span
        className={[
          'text-xs font-semibold px-2 py-0.5 rounded-full w-fit',
          statusCfg.textColor,
          statusCfg.bgColor,
        ].join(' ')}
        aria-label={`Registration status: ${statusCfg.label}`}
      >
        {statusCfg.label}
      </span>
    </div>
  );
}
