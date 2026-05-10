import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, RefreshCw, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["global-settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data;
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.patch("/settings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["global-settings"] });
      toast({ title: "Settings updated successfully" });
      setSelectedFile(null);
      setPreviewUrl(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.response?.data?.error || "Could not update settings",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("scanner", selectedFile);
    updateSettingsMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Admin Settings</h1>
        <p className="text-slate-500 font-medium">Manage global configurations for the academy.</p>
      </div>

      <div className="grid gap-4 md:p-8">
        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 p-4 md:p-8 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-black">Global Payment Configuration</CardTitle>
                <CardDescription className="font-medium">
                  Update the UPI QR code used across all programs and tournaments.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-4 md:p-8 items-start">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
                    Upload New QR Scanner
                  </Label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-600/50 hover:bg-blue-50/30 transition-all overflow-hidden"
                  >
                    {previewUrl ? (
                      <img src={previewUrl} className="w-full h-full object-contain p-4" alt="Preview" />
                    ) : (
                      <div className="text-center p-6">
                        <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                          <Upload className="h-6 w-6 text-slate-400 group-hover:text-blue-600" />
                        </div>
                        <p className="text-sm font-bold text-slate-600">Click to upload</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">PNG, JPG or WebP</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={!selectedFile || updateSettingsMutation.isPending}
                  className="w-full h-14 bg-blue-600 hover:bg-slate-900 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/10"
                >
                  {updateSettingsMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Save New Configuration
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
                    Current Active Scanner
                  </Label>
                  <div className="aspect-square rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col items-center justify-center relative group overflow-hidden">
                    {settings?.upiScannerUrl ? (
                      <>
                        <img
                          src={settings.upiScannerUrl}
                          className="w-full h-full object-contain p-4"
                          alt="Current QR"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full font-black text-[10px] uppercase tracking-widest h-10 px-6 shadow-2xl"
                            onClick={() => window.open(settings.upiScannerUrl, "_blank")}
                          >
                            <Eye className="h-3.5 w-3.5 mr-2" /> View Full Scale
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4 md:p-8">
                        <AlertCircle className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          No Scanner Configured
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {!settings?.upiScannerUrl && (
                  <Alert variant="destructive" className="rounded-2xl border-rose-100 bg-rose-50/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-black text-[10px] uppercase tracking-widest">Action Required</AlertTitle>
                    <AlertDescription className="text-xs font-medium">
                      Without a global scanner, students will not see payment information during registration.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}