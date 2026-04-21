import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/shared/PageHeader";
import EventFilter from "@/features/events/components/EventFilter";
import EventList from "@/features/events/components/EventList";
import { useEvents } from "@/features/events/hooks/useEvents";

export default function EventsPage() {
  const { events, filter, setFilter, categories } = useEvents();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        label="Calendar"
        title={
          <>
            Upcoming <span className="text-gradient-gold">Events</span>
          </>
        }
      />

      <section className="section-padding pt-0">
        <div className="container mx-auto">
          <EventFilter
            categories={categories}
            activeFilter={filter}
            onFilterChange={setFilter}
          />
          <EventList events={events} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
