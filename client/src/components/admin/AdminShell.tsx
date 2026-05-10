import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Plus,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  Trophy,
  Users,
  Image as ImageIcon,
  Settings,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminShellProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard",    href: "/admin/dashboard"    },
  { icon: BookOpen,        label: "Courses",       href: "/admin/courses"      },
  { icon: Trophy,          label: "Tournaments",   href: "/admin/tournaments"  },
  { icon: Users,           label: "Students",      href: "/admin/students"     },
  { icon: Users,           label: "Registrations", href: "/admin/registrations"},
  { icon: ImageIcon,       label: "Gallery",       href: "/admin/gallery"      },
  { icon: Settings,        label: "Settings",      href: "/admin/settings"     },
];

const AdminShell: React.FC<AdminShellProps> = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-uca-bg-base text-uca-text-primary flex relative overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen flex flex-col transition-all duration-300 ease-in-out border-r border-uca-border bg-uca-sidebar-bg",
          // Mobile
          isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64",
          // Tablet
          "md:translate-x-0 md:w-16 md:hover:w-56 group/sidebar",
          // Desktop
          "lg:w-64 lg:hover:w-64"
        )}
      >
        {/* Logo block */}
        <div className="h-16 flex items-center px-4 border-b border-uca-border overflow-hidden shrink-0">
          <div className="flex items-center gap-3 min-w-max">
            <div className="size-8 rounded-lg bg-uca-navy flex items-center justify-center text-white font-black text-xs shrink-0 border border-uca-border">
              UCA
            </div>
            <div className={cn(
              "flex flex-col transition-opacity duration-200",
              isSidebarOpen ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100 lg:opacity-100"
            )}>
              <span className="text-sm font-bold leading-none">UCA Admin</span>
              <span className="text-[10px] text-uca-text-muted uppercase tracking-wider">Command Center</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group/item",
                  isActive
                    ? "bg-uca-sidebar-hover text-white shadow-lg shadow-black/20"
                    : "text-uca-sidebar-text hover:bg-uca-sidebar-hover hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "size-5 shrink-0 transition-colors",
                  isActive ? "text-white" : "group-hover/item:text-white"
                )} />
                <span className={cn(
                  "text-sm font-medium transition-opacity duration-200 whitespace-nowrap",
                  isSidebarOpen ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100 lg:opacity-100"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-2 border-t border-uca-border shrink-0 overflow-hidden">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 text-uca-text-muted hover:text-uca-accent-blue transition-colors rounded-lg hover:bg-uca-bg-elevated group/back"
          >
            <ChevronLeft className="size-5 shrink-0" />
            <span className={cn(
              "text-xs font-semibold transition-opacity duration-200 whitespace-nowrap",
              isSidebarOpen ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100 lg:opacity-100"
            )}>
              Back to Website
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-16 lg:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-uca-border bg-uca-bg-surface shadow-sm sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-uca-text-muted hover:text-uca-text-inverse transition-colors"
            >
              <Menu className="size-6" />
            </button>
            <div className="flex flex-col min-w-0 hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold text-uca-text-primary truncate">{title}</h1>
              {subtitle && <p className="text-xs lg:text-sm text-uca-text-muted truncate">{subtitle}</p>}
            </div>
          </div>

          {actionLabel && (
            <div className="hidden sm:block">
              <Button
                onClick={onAction}
                className="bg-uca-navy hover:bg-uca-navy-hover text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors h-10 gap-2"
              >
                <Plus className="size-4" />
                {actionLabel}
              </Button>
            </div>
          )}
        </header>

        {/* Mobile Page Header (Stacked) */}
        <div className="sm:hidden px-4 py-4 space-y-3 bg-uca-bg-surface border-b border-uca-border">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-uca-text-primary">{title}</h1>
            {subtitle && <p className="text-xs text-uca-text-muted">{subtitle}</p>}
          </div>
          {actionLabel && (
            <Button
              onClick={onAction}
              className="w-full bg-uca-navy hover:bg-uca-navy-hover text-white font-semibold text-sm h-11 rounded-lg transition-colors gap-2"
            >
              <Plus className="size-4" />
              {actionLabel}
            </Button>
          )}
        </div>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
