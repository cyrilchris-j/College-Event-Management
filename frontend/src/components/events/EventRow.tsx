import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import type { Event } from '@/types';
import { formatEventDateRange, formatTimeRange } from '@/utils/dateFormatter';
import { getEventThumbnail } from '@/utils/eventHelpers';
import { CategoryBadge } from './CategoryBadge';
import { RegistrationProgress } from './RegistrationProgress';
import { Button } from '@/components/ui/Button';

interface EventRowProps {
  event: Event;
  index?: number;
}

export const EventRow = memo(function EventRow({ event, index = 0 }: EventRowProps) {
  const navigate = useNavigate();
  const thumbnail = getEventThumbnail(event);
  const dateLabel = formatEventDateRange(event.event_start, event.event_end);
  const timeLabel = formatTimeRange(event.event_start, event.event_end);

  const handleViewDetails = useCallback(() => {
    navigate(`/events/${event.id}`);
  }, [event.id, navigate]);

  return (
    <article
      className={[
        'flex items-center gap-6 px-6 py-5 border-b border-border last:border-0',
        'hover:bg-blue-50/40 transition-all duration-200 group cursor-pointer',
        'animate-fade-up',
      ].join(' ')}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both', opacity: 0 }}
      onClick={handleViewDetails}
      onKeyDown={e => e.key === 'Enter' && handleViewDetails()}
      tabIndex={0}
      role="row"
      aria-label={`Event: ${event.title}`}
    >
      {/* ── Col 1: Thumbnail ─────────────────────────────────────────────── */}
      <div className="flex-shrink-0 w-[120px] h-[75px] sm:w-[240px] sm:h-[140px] rounded-xl overflow-hidden bg-slate-100 shadow-sm border border-border/60">
        <img
          src={thumbnail}
          alt={`${event.title} event thumbnail`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop';
          }}
        />
      </div>

      {/* ── Col 2: Title + Description ───────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <h3
          className="text-base font-bold text-navy group-hover:text-blue-600 transition-colors
                     truncate leading-tight"
        >
          {event.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
          {event.short_description ?? event.description}
        </p>
      </div>

      {/* ── Col 3: Category ──────────────────────────────────────────────── */}
      <div className="flex-shrink-0 hidden sm:block">
        <CategoryBadge category={event.category} />
      </div>

      {/* ── Col 4: Date & Time ───────────────────────────────────────────── */}
      <div className="flex-shrink-0 hidden lg:flex flex-col gap-1 min-w-[130px]">
        <span className="flex items-center gap-1.5 text-xs text-slate-600">
          <Calendar size={12} className="text-slate-400" aria-hidden="true" />
          {dateLabel}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock size={12} className="text-slate-400" aria-hidden="true" />
          {timeLabel}
        </span>
      </div>

      {/* ── Col 5: Venue ─────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 hidden xl:flex items-center gap-1.5 min-w-[120px]">
        <MapPin size={12} className="text-slate-400 flex-shrink-0" aria-hidden="true" />
        <span className="text-xs text-slate-600 truncate">{event.venue}</span>
      </div>

      {/* ── Col 6: Registration Progress ─────────────────────────────────── */}
      <div className="flex-shrink-0 hidden md:block w-[110px]">
        <RegistrationProgress event={event} showCount />
      </div>

      {/* ── Col 7: Action ────────────────────────────────────────────────── */}
      <div className="flex-shrink-0">
        <Button
          variant="secondary"
          size="sm"
          rightIcon={<ArrowRight size={13} />}
          onClick={e => { e.stopPropagation(); handleViewDetails(); }}
          aria-label={`View details for ${event.title}`}
          className="group-hover:border-blue-500 group-hover:text-blue-600 whitespace-nowrap"
        >
          View Details
        </Button>
      </div>
    </article>
  );
});
