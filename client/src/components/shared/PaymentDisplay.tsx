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
    <div className="bg-white p-6 rounded-2xl flex flex-col items-center gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-48 h-48 rounded-xl overflow-hidden shadow-sm border border-slate-100"
      >
        <img
          src={settings.upiScannerUrl}
          alt="Payment QR"
          className="w-full h-full object-contain p-2"
        />
      </motion.div>
      <div className="text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scan to Pay via UPI</p>
        <p className="text-slate-900 font-black">uniquechess@upi</p>
      </div>
    </div>
  );
}