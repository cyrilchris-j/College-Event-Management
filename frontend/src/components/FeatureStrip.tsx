import { Ticket, QrCode, Bell, Users, Award } from 'lucide-react';

interface Feature {
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    id: 'registration',
    icon: <Ticket size={22} />,
    iconBg: 'bg-blue-100 text-blue-600',
    title: 'Easy Registration',
    description: 'Register for events in just a few clicks.',
  },
  {
    id: 'digital-pass',
    icon: <QrCode size={22} />,
    iconBg: 'bg-purple-100 text-purple-600',
    title: 'Digital Pass',
    description: 'Get your digital pass and QR code instantly.',
  },
  {
    id: 'updates',
    icon: <Bell size={22} />,
    iconBg: 'bg-green-100 text-green-600',
    title: 'Stay Updated',
    description: 'Never miss an event with timely updates.',
  },
  {
    id: 'network',
    icon: <Users size={22} />,
    iconBg: 'bg-amber-100 text-amber-600',
    title: 'Connect & Network',
    description: 'Meet new people and build connections.',
  },
  {
    id: 'certificates',
    icon: <Award size={22} />,
    iconBg: 'bg-red-100 text-red-600',
    title: 'Certificates',
    description: 'Earn certificates and showcase your skills.',
  },
];

export function FeatureStrip() {
  return (
    <section
      className="container-main py-10"
      aria-label="Platform features"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {FEATURES.map((feature, i) => (
          <div
            key={feature.id}
            className="bg-white rounded-xl border border-border shadow-card p-5
                       flex flex-col items-center text-center
                       hover:shadow-card-hover hover:-translate-y-0.5
                       transition-all duration-200"
            style={{
              animationDelay: `${i * 100}ms`,
            }}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${feature.iconBg}`}
              aria-hidden="true"
            >
              {feature.icon}
            </div>
            <h3 className="text-sm font-semibold text-navy leading-tight">{feature.title}</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
