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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { format } from "date-fns";
import {
  User, Calendar, MapPin, ShieldCheck, Zap, Info, Clock, Mail, Copy, ArrowRight
} from "lucide-react";

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
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
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
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-uca-bg-surface border border-uca-border p-4 rounded-xl mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
            <div className="relative flex-1 w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-uca-text-muted" />
              <Input
                placeholder="Search students..."
                className="w-full h-10 bg-uca-bg-base border-uca-border text-sm focus:ring-uca-accent-blue rounded-lg pl-10 pr-4 outline-none"
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
          onRowClick={(s) => {
            setSelectedStudent(s);
            setIsDetailSheetOpen(true);
          }}
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

      {/* Details Sheet */}
      <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
        <SheetContent className="sm:max-w-xl rounded-l-[2rem] p-0 border-uca-border bg-uca-bg-base shadow-2xl overflow-y-auto">
          {selectedStudent && (
            <div className="h-full flex flex-col">
              <div className="bg-uca-navy p-8 text-white relative overflow-hidden shrink-0 border-b border-uca-border">
                <SheetHeader className="mb-6 relative z-10 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2.5 py-1 bg-white/10 text-[9px] font-black uppercase tracking-[0.2em] rounded border border-white/20">
                      STUDENT PROFILE
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        selectedStudent.accountStatus === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-uca-accent-red/20 text-uca-accent-red border-uca-accent-red/30'
                      )}
                    >
                      {selectedStudent.accountStatus}
                    </span>
                  </div>
                  <SheetTitle className="text-3xl font-black text-white leading-tight tracking-tight">
                    {selectedStudent.fullName}
                  </SheetTitle>
                  <p className="text-uca-text-muted font-bold text-sm mt-1 flex items-center gap-2">
                    <User className="size-4 text-uca-accent-blue" />
                    Student ID: {selectedStudent.id.slice(0, 8).toUpperCase()}
                  </p>
                </SheetHeader>

                <div className="flex flex-wrap gap-3 relative z-10">
                  <div className="bg-uca-bg-elevated px-4 py-2 rounded-lg border border-uca-border flex flex-col gap-0.5">
                    <p className="text-[8px] font-black text-uca-text-muted uppercase tracking-widest">Joined On</p>
                    <p className="text-xs font-bold text-uca-text-primary">
                      {selectedStudent.createdAt ? format(new Date(selectedStudent.createdAt), "PPP") : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-uca-bg-elevated px-4 py-2 rounded-lg border border-uca-border flex flex-col gap-0.5 text-uca-text-primary">
                    <p className="text-[8px] font-black text-uca-text-muted uppercase tracking-widest">Experience</p>
                    <p className="text-xs font-bold">{selectedStudent.experienceLevel || 'Beginner'}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-8 space-y-10 bg-uca-bg-base">
                <section>
                  <div className="flex items-center gap-3 mb-5 text-uca-text-primary">
                    <Phone className="size-4 text-uca-accent-blue" />
                    <h4 className="text-xs font-black uppercase tracking-widest">Contact Details</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-uca-bg-surface p-4 rounded-xl border border-uca-border">
                      <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1.5">Phone</p>
                      <p className="font-bold text-uca-text-primary text-sm">{selectedStudent.phone}</p>
                    </div>
                    <div className="bg-uca-bg-surface p-4 rounded-xl border border-uca-border">
                      <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1.5">Email</p>
                      <p className="font-bold text-uca-text-primary text-xs truncate">{selectedStudent.email || 'N/A'}</p>
                    </div>
                    <div className="bg-uca-bg-surface p-4 rounded-xl border border-uca-border col-span-2">
                      <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1.5">Address</p>
                      <p className="font-bold text-uca-text-primary text-xs leading-relaxed">{selectedStudent.address || 'N/A'}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-5 text-uca-text-primary">
                    <ShieldCheck className="size-4 text-uca-accent-blue" />
                    <h4 className="text-xs font-black uppercase tracking-widest">Chess Profile</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-uca-bg-surface p-4 rounded-xl border border-uca-border">
                      <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1.5">FIDE ID</p>
                      <p className="text-lg font-black text-uca-text-primary">{selectedStudent.fideId || 'N/A'}</p>
                    </div>
                    <div className="bg-uca-bg-surface p-4 rounded-xl border border-uca-border">
                      <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1.5">Rating</p>
                      <p className="text-lg font-black text-uca-accent-blue">{selectedStudent.fideRating || '0'}</p>
                    </div>
                  </div>
                </section>

                <section>
                   <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3 text-uca-text-primary">
                      <Zap className="size-4 text-uca-accent-blue" />
                      <h4 className="text-xs font-black uppercase tracking-widest">Activity History</h4>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/students/${selectedStudent.id}`)}
                      className="text-[10px] font-black text-uca-accent-blue uppercase hover:underline flex items-center gap-1"
                    >
                      Full Details <ArrowRight className="size-3" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[...(selectedStudent.registrations || []), ...(selectedStudent.enrollments || [])].slice(0, 3).map((item: any, idx: number) => {
                      const isTournament = !!item.tournament;
                      return (
                        <div key={item.id || idx} className="p-4 rounded-xl border border-uca-border bg-uca-bg-surface flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isTournament ? <Trophy className="size-4 text-amber-500" /> : <BookOpen className="size-4 text-uca-accent-blue" />}
                            <span className="text-xs font-bold text-uca-text-primary truncate max-w-[150px]">
                              {item.tournament?.title || item.course?.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-black uppercase text-uca-text-muted">
                            {item.status}
                          </span>
                        </div>
                      );
                    })}
                    {(!selectedStudent.registrations?.length && !selectedStudent.enrollments?.length) && (
                      <p className="text-center py-4 text-[10px] font-black text-uca-text-muted uppercase tracking-widest bg-uca-bg-elevated/20 rounded-xl border border-dashed border-uca-border">
                        No activity found
                      </p>
                    )}
                  </div>
                </section>
              </div>

              <div className="p-6 bg-uca-bg-surface border-t border-uca-border flex gap-3 shrink-0">
                <Button
                  className="flex-1 h-12 bg-uca-navy hover:bg-uca-navy-hover text-uca-text-primary rounded-lg font-bold text-xs uppercase tracking-widest"
                  onClick={() => {
                    setEditingRecord(selectedStudent);
                    setIsAddModalOpen(true);
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-lg font-bold text-xs uppercase tracking-widest border-uca-border bg-uca-bg-base text-uca-text-muted hover:text-red-500 hover:border-red-500"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  Delete Profile
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AdminShell>
  );
}
