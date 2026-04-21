import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api"; // Your Axios instance
import { Event } from "@/types";

export const useEvents = () => {
  const [filter, setFilter] = useState<string>("All");
  const categories = ["All", "Classes", "Workshops", "Tournaments"];

  // 1. Fetch real events from the database
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await api.get("/events");
      return response.data;
    },
  });

  // 2. Keep your exact filtering logic!
  const filteredEvents = useMemo(() => {
    if (filter === "All") return events;
    return events.filter((e: Event) => e.category === filter);
  }, [filter, events]);

  return {
    events: filteredEvents,
    isLoading, // Export this so your UI can show a spinner!
    error,
    filter,
    setFilter,
    categories,
  };
};