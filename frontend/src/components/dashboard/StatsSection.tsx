import React from 'react';
import { Calendar, Users, Award, BarChart3 } from 'lucide-react';
import { AnimatedCounter } from '@/components/reactbits/AnimatedCounter';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';

interface Stat {
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  value: number;
  suffix: string;
  label: string;
  supporting: string;
  spotlightColor: string;
}

const STATS: Stat[] = [
  {
    id: 'total-events',
    icon: <Calendar size={22} />,
    iconBg: 'bg-blue-100 text-blue-600',
    value: 120,
    suffix: '+',
    label: 'Total Events',
    supporting: 'Across all departments',
    spotlightColor: 'rgba(37, 99, 235, 0.12)',
  },
  {
    id: 'students-registered',
    icon: <Users size={22} />,
    iconBg: 'bg-green-100 text-green-600',
    value: 4.8,
    suffix: 'K+',
    label: 'Students Registered',
    supporting: 'This semester',
    spotlightColor: 'rgba(16, 185, 129, 0.12)',
  },
  {
    id: 'active-clubs',
    icon: <Award size={22} />,
    iconBg: 'bg-purple-100 text-purple-600',
    value: 35,
    suffix: '+',
    label: 'Active Clubs',
    supporting: 'On campus',
    spotlightColor: 'rgba(139, 92, 246, 0.12)',
  },
  {
    id: 'attendance-rate',
    icon: <BarChart3 size={22} />,
    iconBg: 'bg-amber-100 text-amber-600',
    value: 95,
    suffix: '%',
    label: 'Attendance Rate',
    supporting: 'Overall average',
    spotlightColor: 'rgba(245, 158, 11, 0.12)',
  },
];

export function StatsSection() {
  return (
    <section className="container-main py-6" aria-label="Campus statistics">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <SpotlightCard
            key={stat.id}
            spotlightColor={stat.spotlightColor}
            className="bg-white rounded-xl border border-border shadow-card hover:shadow-card-hover p-5 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
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
                  <AnimatedCounter
                    to={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.value % 1 !== 0 ? 1 : 0}
                  />
                </p>
                <p className="text-sm font-semibold text-navy">{stat.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.supporting}</p>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
