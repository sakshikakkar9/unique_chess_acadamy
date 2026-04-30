import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { useTournamentRegistration } from "@/features/tournaments/hooks/useTournamentRegistration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Ticket, ArrowLeft } from "lucide-react";

export default function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tournaments } = useAdminTournaments();
  
  // Custom hook for the API mutation
  const { mutate: register, isPending } = useTournamentRegistration();

  const tournament = tournaments.find((t) => t.id.toString() === id);

  if (!tournament) return <div className="p-20 text-center">Tournament not found.</div>;

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // ✅ Data now includes 'phone' instead of 'contact'
    register({ ...data, tournamentId: id });
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Tournaments
      </Button>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gradient-gold">{tournament.title}</h1>
          <div className="flex flex-col gap-4 text-muted-foreground">
            <div className="flex items-center gap-2"><Calendar className="text-primary" /> {new Date(tournament.date).toDateString()}</div>
            <div className="flex items-center gap-2"><MapPin className="text-primary" /> {tournament.location}</div>
            <div className="flex items-center gap-2"><Ticket className="text-primary" /> ₹{tournament.entryFee} Entry Fee</div>
          </div>
          <p className="text-lg leading-relaxed">{tournament.description || "Join us for an exciting competitive event!"}</p>
        </div>

        <Card className="border-primary/20 bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Register Now</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <Input name="studentName" placeholder="Full Name" required />
              
              {/* ✅ FIXED: name="phone" matches the Prisma schema 'phone' field */}
              <Input name="phone" placeholder="Phone Number" required />
              
              <Input name="email" type="email" placeholder="Email (Optional)" />
              
              <Input name="fideId" placeholder="FIDE ID (Optional)" />
              
              <div className="p-4 border border-dashed border-primary/30 rounded-xl bg-primary/5 text-center">
                <p className="text-sm font-bold mb-2">Scan to Pay ₹{tournament.entryFee}</p>
                <img src="/qr-placeholder.png" alt="Payment QR" className="w-32 h-32 mx-auto mb-2" />
                <p className="text-[10px] text-muted-foreground">UPI ID: academy@upi</p>
              </div>

              <Input name="transactionId" placeholder="Transaction ID (UTR)" required />
              
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isPending}>
                {isPending ? "Submitting..." : "Confirm Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}