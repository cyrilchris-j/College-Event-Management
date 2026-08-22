import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const NAV_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Help Center', to: '/help' },
  { label: 'Contact Us', to: '/#contact' },
];

const SOCIAL_LINKS = [
  { icon: <Facebook size={16} />, label: 'Facebook', href: 'https://facebook.com' },
  { icon: <Instagram size={16} />, label: 'Instagram', href: 'https://instagram.com' },
  { icon: <Linkedin size={16} />, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: <Twitter size={16} />, label: 'Twitter / X', href: 'https://twitter.com' },
  { icon: <Youtube size={16} />, label: 'YouTube', href: 'https://youtube.com' },
];

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

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-border mt-auto" role="contentinfo">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-border">

          {/* ── Left: Branding & Socials ──────────────────────────────────────────── */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                <GraduationCap size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold font-poppins text-navy">
                  KSR College of Engineering
                </p>
                <p className="text-xs text-slate-500">Tiruchengode, Tamil Nadu</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Centralized campus event discovery and registration portal for
              students and the KSR community.
            </p>
            <div className="flex items-center gap-2 pt-2" aria-label="Social media links">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center
                             text-slate-500 hover:text-blue-600 hover:border-blue-300
                             transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-500"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Center: Navigation ──────────────────────────────────────── */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-navy uppercase tracking-wider font-poppins">
              Quick Links
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-2.5">
                {NAV_LINKS.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-500 hover:text-blue-600 transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── Right: Contact Us Card ─────────────────────────────────────── */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-border p-5 shadow-sm flex flex-col sm:flex-row gap-5">
            <div className="flex-1 space-y-3.5">
              <div className="border-b border-border pb-2.5">
                <h3 className="text-base font-semibold font-poppins text-navy">Contact Us</h3>
                <p className="text-xs text-slate-500 mt-0.5">We're here to help!</p>
              </div>
              <div className="space-y-3">
                {CONTACT_ITEMS.map(item => (
                  <div key={item.id} className="flex items-start gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center
                                 flex-shrink-0 text-blue-600"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-none mb-1">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-xs text-navy hover:text-blue-600 transition-colors
                                     focus-visible:outline-2 focus-visible:outline-blue-500 rounded font-medium"
                        >
                          {item.lines.join(' ')}
                        </a>
                      ) : (
                        <div className="text-xs text-navy leading-normal font-medium">
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
            </div>

            {/* Email CTA block */}
            <div className="w-full sm:w-44 p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col justify-between text-center">
              <div>
                <div
                  className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2"
                  aria-hidden="true"
                >
                  <Mail size={16} className="text-blue-600" />
                </div>
                <p className="text-xs font-semibold text-navy">Have a question?</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  We'll reply within 24 hours.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                rightIcon={<Send size={11} />}
                className="mt-3.5 w-full justify-center text-xs py-1.5"
                onClick={() => {
                  window.location.href = 'mailto:campusconnect@ksrce.ac.in?subject=CampusConnect Inquiry';
                }}
                aria-label="Send an email message to the CampusConnect team"
              >
                Send Message
              </Button>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ──────────────────────────────────────────────────── */}
        <div className="mt-8 pt-6 text-center border-t border-border">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} KSR College of Engineering, Tiruchengode.
            Built with ❤ for the campus community.
          </p>
        </div>
      </div>
    </footer>
  );
}
