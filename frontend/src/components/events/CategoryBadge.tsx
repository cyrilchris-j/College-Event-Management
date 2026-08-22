import type { EventCategory } from '@/types';
import { getCategoryConfig } from '@/utils/eventHelpers';

interface CategoryBadgeProps {
  category: EventCategory;
  className?: string;
}

export function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  const cfg = getCategoryConfig(category);
  return (
    <span
      className={[
        'inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border',
        cfg.textColor,
        cfg.bgColor,
        cfg.borderColor,
        className,
      ].join(' ')}
    >
      {cfg.label}
    </span>
  );
}
