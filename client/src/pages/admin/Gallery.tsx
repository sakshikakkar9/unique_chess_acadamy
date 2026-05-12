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
  const [orientations, setOrientations] = useState<Record<string, 'landscape' | 'portrait' | 'square'>>({});

  const handleImageLoad = (id: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    const ratio = el.naturalWidth / el.naturalHeight;
    const o = ratio > 1.2 ? 'landscape' : ratio < 0.85 ? 'portrait' : 'square';
    setOrientations(prev => ({ ...prev, [id]: o }));
  };

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

  const getSpanStyle = (orientation: string): React.CSSProperties => {
    switch (orientation) {
      case 'landscape':
        return { gridColumn: 'span 2', gridRow: 'span 1' };
      case 'portrait':
        return { gridColumn: 'span 1', gridRow: 'span 2' };
      default:
        return { gridColumn: 'span 1', gridRow: 'span 1' };
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
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gridAutoRows: '180px',
              gridAutoFlow: 'dense',
            }}
          >
            {['landscape', 'portrait', 'square', 'square', 'landscape', 'portrait', 'portrait', 'square', 'landscape'].map((o, i) => (
              <div
                key={i}
                style={getSpanStyle(o)}
                className="rounded-xl bg-uca-bg-elevated animate-pulse"
              />
            ))}
          </div>
        ) : (
          <GalleryGrid
            images={images}
            orientations={orientations}
            onImageLoad={handleImageLoad}
            onEdit={(img) => {
              // Edit not specified in brief for gallery yet
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
