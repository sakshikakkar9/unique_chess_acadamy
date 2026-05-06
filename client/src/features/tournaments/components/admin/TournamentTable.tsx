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
import { Calendar, Users, MapPin } from "lucide-react";
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
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-bold">Tournament Name</TableHead>
            <TableHead className="font-bold">Division/Category</TableHead>
            <TableHead className="font-bold">Event Dates</TableHead>
            <TableHead className="font-bold">Reg. Count</TableHead>
            <TableHead className="font-bold">Status & Location</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No tournaments found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((tournament, idx) => (
              <TableRow
                key={tournament.id}
                className="cursor-pointer hover:bg-muted/30 transition-colors group"
                onClick={() => onRowClick(tournament)}
              >
                <TableCell>
                  <div className="font-bold text-slate-900">{tournament.title}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {tournament.location || "Online"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-slate-900">{tournament.category || "Professional"}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-orange-500" />
                    {formatDateRange(tournament.startDate, tournament.endDate)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="gap-1.5 py-1 px-3 bg-blue-50 text-blue-700 border-blue-100">
                    <Users className="h-3 w-3" />
                    {tournament._count?.registrations || 0}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    <StatusBadge status={tournament.status} />
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {tournament.location || "Online"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
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
