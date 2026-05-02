import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { useTournamentRegistration } from "@/features/tournaments/hooks/useTournamentRegistration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Ticket, ArrowLeft } from "lucide-react";

export default function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tournaments } = useAdminTournaments();
  const { mutate: register, isPending } = useTournamentRegistration();

  const tournament = tournaments.find((t) => t.id.toString() === id);

  if (!tournament) return <div className="p-20 text-center text-white">Tournament not found.</div>;

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    register({ ...data, tournamentId: id });
  };

  return (
    /* 
      FIX 1: Added 'pt-24' (padding-top) to push content below your fixed navbar.
      This solves the overlap seen in your screenshot.
    */
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
      
      <div className="max-w-6xl mx-auto">
        {/* 
          FIX 2: Simple Text Link for "Back"
          Removed the button styling completely.
        */}
        <div className="mb-8">
          <Link 
            to="/tournaments" 
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Tournaments</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Details Column */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold text-gradient-gold leading-tight">
              {tournament.title}
            </h1>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5 text-primary shrink-0" />
                <span className="text-base">{new Date(tournament.date).toDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span className="text-base">{tournament.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Ticket className="h-5 w-5 text-primary shrink-0" />
                <span className="text-xl font-bold text-foreground">₹{tournament.entryFee}</span>
              </div>
            </div>

            <div className="bg-card/30 border border-border p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-2">About the Event</h3>
              <p className="text-muted-foreground leading-relaxed">
                {tournament.description || "Join this tournament to showcase your skills and compete for the top spots!"}
              </p>
            </div>
          </div>

          {/* Registration Column */}
          <Card className="border-primary/20 shadow-2xl bg-card/50 backdrop-blur-sm">
            <div className="h-1.5 bg-primary w-full rounded-t-xl" />
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center md:text-left">Player Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <Input name="studentName" placeholder="Player Full Name" required className="h-12" />
                <Input name="phone" placeholder="WhatsApp Number" required className="h-12" />
                <Input name="email" type="email" placeholder="Email (Optional)" className="h-12" />
                <Input name="fideId" placeholder="FIDE ID (Optional)" className="h-12" />
                
                <div className="p-4 border border-dashed border-primary/20 rounded-xl bg-primary/5 text-center">
                  <p className="text-xs font-bold text-primary mb-3">Scan to Pay ₹{tournament.entryFee}</p>
                  <div className="bg-white p-2 inline-block rounded-lg mb-2">
                    <img src="/qr-placeholder.png" alt="Payment QR" className="w-32 h-32" />
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase">UPI: academy@upi</p>
                </div>

                <Input name="transactionId" placeholder="Transaction ID (UTR)" required className="h-12 border-primary/30" />
                
                <Button type="submit" className="w-full h-12 font-bold text-lg" disabled={isPending}>
                  {isPending ? "Registering..." : "Complete Registration"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
