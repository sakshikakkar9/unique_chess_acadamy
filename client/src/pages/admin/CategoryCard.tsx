import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AGE_GROUP_LABELS, AGE_GROUP_RANGES, AgeGroup } from "@/types";
// ✅ IMPORT THE NEW PROFESSIONAL ICONS
import { Atom, Trophy, Castle } from "lucide-react";

interface CategoryCardProps {
  type: AgeGroup;
  icon?: string; // Optional if you still pass emojis, but we will use the logic below
  count: number;
  onClick: () => void;
}

// ✅ DEFINE THE ICON MAP TO SYNC WITH TYPES
const categoryIconMap: Record<AgeGroup, React.ReactNode> = {
  CHILDREN: <Atom className="w-10 h-10 text-sky-400 drop-shadow-[0_0_8px_#38bdf8]" />,
  TEENAGERS: <Trophy className="w-10 h-10 text-amber-400 drop-shadow-[0_0_8px_#fbbf24]" />,
  ADULTS: <Castle className="w-10 h-10 text-sky-200 drop-shadow-[0_0_8px_#e0f2fe]" />,
};

export const CategoryCard = ({ type, count, onClick }: CategoryCardProps) => (
  <Card 
    className="relative overflow-hidden cursor-pointer transition-all duration-500 group 
               bg-gradient-to-br from-slate-900/80 to-slate-950/90 
               border border-sky-500/10 hover:border-sky-400 
               shadow-[0_0_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(14,165,233,0.3)] 
               backdrop-blur-xl"
    onClick={onClick}
  >
    {/* Animated Gloss Overlay */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                    bg-gradient-to-tr from-transparent via-sky-400/5 to-transparent -translate-x-full group-hover:translate-x-full transform skew-x-12" />
    
    <CardHeader className="pb-3 relative z-10">
      {/* ✅ RENDER THE PROFESSIONAL ICON */}
      <div className="w-20 h-20 rounded-3xl bg-slate-800/60 flex items-center justify-center mb-5 
                      border border-white/5 group-hover:border-sky-500/50 group-hover:scale-105 
                      shadow-inner transition-all duration-500">
        {categoryIconMap[type]}
      </div>
      <CardTitle className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tighter">
        {AGE_GROUP_LABELS[type]}
      </CardTitle>
      <CardDescription className="text-sky-400/90 font-semibold tracking-wide text-sm mt-1">
        {AGE_GROUP_RANGES[type]}
      </CardDescription>
    </CardHeader>
    
    <CardContent className="relative z-10 pt-4">
      <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
        <div className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
        <span className="text-xs font-black text-sky-100 tracking-tighter uppercase">
          {count} Active Nodes
        </span>
      </div>
    </CardContent>
  </Card>
);