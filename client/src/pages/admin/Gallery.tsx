import React, { useState, useRef } from "react";
import { useGallery } from "@/features/gallery/hooks/useGallery";
import AdminShell from "@/components/admin/AdminShell";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Upload, X, Trash2, Image as ImageIcon } from "lucide-react";
import { GalleryImage } from "@/types";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/shared/admin/StatusBadge";

const AdminGallery: React.FC = () => {
  const { images, isLoading, uploadImage, deleteImage } = useGallery();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryImage>>({
    caption: "",
    category: "ACADEMY",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAdd = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({ caption: "", category: "ACADEMY" });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!selectedFile) {
        toast({ variant: "destructive", title: "Error", description: "Please select a file first" });
        return;
      }
      const data = new FormData();
      data.append("image", selectedFile);
      data.append("caption", formData.caption || "");
      data.append("category", formData.category || "ACADEMY");
      await uploadImage(data as any);
      setIsModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast({ title: "Success", description: "Image uploaded successfully!" });
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed" });
    }
  };

  return (
    <AdminShell
      title="Gallery Management"
      subtitle="Manage and upload photos for the academy gallery."
      actionLabel="Add Image"
      onAction={handleAdd}
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="size-8 border-4 border-uca-accent-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {images.map((img) => (
              <div
                key={img.id}
                className="bg-uca-bg-surface border border-uca-border rounded-xl overflow-hidden group hover:border-uca-accent-blue/30 transition-all shadow-sm"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-uca-bg-base">
                  <img src={img.imageUrl} alt={img.caption || ""} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => { setSelectedImage(img); setIsConfirmOpen(true); }}
                      className="size-10 bg-uca-accent-red text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-sm font-bold text-uca-text-primary truncate">
                    {img.caption || <span className="italic text-uca-text-muted">No caption</span>}
                  </p>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={img.category} />
                    <span className="text-[10px] font-bold text-uca-text-muted uppercase">{img.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-uca-bg-surface rounded-xl border border-uca-border">
            <ImageIcon className="size-10 text-uca-text-muted mx-auto mb-3" />
            <p className="text-uca-text-muted font-bold text-xs uppercase tracking-widest">Gallery Empty</p>
          </div>
        )}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload New Photo"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-uca-text-muted hover:text-white">Cancel</Button>
            <Button onClick={handleSave} className="bg-uca-navy hover:bg-uca-navy-hover text-white font-bold px-8 h-10">Upload</Button>
          </>
        }
      >
        <div className="space-y-6 py-2">
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
              className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg"
              value={formData.caption || ""}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Category</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
              <SelectTrigger className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-uca-bg-surface border-uca-border text-white">
                <SelectItem value="TRAINING">Training</SelectItem>
                <SelectItem value="TOURNAMENT">Tournament</SelectItem>
                <SelectItem value="COACHING">Coaching</SelectItem>
                <SelectItem value="ACADEMY">Academy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={async () => { if (selectedImage) await deleteImage(selectedImage.id); setIsConfirmOpen(false); }}
        title="Delete Image"
        description="This will permanently remove the photo from the gallery."
      />
    </AdminShell>
  );
};

export default AdminGallery;
