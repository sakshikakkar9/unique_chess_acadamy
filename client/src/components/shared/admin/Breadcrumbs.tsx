import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = ({ paths }: { paths: string[] }) => (
  <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">
    <Home className="w-3 h-3" />
    {paths.map((path, idx) => (
      <React.Fragment key={idx}>
        <ChevronRight className="w-3 h-3 text-sky-500/50" />
        <span className={idx === paths.length - 1 ? "text-sky-400" : ""}>{path}</span>
      </React.Fragment>
    ))}
  </nav>
);