import { useCallback, useEffect, useState } from 'react';
import { getPublishedEvents } from '@/services/eventService';
import { useDebounce } from './useDebounce';
import type { Event, EventCategory, FilterState, SortOption } from '@/types';

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  setSearch: (search: string) => void;
  setCategory: (category: EventCategory | 'All') => void;
  setSort: (sort: SortOption) => void;
  clearFilters: () => void;
  refetch: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  category: 'All',
  sort: 'soonest',
};

/**
 * Hook that fetches and filters published events.
 * Search is debounced (300ms). Category/sort are applied immediately.
 */
export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const debouncedSearch = useDebounce(filters.search, 300);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublishedEvents({
        search: debouncedSearch,
        category: filters.category,
        sort: filters.sort,
      });
      setEvents(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load events.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.category, filters.sort]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const setSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const setCategory = useCallback((category: EventCategory | 'All') => {
    setFilters(prev => ({ ...prev, category }));
  }, []);

  const setSort = useCallback((sort: SortOption) => {
    setFilters(prev => ({ ...prev, sort }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    events,
    loading,
    error,
    filters,
    setSearch,
    setCategory,
    setSort,
    clearFilters,
    refetch: fetchEvents,
  };
}
