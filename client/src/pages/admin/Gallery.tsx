import React, { useState } from "react";
import { useGallery } from "@/features/gallery/hooks/useGallery";
import AdminShell from "@/components/admin/AdminShell";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import GalleryGrid from "@/components/admin/GalleryGrid";
import GalleryUploadModal from "@/components/admin/GalleryUploadModal";
import { GalleryImage } from "@/types";
import { useToast } from "@/hooks/useToast";

const AdminGallery: React.FC = () => {
  const { images, isLoading, uploadImage, deleteImage } = useGallery();
  const { success, error: toastError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleUpload = async (data: FormData) => {
    try {
      await uploadImage(data as any);
      success("Image uploaded successfully!");
    } catch (error) {
      toastError("Upload Failed");
    }
  };

  const handleDelete = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!selectedImage) return;
    setIsDeleting(true);
    try {
      await deleteImage(selectedImage.id);
      success("Image removed");
      setIsConfirmOpen(false);
    } catch (err) {
      toastError("Failed to delete image");
    } finally {
      setIsDeleting(false);
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
          <div className="grid gap-3 [grid-auto-flow:dense] [grid-template-columns:repeat(2,1fr)] sm:[grid-template-columns:repeat(3,1fr)] lg:[grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={i % 3 === 0
                  ? { gridColumn: 'span 2', gridRow: 'span 1' }
                  : { gridColumn: 'span 1', gridRow: 'span 2' }}
                className="rounded-xl bg-uca-bg-elevated animate-pulse min-h-[120px]"
              />
            ))}
          </div>
        ) : (
          <GalleryGrid
            images={images}
            onEdit={(img) => {
              // Edit not specified in brief for gallery yet, but hook up to modal if needed
              // For now, only delete is wired in gridcard
            }}
            onDelete={handleDelete}
          />
        )}
      </div>

      <GalleryUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        isLoading={isDeleting}
        title="Delete Image"
        description="This will permanently remove the photo from the gallery."
      />
    </AdminShell>
  );
};

export default AdminGallery;
