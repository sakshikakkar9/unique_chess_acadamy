import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const Footer = () => {
  return (
    <footer className="bg-[#020617] pt-24 pb-12 relative overflow-hidden">
      {/* Top golden gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent opacity-50" />

      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="text-white text-2xl group-hover:scale-110 transition-transform duration-300">♞</div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-black tracking-widest text-lg uppercase">UNIQUE</span>
                <div className="flex gap-1">
                  <span className="text-[#f59e0b] font-black tracking-widest text-lg uppercase">CHESS</span>
                </div>
              </div>
            </Link>
            <p className="text-[#94a3b8] text-sm leading-relaxed max-w-xs">
              India's premier chess academy dedicated to nurturing the next generation of grandmasters through structured training and expert mentorship.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg glass-card-blue flex items-center justify-center text-white hover:glow-blue hover:scale-110 transition-all duration-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: "About Us", path: "/about" },
                { name: "Our Courses", path: "/courses" },
                { name: "Tournaments", path: "/tournaments" },
                { name: "Gallery", path: "/gallery" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-[#64748b] hover:text-[#93c5fd] text-sm font-bold transition-all duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Our Programs</h4>
            <ul className="space-y-4">
              {[
                "Beginner Program",
                "Intermediate Training",
                "Advanced Mastery",
                "One-on-One Coaching",
                "Corporate Workshops",
              ].map((program) => (
                <li key={program}>
                  <Link to="/courses" className="text-[#64748b] hover:text-[#93c5fd] text-sm font-bold transition-all duration-300">
                    {program}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-[#94a3b8]">
                <MapPin className="h-5 w-5 text-[#f59e0b] shrink-0" />
                <span className="text-sm leading-relaxed">Chess House, Andheri West, Mumbai, India</span>
              </li>
              <li className="flex items-center gap-4 text-[#94a3b8]">
                <Phone className="h-5 w-5 text-[#f59e0b] shrink-0" />
                <span className="text-sm font-bold">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-4 text-[#94a3b8]">
                <Mail className="h-5 w-5 text-[#f59e0b] shrink-0" />
                <span className="text-sm font-bold">info@uniquechess.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[#64748b] text-[10px] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} Unique Chess Academy. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[#64748b] hover:text-[#93c5fd] text-[10px] font-black uppercase tracking-widest transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#64748b] hover:text-[#93c5fd] text-[10px] font-black uppercase tracking-widest transition-colors">Terms of Service</a>
          </div>
          <div className="glass-card-gold px-4 py-2 shadow-sm">
             <span className="text-[#f59e0b] text-[10px] font-black uppercase tracking-widest">Designed by Sakshi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
