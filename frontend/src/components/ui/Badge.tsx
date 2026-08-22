import React from 'react';
import type { EventCategory } from '@/types';
import { getCategoryConfig } from '@/utils/eventHelpers';

interface CategoryBadgeProps {
  category: EventCategory;
  className?: string;
}

export function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  const config = getCategoryConfig(category);
  return (
    <span
      className={[
        'inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border',
        config.textColor,
        config.bgColor,
        config.borderColor,
        className,
      ].join(' ')}
    >
      {config.label}
    </span>
  );
}

// ─── Generic text badge ───────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'slate';
  className?: string;
}

const BADGE_COLORS = {
  blue: 'text-blue-700 bg-blue-50 border-blue-200',
  green: 'text-green-700 bg-green-50 border-green-200',
  amber: 'text-amber-700 bg-amber-50 border-amber-200',
  red: 'text-red-700 bg-red-50 border-red-200',
  purple: 'text-purple-700 bg-purple-50 border-purple-200',
  slate: 'text-slate-600 bg-slate-100 border-slate-200',
};

export function Badge({ children, color = 'blue', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border',
        BADGE_COLORS[color],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
