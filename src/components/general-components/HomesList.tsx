import { IHome } from "@/types";
import { Star } from "lucide-react";
import HomeCarousel from "./HomeCarousel";
import { calculateOverallAverageRating, updateSearchParams } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import Pagination from "./Pagination";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCurrency } from "@/providers/CurrencyContext";

type HomesListProps = {
  homes: IHome[] | undefined; // Define homes as an array of IHome objects
  isLoading: boolean;
  totalHomes: number | undefined;
  isHomePage: boolean;
  wishlistName: string | undefined;
};

function HomesList({
  homes,
  isLoading,
  totalHomes,
  isHomePage,
  wishlistName,
}: HomesListProps) {
  const { currency,  } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);
  const homesPerPage = 18;
  const [searchParams, setSearchParams] = useSearchParams();
  const paginate = (pageNumber: number) => {
    const params: Record<string, string> = {};
    params.page = String(pageNumber);
    updateSearchParams(params, searchParams, setSearchParams);
    setCurrentPage(pageNumber);
  };

  if (!homes) {
    return <p>No homes found.</p>;
  }

  if (isLoading) {
    return (
      <div className="w-full flex justify-between min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 ml-16">
          {Array.from({ length: 18 }, (_, index) => (
            <div key={index}>
              <Skeleton className="h-[270px] w-[270px] rounded-xl mb-2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-[200px] mb-1" />
                <Skeleton className="h-5 w-[30px]" />
              </div>
              <Skeleton className="h-5 w-[150px] mb-2" />
              <Skeleton className="h-5 w-[100px] mb-1" />
            </div>
          ))}
        </div>
        <Skeleton className="w-[37%] h-[80vh] sticky top-40" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-evenly mx-8 lg:ml-8 lg:mr-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 ">
        {homes?.map((home) => (
          <div key={home._id} className="">
            <HomeCarousel
              images={home.imgUrls}
              name={home.name}
              homeId={home._id}
              isHomePage={isHomePage}
              wishlistName={wishlistName}
            />
            <div className="flex justify-between">
              <p className="font-600 text-[14px]">{home.loc.address}</p>
              <div className="flex items-center gap-1">
                <Star fill="black" width="14px" />
                {home.reviews.length > 0 ? (
                  <p className="text-xs font-500">
                    {calculateOverallAverageRating(home.reviews)}
                  </p>
                ) : (
                  <p className="">New</p>
                )}
              </div>
            </div>
            <p className="font-500 text-[14px] text-gray-500 pb-2">
              {home.bedrooms} bedrooms
            </p>
            <p className="font-600">
              {currency === "USD"
                ? `$${home.price}`
                : `₪${Math.round(home.price * 3.7)}`}{" "}
              night
            </p>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalHomes={totalHomes}
        homesPerPage={homesPerPage}
        paginate={paginate}
      />
    </div>
  );
}

export default HomesList;
