import React from "react";
import { Link } from "react-router-dom"; // ✅ Added for navigation
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy, Image as ImageIcon, Users, TrendingUp, Calendar, UserCheck, ArrowUpRight } from "lucide-react";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { useAdminGallery } from "@/features/gallery/hooks/useAdminGallery";
import { useDemoAdmin } from "../../features/demo/components/DemoModal";

const AdminDashboard: React.FC = () => {
  const { courses } = useAdminCourses();
  const { tournaments } = useAdminTournaments();
  const { images } = useAdminGallery();
  const { demos, isLoading } = useDemoAdmin();

  const stats = [
    {
      title: "Total Courses",
      value: courses.length.toString(),
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Tournaments",
      value: tournaments.length.toString(),
      icon: Trophy,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Gallery Photos",
      value: images.length.toString(),
      icon: ImageIcon,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "New Leads (Demos)",
      value: isLoading ? "..." : demos.length.toString(),
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitoring growth at Unique Chess Academy.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border bg-card/50 backdrop-blur shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`${stat.bg} p-2 rounded-md`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-green-500 font-medium flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> Live
                </span>
                Syncing with Database
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Registrations & Activity */}
        <Card className="col-span-4 border-border bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Leads & Demo Requests</CardTitle>
            <Link to="/admin/registrations" className="text-xs text-[#d4af37] hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-4 text-muted-foreground">Loading leads...</div>
              ) : demos.length > 0 ? (
                demos.slice(0, 5).map((demo: any) => (
                  <div key={demo.id} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                      <UserCheck className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-semibold">
                        {demo.studentName} <span className="text-xs font-normal text-muted-foreground">booked a demo</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(demo.createdAt).toLocaleDateString()} at {new Date(demo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 bg-muted rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      {demo.phone}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <Users className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No new demo requests yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tournaments */}
        <Card className="col-span-3 border-border bg-card/50">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tournaments.length > 0 ? tournaments.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{t.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                      <Calendar className="h-3 w-3 text-[#d4af37]" />
                      {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <Badge status={t.status} />
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">No events scheduled.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Small Helper Component for Badges
const Badge = ({ status }: { status: string }) => {
  const isOngoing = status === 'ONGOING';
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
      isOngoing ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    }`}>
      {status}
    </span>
  );
};

export default AdminDashboard;