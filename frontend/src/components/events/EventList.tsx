import type { Event } from '@/types';
import { EventRow } from './EventRow';
import { EventRowSkeleton } from '@/components/ui/Skeleton';
import { SearchEmptyState, ErrorState } from '@/components/ui/EmptyState';

interface EventListProps {
  events: Event[];
  loading: boolean;
  error: string | null;
  onClearFilters: () => void;
  hasActiveFilters?: boolean;
}

const SKELETON_COUNT = 6;

export function EventList({
  events,
  loading,
  error,
  onClearFilters,
  hasActiveFilters = false,
}: EventListProps) {
  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div role="status" aria-label="Loading events...">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <EventRowSkeleton key={i} />
        ))}
        <span className="sr-only">Loading events, please wait.</span>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={onClearFilters}
      />
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────
  if (events.length === 0) {
    return hasActiveFilters ? (
      <SearchEmptyState onClear={onClearFilters} />
    ) : (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <span className="text-3xl" aria-hidden="true">📅</span>
        </div>
        <h3 className="text-base font-semibold text-navy mb-1">No events yet</h3>
        <p className="text-sm text-slate-500">
          Check back soon — exciting events are being planned!
        </p>
      </div>
    );
  }

  // ── Events ───────────────────────────────────────────────────────────────
  return (
    <div
      role="table"
      aria-label="All events"
      aria-rowcount={events.length}
    >
      {events.map((event, index) => (
        <EventRow key={event.id} event={event} index={index} />
      ))}
    </div>
  );
}
