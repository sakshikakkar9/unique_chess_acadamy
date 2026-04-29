import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AGE_GROUP_RANGES, Course } from "@/types";
import { courseService } from "@/services/courseService";
import { CheckCircle, Loader2 } from "lucide-react";

interface CourseEnrollModalProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  studentName: string;
  email: string;
  phone: string;
  mode: "ONLINE" | "OFFLINE";
  message: string;
}

const EMPTY: FormState = { studentName: "", email: "", phone: "", mode: "OFFLINE", message: "" };

export default function CourseEnrollModal({ course, open, onOpenChange }: CourseEnrollModalProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = (val: boolean) => {
    if (!val) {
      setForm(EMPTY);
      setSuccess(false);
    }
    onOpenChange(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    setLoading(true);
    try {
      await courseService.enroll(course.id, {
        studentName: form.studentName,
        email: form.email,
        phone: form.phone,
        mode: form.mode,
        message: form.message || undefined,
      });
      setSuccess(true);
      toast({ title: "Enrollment submitted!", description: "We'll reach out to confirm your spot." });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to submit. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!course) return null;

  const ageRange = course.minAge && course.maxAge
    ? `Ages ${course.minAge}–${course.maxAge}`
    : AGE_GROUP_RANGES[course.ageGroup];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Enroll in Course</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            <span className="font-semibold text-foreground">{course.title}</span>
            <span className="mx-2">·</span>
            {ageRange}
            <span className="mx-2">·</span>
            {course.duration}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
            <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <p className="font-semibold text-lg">You're enrolled!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Our team will contact you at <span className="text-foreground">{form.email}</span> to confirm your spot.
              </p>
            </div>
            <Button variant="outline" onClick={() => handleClose(false)} className="mt-2">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="enroll-name">Full Name *</Label>
              <Input
                id="enroll-name"
                placeholder="Your full name"
                value={form.studentName}
                onChange={(e) => set("studentName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Class Mode *</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="OFFLINE"
                    checked={form.mode === "OFFLINE"}
                    onChange={(e) => set("mode", e.target.value as any)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">Offline</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="ONLINE"
                    checked={form.mode === "ONLINE"}
                    onChange={(e) => set("mode", e.target.value as any)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">Online</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="enroll-email">Email *</Label>
              <Input
                id="enroll-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enroll-phone">Phone *</Label>
              <Input
                id="enroll-phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enroll-message">Message (optional)</Label>
              <Textarea
                id="enroll-message"
                rows={3}
                placeholder="Any questions or notes for us?"
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
              />
            </div>

            {course.price && (
              <p className="text-sm text-muted-foreground">
                Course fee: <span className="font-semibold text-foreground">{course.price}</span>
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="min-w-[120px]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enroll Now"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
