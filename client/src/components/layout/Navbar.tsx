import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
    { name: "Events", path: "/events" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 px-6 py-4",
        scrolled
          ? "bg-[#0d1b2e]/70 backdrop-blur-[24px] border-b border-white/10 py-3 shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="text-white text-2xl group-hover:scale-110 transition-transform duration-300">♞</div>
          <div className="flex flex-col md:flex-row md:gap-2 leading-none">
            <span className="text-white font-black tracking-widest text-lg">UNIQUE</span>
            <div className="flex gap-2">
              <span className="text-[#f59e0b] font-black tracking-widest text-lg">CHESS</span>
              <span className="text-[#60a5fa] font-black tracking-widest text-lg">ACADEMY</span>
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "relative text-sm font-bold uppercase tracking-widest transition-all duration-300 py-2",
                isActive(link.path)
                  ? "text-[#60a5fa] glow-text-blue"
                  : "text-[#94a3b8] hover:text-white"
              )}
            >
              {link.name}
              {isActive(link.path) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#60a5fa] shadow-[0_0_10px_#3b82f6]"
                />
              )}
              {!isActive(link.path) && (
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Button
            className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-black font-black rounded-full px-8 hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] border-none"
          >
            JOIN NOW
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 top-0 left-0 w-full h-screen bg-[#0d1b2e]/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center p-8"
          >
            <button
              className="absolute top-6 right-6 p-2 text-white"
              onClick={() => setIsOpen(false)}
            >
              <X size={32} />
            </button>
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={cn(
                      "text-2xl font-black uppercase tracking-widest",
                      isActive(link.path) ? "text-[#60a5fa] glow-text-blue" : "text-white"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-black font-black rounded-full px-12 py-6 text-xl shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                  onClick={() => setIsOpen(false)}
                >
                  JOIN NOW
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
