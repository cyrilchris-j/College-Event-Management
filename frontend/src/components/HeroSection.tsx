import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Calendar, QrCode, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      className="w-full bg-gradient-to-br from-blue-50 via-white to-slate-50
                 border-b border-border"
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

          {/* ── RIGHT: Visual Cards ─────────────────────────────────────── */}
          <div className="relative flex items-center justify-center h-[400px] lg:h-[420px]">
            {/* Decorative background circles */}
            <div
              className="absolute w-72 h-72 rounded-full bg-blue-100/60 top-1/2 left-1/2
                         -translate-x-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <div
              className="absolute w-48 h-48 rounded-full bg-purple-100/40 top-6 right-6"
              aria-hidden="true"
            />

            {/* ── Calendar Card (center-left) ─────────────────────────── */}
            <div
              className="floating absolute left-0 top-8 w-48 bg-white rounded-2xl border border-border
                         shadow-card-hover p-4 z-10"
              aria-hidden="true"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-navy">May 2024</span>
                <Calendar size={14} className="text-blue-600" />
              </div>
              {/* Mini calendar grid */}
              <div className="grid grid-cols-7 gap-0.5 text-center">
                {['M','T','W','T','F','S','S'].map((d, i) => (
                  <span key={i} className="text-[9px] font-semibold text-slate-400">{d}</span>
                ))}
                {[...Array(5)].map((_, i) => (
                  <span key={`pad-${i}`} className="text-[10px] text-transparent">0</span>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                  <button
                    key={d}
                    className={[
                      'text-[10px] w-5 h-5 rounded flex items-center justify-center mx-auto',
                      d === 25
                        ? 'bg-blue-600 text-white font-bold'
                        : d === 28 || d === 30
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100',
                    ].join(' ')}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Event Info Card (center) ────────────────────────────── */}
            <div
              className="floating-delayed absolute top-16 right-4 lg:right-0 w-52 bg-white rounded-2xl
                         border border-border shadow-card-hover p-4 z-20"
              aria-hidden="true"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mb-3">
                <Calendar size={16} className="text-white" />
              </div>
              <h3 className="text-sm font-bold text-navy">AI Workshop</h3>
              <p className="text-xs text-slate-500 mt-0.5">May 25, 2024</p>
              <p className="text-xs text-slate-500">Speaker: Dr. Sarah Johnson</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[62%] rounded-full" />
                </div>
                <span className="text-xs font-semibold text-green-600">62%</span>
              </div>
              <button
                className="mt-3 w-full py-1.5 text-xs font-semibold text-white bg-blue-600
                           rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register Now
              </button>
            </div>

            {/* ── Registered Card (bottom-left) ──────────────────────── */}
            <div
              className="floating-slow absolute bottom-8 left-6 w-44 bg-white rounded-xl
                         border border-border shadow-card p-3 z-10"
              aria-hidden="true"
            >
              <p className="text-xs font-semibold text-navy">Hackathon 2024</p>
              <p className="text-xs text-slate-500 mt-0.5">May 20, 2024</p>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex -space-x-1.5">
                  {['#2563EB','#8B5CF6','#10B981'].map((c, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border-2 border-white"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-semibold text-slate-600">150+ Registered</span>
              </div>
            </div>

            {/* ── Digital Pass / QR Card (bottom-right) ──────────────── */}
            <div
              className="floating absolute bottom-4 right-2 lg:right-0 w-44 bg-navy rounded-xl
                         shadow-lg p-3 z-20"
              aria-hidden="true"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">Your Event Pass</span>
                <QrCode size={14} className="text-blue-300" />
              </div>
              {/* Fake QR pattern */}
              <div className="w-20 h-20 mx-auto bg-white rounded-lg p-1.5">
                <div className="w-full h-full grid grid-cols-5 gap-0.5">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-[1px]"
                      style={{
                        backgroundColor:
                          [0,1,5,6,10,15,20,21,24,3,13,18,8,23].includes(i)
                            ? '#132B5C'
                            : 'transparent',
                      }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-center text-[9px] text-blue-200 mt-2">
                Scan to Verify
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
