import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import SparkleCanvas from "@/components/shared/SparkleCanvas";

const Footer = () => {
  return (
    <footer className="bg-[#0d1421] pt-14 pb-8 relative overflow-hidden text-white">
      <SparkleCanvas density="subtle" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 - Brand */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-baseline">
                <span className="font-bold text-xl tracking-tight text-white uppercase">Unique</span>
                <span className="font-bold text-xl tracking-tight text-[#2563eb] ml-1.5 uppercase">Chess</span>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-[200px]">
              India's premier chess academy dedicated to nurturing the next generation of masters.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-150 text-white/70"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Courses", path: "/courses" },
                { name: "Tournaments", path: "/tournaments" },
                { name: "Gallery", path: "/gallery" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-white/60 hover:text-white transition-colors duration-150 py-1 block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Our Programs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Our Programs</h4>
            <ul className="space-y-2">
              {[
                "Beginner Program",
                "Intermediate Training",
                "Advanced Mastery",
                "One-on-One Coaching",
              ].map((program) => (
                <li key={program}>
                  <Link to="/courses" className="text-sm text-white/60 hover:text-white transition-colors duration-150 py-1 block">
                    {program}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact Us */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-sm text-white/60 leading-relaxed">Chess House, Andheri West, Mumbai, India</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="size-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-sm text-white/60">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="size-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-sm text-white/60">info@uniquechess.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-white/10 my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Unique Chess Academy. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-white/40 hover:text-white/60 transition-colors">Privacy Policy</a>
            <span className="text-white/10">·</span>
            <a href="#" className="text-xs text-white/40 hover:text-white/60 transition-colors">Terms of Service</a>
          </div>
          <div className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
            Designed by Sakshi
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;