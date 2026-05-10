import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, RefreshCw, CheckCircle2, AlertCircle, Eye, Settings } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AdminShell from "@/components/admin/AdminShell";

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

  return (
    <AdminShell
      title="Admin Settings"
      subtitle="Manage global configurations for the academy."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="size-8 animate-spin text-uca-accent-blue" />
          </div>
        ) : (
          <Card className="bg-uca-bg-surface border-uca-border rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="bg-uca-bg-elevated/30 p-6 border-b border-uca-border">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-uca-navy rounded-xl flex items-center justify-center border border-uca-border">
                  <Settings className="size-6 text-uca-accent-blue" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-uca-text-primary">Global Payment Config</CardTitle>
                  <CardDescription className="text-uca-text-muted">
                    Update the UPI QR code used across all programs.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">
                      Upload New QR Scanner
                    </Label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative aspect-square rounded-2xl border-2 border-dashed border-uca-border flex flex-col items-center justify-center cursor-pointer hover:border-uca-accent-blue/50 hover:bg-uca-bg-elevated transition-all overflow-hidden bg-uca-bg-base"
                    >
                      {previewUrl ? (
                        <img src={previewUrl} className="w-full h-full object-contain p-4" alt="Preview" />
                      ) : (
                        <div className="text-center p-6">
                          <Upload className="size-8 text-uca-text-muted mb-3 group-hover:text-uca-accent-blue group-hover:scale-110 transition-all mx-auto" />
                          <p className="text-sm font-bold text-uca-text-primary">Click to upload</p>
                          <p className="text-[10px] text-uca-text-muted mt-1 uppercase font-black">PNG, JPG or WebP</p>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={!selectedFile || updateSettingsMutation.isPending}
                    className="w-full h-12 bg-uca-navy hover:bg-uca-navy-hover text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    {updateSettingsMutation.isPending ? (
                      <RefreshCw className="size-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="size-4 mr-2" />
                    )}
                    Save Configuration
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">
                      Current Active Scanner
                    </Label>
                    <div className="aspect-square rounded-2xl bg-uca-bg-base border border-uca-border flex flex-col items-center justify-center relative group overflow-hidden">
                      {settings?.upiScannerUrl ? (
                        <>
                          <img src={settings.upiScannerUrl} className="w-full h-full object-contain p-4" alt="Current QR" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="rounded-lg font-bold text-[10px] uppercase tracking-widest h-10 px-4 bg-uca-text-primary text-uca-bg-base"
                              onClick={() => window.open(settings.upiScannerUrl, "_blank")}
                            >
                              <Eye className="size-3.5 mr-2" /> View Full
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-8">
                          <AlertCircle className="size-10 text-uca-bg-elevated mx-auto mb-3" />
                          <p className="text-[10px] font-black text-uca-text-muted uppercase tracking-widest">
                            No Scanner Configured
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {!settings?.upiScannerUrl && (
                    <Alert className="rounded-xl border-uca-accent-red/20 bg-uca-accent-red/10 text-uca-accent-red">
                      <AlertCircle className="size-4" />
                      <AlertTitle className="font-black text-[10px] uppercase tracking-widest">Action Required</AlertTitle>
                      <AlertDescription className="text-xs font-medium">
                        Payment information is missing for student registrations.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminShell>
  );
}
