import React from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  if (!tournament) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-xl font-semibold">Tournament not found.</p>
        <Button onClick={() => navigate("/tournaments")}>Return to List</Button>
      </div>
    );
  }

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const phoneRegex = /^[0-9+\s-]{10,}$/;
    if (data.phone && !phoneRegex.test(data.phone.toString())) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    // Pass the data to the backend mutation
    register({ ...data, tournamentId: id });
  };

  return (
    // Changed padding to be more responsive (p-4 for mobile, p-10 for desktop)
    <div className="min-h-screen bg-background p-4 md:p-10 lg:p-16">
      
      {/* 1. Back Navigation - Now with fixed width and higher contrast */}
      <div className="max-w-6xl mx-auto mb-6">
        <Button 
          variant="outline" // Outline variant is often more visible than ghost on mobile
          onClick={() => navigate("/tournaments")} 
          className="flex items-center gap-2 border-primary/20 hover:bg-primary/5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> 
          <span>Back to Tournaments</span>
        </Button>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
        {/* Information Section */}
        <div className="space-y-8">
          <header>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gradient-gold leading-tight">
              {tournament.title}
            </h1>
          </header>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-5 w-5 text-primary shrink-0" />
              <span className="font-medium text-sm md:text-base">
                {new Date(tournament.date).toLocaleDateString('en-IN', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <span className="font-medium text-sm md:text-base">{tournament.location}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Ticket className="h-5 w-5 text-primary shrink-0" />
              <span className="font-bold text-lg text-foreground">₹{tournament.entryFee}</span>
            </div>
          </div>

          <div className="bg-muted/30 p-6 rounded-2xl border border-border">
            <h3 className="text-lg font-semibold mb-3">About the Event</h3>
            <p className="text-muted-foreground leading-relaxed">
              {tournament.description || "Join this tournament to showcase your skills and compete for the top spots!"}
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="relative">
          <Card className="border-primary/20 shadow-xl overflow-hidden backdrop-blur-sm">
            <div className="h-2 bg-primary w-full" />
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Player Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-4">
                  <Input name="studentName" placeholder="Player Full Name" required className="h-11" />
                  <Input name="phone" placeholder="WhatsApp Number" required className="h-11" />
                  <Input name="email" type="email" placeholder="Email Address (Optional)" className="h-11" />
                  <Input name="fideId" placeholder="FIDE ID (If applicable)" className="h-11" />
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-4">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase">
                    Scan & Pay
                  </span>
                  <div className="bg-white p-2 w-40 h-40 mx-auto rounded-lg shadow-inner">
                    <img src="/qr-placeholder.png" alt="Payment QR" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">UPI: academy@upi</p>
                </div>

                <Input 
                  name="transactionId" 
                  placeholder="Transaction ID (UTR Number)" 
                  required 
                  className="h-11 border-primary/40 focus:ring-primary" 
                />
                
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-bold shadow-lg" 
                  disabled={isPending}
                >
                  {isPending ? "Processing..." : "Complete Registration"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}