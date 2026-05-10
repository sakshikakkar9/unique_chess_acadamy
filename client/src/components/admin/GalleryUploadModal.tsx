import React, { useState, useRef } from "react";
import { Upload, X, ImageIcon, Wand2 } from "lucide-react";
import AdminModal from "./AdminModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FrameOrientation = 'landscape' | 'portrait' | 'auto';

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: FormData) => Promise<void>;
}

const detectOrientation = (file: File): Promise<'landscape' | 'portrait'> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(img.naturalWidth >= img.naturalHeight ? 'landscape' : 'portrait');
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};

const GalleryUploadModal: React.FC<GalleryUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [frame, setFrame] = useState<FrameOrientation>('auto');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("ACADEMY");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (frame === 'auto') {
        const orientation = await detectOrientation(file);
        // Provide feedback for auto-detection
        console.log(`Auto-detected orientation: ${orientation}`);
      }
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      let finalOrientation: 'landscape' | 'portrait' = 'landscape';
      if (frame === 'auto') {
        finalOrientation = await detectOrientation(selectedFile);
      } else {
        finalOrientation = frame as 'landscape' | 'portrait';
      }

      const data = new FormData();
      data.append("image", selectedFile);
      data.append("caption", caption);
      data.append("category", category);
      data.append("orientation", finalOrientation);

      await onUpload(data);
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption("");
    setCategory("ACADEMY");
    setFrame("auto");
    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload Gallery Asset"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} className="text-uca-text-muted hover:text-uca-text-primary">Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={!selectedFile || isUploading || (frame === 'auto' && !selectedFile)}
            className="bg-uca-navy hover:bg-uca-navy-hover text-white font-bold px-8 h-10 disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : "Upload Asset"}
          </Button>
        </>
      }
    >
      <div className="space-y-6 py-2">
        {/* Frame Selector */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Target Frame</Label>
          <div className="flex gap-3">
            {[
              { id: 'landscape', label: 'Landscape', sub: '16:9 Rect', icon: <div className="w-8 h-5 rounded border-2 border-current" /> },
              { id: 'portrait', label: 'Portrait', sub: '2:3 Slot', icon: <div className="w-5 h-8 rounded border-2 border-current" /> },
              { id: 'auto', label: 'Auto', sub: 'Smart Detect', icon: <Wand2 className="size-5" /> },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFrame(opt.id as FrameOrientation)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center",
                  frame === opt.id
                    ? "border-uca-navy bg-uca-bg-elevated text-uca-navy"
                    : "border-uca-border bg-uca-bg-surface text-uca-text-muted hover:border-slate-400"
                )}
              >
                {opt.icon}
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-tight">{opt.label}</span>
                  <span className="text-[8px] opacity-60 font-medium">{opt.sub}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Image File</Label>
          <div
            className="border-2 border-dashed border-uca-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-uca-bg-elevated transition-all bg-uca-bg-base"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-uca-border">
                <img src={previewUrl} className="size-full object-cover" alt="Preview" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setSelectedFile(null); }}
                  className="absolute top-2 right-2 size-8 bg-uca-accent-red text-white rounded-lg flex items-center justify-center shadow-lg"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="size-8 text-uca-accent-blue" />
                <p className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Select Image Asset</p>
              </>
            )}
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Caption</Label>
          <Input
            placeholder="e.g. Academy Training Session"
            className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg text-uca-text-primary"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg text-uca-text-primary"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
              <SelectItem value="TRAINING">Training</SelectItem>
              <SelectItem value="TOURNAMENT">Tournament</SelectItem>
              <SelectItem value="COACHING">Coaching</SelectItem>
              <SelectItem value="ACADEMY">Academy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </AdminModal>
  );
};

export default GalleryUploadModal;
