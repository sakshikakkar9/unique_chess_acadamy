import { LucideIcon } from "lucide-react";

export interface Course {
  id: string;
  title: string;
  level: string;
  duration: string;
  description: string;
  image: string;
  price?: string;
  features?: string[];
}

export interface Tournament {
  id: string;
  title: string;
  location: string;
  date: string;
  status: "Open" | "Coming Soon" | "Completed";
  image?: string;
  type: "State" | "National" | "Open" | "Junior";
}

export interface PastResult {
  id: string;
  tournament: string;
  winner: string;
  runnerUp: string;
  category: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: "Classes" | "Workshops" | "Tournaments";
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  category: "Training" | "Tournaments" | "Coaching" | "Academy";
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
