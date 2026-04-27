import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Image as ImageIcon,
  Users,
  Crown,
  ChevronLeft,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard",    href: "/admin/dashboard"    },
  { icon: BookOpen,        label: "Courses",       href: "/admin/courses"      },
  { icon: Trophy,          label: "Tournaments",   href: "/admin/tournaments"  },
  { icon: Users,           label: "Registrations", href: "/admin/registrations"},
  { icon: ImageIcon,       label: "Gallery",       href: "/admin/gallery"      },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 h-screen w-72 flex flex-col",
          "bg-sidebar border-r border-white/5 shadow-2xl",
          "transition-transform duration-500 ease-in-out md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center gold-glow">
              <Crown className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base tracking-tight text-sidebar-foreground">
                UCA Admin
              </span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Premium Panel</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-sidebar-foreground hover:bg-white/5"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "bg-primary text-primary-foreground gold-glow"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-white/5"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110", isActive ? "text-primary-foreground" : "text-primary")} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="active-sidebar-pill"
                    className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary-foreground"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sidebar-foreground/40 hover:text-primary transition-all group"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Website
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
