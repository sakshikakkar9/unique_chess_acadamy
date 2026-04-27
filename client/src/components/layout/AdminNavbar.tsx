import React from "react";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface AdminNavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ setSidebarOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-white/5 bg-background/60 backdrop-blur-xl px-6 md:px-10">
      <div className="flex items-center gap-6">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="hidden md:flex flex-col">
          <h2 className="text-lg font-heading font-bold text-foreground">Management Portal</h2>
          <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Unique Chess Academy</p>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </Button>

        <div className="h-8 w-px bg-white/5 mx-2 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-xl bg-primary/10 hover:bg-primary/20 p-0 overflow-hidden transition-all duration-300">
              <div className="flex h-full w-full items-center justify-center text-primary">
                <User className="h-5 w-5" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 glass border-white/10 p-2 mt-4">
            <DropdownMenuLabel className="font-heading font-bold px-3 py-2">Administrator</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg m-1 py-2 cursor-pointer">
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-bold text-xs uppercase tracking-widest">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminNavbar;
