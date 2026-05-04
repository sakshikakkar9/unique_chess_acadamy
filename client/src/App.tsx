import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PageLoader from "@/components/shared/PageLoader";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

// Layouts
import UserLayout from "@/components/layout/UserLayout";
import AdminLayout from "@/components/layout/AdminLayout";

// Public Pages
const Index = lazy(() => import("./pages/Index.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Courses = lazy(() => import("./pages/Courses.tsx"));
const CourseEnrollment = lazy(() => import("./pages/CourseEnrollment.tsx"));
const Tournaments = lazy(() => import("./pages/Tournaments.tsx"));
// ✅ New dynamic route for registration/details
const TournamentDetails = lazy(() => import("./pages/TournamentDetails.tsx")); 
const Gallery = lazy(() => import("./pages/Gallery.tsx"));
const Events = lazy(() => import("./pages/Events.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Admin Pages
const AdminLogin = lazy(() => import("./pages/admin/Login.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard.tsx"));
const AdminCourses = lazy(() => import("./pages/admin/Courses.tsx"));
const AdminTournaments = lazy(() => import("./pages/admin/Tournaments.tsx"));
// ✅ New admin route to see registered students
const AdminRegistrations = lazy(() => import("./pages/admin/Registrations.tsx")); 
const AdminGallery = lazy(() => import("./pages/admin/Gallery.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route element={<UserLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id/enroll" element={<CourseEnrollment />} />
                <Route path="/tournaments" element={<Tournaments />} />
                {/* ✅ Added the dynamic ID route here */}
                <Route path="/tournaments/:id" element={<TournamentDetails />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/events" element={<Events />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="tournaments" element={<AdminTournaments />} />
                {/* ✅ Added route for tracking tournament signups */}
                <Route path="registrations" element={<AdminRegistrations />} />
                <Route path="gallery" element={<AdminGallery />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;