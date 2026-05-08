import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Image as ImageIcon,
  Users,
  Calendar,
  Settings,
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
  { icon: Calendar,        label: "Events",        href: "/admin/events"       },
  { icon: Users,           label: "Students",      href: "/admin/students"     },
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
          "bg-[#0f172a] border-r border-[#1e293b]",
          "transition-transform duration-300 ease-in-out md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo block */}
        <div className="p-6 flex items-center justify-between border-b border-[#1e293b]">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div
              style={{
                width: '34px',
                height: '34px',
                background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 900,
                fontSize: '13px'
              }}
            >
              UCA
            </div>
            <div className="flex flex-col">
              <span style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 700 }}>
                UCA Admin
              </span>
              <span style={{ color: '#475569', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Command Center
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#64748b] hover:bg-[#1e293b] hover:text-white"
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
                  "flex items-center gap-[10px] px-3 py-[9px] rounded-lg transition-all duration-200",
                  isActive
                    ? "text-white font-bold"
                    : "text-[#64748b] font-medium hover:bg-[#1e293b] hover:text-white group"
                )}
                style={isActive ? {
                  background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                  fontSize: '13px',
                  fontWeight: 700
                } : {
                  fontSize: '13px'
                }}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-white" : "text-[#475569] group-hover:text-white"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer: Bottom "Back to Website" */}
        <div className="p-4 border-t border-[#1e293b]">
          <Link
            to="/"
            className="flex items-center gap-2 text-[12px] text-[#64748b] hover:text-[#0284c7] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Website
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
