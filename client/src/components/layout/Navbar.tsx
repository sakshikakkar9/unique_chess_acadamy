import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Removed Crown as it's unused
import { Button } from "@/components/ui/button";
import NavLink from "./NavLink";
import { cn } from "@/lib/utils";

// Make sure this path correctly points from components/layout to assets
import ucaLogo from "../../assets/logo.jpeg"; 

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
        "fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-8 py-4",
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60 py-3 shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center group">
          <img 
            src={ucaLogo} 
            alt="Unique Chess Academy" 
            className="h-12 w-auto object-contain transition-transform group-hover:scale-105 md:h-16" 
            onError={(e) => console.error("Logo failed to load:", e)}
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path}>
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
            Book Free Demo
          </Button>
          <Button size="sm" className="gold-glow">
            Join Now
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border p-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-lg font-medium p-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-border" />
            <Button className="w-full gold-glow">Join Now</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;