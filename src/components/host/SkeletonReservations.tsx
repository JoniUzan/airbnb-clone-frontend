import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton"; // Assuming ShadCN has a skeleton utility

function SkeletonReservations({ count = 4 }: { count: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="mb-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-3/4" /> {/* Title placeholder */}
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-1/2" />{" "}
                {/* Description placeholder */}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" /> {/* Dates placeholder */}
            </CardContent>
            <CardFooter className="flex-col m-0 p-0 items-start">
              <Separator />
   
              <Skeleton className="h-2 w-1/4 py-2 px-3 my-2 mx-6 " />{" "}
              {/* Price placeholder */}
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default SkeletonReservations;
