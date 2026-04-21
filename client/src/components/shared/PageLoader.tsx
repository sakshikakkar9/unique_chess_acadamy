import { Skeleton } from "@/components/ui/skeleton";

const PageLoader = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-40 pb-20">
        <Skeleton className="h-4 w-24 mb-6" />
        <Skeleton className="h-16 w-3/4 mb-6" />
        <Skeleton className="h-4 w-1/2 mb-12" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="aspect-square rounded-2xl" />
          <Skeleton className="aspect-square rounded-2xl" />
          <Skeleton className="aspect-square rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
