import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Search,
  Filter,
  Users,
  Trophy,
  BookOpen,
  Plus,
  MoreVertical,
  Eye,
  Trash2,
  Phone,
  RefreshCw
} from "lucide-react";
import AdminPageHeader from "@/components/shared/admin/AdminPageHeader";
import AddStudentModal from "@/components/shared/admin/AddStudentModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function StudentsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tournamentFilter, setTournamentFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure? This will delete the student and all their registrations.")) return;
    try {
      await api.delete(`/students/${id}`);
      toast.success("Student deleted successfully");
      refetch();
    } catch (err) {
      toast.error("Failed to delete student");
    }
  };

  const getAvatarStyles = (name: string) => {
    const firstLetter = (name || "?").charAt(0).toUpperCase();
    if ("ABCDE".includes(firstLetter)) return { bg: "#e0f2fe", color: "#0284c7" };
    if ("FGHIJ".includes(firstLetter)) return { bg: "#ede9fe", color: "#6d28d9" };
    if ("KLMNO".includes(firstLetter)) return { bg: "#d1fae5", color: "#065f46" };
    if ("PQRST".includes(firstLetter)) return { bg: "#fef3c7", color: "#b45309" };
    return { bg: "#fce7f3", color: "#be185d" };
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <AdminPageHeader
          title="Student Management"
          subtitle="Centralized directory of all academy students and their progress."
        />
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl h-11 px-6 font-bold flex items-center gap-2 shadow-lg shadow-sky-600/20 w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" /> Add New Student
        </Button>
      </div>

      <AddStudentModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={() => refetch()}
      />

      <div
        className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6 bg-white"
        style={{
          border: '1px solid #e0eeff',
          padding: '14px 18px',
          borderRadius: '14px'
        }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto flex-1">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
            <Input
              placeholder="Search by name, phone or email..."
              className="pl-10 h-11 w-full rounded-xl border-slate-200 focus:ring-sky-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={tournamentFilter} onValueChange={setTournamentFilter}>
            <SelectTrigger className="h-11 w-full sm:w-56 rounded-xl border-slate-200 font-bold text-[10px] uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                <SelectValue placeholder="Tournament" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
              <SelectItem value="ALL" className="font-bold text-[10px] uppercase tracking-widest py-3">All Tournaments</SelectItem>
              {tournaments.map((t: any) => (
                <SelectItem key={t.id} value={t.id.toString()} className="font-bold text-[10px] uppercase tracking-widest py-3">{t.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="h-11 w-full sm:w-56 rounded-xl border-slate-200 font-bold text-[10px] uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-sky-500" />
                <SelectValue placeholder="Course" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
              <SelectItem value="ALL" className="font-bold text-[10px] uppercase tracking-widest py-3">All Courses</SelectItem>
              {courses.map((c: any) => (
                <SelectItem key={c.id} value={c.id} className="font-bold text-[10px] uppercase tracking-widest py-3">{c.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {isLoading ? (
          <div className="bg-white p-10 text-center rounded-2xl border border-slate-100">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600" />
            <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-slate-400">Loading Students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-2xl border border-slate-100">
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <Users className="h-10 w-10" />
              <p className="font-bold uppercase tracking-widest text-xs">No students found</p>
            </div>
          </div>
        ) : (
          filteredStudents.map((student: any) => {
            const avatarStyles = getAvatarStyles(student.fullName);
            return (
              <div
                key={student.id}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4"
                onClick={() => navigate(`/admin/students/${student.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: avatarStyles.bg,
                        color: avatarStyles.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 700,
                      }}
                    >
                      {(student.fullName || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{student.fullName}</p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {student.gender} • {new Date().getFullYear() - new Date(student.dob).getFullYear()} Years
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-50 rounded-full">
                        <MoreVertical className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-2xl border-slate-100 shadow-xl p-2">
                      <DropdownMenuItem
                        className="font-bold text-[11px] uppercase tracking-widest py-3 rounded-xl cursor-pointer"
                        onClick={() => navigate(`/admin/students/${student.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4 text-sky-500" /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="font-bold text-[11px] uppercase tracking-widest py-3 rounded-xl cursor-pointer text-rose-600 focus:text-rose-600"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Contact</p>
                    <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-sky-500" /> {student.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        student.accountStatus === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}
                    >
                      {student.accountStatus}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop View: Table */}
      <div
        className="bg-white overflow-hidden hidden md:block"
        style={{
          border: '1px solid #e0eeff',
          borderRadius: '14px'
        }}
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[10px] font-black uppercase text-[#64748b] tracking-[0.08em]">
              <th className="p-4 px-6">Student</th>
              <th className="p-4 px-6">Contact Info</th>
              <th className="p-4 px-6">Last Activity</th>
              <th className="p-4 px-6 text-center">Account Status</th>
              <th className="p-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-10 text-center">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600" />
                  <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-slate-400">Loading Students...</p>
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <Users className="h-10 w-10" />
                    <p className="font-bold uppercase tracking-widest text-xs">No students found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student: any) => {
                const avatarStyles = getAvatarStyles(student.fullName);
                const lastTournament = student.registrations?.[0]?.tournament?.title;
                const lastCourse = student.enrollments?.[0]?.course?.title;

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-[#f0f9ff] transition-all duration-120 border-b border-[#f1f5f9] group cursor-pointer"
                    onClick={() => navigate(`/admin/students/${student.id}`)}
                  >
                    <td className="p-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: avatarStyles.bg,
                            color: avatarStyles.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 700,
                            flexShrink: 0
                          }}
                        >
                          {(student.fullName || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }} className="truncate">{student.fullName}</p>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                            {student.gender} • {new Date().getFullYear() - new Date(student.dob).getFullYear()} Years
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2" style={{ fontSize: '11px', color: '#0f172a', fontWeight: 600 }}>
                          <Phone className="h-3 w-3 text-sky-500" /> {student.phone}
                        </div>
                        {student.email && (
                          <div className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">
                            {student.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 px-6">
                      <div className="space-y-1">
                        {lastTournament && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 uppercase tracking-tight">
                            <Trophy className="h-3 w-3" /> {lastTournament}
                          </div>
                        )}
                        {lastCourse && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-sky-600 uppercase tracking-tight">
                            <BookOpen className="h-3 w-3" /> {lastCourse}
                          </div>
                        )}
                        {!lastTournament && !lastCourse && (
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No Activity</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          student.accountStatus === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}
                      >
                        {student.accountStatus}
                      </span>
                    </td>
                    <td className="p-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl border-slate-100 shadow-xl p-2">
                          <DropdownMenuItem
                            className="font-bold text-[11px] uppercase tracking-widest py-3 rounded-xl cursor-pointer"
                            onClick={() => navigate(`/admin/students/${student.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4 text-sky-500" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="font-bold text-[11px] uppercase tracking-widest py-3 rounded-xl cursor-pointer text-rose-600 focus:text-rose-600"
                            onClick={() => handleDelete(student.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
