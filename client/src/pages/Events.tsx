import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/shared/PageHeader";
import EventFilter from "@/features/events/components/EventFilter";
import EventList from "@/features/events/components/EventList";
import { useEvents } from "@/features/events/hooks/useEvents";
import SparkleCanvas from "@/components/shared/SparkleCanvas";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Sparkles } from "lucide-react";

export default function EventsPage() {
  const { events, filter, setFilter, categories } = useEvents();

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-[#cbd5e1] selection:bg-sky-500/30 overflow-hidden relative">
      <SparkleCanvas />
      <Navbar />

      {/* HERO SECTION */}
      <header className="relative pt-48 pb-24 flex items-center">
        <div className="container mx-auto px-6 z-10 text-center">
          <ScrollReveal direction="scale">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card-blue mb-10 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Sparkles className="h-4 w-4 text-[#38bdf8] animate-pulse" />
              <span className="accent-label text-[#38bdf8] font-black">Calendar</span>
            </div>

            <h1 className="text-6xl md:text-9xl font-black text-white mb-10 tracking-tighter uppercase leading-none">
              Upcoming <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] glow-text-gold">Events</span>
            </h1>

            <p className="text-[#94a3b8] max-w-2xl mx-auto text-xl leading-relaxed font-medium">
              Join us for workshops, tournaments, and special masterclasses designed to elevate your game.
            </p>
          </ScrollReveal>
        </div>
      </header>

      <section className="pb-32 relative z-10">
        <div className="container mx-auto px-6">
          {/* Overwrite the default filter styling via custom buttons if needed,
              but for now using the EventFilter which should be upgraded in a real scenario.
              Actually the prompt said only pages and certain components.
              Let's see if we can improve EventFilter by modifying it if it's in client/src/features/**/components/
          */}
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
