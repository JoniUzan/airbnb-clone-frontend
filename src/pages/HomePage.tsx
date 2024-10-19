import FilterModal from "@/components/general-components/FilterComponent";
import HomesList from "@/components/general-components/HomesList";
import SearchComponent from "@/components/general-components/SearchComponent";
import GoogleMap from "@/components/googleMaps/GoogleMap";

import { fetchHomeCountByFilers, fetchHomes } from "@/lib/http";
import { IHome, QueryFilter } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "react-day-picker";
import { useSearchParams } from "react-router-dom";

function HomePage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultFilters: QueryFilter = {
    type: undefined,
    roomType: undefined,
    InstantBook: undefined,
    SelfCheckIn: undefined,
    AllowsPets: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    beds: undefined,
    bathrooms: undefined,
    hostLanguage: undefined,
    amenities: undefined,
    capacity: undefined,
    accessibility: undefined,
    location: undefined,
    startDate: undefined,
    endDate: undefined,
  };

  const [filters, setFilters] = useState<QueryFilter>(defaultFilters);

  // Effect to update filters when searchParams change
  useEffect(() => {
    const newFilters = {
      ...defaultFilters,
      ...Object.fromEntries(searchParams.entries()),
    };
    setFilters(newFilters);
  }, [searchParams]);

  const { data: homes = [], isLoading } = useQuery<IHome[]>({
    queryKey: ["homes", filters],
    queryFn: () => fetchHomes(filters),
  });

  const { data: totalHomes } = useQuery<number | undefined>({
    queryKey: ["totalHomes", filters],
    queryFn: () => fetchHomeCountByFilers(filters),
  });

  const position = homes.length > 0 && {
    lat: homes[0].loc.lat,
    lng: homes[0].loc.lan,
  };

  return (
    <>
      <div className="flex justify-center items-center gap-2 bg-white sticky top-[170px] md:top-[110px] pt-3 mt-0 z-40 border-b-[1px] border-gray-200 mx-4">
        <SearchComponent
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
        <Button
          onClick={() => setModalOpen(true)}
          className="border-[1px] border-gray-300 flex gap-2 p-4 rounded-xl text-xs items-center font-500 hover:border-black hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            style={{
              display: "block",
              fill: "none",
              height: "16px",
              width: "16px",
              stroke: "currentColor",
              strokeWidth: 3,
              overflow: "visible",
            }}
          >
            <path
              fill="none"
              d="M7 16H3m26 0H15M29 6h-4m-8 0H3m26 20h-4M7 16a4 4 0 1 0 8 0 4 4 0 0 0-8 0zM17 6a4 4 0 1 0 8 0 4 4 0 0 0-8 0zm0 20a4 4 0 1 0 8 0 4 4 0 0 0-8 0zm0 0H3"
            ></path>
          </svg>
          <span className="hidden md:inline">Filters</span>
        </Button>
        <FilterModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          initialFilters={defaultFilters}
        />
      </div>
      <div className="flex gap-10">
        <HomesList
          homes={homes}
          isLoading={isLoading}
          totalHomes={totalHomes}
          isHomePage={true}
          wishlistName=""
        />
        {position && <GoogleMap homes={homes} position={position} />}
      </div>
    </>
  );
}

export default HomePage;
