import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function PaymentDisplay() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["global-settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const scannerUrl = settings?.upiScannerUrl;

  if (!scannerUrl) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Scan to Pay Securely</p>
      </div>

      <div className="relative group">
        {/* Sleek Border Container */}
        <div className="relative bg-white p-8 rounded-[2.5rem] border-2 border-slate-200 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:border-blue-100 overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl opacity-50 transition-opacity group-hover:opacity-100" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-slate-50 rounded-full blur-3xl opacity-50 transition-opacity group-hover:opacity-100" />

          <div className="relative flex flex-col items-center gap-8">
            <div className="relative p-6 bg-white rounded-[2rem] shadow-inner border border-slate-100 ring-8 ring-slate-50/50">
              <img
                src={scannerUrl}
                alt="Payment QR Code"
                className="w-56 h-56 object-contain"
              />
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-600/20 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-600/20 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-600/20 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-600/20 rounded-br-xl" />
            </div>

            <div className="text-center space-y-2">
              <p className="text-lg font-black text-slate-900 tracking-tight">Official UPI Payment</p>
              <div className="flex flex-col items-center">
                <span className="px-4 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Universal Chess Academy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
