import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, SlidersHorizontal, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/HeroSection';
import { EventList } from '@/components/events/EventList';
import { FilterDropdown } from '@/components/events/FilterDropdown';
import { useEvents } from '@/hooks/useEvents';
import { BlurText } from '@/components/ui/BlurText';

export function HomePage() {
  const {
    events,
    loading,
    error,
    filters,
    setSearch,
    setCategory,
    setSort,
    clearFilters,
    refetch,
  } = useEvents();

  const [filterOpen, setFilterOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'All' ||
    filters.sort !== 'soonest';

  const upcomingEvents = events
    .filter(e => {
      const eventStart = new Date(e.event_start).getTime();
      return !isNaN(eventStart) && eventStart >= Date.now();
    })
    .sort((a, b) => new Date(a.event_start).getTime() - new Date(b.event_start).getTime())
    .slice(0, 4);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scrollTarget = params.get('scroll');
    if (scrollTarget) {
      const el = document.getElementById(scrollTarget);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 300);
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Header
        searchValue={filters.search}
        onSearchChange={setSearch}
        onFilterClick={() => setFilterOpen(prev => !prev)}
      />

      <main id="main-content">
        {/* ── Hero ────────────────────────────────────────────────────── */}
        <HeroSection events={events} />

        {/* ── Main Content: Events + Contact ──────────────────────────── */}
        <section
          id="events-section"
          className="container-main py-6"
          aria-label="All events"
        >
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── ALL EVENTS & UPCOMING EVENTS (75%) ──────────────────── */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Centered Animated All Events Title */}
              {!loading && (
                <div id="all-events-section" className="flex justify-center items-center py-6 mt-10 mb-2">
                  <BlurText
                    text="All Events"
                    delay={100}
                    animateBy="letters"
                    direction="top"
                    className="text-3xl md:text-5xl font-extrabold text-white font-poppins tracking-tight"
                  />
                </div>
              )}

              {/* All Events */}
              <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
                {/* Section header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    {!loading && (
                      <span className="text-xs font-semibold text-slate-500">
                        Showing {events.length} events
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Active filter badges */}
                    {filters.category !== 'All' && (
                      <span className="hidden sm:flex items-center gap-1 text-xs bg-blue-100 text-blue-700
                                       font-semibold px-2.5 py-1 rounded-full">
                        {filters.category}
                        <button
                          onClick={() => setCategory('All')}
                          aria-label={`Remove ${filters.category} filter`}
                          className="hover:text-blue-900"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}

                    {/* Filter button (relative for dropdown) */}
                    <div className="relative">
                      <button
                        ref={filterButtonRef as React.RefObject<HTMLButtonElement>}
                        onClick={() => setFilterOpen(prev => !prev)}
                        aria-expanded={filterOpen}
                        aria-haspopup="dialog"
                        aria-label="Open filter panel"
                        className={[
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
                          'border transition-colors duration-150',
                          filterOpen || hasActiveFilters
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : 'border-border text-slate-600 hover:border-blue-400 hover:text-blue-600',
                        ].join(' ')}
                      >
                        <SlidersHorizontal size={13} />
                        Filter
                        {hasActiveFilters && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-blue-600"
                            aria-label="Active filters"
                          />
                        )}
                      </button>

                      <FilterDropdown
                        isOpen={filterOpen}
                        onClose={() => setFilterOpen(false)}
                        selectedCategory={filters.category}
                        onCategoryChange={setCategory}
                        selectedSort={filters.sort}
                        onSortChange={setSort}
                        onClear={clearFilters}
                        hasActiveFilters={hasActiveFilters}
                        anchorRef={filterButtonRef as React.RefObject<HTMLElement | null>}
                      />
                    </div>

                    {/* Clear filters */}
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="hidden sm:block text-xs text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Clear all active filters"
                      >
                        Clear
                      </button>
                    )}

                    {/* View all link */}
                    <Link
                      to="/events"
                      className="hidden sm:flex items-center gap-1 text-xs font-medium text-blue-600
                                 hover:text-blue-700 transition-colors focus-visible:outline-2
                                 focus-visible:outline-blue-500 rounded"
                      aria-label="View all events"
                    >
                      View All <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Event list */}
                <EventList
                  events={events}
                  loading={loading}
                  error={error}
                  onClearFilters={error ? refetch : clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>

              {/* Centered Animated Upcoming Events Title */}
              {!loading && upcomingEvents.length > 0 && (
                <div id="upcoming-events-section" className="flex justify-center items-center py-6 mt-10 mb-2">
                  <BlurText
                    text="Upcoming Events"
                    delay={100}
                    animateBy="letters"
                    direction="top"
                    className="text-3xl md:text-5xl font-extrabold text-white font-poppins tracking-tight"
                  />
                </div>
              )}

              {/* Upcoming Events */}
              {!loading && upcomingEvents.length > 0 && (
                <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
                  <EventList
                    events={upcomingEvents}
                    loading={loading}
                    error={error}
                    onClearFilters={refetch}
                  />
                </div>
              )}
            </div>



          </div>
        </section>


      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
