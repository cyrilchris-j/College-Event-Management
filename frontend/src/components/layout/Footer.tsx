import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from 'lucide-react';

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

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-border mt-auto" role="contentinfo">
      <div className="container-main pt-10 pb-4">
        {/* Centered Columns */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-16 md:gap-36 pb-8 border-b border-border text-center md:text-left">
          
          {/* Column 1: Branding & Socials */}
          <div className="flex flex-col items-center md:items-start gap-4 max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                <GraduationCap size={22} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-base font-semibold font-poppins text-navy">
                  KSR College of Engineering
                </p>
                <p className="text-xs text-slate-500">Tiruchengode, Tamil Nadu</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Centralized campus event discovery and registration portal for
              students and the KSR community.
            </p>
            <div className="flex items-center gap-2 pt-1" aria-label="Social media links">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center
                             text-slate-500 hover:text-blue-600 hover:border-blue-300
                             transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-500"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation / Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-navy uppercase tracking-wider font-poppins">
              Quick Links
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col items-center md:items-start gap-2.5">
                {NAV_LINKS.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-base text-slate-500 hover:text-blue-600 transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-4 text-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} KSR College of Engineering, Tiruchengode.
            Built with ❤ for the campus community.
          </p>
        </div>
      </div>
    </footer>
  );
}
