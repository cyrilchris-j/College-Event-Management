import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Event } from '@/types';
import { getEventThumbnail } from '@/utils/eventHelpers';
import { formatEventDateRange } from '@/utils/dateFormatter';
import { CategoryBadge } from '@/components/events/CategoryBadge';
import { RegistrationProgress } from '@/components/events/RegistrationProgress';
import { EventCountdown } from '@/components/events/EventCountdown';

interface HeroSectionProps {
  events?: Event[];
}

export function HeroSection({ events = [] }: HeroSectionProps) {
  const navigate = useNavigate();

  // 1. Sort events by created_at in descending order to get the newest first, slice 3
  const recentEvents = [...events]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  // 2. We want display order: 3rd most recent (idx 2) -> 2nd most recent (idx 1) -> newest (idx 0)
  const displayEvents = [recentEvents[2], recentEvents[1], recentEvents[0]].filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (displayEvents.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % displayEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayEvents.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [displayEvents.length]);

  const activeEvent = displayEvents[currentIndex];
  const thumbnail = activeEvent ? getEventThumbnail(activeEvent) : '';
  const dateLabel = activeEvent ? formatEventDateRange(activeEvent.event_start, activeEvent.event_end) : '';

  return (
    <section
      className="w-full bg-[#0B1329] border-b border-[#1E2D52]"
      aria-label="Welcome hero section"
    >
      <div className="w-full flex flex-col items-center justify-center p-0 m-0">
        {/* Recent Events Slideshow (Full Screen / No Card container) */}
        <div className="relative flex flex-col items-center justify-center w-full min-h-[460px] mx-auto p-0 m-0">
          {/* Decorative background circles */}
          <div
            className="absolute w-96 h-96 rounded-full bg-blue-900/10 top-1/2 left-1/2
                       -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <div
            className="absolute w-64 h-64 rounded-full bg-purple-950/15 -top-12 right-12"
            aria-hidden="true"
          />

          {activeEvent ? (
            <div
              key={activeEvent.id}
              className="w-full flex flex-col md:flex-row gap-0 items-center justify-between
                         animate-slide-in cursor-pointer p-0 m-0"
              onClick={() => navigate(`/events/${activeEvent.id}`)}
            >
              {/* Left: Large Event Banner Image */}
              <div className="relative w-full md:w-1/2 h-[300px] md:h-[480px] rounded-none overflow-hidden bg-slate-800 shadow-xl flex-shrink-0">
                <img
                  src={thumbnail}
                  alt={`${activeEvent.title} banner`}
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&h=600&fit=crop';
                  }}
                />
                <div className="absolute top-4 right-4 z-20">
                  <CategoryBadge category={activeEvent.category} />
                </div>
              </div>

              {/* Right: Event Details directly on the page background */}
              <div className="flex-1 flex flex-col justify-between py-8 px-6 md:px-12 text-white w-full md:w-1/2 h-full">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-blue-400">
                      Recent Event
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1.5 leading-tight tracking-tight">
                      {activeEvent.title}
                    </h1>
                    <p className="text-sm md:text-base text-slate-350 mt-3 line-clamp-3 leading-relaxed">
                      {activeEvent.short_description ?? activeEvent.description}
                    </p>
                  </div>

                  {/* Countdown display */}
                  <EventCountdown eventStart={activeEvent.event_start} />

                  {/* Date & Location */}
                  <div className="flex flex-col gap-3 border-t border-[#1E2D52] pt-5">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <Calendar size={16} className="text-blue-400" />
                      <span className="font-semibold">{dateLabel}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <MapPin size={16} className="text-blue-400" />
                      <span className="font-semibold truncate">{activeEvent.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 border-t border-[#1E2D52] pt-5 mt-5">
                  {/* Registration Progress */}
                  <RegistrationProgress event={activeEvent} showCount />

                  {/* Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-center text-sm py-3 font-semibold shadow-md"
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/events/${activeEvent.id}`);
                    }}
                  >
                    Register Now
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Fallback Placeholder */
            <div className="w-full max-w-[500px] border border-[#1E2D52] rounded-2xl p-8 text-center flex flex-col gap-4 items-center z-10 text-white">
              <div className="w-14 h-14 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-400">
                <Calendar size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold">No Events Uploaded</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-[280px] mx-auto leading-relaxed">
                  Events uploaded by the admin or organizers will show up here automatically.
                </p>
              </div>
            </div>
          )}

          {/* Slide indicators */}
          {displayEvents.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {displayEvents.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'bg-blue-500 w-4' : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to event slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
