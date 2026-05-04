import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Image as ImageIcon,
  Users,
  Settings,
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
  { icon: Settings,        label: "Settings",      href: "/admin/settings"     },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col",
          "bg-sidebar border-r border-sidebar-border",
          "transition-transform duration-300 ease-in-out md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-sidebar-border">
          <Link to="/admin/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center gold-glow">
              <Crown className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-heading font-bold text-sm tracking-tight text-sidebar-foreground">
                UCA Admin
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/20 gold-glow"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive && "text-primary")} />
                {item.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-sidebar-foreground/50 hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-3 w-3" />
            Back to Website
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
