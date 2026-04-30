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
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white border-b border-[#e2e8f0] py-3 shadow-[0_1px_8px_rgba(0,0,0,0.06)]"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-baseline">
            <span className={cn(
              "font-bold text-xl tracking-tight",
              scrolled ? "text-[#0f172a]" : "text-white"
            )}>
              UNIQUE
            </span>
            <span className="font-bold text-xl tracking-tight text-[#2563eb] ml-1.5">
              CHESS
            </span>
            <span className={cn(
              "font-medium text-xs tracking-wider ml-1.5",
              scrolled ? "text-[#64748b]" : "text-white/70"
            )}>
              ACADEMY
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "relative text-[14px] font-medium transition-colors duration-200 py-1",
                isActive(link.path)
                  ? "text-[#2563eb]"
                  : scrolled
                    ? "text-[#475569] hover:text-[#0f172a]"
                    : "text-white/80 hover:text-white"
              )}
            >
              {link.name}
              {isActive(link.path) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#2563eb]"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Button
            className="bg-[#d97706] text-white font-semibold rounded-full px-6 py-2 h-auto hover:bg-[#b45309] transition-all duration-300 shadow-[0_4px_12px_rgba(217,119,6,0.35)]"
          >
            Enroll Now
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn(
            "lg:hidden p-2 transition-colors",
            scrolled ? "text-[#0f172a]" : "text-white"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
               <div className="flex items-baseline">
                <span className="font-bold text-xl tracking-tight text-[#0f172a]">UNIQUE</span>
                <span className="font-bold text-xl tracking-tight text-[#2563eb] ml-1.5">CHESS</span>
              </div>
              <button
                className="p-2 text-[#0f172a]"
                onClick={() => setIsOpen(false)}
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex flex-col gap-6">
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
                      isActive(link.path) ? "text-[#2563eb]" : "text-[#475569]"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="mt-8"
              >
                <Button
                  className="bg-[#d97706] text-white font-bold rounded-full w-full py-4 h-auto text-lg shadow-[0_4px_12px_rgba(217,119,6,0.35)]"
                  onClick={() => setIsOpen(false)}
                >
                  Enroll Now
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
