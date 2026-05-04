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
  description?: string;
  custom_banner_url?: string;
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
  location?: string;
  category?: string;
  totalPrizePool?: string;
  entryFee: number;
  discountDetails?: string;
  brochureUrl?: string;
  otherDetails?: string;
  contactDetails?: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  imageUrl?: string;
  scannerUrl?: string;
  results?: TournamentResult[];
  registrations?: Registration[];
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
  studentName: string;
  gender: string;
  category?: string;
  dob: string | Date;
  email?: string;
  phone: string;
  fideId: string;
  fideRating: number;
  address: string;
  ageProofUrl: string;
  paymentProofUrl: string;
  discoverySource: string;
  transactionId?: string;
  tournamentId: number;
  status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'COMPLETED' | 'CONFIRMED' | 'REJECTED';
  createdAt: string;

  // ✅ Add this so the Admin Page can show the Tournament Title
  tournament?: {
    id: number;
    title: string;
  };
}

export type EnrollmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "REJECTED";

export interface CourseEnrollment {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string | Date;
  address: string;
  fideId?: string;
  fideRating?: number;
  discoverySource: string;
  category?: string;
  ageProofUrl: string;
  paymentProofUrl: string;
  transactionId?: string;
  experienceLevel?: string;
  courseId: string;
  course?: { id: string; title: string; ageGroup: AgeGroup };
  status: EnrollmentStatus;
  createdAt?: string;
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

export interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  location?: string;
  category: "CLASS" | "WORKSHOP";
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
