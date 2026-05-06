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
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Scan to Pay Securely</p>
      </div>

      <div className="relative group">
        {/* Sleek Border Container */}
        <div className="relative bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl transition-all duration-700 group-hover:shadow-blue-600/10 group-hover:border-blue-600/20 overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl opacity-50 transition-opacity group-hover:opacity-100" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 transition-opacity group-hover:opacity-100" />

          <div className="relative flex flex-col items-center gap-10">
            <div className="relative p-8 bg-white rounded-[2.5rem] shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border-2 border-slate-50 ring-[12px] ring-slate-50/80 transition-all duration-500 group-hover:ring-blue-50 group-hover:border-white">
              <img
                src={scannerUrl}
                alt="Payment QR Code"
                className="w-64 h-64 object-contain transition-transform duration-700 group-hover:scale-105"
              />
              {/* Corner Accents */}
              <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-blue-600/40 rounded-tl-2xl" />
              <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-blue-600/40 rounded-tr-2xl" />
              <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-blue-600/40 rounded-bl-2xl" />
              <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-blue-600/40 rounded-br-2xl" />
            </div>

            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" />
                <p className="text-xl font-bold text-slate-900 tracking-tight">Secured UPI Gateway</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="px-6 py-2 bg-slate-900 rounded-2xl text-[10px] font-bold text-white uppercase tracking-[0.25em] shadow-md shadow-slate-900/20">
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
