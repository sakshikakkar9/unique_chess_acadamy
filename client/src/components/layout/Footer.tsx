import { Link } from "react-router-dom";
import { Crown, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card pt-20 pb-10 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <Crown className="h-8 w-8 text-primary" />
              <span className="font-heading font-bold text-xl tracking-tight">
                Unique <span className="text-gradient-gold">Chess</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              India's premier chess academy dedicated to nurturing the next generation of grandmasters through structured training and expert mentorship.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-background border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/courses" className="hover:text-primary transition-colors">Our Courses</Link></li>
              <li><Link to="/tournaments" className="hover:text-primary transition-colors">Tournaments</Link></li>
              <li><Link to="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-6">Our Programs</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="/courses" className="hover:text-primary transition-colors">Beginner Program</Link></li>
              <li><Link to="/courses" className="hover:text-primary transition-colors">Intermediate Training</Link></li>
              <li><Link to="/courses" className="hover:text-primary transition-colors">Advanced Mastery</Link></li>
              <li><Link to="/courses" className="hover:text-primary transition-colors">One-on-One Coaching</Link></li>
              <li><Link to="/courses" className="hover:text-primary transition-colors">Corporate Workshops</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Andheri West, Mumbai, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>info@uniquechess.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Unique Chess Academy. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
