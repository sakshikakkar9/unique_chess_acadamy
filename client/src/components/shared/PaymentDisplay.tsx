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
      <div className="relative group max-w-sm mx-auto">
        {/* Sleek Border Container */}
        <div className="relative bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl transition-all duration-700 group-hover:shadow-blue-600/5 group-hover:border-blue-600/10 overflow-hidden">
          <div className="relative flex flex-col items-center">
            <div className="relative p-6 bg-white rounded-[2rem] border border-slate-50 ring-8 ring-slate-50/50 transition-all duration-500 group-hover:ring-blue-50/50">
              <img
                src={scannerUrl}
                alt="Payment QR Code"
                className="w-56 h-56 object-contain transition-transform duration-700 group-hover:scale-105"
              />
              {/* Subtle Corner Accents */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-blue-600/20 rounded-tl-xl" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-blue-600/20 rounded-tr-xl" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-blue-600/20 rounded-bl-xl" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-blue-600/20 rounded-br-xl" />
            </div>

            {/* Pulsing Status Indicator */}
            <div className="mt-6 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Active Scanner</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
