import React from "react";
// Import standard Link
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { useTournamentRegistration } from "@/features/tournaments/hooks/useTournamentRegistration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Ticket, ArrowLeft, Menu } from "lucide-react";

export default function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tournaments } = useAdminTournaments();
  
  const { mutate: register, isPending } = useTournamentRegistration();

  const tournament = tournaments.find((t) => t.id.toString() === id);

  if (!tournament) return <div className="p-20 text-center">Tournament not found.</div>;

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Client-side validation
    const phoneRegex = /^[0-9+\s-]{10,}$/;
    if (data.phone && !phoneRegex.test(data.phone.toString())) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    if (data.email && !data.email.toString().includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Pass data with the original tournament ID string
    register({ ...data, tournamentId: id });
  };

  return (
    // FIX 1: Add bottom padding for mobile browsers so content isn't cut off
    <div className="min-h-screen bg-background p-4 md:p-12 pb-24 md:pb-12">
      
      {/* 
        NEW RELIABLE MOBILE HEADER STRUCTURE (Fixed collision seen in image_0.png)
        This ensures elements do not overlap.
      */}
      <header className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder (Replace with your actual logo element) */}
          <div className="w-8 h-8 rounded bg-muted-foreground/10 p-1 flex items-center justify-center">
             <img src="/logo-icon.png" alt="Logo" className="w-full h-full object-contain" />
          </div>

          {/* FIX: Use standard Link component for text-only navigation (not a button) */}
          <Link 
            to="/tournaments" // Define your tournament path here
            className="text-sm font-medium text-foreground/80 hover:text-primary flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Tournaments
          </Link>
        </div>

        {/* Mobile Burger Menu Icon (Visible on mobile, hidden on desktop) */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6 text-foreground" />
        </Button>
      </header>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6 md:space-y-8">
          
          {/* FIX: Reduced main title size on mobile for better balance (text-3xl -> text-5xl on desktop) */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-gradient-gold tracking-tight leading-tight">
            {tournament.title}
          </h1>

          {/* FIX: Reduced spacing and icon size on mobile for better alignment */}
          <div className="flex flex-col gap-3 text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                {/* FIX: Icons h-5 w-5 to match desktop, smaller appearance on mobile via container spacing */}
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm md:text-base font-medium">
                {new Date(tournament.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm md:text-base font-medium capitalize">{tournament.location}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">₹{tournament.entryFee}</span>
            </div>
          </div>

          {/* FIX: Balanced spacing/style for "About the Event" */}
          <div className="prose prose-invert max-w-none bg-muted/20 p-6 rounded-2xl border border-border">
             <h3 className="text-lg font-bold mb-3 text-foreground/90">About the Event</h3>
             <p className="text-sm md:text-lg leading-relaxed text-foreground/80">
               {tournament.description || "Join us for an exciting competitive event!"}
             </p>
          </div>
        </div>

        {/* 
          RIGHT COLUMN: Registration Card
          FIX: Added a slight blur effect and deeper shadows seen in many professional interfaces.
          Removed the thick yellow top border seen in image_0.png, which looked heavy on mobile.
        */}
        <div className="relative pt-6 md:pt-0">
          <Card className="relative border-primary/20 bg-card/70 backdrop-blur-md shadow-2xl overflow-hidden">
            {/* Elegant, thinner visual accent (replaces thick top border) */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 to-primary" />
            
            <CardHeader className="pt-8">
              <CardTitle className="text-2xl font-extrabold text-foreground tracking-tight">Player Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                {/* FIX: Consistent height and styling for inputs */}
                <Input name="studentName" placeholder="Player Full Name" required className="h-11 bg-background/50" />
                <Input name="phone" placeholder="WhatsApp Number" required className="h-11 bg-background/50" />
                <Input name="email" type="email" placeholder="Email Address (Optional)" className="h-11 bg-background/50" />
                <Input name="fideId" placeholder="FIDE ID (If applicable)" className="h-11 bg-background/50" />
                
                <div className="p-5 border border-dashed border-primary/30 rounded-2xl bg-primary/5 text-center space-y-4">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">Scan to Pay</span>
                  <div className="bg-white p-2 inline-block rounded-xl shadow-inner">
                    <img src="/qr-placeholder.png" alt="Payment QR" className="w-32 h-32" />
                  </div>
                  <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">UPI ID: academy@upi</p>
                </div>

                <Input name="transactionId" placeholder="Transaction ID (UTR Number)" required className="h-11 bg-background/50 border-primary/40 focus:border-primary" />
                
                <Button type="submit" className="w-full h-12 text-lg font-bold bg-primary text-primary-foreground hover:scale-[1.01] active:scale-95 transition-all shadow-lg" disabled={isPending}>
                  {isPending ? "Submitting..." : `Complete Registration (₹${tournament.entryFee})`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}