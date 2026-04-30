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
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION (Dark Hero Mini) */}
      <header className="relative h-[45vh] min-h-[400px] flex items-center bg-[#0f172a] overflow-hidden">
        <SparkleCanvas density="subtle" />
        <div className="container mx-auto px-6 z-10 text-center">
          <ScrollReveal variants={scaleIn}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f9ff] text-[#0ea5e9] border border-[#0ea5e9]/20 mb-8">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Calendar</span>
            </div>

            <h1 className="text-h1 text-white mb-6">
              Upcoming <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d97706] to-[#fbbf24]">Events</span>
            </h1>

            <p className="text-[#94a3b8] max-w-2xl mx-auto text-body-lg">
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
