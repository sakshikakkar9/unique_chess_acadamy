import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EventFilter from "@/features/events/components/EventFilter";
import EventList from "@/features/events/components/EventList";
import { useEvents } from "@/features/events/hooks/useEvents";
import SparkleCanvas from "@/components/shared/SparkleCanvas";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Sparkles } from "lucide-react";
import { scaleIn } from "@/components/shared/motion";

export default function EventsPage() {
  const { events, filter, setFilter, categories } = useEvents();

  return (
    <div className="min-h-screen bg-white selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION (Dark Hero Mini) */}
      <header className="relative h-[50vh] min-h-[400px] flex items-center bg-[#020617] overflow-hidden pt-20">
        <SparkleCanvas density="subtle" />
        <div className="container mx-auto px-6 z-10">
          <ScrollReveal variants={scaleIn} className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-8">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Calendar</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              Upcoming <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">Events</span>
            </h1>

            <p className="text-slate-400 max-w-xl text-lg leading-relaxed">
              Join us for workshops, tournaments, and special masterclasses designed to elevate your game.
            </p>
          </ScrollReveal>
        </div>
      </header>

      <section className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-6">
          <EventFilter
            categories={categories}
            activeFilter={filter}
            onFilterChange={setFilter}
          />
          <div className="mt-20">
            <EventList events={events} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
