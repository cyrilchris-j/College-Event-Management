import {
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react';

const SOCIAL_LINKS = [
  { icon: <Facebook size={16} />, label: 'Facebook', href: 'https://www.facebook.com/ksrceofficial' },
  { icon: <Instagram size={16} />, label: 'Instagram', href: 'https://www.instagram.com/ksrce_official' },
  { icon: <Linkedin size={16} />, label: 'LinkedIn', href: 'https://www.linkedin.com/school/ksrce' },
  { icon: <Youtube size={16} />, label: 'YouTube', href: 'https://www.youtube.com/@ksrceofficial' },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-[#0D172A] text-slate-300 mt-auto w-full py-12 border-t border-slate-800" role="contentinfo">
      <div className="container-main grid grid-cols-1 md:grid-cols-4 gap-8 text-left">

        {/* Column 1: Branding & Address */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="KSR Logo" className="h-10 w-auto object-contain" />
            <div>
              <h3 className="text-sm font-bold font-poppins text-white leading-tight">
                K.S.R. College of Engineering
              </h3>
              <p className="text-[11px] text-blue-400 font-semibold">(Autonomous)</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            K.S.R. Kalvi Nagar, Tiruchengode - 637 215, Namakkal District, Tamil Nadu, India.
          </p>
          <div className="pt-1">
            <a
              href="https://ksrce.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20"
            >
              <Globe size={13} /> Visit Official Website <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Column 2: Academic Departments */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
            Departments
          </h4>
          <ul className="text-xs text-slate-400 space-y-1.5">
            <li><a href="https://ksrce.ac.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Computer Science & Engineering</a></li>
            <li><a href="https://ksrce.ac.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Information Technology</a></li>
            <li><a href="https://ksrce.ac.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Artificial Intelligence & Data Science</a></li>
            <li><a href="https://ksrce.ac.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Electronics & Communication Engg.</a></li>
            <li><a href="https://ksrce.ac.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Electrical & Electronics Engg.</a></li>
            <li><a href="https://ksrce.ac.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Mechanical & Civil Engineering</a></li>
          </ul>
        </div>

        {/* Column 3: Quick Campus Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
            Campus Portals
          </h4>
          <ul className="text-xs text-slate-400 space-y-1.5">
            <li><a href="https://ksrce.ac.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Student Portal & COE</a></li>
            <li><a href="https://ksrce.ac.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Training & Placement Cell</a></li>
            <li><a href="https://ksrce.ac.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Research & Innovation Council</a></li>
            <li><a href="https://ksrce.ac.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Admissions 2026</a></li>
            <li><a href="https://ksrce.ac.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Alumni Network</a></li>
          </ul>
        </div>

        {/* Column 4: Contact & Social */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
            Contact & Support
          </h4>
          <div className="text-xs text-slate-400 space-y-2">
            <p className="flex items-center gap-2"><Phone size={13} className="text-blue-400" /> +91 4288 274213 / 274741</p>
            <p className="flex items-center gap-2"><Mail size={13} className="text-blue-400" /> principal@ksrce.ac.in</p>
            <p className="flex items-center gap-2"><MapPin size={13} className="text-blue-400" /> Tiruchengode, Namakkal - 637215</p>
          </div>

          <div className="pt-2 flex items-center gap-2">
            {SOCIAL_LINKS.map(social => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-8 h-8 rounded-xl border border-slate-700 bg-slate-900/60 flex items-center justify-center
                           text-slate-400 hover:text-blue-400 hover:border-blue-500
                           transition-all duration-200"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      <div className="container-main mt-8 pt-4 border-t border-slate-800/60 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} K.S.R. College of Engineering (Autonomous). All Rights Reserved. Built for Campus Events & Registration Portal.
      </div>
    </footer>
  );
}
