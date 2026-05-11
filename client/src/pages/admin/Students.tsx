import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Search,
  Trophy,
  BookOpen,
  Phone,
  X
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminTable, { AdminTableColumn } from "@/components/admin/AdminTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import AddStudentModal from "@/components/shared/admin/AddStudentModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import { getAvatarStyles, cn } from "@/lib/utils";

export default function StudentsPage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [tournamentFilter, setTournamentFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const { data: students = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-students", tournamentFilter, courseFilter],
    queryFn: async () => {
      let url = "/students";
      const params = new URLSearchParams();
      if (tournamentFilter !== "ALL") params.append("tournamentId", tournamentFilter);
      if (courseFilter !== "ALL") params.append("courseId", courseFilter);
      if (params.toString()) url += `?${params.toString()}`;
      return (await api.get(url)).data;
    }
  });

  const { data: tournaments = [] } = useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => (await api.get("/tournaments")).data
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => (await api.get("/courses")).data
  });

  const filteredStudents = useMemo(() => {
    return students.filter((s: any) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const handleDelete = async () => {
    if (!selectedStudent) return;
    setIsDeleting(true);
    try {
      await api.delete(`/students/${selectedStudent.id}`);
      success("Student deleted successfully");
      setIsConfirmOpen(false);
      refetch();
    } catch (err) {
      toastError("Failed to delete student");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: AdminTableColumn[] = [
    { key: 'displayFullName', label: 'Student', className: 'min-w-[200px]' },
    { key: 'displayContact', label: 'Contact Info', hiddenOn: 'mobile' },
    { key: 'displayActivity', label: 'Last Activity', hiddenOn: 'tablet' },
    { key: 'displayStatus', label: 'Status', align: 'right' }
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (s: any) => {
    setEditingRecord(s);
    setIsAddModalOpen(true);
  };

  const rows = filteredStudents.map((student: any) => {
    const avatarStyles = getAvatarStyles(student.fullName);
    const lastTournament = student.registrations?.[0]?.tournament?.title;
    const lastCourse = student.enrollments?.[0]?.course?.title;

    return {
      ...student,
      displayFullName: (
        <div className="flex items-center gap-3">
          <div
            className="size-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
            style={{ backgroundColor: avatarStyles.bg, color: avatarStyles.color }}
          >
            {(student.fullName || "?").charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-uca-text-primary truncate">{student.fullName}</span>
            <span className="text-[10px] text-uca-text-muted">
              {student.gender} • {new Date().getFullYear() - new Date(student.dob).getFullYear()} Years
            </span>
          </div>
        </div>
      ),
      displayContact: (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-uca-text-primary">
            <Phone className="size-3 text-uca-accent-blue" />
            {student.phone}
          </div>
          {student.email && (
            <span className="text-[10px] text-uca-text-muted truncate max-w-[150px]">
              {student.email}
            </span>
          )}
        </div>
      ),
      displayActivity: (
        <div className="flex flex-col gap-1">
          {lastTournament && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 uppercase tracking-tight">
              <Trophy className="size-3" /> {lastTournament}
            </div>
          )}
          {lastCourse && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-uca-accent-blue uppercase tracking-tight">
              <BookOpen className="size-3" /> {lastCourse}
            </div>
          )}
          {!lastTournament && !lastCourse && (
            <span className="text-[10px] text-uca-text-muted font-bold uppercase tracking-widest">No Activity</span>
          )}
        </div>
      ),
      displayStatus: (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
            student.accountStatus === 'ACTIVE'
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              : 'bg-uca-accent-red/10 text-uca-accent-red border-uca-accent-red/20'
          )}
        >
          {student.accountStatus}
        </span>
      )
    };
  });

  return (
    <AdminShell
      title="Student Management"
      subtitle="Centralized directory of all academy students and their progress."
      actionLabel="Add Student"
      onAction={handleAdd}
    >
      <div className="space-y-6">
        {/* Standardized Filter Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-uca-bg-surface border border-uca-border p-4 rounded-xl">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
            <div className="relative flex-1 w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-uca-text-muted" />
              <Input
                placeholder="Search students..."
                className="pl-10 h-10 bg-uca-bg-base border-uca-border text-sm focus:ring-uca-accent-blue rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={tournamentFilter} onValueChange={setTournamentFilter}>
              <SelectTrigger className="h-10 w-full sm:w-48 bg-uca-bg-base border-uca-border text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Trophy className="size-3.5 text-amber-500" />
                  <SelectValue placeholder="Tournament" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                <SelectItem value="ALL">All Tournaments</SelectItem>
                {tournaments.map((t: any) => (
                  <SelectItem key={t.id} value={t.id.toString()}>{t.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="h-10 w-full sm:w-48 bg-uca-bg-base border-uca-border text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-3.5 text-uca-accent-blue" />
                  <SelectValue placeholder="Course" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                <SelectItem value="ALL">All Courses</SelectItem>
                {courses.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Area */}
        <AdminTable
          columns={columns}
          rows={rows}
          isLoading={isLoading}
          onRowClick={(s) => navigate(`/admin/students/${s.id}`)}
          onEdit={(row) => {
            const original = students.find((s: any) => s.id === row.id);
            if (original) handleEdit(original);
          }}
          onDelete={(s) => { setSelectedStudent(s); setIsConfirmOpen(true); }}
          entityName="students"
          onAddFirst={handleAdd}
        />
      </div>

      <AddStudentModal
        open={isAddModalOpen}
        onOpenChange={(open) => { setIsAddModalOpen(open); if (!open) setEditingRecord(null); }}
        onSuccess={() => {
          refetch();
          success(editingRecord ? "Student updated" : "Student added");
        }}
        editingRecord={editingRecord}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Student Profile?"
        description="This will permanently remove the student and all their registrations. This action cannot be undone."
      />
    </AdminShell>
  );
}
