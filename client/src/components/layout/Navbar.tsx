import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// IMPORT THE LOGO FROM ASSETS
import logoImg from "@/assets/logo.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Courses", path: "/courses" },
    { name: "Tournaments", path: "/tournaments" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white border-b border-slate-200 py-2 shadow-sm"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-3 items-center">
        {/* LEFT SECTION: LOGO */}
        <div className="flex justify-start">
          <Link to="/" className="flex items-center group">
            <img 
              src={logoImg} 
              alt="Unique Chess Academy"
              className={cn(
                "h-10 sm:h-14 md:h-16 w-auto transition-all duration-300 object-contain rounded-lg",
                scrolled ? "mix-blend-multiply opacity-95" : "brightness-110 contrast-110"
              )}
            />
          </Link>
        </div>

        {/* CENTER SECTION: DESKTOP NAVIGATION */}
        <div className="hidden lg:flex justify-center items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "relative text-[14px] font-medium transition-colors duration-200 py-1",
                isActive(link.path)
                  ? "text-blue-600"
                  : scrolled
                    ? "text-slate-600 hover:text-slate-900"
                    : "text-white/80 hover:text-white"
              )}
            >
              {link.name}
              {isActive(link.path) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-blue-600"
                />
              )}
            </Link>
          ))}
        </div>

        {/* RIGHT SECTION: EMPTY (FOR BALANCING) OR MOBILE TOGGLE */}
        <div className="flex justify-end">
          <button
            className={cn(
              "lg:hidden p-2 transition-colors",
              scrolled ? "text-slate-900" : "text-white"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 w-full h-screen bg-white z-[60] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <img src={logoImg} alt="Logo" className="h-12 w-auto mix-blend-multiply" />
              <button
                className="p-2 text-slate-900"
                onClick={() => setIsOpen(false)}
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto items-center text-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={cn(
                      "text-2xl font-bold transition-colors",
                      isActive(link.path) ? "text-blue-600" : "text-slate-600"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;