import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavLink from "./NavLink";
import { cn } from "@/lib/utils";
import ucaLogo from "../../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Courses", path: "/courses" },
    { name: "Tournaments", path: "/tournaments" },
    { name: "Gallery", path: "/gallery" },
    { name: "Events", path: "/events" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 px-4 md:px-8 py-4",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl shadow-black/20"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center group relative">
          <div className="absolute -inset-2 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          <img 
            src={ucaLogo} 
            alt="Unique Chess Academy" 
            className="h-10 w-auto object-contain transition-transform group-hover:scale-110 md:h-14 relative z-10"
            onError={(e) => console.error("Logo failed to load:", e)}
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path}>
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all">
            Book Free Demo
          </Button>
          <Button size="sm" className="gold-glow rounded-full px-6">
            Join Now
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-background/95 backdrop-blur-2xl p-6 z-50 animate-in fade-in slide-in-from-top-10">
          <div className="flex flex-col gap-6 items-center pt-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-2xl font-heading font-medium tracking-wide hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="w-full h-px bg-white/5 my-4" />
            <Button variant="outline" className="w-full border-primary/20" onClick={() => setIsOpen(false)}>
              Book Free Demo
            </Button>
            <Button className="w-full gold-glow rounded-full" onClick={() => setIsOpen(false)}>
              Join Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
