import { Link } from "react-router-dom";
import {
  Facebook, Instagram, Twitter, Youtube,
  MapPin as MapPinIcon, Phone as PhoneIcon, Mail as EnvelopeIcon,
  Calendar as CalendarIcon
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#070F1C] text-white">
      {/* Top accent strip */}
      <div className="border-b border-white/10 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                        flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-6 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-2 text-xs text-white/50 font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              INDIA'S PREMIER CHESS ACADEMY
            </span>
            <span className="text-xs text-white/30 hidden sm:block">·</span>
            <span className="text-xs text-white/50 font-medium tracking-wide">
              EST. 2018
            </span>
            <span className="text-xs text-white/30 hidden sm:block">·</span>
            <span className="text-xs text-white/50 font-medium tracking-wide">
              FIDE AFFILIATED
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30">Trusted by</span>
            <span className="text-sm font-bold text-blue-400">2,400+</span>
            <span className="text-xs text-white/30">students across India</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1 — Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <div className="flex items-baseline">
                <span className="font-bold text-xl tracking-tight text-white uppercase">Unique</span>
                <span className="font-bold text-xl tracking-tight text-[#2563eb] ml-1.5 uppercase">Chess</span>
              </div>
            </Link>

            <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-[220px]">
              Shaping grandmasters through
              structured training, elite tournaments,
              and world-class mentorship.
            </p>

            <div className="flex flex-col gap-2 mb-6">
              {[
                { value: '2,400+', label: 'Students Trained' },
                { value: '150+',   label: 'Tournament Wins' },
                { value: '12',     label: 'FIDE Rated Coaches' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-base font-bold text-blue-400">{stat.value}</span>
                  <span className="text-xs text-white/40">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Youtube, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-blue-600
                             border border-white/10 hover:border-blue-500
                             transition-all duration-200 group"
                >
                  <social.icon className="size-4 text-white/60 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Explore */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-5
                           flex items-center gap-2">
              <span className="w-4 h-px bg-blue-500" />
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home',           href: '/' },
                { label: 'About UCA',      href: '/about' },
                { label: 'Our Courses',    href: '/courses' },
                { label: 'Tournaments',    href: '/tournaments' },
                { label: 'Photo Gallery',  href: '/gallery' },
                { label: 'Contact Us',     href: '/contact' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.href}
                     className="text-sm text-white/50 hover:text-white
                                transition-colors duration-150
                                flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-3 h-px bg-blue-500
                                     transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Programs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-5
                           flex items-center gap-2">
              <span className="w-4 h-px bg-blue-500" />
              Programs
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Beginner Foundation',  tag: 'Ages 5+' },
                { label: 'Junior Development',   tag: 'Ages 8–14' },
                { label: 'Teen Competitive',     tag: 'Ages 14–18' },
                { label: 'Adult Mastery',        tag: 'All levels' },
                { label: 'One-on-One Coaching',  tag: 'Premium' },
                { label: 'Online Sessions',      tag: 'Remote' },
              ].map((prog, i) => (
                <li key={i} className="flex items-center justify-between gap-3">
                  <Link to="/courses" className="text-sm text-white/50 hover:text-white
                                   transition-colors duration-150 cursor-pointer">
                    {prog.label}
                  </Link>
                  <span className="text-[10px] text-blue-400/70 font-medium
                                   bg-blue-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
                    {prog.tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Get In Touch */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-5
                           flex items-center gap-2">
              <span className="w-4 h-px bg-blue-500" />
              Get In Touch
            </h4>

            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-blue-500/15 flex-shrink-0 mt-0.5">
                  <MapPinIcon className="size-3.5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/70 mb-0.5">Visit Us</p>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Chess House, Andheri West<br />Mumbai, Maharashtra 400053
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-blue-500/15 flex-shrink-0 mt-0.5">
                  <PhoneIcon className="size-3.5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/70 mb-0.5">Call Us</p>
                  <a href="tel:+919876543210"
                     className="text-xs text-white/40 hover:text-blue-400 transition-colors">
                    +91 98765 43210
                  </a>
                  <p className="text-[10px] text-white/25 mt-0.5">Mon–Sat, 9am–7pm IST</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-blue-500/15 flex-shrink-0 mt-0.5">
                  <EnvelopeIcon className="size-3.5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/70 mb-0.5">Email Us</p>
                  <a href="mailto:info@uniquechess.in"
                     className="text-xs text-white/40 hover:text-blue-400 transition-colors">
                    info@uniquechess.in
                  </a>
                  <p className="text-[10px] text-white/25 mt-0.5">Reply within 24 hours</p>
                </div>
              </li>
            </ul>

            <Link to="/contact"
               className="flex items-center justify-center gap-2 w-full
                          bg-blue-600 hover:bg-blue-500 text-white
                          text-xs font-semibold py-2.5 rounded-lg
                          transition-colors duration-150">
              <CalendarIcon className="size-3.5" />
              Book a Free Demo Class
            </Link>
          </div>
        </div>

        {/* Newsletter strip */}
        <div className="border-t border-white/5 mt-12 pt-10 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-base font-bold text-white mb-1">
                Stay ahead of every move.
              </p>
              <p className="text-sm text-white/40">
                Tournament alerts, coaching tips, and UCA news — straight to your inbox.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-lg
                           bg-white/5 border border-white/10
                           text-sm text-white placeholder:text-white/30
                           focus:outline-none focus:border-blue-500
                           transition-colors duration-150"
              />
              <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500
                                 text-white text-sm font-semibold rounded-lg
                                 transition-colors duration-150 flex-shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6
                        flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Unique Chess Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="#" className="text-xs text-white/25 hover:text-white/50
                                           transition-colors duration-150">
              Privacy Policy
            </Link>
            <Link to="#" className="text-xs text-white/25 hover:text-white/50
                                         transition-colors duration-150">
              Terms of Service
            </Link>
            <Link to="#" className="text-xs text-white/25 hover:text-white/50
                                           transition-colors duration-150">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
