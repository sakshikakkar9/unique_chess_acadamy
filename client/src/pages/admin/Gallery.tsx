import React, { useState } from "react";
import { useAdminGallery } from "@/features/gallery/hooks/useAdminGallery";
import DataTable, { Column } from "@/components/shared/admin/DataTable";
import AdminFormModal from "@/components/shared/admin/AdminFormModal";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { GalleryImage } from "@/types";

const AdminGallery: React.FC = () => {
  const { images, isLoading, addImage, updateImage, deleteImage } = useAdminGallery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryImage>>({});

  const columns: Column<GalleryImage>[] = [
    {
      header: "Preview",
      accessorKey: "url",
      cell: (item) => (
        <div className="w-12 h-12 rounded overflow-hidden border border-border">
          <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
        </div>
      )
    },
    { header: "Alt Text", accessorKey: "alt" },
    {
      header: "Category",
      accessorKey: "category",
      cell: (item) => (
        <span className="text-xs bg-muted px-2 py-0.5 rounded">{item.category}</span>
      )
    },
  ];

  const handleAdd = () => {
    setSelectedImage(null);
    setFormData({
      url: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&q=80&w=800",
      alt: "",
      category: "Academy",
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
      if (selectedImage) {
        await updateImage(selectedImage.id, formData);
      } else {
        await addImage(formData as Omit<GalleryImage, "id">);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
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
        <Button onClick={handleAdd} className="gap-2">
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
        onSave={handleSave}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="url">Image URL</Label>
            <Input
              id="url"
              value={formData.url || ""}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              placeholder="Describe the image"
              value={formData.alt || ""}
              onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(v: GalleryImage["category"]) => setFormData({ ...formData, category: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Training">Training</SelectItem>
                <SelectItem value="Tournaments">Tournaments</SelectItem>
                <SelectItem value="Coaching">Coaching</SelectItem>
                <SelectItem value="Academy">Academy</SelectItem>
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
        description={`Are you sure you want to delete this image? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminGallery;
