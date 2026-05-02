import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { useTournamentRegistration } from "@/features/tournaments/hooks/useTournamentRegistration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Calendar, MapPin, Ticket, ArrowLeft, Trophy, Users, 
  Upload, CheckCircle2, Copy 
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TournamentDetails() {
  const { id } = useParams();
  const { tournaments, isLoading } = useAdminTournaments();
  const { mutate: register, isPending } = useTournamentRegistration();
  
  // State for the success popup
  const [showSuccess, setShowSuccess] = useState(false);
  const [refId, setRefId] = useState("");

  const tournament = tournaments.find((t) => t.id.toString() === id);

  if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  if (!tournament) return <div className="p-20 text-center text-slate-900">Tournament not found.</div>;

const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 1. Check if ID exists
    if (!id) {
      console.error("No tournament ID found in URL");
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    // 2. ✅ CRITICAL STEP: Add the ID from the URL into the FormData
    // This allows the hook to find it using formData.get("tournamentId")
    formData.append("tournamentId", id); 

    // 3. Now call the register function as usual
    register(formData, {
      onSuccess: (data: any) => {
        setRefId(data.referenceId || "UCA-" + Math.random().toString(36).toUpperCase().substring(2, 10));
        setShowSuccess(true);
      }
    });
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
          {/* Left Side: Tournament Info (Unchanged as requested) */}
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
                {tournament.description || "Compete against the finest minds in the region."}
              </p>
            </div>
          </div>

          {/* Right Side: Updated Registration Form */}
          <Card className="border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden">
            <div className="h-2 bg-orange-500 w-full" />
            <CardHeader className="pt-10 pb-6 px-10">
              <CardTitle className="text-2xl font-black text-slate-900">Player Registration</CardTitle>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">All fields are required unless marked optional</p>
            </CardHeader>
            <CardContent className="px-10 pb-10">
              <form onSubmit={handleRegister} className="space-y-6">
                
                {/* Personal Details Row */}
                <div className="space-y-4">
                  <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Personal Details</Label>
                  <Input name="studentName" placeholder="Player Full Name" required className="h-14 rounded-xl border-slate-200 bg-slate-50/50" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <select name="gender" required className="h-14 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <Input name="dob" type="date" required className="h-14 rounded-xl border-slate-200 bg-slate-50/50" />
                  </div>
                </div>

                {/* Contact & FIDE */}
                <div className="space-y-4">
                  <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Contact & Rating</Label>
                  <Input name="phone" placeholder="Phone Number" required className="h-14 rounded-xl border-slate-200 bg-slate-50/50" />
                  <Input name="email" type="email" placeholder="Email Address (Optional)" className="h-14 rounded-xl border-slate-200 bg-slate-50/50" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input name="fideId" placeholder="FIDE ID" defaultValue="NA" className="h-14 rounded-xl border-slate-200 bg-slate-50/50" />
                    <Input name="fideRating" type="number" placeholder="FIDE Rating" defaultValue="0" className="h-14 rounded-xl border-slate-200 bg-slate-50/50" />
                  </div>
                  <Input name="address" placeholder="Residential Address" required className="h-14 rounded-xl border-slate-200 bg-slate-50/50" />
                </div>

                {/* Discovery Source */}
                <div className="space-y-4">
                  <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">How did you hear about us?</Label>
                  <select name="discoverySource" required className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="Social Media">Social Media</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Through Academy">Through Academy</option>
                    <option value="Through Coaches">Through Coaches</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">Age Proof</Label>
                    <div className="relative h-14 w-full">
                      <Input name="ageProof" type="file" required className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                      <div className="h-full w-full border border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 gap-2 text-slate-400">
                        <Upload className="h-4 w-4" /> <span className="text-[10px] font-bold">Upload</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">Payment Proof</Label>
                    <div className="relative h-14 w-full">
                      <Input name="paymentProof" type="file" required className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                      <div className="h-full w-full border border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 gap-2 text-slate-400">
                        <Upload className="h-4 w-4" /> <span className="text-[10px] font-bold">Upload</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment QR (Kept as requested) */}
                <div className="p-6 border-2 border-dashed border-orange-100 rounded-2xl bg-orange-50/30 text-center">
                  <p className="text-xs font-black text-orange-600 mb-4 uppercase tracking-widest">UPI Payment: ₹{tournament.entryFee}</p>
                  <img src="/qr-placeholder.png" alt="Payment QR" className="w-32 h-32 mx-auto mb-2" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase">uniquechess@upi</p>
                </div>
                
                <Button type="submit" className="w-full h-14 font-black text-lg bg-[#020617] hover:bg-orange-600 rounded-xl transition-all shadow-xl" disabled={isPending}>
                  {isPending ? "PROCESSING..." : "SUBMIT REGISTRATION"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-emerald-500 p-8 text-center text-white">
            <CheckCircle2 className="h-16 w-16 mx-auto mb-4 animate-bounce" />
            <DialogTitle className="text-2xl font-black mb-1">Registration Successful!</DialogTitle>
            <p className="text-emerald-100 text-sm font-bold">Your spot in the arena is now reserved.</p>
          </div>
          <div className="p-8 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Your Unique Reference ID</p>
            <div className="flex items-center justify-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-6 group">
              <span className="text-2xl font-black text-slate-900 tracking-tighter">{refId}</span>
              <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(refId)} className="hover:text-orange-600">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => setShowSuccess(false)} className="w-full h-12 rounded-xl bg-slate-900 font-bold">Done</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}