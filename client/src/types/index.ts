import { LucideIcon } from "lucide-react";

export type AgeGroup = "CHILDREN" | "TEENAGERS" | "ADULTS";

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  CHILDREN: "Children",
  TEENAGERS: "Teenagers",
  ADULTS: "Adults",
};

export const AGE_GROUP_RANGES: Record<AgeGroup, string> = {
  CHILDREN: "Ages 6–12",
  TEENAGERS: "Ages 13–17",
  ADULTS: "Ages 18+",
};

export interface Course {
  id: string; // Changed to string to match CUID
  title: string;
  ageGroup: AgeGroup;
  minAge?: number | null;
  maxAge?: number | null;
  skillLevel: string; // Renamed from level to match schema
  duration: string;
  startDate?: string;
  endDate?: string;
  enrollmentStart?: string;
  enrollmentEnd?: string;
  status?: string | null;
  description?: string;
  custom_banner_url?: string;
  brochureUrl?: string;
  posterOrientation?: "LANDSCAPE" | "PORTRAIT";
  scannerUrl?: string;
  fee: number; // Replaced price with fee
  days?: string[];
  classTime?: string;
  mode: "ONLINE" | "OFFLINE" | "HYBRID";
  contactDetails?: string;
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Tournament {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  registrationStart?: string;
  registrationDeadline?: string;
  posterOrientation?: "LANDSCAPE" | "PORTRAIT";
  location?: string;
  category?: string;
  totalPrizePool?: string;
  entryFee: number;
  discountDetails?: string;
  brochureUrl?: string;
  otherDetails?: string;
  contactDetails?: string;
  status?: string | null;
  imageUrl?: string;
  scannerUrl?: string;
  results?: TournamentResult[];
  registrations?: Registration[];
  _count?: {
    registrations: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface TournamentResult {
  id: number;
  tournamentId: number;
  position: number;
  playerName: string;
  score?: number;
  prize?: string;
}

export interface Registration {
  id: string;
  referenceId: string;
  category?: string;
  ageProofUrl: string;
  paymentProofUrl: string;
  transactionId?: string;
  tournamentId: number;
  status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'COMPLETED' | 'CONFIRMED' | 'REJECTED';
  createdAt: string;

  student?: {
    fullName: string;
    email?: string;
    phone: string;
    gender: string;
    dob: string | Date;
    address: string;
    fideId?: string;
    fideRating?: number;
  };

  // ✅ Add this so the Admin Page can show the Tournament Title
  tournament?: {
    id: number;
    title: string;
  };
}

export type EnrollmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "REJECTED";

export interface CourseEnrollment {
  id: string;
  studentId: string;
  category?: string;
  ageProofUrl: string;
  paymentProofUrl: string;
  transactionId?: string;
  status: EnrollmentStatus;
  courseId: string;
  course?: { id: string; title: string; ageGroup: AgeGroup };
  student?: {
    fullName: string;
    email?: string;
    phone: string;
    gender: string;
    dob: string | Date;
    address: string;
    fideId?: string;
    fideRating?: number;
    experienceLevel?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface DemoRegistration {
  id: number;
  studentName: string;
  email: string;
  phone: string;
  scheduledAt: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED";
  createdAt?: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption?: string;
  category: string;
  createdAt?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
}
