import { useEffect, useRef, useState } from 'react';
import { Calendar, Users, Award, BarChart3 } from 'lucide-react';

interface Stat {
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
  supporting: string;
}

const STATS: Stat[] = [
  {
    id: 'total-events',
    icon: <Calendar size={22} />,
    iconBg: 'bg-blue-100 text-blue-600',
    value: '120+',
    label: 'Total Events',
    supporting: 'Across all departments',
  },
  {
    id: 'students-registered',
    icon: <Users size={22} />,
    iconBg: 'bg-green-100 text-green-600',
    value: '4.8K+',
    label: 'Students Registered',
    supporting: 'This semester',
  },
  {
    id: 'active-clubs',
    icon: <Award size={22} />,
    iconBg: 'bg-purple-100 text-purple-600',
    value: '35+',
    label: 'Active Clubs',
    supporting: 'On campus',
  },
  {
    id: 'attendance-rate',
    icon: <BarChart3 size={22} />,
    iconBg: 'bg-amber-100 text-amber-600',
    value: '95%',
    label: 'Attendance Rate',
    supporting: 'Overall average',
  },
];

function StatCard({ stat, visible }: { stat: Stat; visible: boolean }) {
  return (
    <div
      className={[
        'bg-white rounded-xl border border-border shadow-card',
        'flex items-center gap-4 p-5 transition-all duration-500',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      ].join(' ')}
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${stat.iconBg}`}
        aria-hidden="true"
      >
        {stat.icon}
      </div>

      {/* Text */}
      <div>
        <p className="text-2xl font-bold font-poppins text-navy leading-tight">
          {stat.value}
        </p>
        <p className="text-sm font-semibold text-navy">{stat.label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{stat.supporting}</p>
      </div>
    </div>
  );
}

export function StatsSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="container-main py-6"
      aria-label="Campus statistics"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.id}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <StatCard stat={stat} visible={visible} />
          </div>
        ))}
      </div>
    </section>
  );
}
