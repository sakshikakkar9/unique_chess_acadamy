import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import SparkleCanvas from "@/components/shared/SparkleCanvas";

const Footer = () => {
  return (
    <footer className="bg-[#0d1421] pt-24 pb-12 relative overflow-hidden text-white">
      <SparkleCanvas density="subtle" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-baseline">
                <span className="font-bold text-xl tracking-tight text-white">UNIQUE</span>
                <span className="font-bold text-xl tracking-tight text-[#2563eb] ml-1.5">CHESS</span>
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
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: "About Us", path: "/about" },
                { name: "Our Courses", path: "/courses" },
                { name: "Tournaments", path: "/tournaments" },
                { name: "Gallery", path: "/gallery" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-[#94a3b8] hover:text-white text-sm font-medium transition-all duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-8">Our Programs</h4>
            <ul className="space-y-4">
              {[
                "Beginner Program",
                "Intermediate Training",
                "Advanced Mastery",
                "One-on-One Coaching",
                "Corporate Workshops",
              ].map((program) => (
                <li key={program}>
                  <Link to="/courses" className="text-[#94a3b8] hover:text-white text-sm font-medium transition-all duration-300">
                    {program}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-8">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-[#94a3b8]">
                <MapPin className="h-5 w-5 text-[#2563eb] shrink-0" />
                <span className="text-sm leading-relaxed">Chess House, Andheri West, Mumbai, India</span>
              </li>
              <li className="flex items-center gap-4 text-[#94a3b8]">
                <Phone className="h-5 w-5 text-[#2563eb] shrink-0" />
                <span className="text-sm font-semibold">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-4 text-[#94a3b8]">
                <Mail className="h-5 w-5 text-[#2563eb] shrink-0" />
                <span className="text-sm font-semibold">info@uniquechess.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[#64748b] text-[11px] font-medium uppercase tracking-widest">
            © {new Date().getFullYear()} Unique Chess Academy. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[#64748b] hover:text-white text-[11px] font-medium uppercase tracking-widest transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#64748b] hover:text-white text-[11px] font-medium uppercase tracking-widest transition-colors">Terms of Service</a>
          </div>
          <div className="border border-[#d97706]/40 px-4 py-2 rounded-full">
             <span className="text-[#d97706] text-[11px] font-bold uppercase tracking-widest">Designed by Sakshi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
