import GoogleMapSkeleton from "@/components/general-components/GoogleMapSkeleton";
import { Skeleton } from "../ui/skeleton";

function HomeListSkeleton() {
  return (
    <div className="w-full min-h-screen lg:flex ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:w-[60%] mx-8 mt-8 ">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="relative">
              <Skeleton className="w-full xl:h-[270px] lg:h-[340px] md:h-[400px] sm:h-[400px] h-[350px] rounded-lg" />
            </div>
            <div className="flex justify-between mt-2">
              <Skeleton className="w-2/5 h-4" />
              <div className="flex items-center gap-1">
                <Skeleton className="w-4 h-4 rounded-full" />
              </div>
            </div>
            <Skeleton className="w-3/5 h-4 mt-2" />
            <Skeleton className="w-1/3 h-4 mt-2" />
          </div>
        ))}
      </div>
      <div className=" lg:w-[40%] ">
        <GoogleMapSkeleton />
      </div>
    </div>
  );
}

export default HomeListSkeleton;
