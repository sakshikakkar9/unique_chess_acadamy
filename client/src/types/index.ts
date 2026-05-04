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
  id: number;
  title: string;
  ageGroup: AgeGroup;
  minAge?: number | null;
  maxAge?: number | null;
  level: string;
  duration: string;
  description?: string;
  bannerUrl?: string;
  scannerUrl?: string;
  fee: number;
  mode: string;
  classTime: string;
  days: string[];
  contactDetails: string;
  image?: string;
  price?: string;
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Tournament {
  id: number;
  title: string;
  location?: string;
  date: string;
  entryFee?: number;
  description?: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
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
  tournamentId: number; // Changed to number to match Tournament.id
  studentName: string;
  email?: string;
  phone: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER'; 
  dob: string | Date;
  address: string;
  fideId?: string;
  fideRating?: number;
  ageProofUrl: string;
  paymentProofUrl: string;
  referenceId: string;
  status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;

  // ✅ Add this so the Admin Page can show the Tournament Title
  tournament?: {
    id: number;
    title: string;
  };
}

export type EnrollmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "REJECTED";

export interface CourseEnrollment {
  id: number;
  studentName: string;
  email: string;
  phone: string;
  mode: "ONLINE" | "OFFLINE";
  courseId: string;
  course?: { id: string; title: string; ageGroup: AgeGroup };
  message?: string;
  gender: string;
  dob: string;
  address: string;
  fideId?: string;
  fideRating?: number;
  category?: string;
  discoverySource: string;
  transactionId?: string;
  experienceLevel?: string;
  ageProofUrl?: string;
  paymentProofUrl?: string;
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
