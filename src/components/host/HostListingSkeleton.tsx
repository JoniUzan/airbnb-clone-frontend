// components/host/ListingSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

const HostListingSkeleton = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="p-4">
          <Skeleton className="w-full h-96 mb-4 rounded-lg" />
          <Skeleton className="w-1/2 h-6 mb-2 rounded" />
          <Skeleton className="w-1/4 h-6 rounded" />
        </div>
      ))}
    </section>
  );
};

export default HostListingSkeleton;
