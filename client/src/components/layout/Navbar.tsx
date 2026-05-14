import { useState, useEffect } from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import { Menu, X as XMarkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// IMPORT THE LOGO FROM ASSETS
import logoImg from "@/assets/logo.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Check if current page is an enrollment/registration page
  const isEnrollmentPage =
    !!matchPath({ path: "/courses/:id/enroll" }, location.pathname) ||
    !!matchPath({ path: "/tournaments/:id" }, location.pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Courses", href: "/courses" },
    { label: "Tournaments", href: "/tournaments" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'));

  // Define navbar visibility
  // If enrollment page, hidden by default, visible on scroll.
  // Otherwise, always visible.
  const isNavbarVisible = !isEnrollmentPage || isScrolled;

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-500",
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-transparent border-b border-transparent',
        !isNavbarVisible && "-translate-y-full opacity-0"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

          {/* Logo — fixed size always */}
          <Link to="/">
            <img src={logoImg} alt="UCA" className="h-9 w-auto rounded-lg" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-150",
                  isActive(link.href)
                    ? 'text-blue-600'
                    : isScrolled
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-white/80 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link
            to="/tournaments"
            className={cn(
              "hidden md:flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150",
              isScrolled
                ? 'bg-slate-900 text-white hover:bg-slate-700'
                : 'bg-white/15 text-white border border-white/30 hover:bg-white/25'
            )}
          >
            Enroll Now
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(true)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              isScrolled ? "text-slate-700" : "text-white"
            )}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-[100] bg-[#070F1C] flex flex-col transition-all duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {/* Top bar inside overlay */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <img src={logoImg} alt="UCA" className="h-9 w-auto rounded-lg" />
          <button onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white">
            <XMarkIcon className="size-6" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-6 pt-8 gap-1">
          {navLinks.map(link => (
            <Link key={link.href}
               to={link.href}
               onClick={() => setIsOpen(false)}
               className={cn(
                 "px-4 py-3 rounded-xl text-lg font-semibold transition-colors duration-150",
                 isActive(link.href)
                   ? 'bg-blue-600/20 text-blue-400'
                   : 'text-white/70 hover:text-white hover:bg-white/8'
               )}>
              {link.label}
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
            Enroll Now
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
