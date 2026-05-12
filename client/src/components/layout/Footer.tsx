import { Link } from "react-router-dom";
import {
  Facebook, Instagram, Twitter, Youtube,
  MapPin as MapPinIcon, Phone as PhoneIcon, Mail as EnvelopeIcon
} from "lucide-react";
import logoImg from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-[#070F1C]">

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">

          {/* Column 1 — Brand */}
          <div>
            <img src={logoImg} alt="UCA" className="h-9 mb-4 rounded-lg" />
            <p className="text-sm text-white/45 leading-relaxed mb-5 max-w-[220px]">
              India's premier chess academy.
              Training champions since 2018.
            </p>

            {/* One key credential */}
            <div className="inline-flex items-center gap-2 bg-white/5
                            border border-white/10 rounded-lg px-3 py-2 mb-5">
              <span className="text-blue-400 text-sm">♟</span>
              <span className="text-xs text-white/50 font-medium">FIDE Affiliated Academy</span>
            </div>

            {/* Social */}
            <div className="flex gap-2.5">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map((s, i) => (
                <a key={i} href={s.href} aria-label={s.label}
                   className="w-8 h-8 rounded-lg bg-white/8 border border-white/10
                              hover:bg-blue-600 hover:border-blue-600
                              flex items-center justify-center
                              transition-all duration-150">
                  <s.icon className="size-4 text-white/60 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase
                          tracking-[0.2em] mb-5">
              Navigate
            </p>
            <ul className="space-y-3">
              {[
                { label: 'Home',         href: '/' },
                { label: 'About Us',     href: '/about' },
                { label: 'Courses',      href: '/courses' },
                { label: 'Tournaments',  href: '/tournaments' },
                { label: 'Gallery',      href: '/gallery' },
                { label: 'Contact',      href: '/contact' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.href}
                     className="text-sm text-white/45 hover:text-white
                                transition-colors duration-150
                                flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2.5 h-px bg-blue-500
                                     transition-all duration-200 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact + CTA */}
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase
                          tracking-[0.2em] mb-5">
              Get In Touch
            </p>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 text-base mt-0.5 flex-shrink-0">
                  <MapPinIcon className="size-4" />
                </span>
                <span className="text-sm text-white/45 leading-relaxed">
                  Andheri West, Mumbai<br />Maharashtra, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-400 text-base flex-shrink-0">
                  <PhoneIcon className="size-4" />
                </span>
                <a href="tel:+919876543210"
                   className="text-sm text-white/45 hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-400 text-base flex-shrink-0">
                  <EnvelopeIcon className="size-4" />
                </span>
                <a href="mailto:info@uniquechess.in"
                   className="text-sm text-white/45 hover:text-white transition-colors">
                  info@uniquechess.in
                </a>
              </li>
            </ul>

            {/* Single strong CTA */}
            <Link to="/contact"
               className="flex items-center justify-center gap-2 w-full
                          bg-blue-600 hover:bg-blue-500 text-white
                          text-sm font-semibold py-3 rounded-xl
                          transition-colors duration-150">
              Book a Free Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar — minimal */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                        py-5 flex flex-col sm:flex-row items-center
                        justify-between gap-3">

          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Unique Chess Academy. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link to="#"
               className="text-xs text-white/25 hover:text-white/50 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/15 text-xs">·</span>
            <Link to="#"
               className="text-xs text-white/25 hover:text-white/50 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
