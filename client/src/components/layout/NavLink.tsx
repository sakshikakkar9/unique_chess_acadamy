import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink = ({ to, children, className }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "relative text-sm font-medium transition-all duration-300 py-1",
        isActive ? "text-primary text-glow-gold" : "text-muted-foreground hover:text-foreground",
        "group",
        className
      )}
    >
      {children}
      <span
        className={cn(
          "absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300",
          isActive ? "w-full" : "w-0 group-hover:w-full"
        )}
      />
    </Link>
  );
};

export default NavLink;
