import React from "react";
import { useParams, Link } from "react-router-dom";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { useTournamentRegistration } from "@/features/tournaments/hooks/useTournamentRegistration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Ticket, ArrowLeft, Trophy, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TournamentDetails() {
  const { id } = useParams();
  const { tournaments, isLoading } = useAdminTournaments();
  const { mutate: register, isPending } = useTournamentRegistration();

  const tournament = tournaments.find((t) => t.id.toString() === id);

  if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  if (!tournament) return <div className="p-20 text-center text-slate-900">Tournament not found.</div>;

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    register({ ...data, tournamentId: id });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto pt-32 pb-20 px-6">
        <div className="mb-12">
          <Link 
            to="/tournaments" 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-orange-600 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="uppercase tracking-widest">Back to Arenas</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Details Column */}
          <div className="space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100 mb-6">
                <Trophy className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-wider">{tournament.category || 'Professional'}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter">
                {tournament.title}
              </h1>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Event Date</p>
                  <p className="text-slate-900 font-bold">{new Date(tournament.startDate).toDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Venue</p>
                  <p className="text-slate-900 font-bold">{tournament.location || 'Main Academy Hall'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <Ticket className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entry Fee</p>
                  <p className="text-2xl font-black text-slate-900">₹{tournament.entryFee}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prize Pool</p>
                  <p className="text-2xl font-black text-slate-900">₹{tournament.totalPrizePool?.toLocaleString() || 'TBD'}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem]">
              <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">Event Overview</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {tournament.description || "Compete against the finest minds in the region. This tournament follows official FIDE rules and offers a professional environment for all participants."}
              </p>
            </div>
          </div>

          {/* Registration Column */}
          <Card className="border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden">
            <div className="h-2 bg-orange-500 w-full" />
            <CardHeader className="pt-10 pb-6 px-10">
              <CardTitle className="text-2xl font-black text-slate-900">Player Registration</CardTitle>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Secure your spot in the arena</p>
            </CardHeader>
            <CardContent className="px-10 pb-10">
              <form onSubmit={handleRegister} className="space-y-5">
                <Input name="studentName" placeholder="Full Name" required className="h-14 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white" />
                <Input name="phone" placeholder="WhatsApp Number" required className="h-14 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white" />
                <Input name="email" type="email" placeholder="Email Address" className="h-14 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white" />
                <Input name="fideId" placeholder="FIDE ID (If available)" className="h-14 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white" />
                
                <div className="p-6 border-2 border-dashed border-orange-100 rounded-2xl bg-orange-50/30 text-center">
                  <p className="text-xs font-black text-orange-600 mb-4 uppercase tracking-widest">Payment via UPI: ₹{tournament.entryFee}</p>
                  <div className="bg-white p-3 inline-block rounded-2xl mb-3 shadow-sm border border-orange-100">
                    <img src="/qr-placeholder.png" alt="Payment QR" className="w-36 h-36" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">ID: uniquechess@upi</p>
                </div>

                <Input name="transactionId" placeholder="Transaction ID (UTR)" required className="h-14 rounded-xl border-orange-200 bg-orange-50/20 focus:bg-white font-bold" />
                
                <Button type="submit" className="w-full h-14 font-black text-lg bg-[#020617] hover:bg-orange-600 rounded-xl transition-all shadow-xl hover:shadow-orange-600/20" disabled={isPending}>
                  {isPending ? "VALIDATING..." : "CONFIRM REGISTRATION"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}