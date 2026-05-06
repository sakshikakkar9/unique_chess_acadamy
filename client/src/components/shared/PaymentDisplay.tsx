import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Info, CreditCard, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";

export default function PaymentDisplay() {
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ["global-settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Loading Payment Info...</p>
      </div>
    );
  }

  if (error || !settings?.upiScannerUrl) {
    return (
      <div className="bg-white p-6 rounded-2xl">
        <Alert variant="destructive" className="border-rose-100 bg-rose-50 text-rose-600 rounded-xl">
          <Info className="h-4 w-4" />
          <AlertTitle className="text-[10px] font-black uppercase tracking-widest">Payment Info Unavailable</AlertTitle>
          <AlertDescription className="text-xs font-medium">
            We're having trouble loading the payment QR code. Please contact the academy directly to complete your registration.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative">
        {/* Decorative elements for a more professional look */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-[2.5rem] blur-2xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50"
        >
          <div className="w-44 h-44 flex items-center justify-center overflow-hidden">
            <img
              src={settings.upiScannerUrl}
              alt="Payment QR"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Subtle corner markers */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-200 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-200 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-200 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-200 rounded-br-lg" />
        </motion.div>
      </div>

      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="h-px w-8 bg-slate-200" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">UPI Payment</p>
          <div className="h-px w-8 bg-slate-200" />
        </div>
        <p className="text-xl font-black text-slate-900 tracking-tight">uniquechess@upi</p>
        <p className="text-[10px] font-bold text-slate-400">Accepting all major UPI apps</p>
      </div>
    </div>
  );
}