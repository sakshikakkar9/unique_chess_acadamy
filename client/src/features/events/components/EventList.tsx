import { Event } from "@/types";
import EventCard from "./EventCard";

interface EventListProps {
  events: Event[];
}

const EventList = ({ events }: EventListProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-border">
        <p className="text-muted-foreground">No events found in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, i) => (
        <EventCard key={event.id} event={event} index={i} />
      ))}
    </div>
  );
};

export default EventList;
