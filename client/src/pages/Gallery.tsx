import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/shared/PageHeader";
import GalleryItem from "@/features/gallery/components/GalleryItem";
import { useGallery } from "@/features/gallery/hooks/useGallery";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  const { images, filter, setFilter, categories } = useGallery();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        label="Gallery"
        title={
          <>
            Moments of <span className="text-gradient-gold">Excellence</span>
          </>
        }
      />

      <section className="section-padding pt-0">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  filter === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary/50 text-muted-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, i) => (
              <GalleryItem key={img.id} image={img} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
