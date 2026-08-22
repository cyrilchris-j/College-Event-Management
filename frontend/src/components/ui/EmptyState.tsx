import React from 'react';
import { Calendar, Search } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title = 'No events found',
  description = 'Try adjusting your search or filters to find what you\'re looking for.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        {icon ?? <Calendar className="text-blue-400" size={28} />}
      </div>
      <h3 className="text-base font-semibold text-navy mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs">{description}</p>
      {action && (
        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function SearchEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <EmptyState
      icon={<Search className="text-blue-400" size={28} />}
      title="No results found"
      description="We couldn't find any events matching your search. Try different keywords or clear the filters."
      action={{ label: 'Clear Filters', onClick: onClear }}
    />
  );
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <span className="text-2xl" aria-hidden="true">⚠️</span>
      </div>
      <h3 className="text-base font-semibold text-navy mb-1">Oops!</h3>
      <p className="text-sm text-slate-500 max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
