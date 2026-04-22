import React, { useState } from "react";
import { useGallery } from "@/features/gallery/hooks/useGallery";
import DataTable, { Column } from "@/components/shared/admin/DataTable";
import AdminFormModal from "@/components/shared/admin/AdminFormModal";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"; // ✅ Added missing toast import
import { Plus } from "lucide-react";
import { GalleryImage } from "@/types";

const AdminGallery: React.FC = () => {
  const { images, isLoading, uploadImage, deleteImage } = useGallery();
  const { toast } = useToast(); // ✅ Initialize toast

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryImage>>({});

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

  const handleAdd = () => {
    setSelectedImage(null);
    setFormData({
      imageUrl: "",
      caption: "",
      category: "ACADEMY",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (image: GalleryImage) => {
    setSelectedImage(image);
    setFormData({ ...image });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsConfirmOpen(true);
  };

const handleSave = async () => {
  try {
    if (!formData.imageUrl) return;

    // Ensure category is Uppercase to match Prisma Enums
    const payload = {
      imageUrl: formData.imageUrl,
      caption: formData.caption || "",
      category: formData.category?.toUpperCase() || "ACADEMY",
    };

    // This calls the mutation we just defined
    await uploadImage(payload as any);
    
    setIsModalOpen(false);
    setFormData({}); 
  } catch (error) {
    console.error("Save failed", error);
  }
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
          <p className="text-muted-foreground">Manage the photos displayed on your website.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
          <Plus className="h-4 w-4" />
          Add Image
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={images}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <AdminFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedImage ? "Edit Image" : "Add New Image"}
        onSave={handleSave} // ✅ This triggers the handleSave logic above
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              placeholder="Paste link here"
              value={formData.imageUrl || ""}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              placeholder="Brief description"
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
        description="Are you sure you want to delete this image?"
      />
    </div>
  );
};

export default AdminGallery;