import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import { courseService } from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, CheckCircle2, Loader2
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CoursePublicView } from "@/features/courses/components/public/CoursePublicView";
import 'react-quill/dist/quill.snow.css';
import { resolveRegistrationStatus } from "@/lib/statusUtils";

export default function CourseEnrollmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { courses, isLoading } = useAdminCourses();

  const course = useMemo(() => courses.find((c) => c.id === id), [courses, id]);

  const registrationStatus = useMemo(() => {
    if (!course) return "OPEN";
    return resolveRegistrationStatus(
      course.startDate,
      course.endDate,
      course.enrollmentStart,
      course.enrollmentEnd,
      course.status
    );
  }, [course]);

  const isRegistrationDisabled = registrationStatus !== "OPEN";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refId, setRefId] = useState("");
  const [ucaId, setUcaId] = useState("");

  const [files, setFiles] = useState<{ age?: File | null; payment?: File | null }>({
    age: null,
    payment: null
  });

  const [form, setForm] = useState({
    studentName: "",
    gender: "Male",
    dob: "",
    phone: "",
    address: "",
    discoverySource: "Social Media",
    category: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'age' | 'payment') => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const set = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleBrochureDownload = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    const downloadUrl = url.includes("cloudinary.com")
      ? url.replace("/upload/", "/upload/fl_attachment/")
      : url;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.target = "_blank";
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: "The course brochure is being downloaded.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    // Name validation
    if (!/^[A-Za-z\s]+$/.test(form.studentName)) {
      toast({
        variant: "destructive",
        title: "Invalid Name",
        description: "Student name should only contain letters and spaces."
      });
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(form.phone)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Phone number must be exactly 10 digits."
      });
      return;
    }

    if (!files.age || !files.payment) {
      toast({
        variant: "destructive",
        title: "Missing Files",
        description: "Please upload both Age Proof and Payment Proof."
      });
      return;
    }

    // File validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const minSize = 100 * 1024; // 100 KB
    const maxSize = 300 * 1024; // 300 KB

    for (const [key, file] of Object.entries(files)) {
      if (file) {
        if (!allowedTypes.includes(file.type)) {
          toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: `${key === 'age' ? 'Age Proof' : 'Payment Proof'} must be a JPEG or PNG image.`
          });
          return;
        }
        if (file.size < minSize || file.size > maxSize) {
          toast({
            variant: "destructive",
            title: "Invalid File Size",
            description: `${key === 'age' ? 'Age Proof' : 'Payment Proof'} size must be between 100 KB and 300 KB.`
          });
          return;
        }
      }
    }

    setLoading(true);
    try {
      const result = await courseService.enroll(course.id, {
        ...form,
        ageProof: files.age,
        paymentProof: files.payment,
        experienceLevel: course.skillLevel,
        email: "",
        fideId: "NA",
        fideRating: 0
      });

      setRefId(result.referenceId);
      setUcaId(result.student?.ucaId || result.data?.student?.ucaId || result.ucaId || result.data?.ucaId || "");
      setSuccess(true);
      toast({ title: "Enrollment Successful!", description: "Your application has been received." });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.error || "Failed to submit enrollment."
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Course not found</h1>
        <Button onClick={() => navigate("/courses")} className="rounded-xl font-bold">Back to Courses</Button>
      </div>
    );
  }

  if (success) {
    return (
      // <div className="min-h-screen bg-white">
      //   <Navbar />
      //   <div className="container mx-auto px-6 pt-40 pb-20 flex flex-col items-center justify-center text-center">
      //     <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md space-y-6">
      //       <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
      //         <CheckCircle2 className="h-14 w-14 text-green-500" />
      //       </div>
      //       <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Enrollment Successful!</h1>
      //       <p className="text-slate-500 leading-relaxed">Your registration for <span className="text-blue-600 font-semibold">{course.title}</span> has been submitted.</p>

      //       <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl space-y-2">
      //         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference ID</p>
      //         <p className="text-3xl font-bold text-blue-600 tracking-tight">{refId}</p>
      //       </div>

      //       {ucaId && (
      //         <div className="
      //           mt-4 p-4 rounded-xl
      //           bg-amber-50 dark:bg-amber-900/20
      //           border border-amber-200 dark:border-amber-700
      //           text-center
      //         ">
      //           <p className="text-xs text-amber-600 dark:text-amber-400 font-medium
      //                         uppercase tracking-wider mb-1">
      //             Your Student ID
      //           </p>
      //           <p className="text-2xl font-bold text-amber-700 dark:text-amber-300
      //                         tracking-widest font-mono">
      //             {ucaId}
      //           </p>
      //           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
      //             Please save this ID for future reference
      //           </p>
      //         </div>
      //       )}

      //       <Button onClick={() => navigate("/courses")} className="w-full h-16 bg-slate-900 hover:bg-blue-600 rounded-2xl font-bold transition-all text-white text-lg">
      //         RETURN TO PROGRAMS
      //       </Button>
      //     </motion.div>
      //   </div>
      //   <Footer />
      // </div>
      <div className="min-h-screen flex flex-col bg-white">
    <Navbar />
    {/* Optimized padding: pt-24 for mobile, pt-32 for tablets, pt-40 for large desktops */}
    <div className="flex-1 container mx-auto px-4 sm:px-6 pt-24 md:pt-32 lg:pt-40 pb-12 flex flex-col items-center justify-center text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="w-full max-w-md space-y-5 md:space-y-6"
      >
        {/* Success Icon */}
        <div className="h-20 w-20 md:h-24 md:w-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
          <CheckCircle2 className="h-10 w-10 md:h-14 md:w-14 text-green-500" />
        </div>
        
        {/* Headings */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight px-2">
          Enrollment Successful!
        </h1>
        <p className="text-sm md:text-base text-slate-500 leading-relaxed px-4">
          Your registration for <span className="text-blue-600 font-semibold">{course.title}</span> has been submitted.
        </p>

        {/* Reference ID Card */}
        <div className="bg-slate-50 border border-slate-100 p-6 md:p-8 rounded-2xl md:rounded-3xl space-y-1 md:space-y-2 mx-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference ID</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-600 tracking-tight break-all">{refId}</p>
        </div>

        {/* Student ID Card */}
        {ucaId && (
          <div className="
            mt-4 p-4 rounded-xl mx-2
            bg-amber-50 dark:bg-amber-900/20
            border border-amber-200 dark:border-amber-700
            text-center
          ">
            <p className="text-[10px] md:text-xs text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wider mb-1">
              Your Student ID
            </p>
            <p className="text-xl md:text-2xl font-bold text-amber-700 dark:text-amber-300 tracking-widest font-mono break-all">
              {ucaId}
            </p>
            <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 mt-1">
              Please save this ID for future reference
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="px-2 pt-2">
          <Button 
            onClick={() => navigate("/courses")} 
            className="w-full h-12 md:h-16 bg-slate-900 hover:bg-blue-600 rounded-xl md:rounded-2xl font-bold transition-all text-white text-base md:text-lg shadow-sm"
          >
            RETURN TO PROGRAMS
          </Button>
        </div>
      </motion.div>
    </div>
    <Footer />
  </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back link */}
        <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6">
          <ArrowLeft className="size-4" />
          Back to Course
        </Link>

        <CoursePublicView
          course={course}
          isRegistrationDisabled={isRegistrationDisabled}
          registrationStatus={registrationStatus}
          form={form}
          set={set}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          loading={loading}
          files={files}
          onBrochureDownload={handleBrochureDownload}
        />
      </div>

      <Footer />
    </div>
  );
}
