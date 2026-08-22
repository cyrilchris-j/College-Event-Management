import {
  GraduationCap,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from 'lucide-react';

const SOCIAL_LINKS = [
  { icon: <Facebook size={16} />, label: 'Facebook', href: 'https://facebook.com' },
  { icon: <Instagram size={16} />, label: 'Instagram', href: 'https://instagram.com' },
  { icon: <Linkedin size={16} />, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: <Twitter size={16} />, label: 'Twitter / X', href: 'https://twitter.com' },
  { icon: <Youtube size={16} />, label: 'YouTube', href: 'https://youtube.com' },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-slate-50 mt-auto w-full py-8 border-t border-[#1E2D52]" role="contentinfo">
      <div className="container-main flex flex-col items-center justify-center gap-6 text-center">
        
        {/* Branding & Description */}
        <div className="flex flex-col items-center gap-3.5 max-w-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center flex-shrink-0 shadow-md">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-base font-semibold font-poppins text-navy">
                KSR College of Engineering
              </p>
              <p className="text-xs text-slate-500">Tiruchengode, Tamil Nadu</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed mt-1">
            Centralized campus event discovery and registration portal for
            students and the KSR community.
          </p>
        </div>

        {/* 5 Social Icons (Centered) */}
        <div className="flex items-center gap-3.5 justify-center" aria-label="Social media links">
          {SOCIAL_LINKS.map(social => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center
                         text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-white
                         transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-500 shadow-sm"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Bottom bar (Copyright, no top border) */}
        <div className="pt-2 text-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} KSR College of Engineering, Tiruchengode.
            Built with ❤ for the campus community.
          </p>
        </div>

      </div>
    </footer>
  );
}
