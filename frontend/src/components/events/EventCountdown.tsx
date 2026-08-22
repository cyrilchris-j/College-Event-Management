import { useEffect, useState } from 'react';

interface EventCountdownProps {
  eventStart: string;
}

export function EventCountdown({ eventStart }: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(eventStart) - +new Date();
      if (difference <= 0) {
        return {
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
        };
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      return {
        days: d.toString().padStart(2, '0'),
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0'),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [eventStart]);

  return (
    <div className="flex flex-col items-start gap-2.5 py-1">
      {/* Countdown Badge */}
      <span className="bg-[#111C3A] text-blue-400 border border-[#1E2D52] py-1 px-3.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-inner">
        Count Down
      </span>

      {/* Countdown Boxes */}
      <div className="flex items-center gap-3 justify-start">
        {/* Days Box: Red */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 rounded-xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden transition-all duration-300 hover:scale-105 border border-red-400">
          <span className="text-lg sm:text-xl font-extrabold tracking-tight leading-none">{timeLeft.days}</span>
          <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider opacity-90 mt-1">Days</span>
        </div>

        {/* Hours Box: Orange */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-500 rounded-xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden transition-all duration-300 hover:scale-105 border border-orange-400">
          <span className="text-lg sm:text-xl font-extrabold tracking-tight leading-none">{timeLeft.hours}</span>
          <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider opacity-90 mt-1">Hrs</span>
        </div>

        {/* Minutes Box: Yellow */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-amber-500 rounded-xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden transition-all duration-300 hover:scale-105 border border-amber-400">
          <span className="text-lg sm:text-xl font-extrabold tracking-tight leading-none">{timeLeft.minutes}</span>
          <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider opacity-90 mt-1">Mins</span>
        </div>

        {/* Seconds Box: Blue */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-sky-500 rounded-xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden transition-all duration-300 hover:scale-105 border border-sky-400">
          <span className="text-lg sm:text-xl font-extrabold tracking-tight leading-none">{timeLeft.seconds}</span>
          <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider opacity-90 mt-1">Secs</span>
        </div>
      </div>
    </div>
  );
}
