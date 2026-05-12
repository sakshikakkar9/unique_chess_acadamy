import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-[#070F1C] text-white">
      <div className="max-w-4xl mx-auto px-6 py-14
                      flex flex-col items-center gap-10">

        {/* ZONE 1 — Brand */}
        <div className="flex flex-col items-center gap-4">

          {/* Logo */}
          <img src={logoImg} alt="Unique Chess Academy"
               className="h-10 w-auto opacity-90 rounded-lg" />

          {/* Tagline — one line only */}
          <p className="text-sm text-white/40 text-center">
            Training champions across India since 2018.
          </p>

          {/* Social icons — 4 only */}
          <div className="flex items-center gap-3 mt-1">
            {[
              {
                label: 'Facebook', href: '#',
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              },
              {
                label: 'Instagram', href: '#',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           strokeWidth="2" className="size-4">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              },
              {
                label: 'YouTube', href: '#',
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88
                  0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46
                  5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0
                  8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0
                  00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                </svg>
              },
              {
                label: 'X / Twitter', href: '#',
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231
                  -5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161
                  17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              },
            ].map(s => (
              <a key={s.label} href={s.href} aria-label={s.label}
                 className="w-9 h-9 rounded-xl bg-white/6 border border-white/10
                            hover:bg-blue-600 hover:border-blue-600
                            text-white/40 hover:text-white
                            flex items-center justify-center
                            transition-all duration-200">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Thin divider */}
        <div className="w-full h-px bg-white/8" />

        {/* ZONE 2 — Nav links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            { label: 'Home',        href: '/' },
            { label: 'About',       href: '/about' },
            { label: 'Courses',     href: '/courses' },
            { label: 'Tournaments', href: '/tournaments' },
            { label: 'Gallery',     href: '/gallery' },
            { label: 'Contact',     href: '/contact' },
          ].map(link => (
            <Link key={link.label} to={link.href}
               className="text-sm text-white/40 hover:text-white
                          transition-colors duration-150 font-medium">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Thin divider */}
        <div className="w-full h-px bg-white/8" />

        {/* ZONE 3 — Bottom bar */}
        <div className="w-full flex flex-col sm:flex-row items-center
                        justify-between gap-3">

          <p className="text-xs text-white/25">
            © 2026 Unique Chess Academy. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/privacy"
               className="text-xs text-white/25 hover:text-white/60
                          transition-colors duration-150">
              Privacy Policy
            </Link>
            <span className="text-white/15">·</span>
            <Link to="/terms"
               className="text-xs text-white/25 hover:text-white/60
                          transition-colors duration-150">
              Terms of Service
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
