import { Trophy, Users, Star, BookOpen } from "lucide-react";
import heroImg from "@/assets/hero-chess.jpg";
import trainingImg from "@/assets/academy-training.jpg";
import tournamentImg from "@/assets/tournament.jpg";
import coachingImg from "@/assets/coaching.jpg";
import { Course, Tournament, Event, GalleryImage, Testimonial, Stat, PastResult } from "@/types";

export const stats: Stat[] = [
  { id: "1", icon: Users, value: "5,000+", label: "Students Trained" },
  { id: "2", icon: Trophy, value: "120+", label: "Tournaments Hosted" },
  { id: "3", icon: Star, value: "50+", label: "National Champions" },
  { id: "4", icon: BookOpen, value: "15+", label: "Expert Coaches" },
];

export const courses: Course[] = [
  {
    id: "beginner",
    title: "Beginner Program",
    level: "Ages 6–12",
    duration: "3 Months",
    description: "Build a solid foundation with piece movement, basic tactics, and fun puzzles.",
    image: coachingImg,
    features: ["Piece Movement", "Basic Tactics", "Fun Puzzles", "Game Fundamentals"],
  },
  {
    id: "intermediate",
    title: "Intermediate Training",
    level: "Ages 10–18",
    duration: "6 Months",
    description: "Master openings, middle-game strategy, and competitive play techniques.",
    image: trainingImg,
    features: ["Opening Principles", "Strategy", "Endgame Basics", "Tournament Rules"],
  },
  {
    id: "advanced",
    title: "Advanced Mastery",
    level: "All Ages",
    duration: "12 Months",
    description: "Deep endgame study, tournament preparation, and grandmaster-level analysis.",
    image: tournamentImg,
    features: ["Deep Analysis", "Advanced Tactics", "Mental Prep", "GM Techniques"],
  },
];

export const tournaments: Tournament[] = [
  {
    id: "1",
    title: "National Junior Championship 2026",
    location: "Mumbai",
    date: "June 15–18, 2026",
    status: "Coming Soon",
    type: "National",
    image: tournamentImg,
  },
  {
    id: "2",
    title: "State Open 2026",
    location: "Delhi",
    date: "May 20, 2026",
    status: "Open",
    type: "State",
  },
  {
    id: "3",
    title: "Inter-School Championship",
    location: "Bangalore",
    date: "July 10, 2026",
    status: "Coming Soon",
    type: "Junior",
  },
  {
    id: "4",
    title: "Rapid Chess Festival",
    location: "Chennai",
    date: "August 5, 2026",
    status: "Coming Soon",
    type: "Open",
  },
];

export const pastResults: PastResult[] = [
  {
    id: "r1",
    tournament: "Winter Open 2025",
    winner: "Rahul S.",
    runnerUp: "Sanya M.",
    category: "Open",
  },
  {
    id: "r2",
    tournament: "Junior State 2025",
    winner: "Ishaan K.",
    runnerUp: "Ananya P.",
    category: "U-14",
  },
  {
    id: "r3",
    tournament: "Academy Blitz",
    winner: "Vikram R.",
    runnerUp: "Zaid N.",
    category: "Academy",
  },
];

export const events: Event[] = [
  {
    id: "e1",
    title: "Weekly Group Class",
    date: "Every Saturday",
    time: "10:00 AM",
    location: "Online",
    category: "Classes",
  },
  {
    id: "e2",
    title: "Tactical Workshop",
    date: "May 5, 2026",
    time: "2:00 PM",
    location: "Mumbai Center",
    category: "Workshops",
  },
  {
    id: "e3",
    title: "Monthly Blitz",
    date: "Last Sunday",
    time: "4:00 PM",
    location: "Academy",
    category: "Tournaments",
  },
];

export const galleryImages: GalleryImage[] = [
  { id: "g1", url: heroImg, alt: "Academy", category: "Academy" },
  { id: "g2", url: trainingImg, alt: "Training session", category: "Training" },
  { id: "g3", url: tournamentImg, alt: "Tournament hall", category: "Tournaments" },
  { id: "g4", url: coachingImg, alt: "One-on-one coaching", category: "Coaching" },
  { id: "g5", url: heroImg, alt: "Kids playing", category: "Academy" },
  { id: "g6", url: trainingImg, alt: "Advanced class", category: "Training" },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Priya Sharma",
    role: "Parent",
    rating: 5,
    text: "My son went from a complete beginner to winning his school championship in just 6 months. The coaches here are exceptional.",
  },
  {
    id: "t2",
    name: "Arjun Mehta",
    role: "Student, Age 16",
    rating: 5,
    text: "Unique Chess Academy transformed my game. The structured approach and regular tournaments gave me the competitive edge I needed.",
  },
  {
    id: "t3",
    name: "Dr. Rajesh Kumar",
    role: "Parent",
    rating: 5,
    text: "The academy's focus on both skill development and character building makes it truly unique. Highly recommended for any aspiring chess player.",
  },
];
