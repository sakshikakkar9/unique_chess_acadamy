import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X as XMarkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// IMPORT THE LOGO FROM ASSETS
import logoImg from "@/assets/logo.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'));

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 flex items-center",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* LEFT SECTION: LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src={logoImg}
              alt="Unique Chess Academy"
              className="h-10 w-auto object-contain rounded-lg transition-all duration-300"
            />
          </Link>

          {/* CENTER SECTION: DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm transition-all duration-300 relative py-1",
                  isActive(link.path)
                    ? cn(
                        "text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5"
                      )
                    : isScrolled
                      ? "text-slate-600 hover:text-slate-900 font-medium"
                      : "text-white/80 hover:text-white font-medium"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT SECTION: MOBILE TOGGLE */}
          <div className="md:hidden">
            <button
              className={cn(
                "p-2 transition-colors",
                isScrolled ? "text-slate-900" : "text-white"
              )}
              onClick={() => setIsOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-[100] bg-[#070F1C] flex flex-col transition-all duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {/* Top bar inside overlay */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <img src={logoImg} alt="UCA" className="h-10 w-auto rounded-lg" />
          <button onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white">
            <XMarkIcon className="size-6" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-6 pt-8 gap-1">
          {navLinks.map(link => (
            <Link key={link.path}
               to={link.path}
               onClick={() => setIsOpen(false)}
               className={cn(
                 "px-4 py-3 rounded-xl text-lg font-semibold transition-colors duration-150",
                 isActive(link.path)
                   ? 'bg-blue-600/20 text-blue-400'
                   : 'text-white/70 hover:text-white hover:bg-white/8'
               )}>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA at bottom of mobile menu */}
        <div className="mt-auto px-6 pb-10">
          <Link to="/tournaments"
             onClick={() => setIsOpen(false)}
             className="flex items-center justify-center gap-2 w-full
                        bg-blue-600 hover:bg-blue-500 text-white
                        font-semibold py-3.5 rounded-xl transition-colors duration-150">
            View Tournaments
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
