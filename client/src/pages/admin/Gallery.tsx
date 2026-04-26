import React, { useState, useRef } from "react";
import { useGallery } from "@/features/gallery/hooks/useGallery";
import DataTable, { Column } from "@/components/shared/admin/DataTable";
import AdminFormModal from "@/components/shared/admin/AdminFormModal";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Upload, X } from "lucide-react";
import { GalleryImage } from "@/types";

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

  const columns: Column<GalleryImage>[] = [
    {
      header: "Preview",
      accessorKey: "imageUrl",
      cell: (item) => (
        <div className="w-12 h-12 rounded overflow-hidden border border-border bg-muted">
          <img 
            src={item.imageUrl} 
            alt={item.caption || "Gallery Image"} 
            className="w-full h-full object-cover" 
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Error'; }}
          />
        </div>
      )
    },
    { header: "Caption", accessorKey: "caption" },
    {
      header: "Category",
      accessorKey: "category",
      cell: (item) => (
        <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded uppercase">
          {item.category}
        </span>
      )
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create a temporary URL for previewing the image in the modal
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
    // Key names must match what the backend expects
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

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({});
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">Manage and upload photos from your computer.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
          <Plus className="h-4 w-4" />
          Add Image
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={images}
        isLoading={isLoading}
        onDelete={handleDeleteClick}
        // Note: For file uploads, 'Edit' is usually complex because you'd have to 
        // handle replacing a physical file. Keeping it simple with Add/Delete for now.
      />

      <AdminFormModal
  open={isModalOpen}
  onOpenChange={setIsModalOpen}
  title={selectedImage ? "Edit Image" : "Upload New Photo"}
  onSave={handleSave} 
>
  {/* 👇 Added max-height and overflow scroll here */}
  <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
    
    {/* Image Upload Area */}
    <div className="grid gap-2">
      <Label>Image File</Label>
      <div 
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition"
        onClick={() => fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <div className="relative w-full aspect-video rounded-md overflow-hidden border">
            <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setSelectedFile(null); }}
              className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full shadow-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Click to select an image</p>
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

    {/* Caption and Category - These will now be reachable via scroll */}
    <div className="grid gap-2">
      <Label htmlFor="caption">Caption</Label>
      <Input
        id="caption"
        placeholder="Enter caption..."
        value={formData.caption || ""}
        onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
      />
    </div>

    <div className="grid gap-2">
      <Label>Category</Label>
      <Select
        value={formData.category}
        onValueChange={(v) => setFormData({ ...formData, category: v })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TRAINING">Training</SelectItem>
          <SelectItem value="TOURNAMENT">Tournament</SelectItem>
          <SelectItem value="COACHING">Coaching</SelectItem>
          <SelectItem value="ACADEMY">Academy</SelectItem>
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