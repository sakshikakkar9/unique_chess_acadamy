import React from "react";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserPlus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tournament } from "@/types";

interface ActionMenuProps {
  tournament: Tournament;
  onViewPreview: (tournament: Tournament) => void;
  onEdit: (tournament: Tournament) => void;
  onDelete: (tournament: Tournament) => void;
  onViewStudents: (tournament: Tournament) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  tournament,
  onViewPreview,
  onEdit,
  onDelete,
  onViewStudents
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewPreview(tournament); }}>
          <Eye className="mr-2 h-4 w-4" />
          View Preview
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewStudents(tournament); }}>
          <UserPlus className="mr-2 h-4 w-4" />
          View Students
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(tournament); }}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => { e.stopPropagation(); onDelete(tournament); }}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionMenu;
