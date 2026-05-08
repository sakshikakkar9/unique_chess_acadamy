import React from "react";
import { Tournament } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import StatusBadge from "@/components/shared/admin/StatusBadge";
import ActionMenu from "./ActionMenu";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/components/shared/motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Users, MapPin, Trophy } from "lucide-react";
import { format } from "date-fns";

interface TournamentTableProps {
  data: Tournament[];
  isLoading: boolean;
  onRowClick: (tournament: Tournament) => void;
  onViewPreview: (tournament: Tournament) => void;
  onEdit: (tournament: Tournament) => void;
  onDelete: (tournament: Tournament) => void;
}

const TournamentTable: React.FC<TournamentTableProps> = ({
  data,
  isLoading,
  onRowClick,
  onViewPreview,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const formatDateRange = (start?: string, end?: string) => {
    if (!start) return "N/A";
    const startStr = format(new Date(start), "MMM d");
    if (!end) return startStr;
    return `${startStr} - ${format(new Date(end), "MMM d, yyyy")}`;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50 hover:bg-slate-50/50">
          <TableRow>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-12">Tournament Name</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-12">Division/Category</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-12">Event Dates</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-12">Reg. Count</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-12">Status & Location</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2 text-slate-300">
                  <Trophy className="h-8 w-8" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No arenas found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((tournament, idx) => (
              <TableRow
                key={tournament.id}
                className="cursor-pointer hover:bg-sky-50/50 transition-colors group border-b border-slate-100 last:border-0"
                onClick={() => onRowClick(tournament)}
              >
                <TableCell className="py-4">
                  <div className="font-bold text-slate-900 leading-tight">{tournament.title}</div>
                  <div className="text-[10px] font-black uppercase tracking-tight text-slate-400 mt-1">
                    {tournament.location || "Online"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-bold text-slate-700">{tournament.category || "Professional"}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-sky-500" />
                    {formatDateRange(tournament.startDate, tournament.endDate)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sky-600 font-black text-sm">
                    <Users className="h-3.5 w-3.5" />
                    {tournament._count?.registrations || 0}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <StatusBadge status={tournament.status} />
                    <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-slate-400">
                      <MapPin className="h-3 w-3 text-slate-300" />
                      {tournament.location || "Online"}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-4">
                  <ActionMenu
                    tournament={tournament}
                    onViewPreview={onViewPreview}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewStudents={onRowClick}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TournamentTable;
