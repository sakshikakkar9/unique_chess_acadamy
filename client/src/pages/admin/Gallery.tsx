import React, { useState, useRef } from "react";
import { useGallery } from "@/features/gallery/hooks/useGallery";
import AdminFormModal from "@/components/shared/admin/AdminFormModal";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Upload, X, Trash2 } from "lucide-react";
import { GalleryImage } from "@/types";
import { cn } from "@/lib/utils";
import AdminPageHeader from "@/components/shared/admin/AdminPageHeader";
import StatusBadge from "@/components/shared/admin/StatusBadge";

const AdminGallery: React.FC = () => {
  const { images, isLoading, uploadImage, deleteImage } = useGallery();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  // States for file upload
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
    setFormData({
      caption: "",
      category: "ACADEMY",
    });
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
      console.error("Upload failed", error);
      toast({ variant: "destructive", title: "Upload Failed", description: "Check server logs for 500 error details." });
    }
  };

  const handleDeleteClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedImage) {
      await deleteImage(selectedImage.id);
      setIsConfirmOpen(false);
      setSelectedImage(null);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <AdminPageHeader
        title="Gallery Management"
        subtitle="Manage and upload photos for the academy gallery."
        action={
          <Button onClick={handleAdd} className="shadow-lg bg-[#0284c7] hover:bg-[#0284c7]/90 text-white font-bold rounded-full px-6">
            <Plus className="mr-2 h-4 w-4" /> Add Image
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0284c7] border-t-transparent"></div>
        </div>
      ) : images.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px'
          }}
        >
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-white group"
              style={{
                border: '1px solid #e0eeff',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              <div style={{ height: '120px', width: '100%', position: 'relative' }}>
                <img
                  src={img.imageUrl}
                  alt={img.caption || ""}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={() => handleDeleteClick(img)}
                  className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#0f172a',
                    marginBottom: '8px'
                  }}
                  className="truncate"
                >
                  {img.caption || <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>No caption added</span>}
                </p>
                <StatusBadge status={img.category} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[14px] border border-[#e0eeff]">
          <p className="text-slate-400 text-sm">No images in the gallery yet.</p>
        </div>
      )}

      <AdminFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedImage ? "Edit Image" : "Upload New Photo"}
        onSave={handleSave}
      >
        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image File</Label>
            <div
              className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setSelectedFile(null); }}
                    className="absolute top-2 right-2 p-1 bg-rose-500 text-white rounded-full shadow-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-[#94a3b8]" />
                  <p className="text-[10px] font-bold uppercase text-[#94a3b8]">Click to select an image</p>
                </>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="caption" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Caption</Label>
            <Input
              id="caption"
              placeholder="Enter caption..."
              className="h-11 rounded-xl"
              value={formData.caption || ""}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(v) => setFormData({ ...formData, category: v })}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl">
                <SelectItem value="TRAINING" className="text-xs font-bold uppercase py-2.5">Training</SelectItem>
                <SelectItem value="TOURNAMENT" className="text-xs font-bold uppercase py-2.5">Tournament</SelectItem>
                <SelectItem value="COACHING" className="text-xs font-bold uppercase py-2.5">Coaching</SelectItem>
                <SelectItem value="ACADEMY" className="text-xs font-bold uppercase py-2.5">Academy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </AdminFormModal>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Image"
        description="This will permanently remove the photo from the gallery."
      />
    </div>
  );
};

export default AdminGallery;
