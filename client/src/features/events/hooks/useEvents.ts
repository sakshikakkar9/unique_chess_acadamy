import { useState, useMemo } from "react";
import { events } from "@/services/mockData";
import { Event } from "@/types";

export const useEvents = () => {
  const [filter, setFilter] = useState<string>("All");

  const filteredEvents = useMemo(() => {
    if (filter === "All") return events;
    return events.filter((e) => e.category === filter);
  }, [filter]);

  const categories = ["All", "Classes", "Workshops", "Tournaments"];

  return {
    events: filteredEvents,
    filter,
    setFilter,
    categories,
  };
};
