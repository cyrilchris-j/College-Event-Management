import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Event } from '@/types';
import { getEventThumbnail } from '@/utils/eventHelpers';
import { formatEventDateRange } from '@/utils/dateFormatter';
import { CategoryBadge } from '@/components/events/CategoryBadge';
import { RegistrationProgress } from '@/components/events/RegistrationProgress';

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
      className="w-full bg-gradient-to-br from-blue-50 via-white to-slate-50 border-b border-border"
      aria-label="Welcome hero section"
    >
      <div className="container-main py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── LEFT: Text Content ──────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                               bg-blue-100 text-blue-700 text-sm font-semibold border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" aria-hidden="true" />
                Discover. Register. Participate.
              </span>
            </div>

            {/* Heading */}
            <div className="animate-fade-up-delay-1">
              <h1 className="font-poppins font-bold leading-[1.1]
                             text-[30px] sm:text-[36px] lg:text-[48px] xl:text-[52px]">
                <span className="text-navy">Discover. Learn.</span>
                <br />
                <span className="text-blue-600">Grow.</span>
                <br />
                <span className="text-navy text-[24px] sm:text-[28px] lg:text-[36px] font-semibold">
                  Your Campus, Your Journey.
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="animate-fade-up-delay-2 text-[15px] text-slate-600 leading-relaxed max-w-md">
              Find exciting events, build skills, and connect with a community
              that inspires you. All campus events — in one place.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-up-delay-3 flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
                onClick={() => {
                  document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                aria-label="Explore all events"
              >
                Explore Events
              </Button>
              <Button
                variant="secondary"
                size="lg"
                leftIcon={
                  <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <Play size={9} className="text-white ml-0.5" aria-hidden="true" />
                  </span>
                }
                onClick={() => navigate('/login')}
                aria-label="Learn how CampusConnect works"
              >
                How It Works
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="animate-fade-up-delay-4 flex items-center gap-4 flex-wrap">
              {[
                { text: 'Free Registration', color: 'text-green-600' },
                { text: 'Instant Digital Ticket', color: 'text-blue-600' },
                { text: 'QR Verified Entry', color: 'text-purple-600' },
              ].map(item => (
                <span
                  key={item.text}
                  className={`flex items-center gap-1.5 text-xs font-medium ${item.color}`}
                >
                  <CheckCircle2 size={13} />
                  {item.text}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Recent Events Animatic Carousel ────────────────────── */}
          <div className="relative flex flex-col items-center justify-center min-h-[420px] w-full max-w-[400px] mx-auto">
            {/* Decorative background circles */}
            <div
              className="absolute w-72 h-72 rounded-full bg-blue-100/60 top-1/2 left-1/2
                         -translate-x-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <div
              className="absolute w-48 h-48 rounded-full bg-purple-100/40 -top-6 right-6"
              aria-hidden="true"
            />

            {activeEvent ? (
              <div
                key={activeEvent.id}
                className="w-full max-w-[340px] bg-white rounded-2xl border border-border
                           shadow-card-hover p-5 z-10 flex flex-col gap-4 animate-fade-up floating
                           hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/events/${activeEvent.id}`)}
              >
                {/* Event Image */}
                <div className="relative w-full h-[170px] rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={thumbnail}
                    alt={`${activeEvent.title} banner`}
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop';
                    }}
                  />
                  <div className="absolute top-3 right-3 z-20">
                    <CategoryBadge category={activeEvent.category} />
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600">
                    Recent Event
                  </span>
                  <h3 className="text-base font-bold text-navy mt-0.5 line-clamp-1">
                    {activeEvent.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {activeEvent.short_description ?? activeEvent.description}
                  </p>
                </div>

                {/* Date & Location */}
                <div className="flex flex-col gap-2 border-t border-border/80 pt-3.5">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar size={13} className="text-blue-600" />
                    <span className="font-medium">{dateLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <MapPin size={13} className="text-blue-600" />
                    <span className="font-medium truncate">{activeEvent.venue}</span>
                  </div>
                </div>

                {/* Registration Progress */}
                <div className="border-t border-border/80 pt-3.5">
                  <RegistrationProgress event={activeEvent} showCount />
                </div>

                {/* Button */}
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center mt-1"
                  onClick={e => {
                    e.stopPropagation();
                    navigate(`/events/${activeEvent.id}`);
                  }}
                >
                  Register Now
                </Button>
              </div>
            ) : (
              /* Fallback Placeholder Card */
              <div className="w-full max-w-[340px] bg-white rounded-2xl border border-border shadow-card-hover p-6 text-center flex flex-col gap-4 items-center z-10">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Calendar size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy">No Events Uploaded</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-[240px] mx-auto leading-relaxed">
                    Events uploaded by the admin or organizers will show up here automatically.
                  </p>
                </div>
              </div>
            )}

            {/* Slide indicators */}
            {displayEvents.length > 1 && (
              <div className="absolute -bottom-6 flex items-center gap-1.5 z-20">
                {displayEvents.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentIndex === idx ? 'bg-blue-600 w-4' : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to event slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
