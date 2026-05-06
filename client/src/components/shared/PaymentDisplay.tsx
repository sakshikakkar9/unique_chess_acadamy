import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Loader2, QrCode } from "lucide-react";

export default function PaymentDisplay() {
  const [scannerUrl, setScannerUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        if (res.data?.scannerUrl) {
          setScannerUrl(res.data.scannerUrl);
        }
      } catch (err) {
        console.error("Failed to fetch payment settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!scannerUrl) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Scan to Pay Securely</p>
      </div>

      <div className="relative group">
        {/* Sleek Border Container */}
        <div className="relative bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm transition-all duration-500 group-hover:border-slate-200 group-hover:shadow-md overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-slate-50 rounded-full blur-3xl opacity-50 transition-opacity group-hover:opacity-100" />

          <div className="relative flex flex-col items-center gap-6">
            <div className="relative p-4 bg-white rounded-2xl shadow-inner border border-slate-50">
              <img
                src={scannerUrl}
                alt="Payment QR Code"
                className="w-48 h-48 object-contain"
              />
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-slate-200 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-slate-200 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-slate-200 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-slate-200 rounded-br-lg" />
            </div>

            <div className="text-center space-y-1">
              <p className="text-sm font-black text-slate-900 tracking-tight">Official UPI ID</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Universal Chess Academy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
