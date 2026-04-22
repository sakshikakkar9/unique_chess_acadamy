import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export const EditTournamentModal = ({ tournament, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: tournament.title,
    status: tournament.status, // Must match UPCOMING, ONGOING, etc.
    location: tournament.location
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(tournament.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in duration-200">
        <h2 className="text-xl font-bold mb-6 text-gradient-gold">Edit Tournament</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full bg-background border border-border p-3 rounded-xl outline-none"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <select 
            className="w-full bg-background border border-border p-3 rounded-xl outline-none"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};