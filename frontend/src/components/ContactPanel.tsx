import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ContactItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  lines: string[];
  href?: string;
}

const CONTACT_ITEMS: ContactItem[] = [
  {
    id: 'phone',
    icon: <Phone size={16} />,
    label: 'Phone',
    lines: ['+91 98765 43210'],
    href: 'tel:+919876543210',
  },
  {
    id: 'email',
    icon: <Mail size={16} />,
    label: 'Email',
    lines: ['campusconnect@ksrce.ac.in'],
    href: 'mailto:campusconnect@ksrce.ac.in',
  },
  {
    id: 'location',
    icon: <MapPin size={16} />,
    label: 'Location',
    lines: [
      'KSR College of Engineering,',
      'Tiruchengode – 637 215',
      'Tamil Nadu, India',
    ],
  },
  {
    id: 'hours',
    icon: <Clock size={16} />,
    label: 'Office Hours',
    lines: ['Mon – Fri: 9:00 AM – 5:00 PM'],
  },
];

export function ContactPanel() {
  return (
    <aside
      className="bg-white rounded-xl border border-border shadow-card h-fit"
      aria-label="Contact information"
    >
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-base font-semibold font-poppins text-navy">Contact Us</h2>
        <p className="text-xs text-slate-500 mt-0.5">We're here to help!</p>
      </div>

      <div className="p-5 space-y-4">
        {CONTACT_ITEMS.map(item => (
          <div key={item.id} className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center
                         flex-shrink-0 text-blue-600"
              aria-hidden="true"
            >
              {item.icon}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-sm text-navy hover:text-blue-600 transition-colors
                             focus-visible:outline-2 focus-visible:outline-blue-500 rounded"
                >
                  {item.lines.join(' ')}
                </a>
              ) : (
                <div className="text-sm text-navy leading-relaxed">
                  {item.lines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < item.lines.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Illustration / CTA ──────────────────────────────────────────────── */}
      <div className="mx-5 mb-5 p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
        {/* Envelope illustration */}
        <div
          className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3"
          aria-hidden="true"
        >
          <Mail size={22} className="text-blue-600" />
        </div>
        <p className="text-sm font-semibold text-navy">Have a question?</p>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Send us a message and we'll get back to you within 24 hours.
        </p>
        <Button
          variant="primary"
          size="sm"
          rightIcon={<Send size={13} />}
          className="mt-3 w-full justify-center"
          onClick={() => {
            window.location.href = 'mailto:campusconnect@ksrce.ac.in?subject=CampusConnect Inquiry';
          }}
          aria-label="Send an email message to the CampusConnect team"
        >
          Send a Message
        </Button>
      </div>
    </aside>
  );
}
