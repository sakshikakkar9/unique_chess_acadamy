import { Link } from "react-router-dom";
import { Crown, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Crown className="h-8 w-8 text-primary" />
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight">
                Unique <span className="text-gradient-gold">Chess</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Nurturing the next generation of grandmasters through structured training, expert mentorship, and a commitment to excellence.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 rounded-full glass border border-white/5 hover:border-primary/50 text-muted-foreground hover:text-primary hover:scale-110 transition-all shadow-lg">
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-8 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full" />
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />About Us</Link></li>
              <li><Link to="/courses" className="hover:text-primary transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />Our Courses</Link></li>
              <li><Link to="/tournaments" className="hover:text-primary transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />Tournaments</Link></li>
              <li><Link to="/gallery" className="hover:text-primary transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-8 relative inline-block">
              Programs
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full" />
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="/courses" className="hover:text-primary transition-colors">Beginner Program</Link></li>
              <li><Link to="/courses" className="hover:text-primary transition-colors">Intermediate Training</Link></li>
              <li><Link to="/courses" className="hover:text-primary transition-colors">Advanced Mastery</Link></li>
              <li><Link to="/courses" className="hover:text-primary transition-colors">One-on-One Coaching</Link></li>
              <li><Link to="/courses" className="hover:text-primary transition-colors">Corporate Workshops</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-8 relative inline-block">
              Get in Touch
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full" />
            </h4>
            <ul className="space-y-6 text-sm text-muted-foreground">
              <li className="flex items-start gap-4">
                <div className="p-2 bg-primary/5 rounded-md mt-0.5">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                </div>
                <span className="leading-relaxed">Andheri West, Mumbai, India</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-primary/5 rounded-md mt-0.5">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                </div>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-primary/5 rounded-md mt-0.5">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                </div>
                <span className="hover:text-primary transition-colors">info@uniquechess.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-muted-foreground/60">
          <p>© {new Date().getFullYear()} Unique Chess Academy. Designed for Masters.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
