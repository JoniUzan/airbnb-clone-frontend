import HostListingSkeleton from "@/components/host/HostListingSkeleton";
import ListingCard from "@/components/host/ListingCard";
import { Button } from "@/components/ui/button";
import { getHostListing } from "@/lib/http";
import { IHome } from "@/types";
import { useQuery } from "@tanstack/react-query";

import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HostListingPage() {
  let content;
  const navigate = useNavigate();

  //get all host reservations using react query
  const {
    data: listings,
    error: listingError,
    isLoading: listingLoading,
  } = useQuery<IHome[]>({
    queryKey: ["listing"],
    queryFn: () => getHostListing(),
  });

  if (listingLoading) {
    content = (
      <div>
        <HostListingSkeleton />
      </div>
    );
  }
  if (listingError) {
    content = <div>Error</div>;
  }
  if (listings) {
    content = (
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 ">
        {listings.map((listing) => {
          return <ListingCard key={listing._id} listing={listing} />;
        })}
      </section>
    );
  }
  return (
    <div className="p-10 sm:p-16 md:p-20">
      <header className="flex items-center justify-between">
        <h2 className="text-4xl font-500 py-8">Your listings</h2>
        <Button onClick={() => navigate("/becomeAhost")} variant={"ghost"}>
          <Plus />
        </Button>
      </header>
      {content}
    </div>
  );
}

export default HostListingPage;
