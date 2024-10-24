import { Skeleton } from "@/components/ui/skeleton";

export default function GoogleMapSkeleton() {
  return (
    <div
      className="h-[75vh] sticky top-[200px] hidden sm:hidden md:hidden lg:block w-full"
    >
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
  );
}
