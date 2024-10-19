import HomesList from "@/components/general-components/HomesList";
import GoogleMap from "@/components/googleMaps/GoogleMap";
import { fetchHomeById, fetchWishlistByName } from "@/lib/http";
import { useAuth } from "@/providers/user.context";
import { IWishlistResponse, IHome } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function WishlistDetailPage() {
  const { loggedInUser } = useAuth();
  const userId = loggedInUser?.user._id;
  const { title } = useParams();
  const Navigate = useNavigate();

  const {
    data: wishlistData,
    error: wishlistError,
    isLoading: wishlistLoading,
  } = useQuery<IWishlistResponse, Error>({
    queryKey: ["userWishlistName", userId, title],
    queryFn: () => fetchWishlistByName(userId!, title!),
    enabled: !!userId && !!title,
  });

  const {
    data: homesData,
    error: homesError,
    isLoading: homesLoading,
  } = useQuery<IHome[], Error>({
    queryKey: ["homes", wishlistData?.wishlist.list],
    queryFn: () =>
      wishlistData
        ? Promise.all(wishlistData.wishlist.list.map(fetchHomeById))
        : Promise.resolve([]),
    enabled: !!wishlistData,
  });

  const position =
    homesData &&
    homesData.length > 0 &&
    homesData[0].loc?.lat &&
    homesData[0].loc?.lan
      ? { lat: homesData[0].loc.lat, lng: homesData[0].loc.lan }
      : null;

  function handleGoBack() {
    Navigate(-1);
  }

  if (wishlistLoading || homesLoading) return <div>Loading...</div>;
  if (wishlistError)
    return <div>Error fetching wishlist: {wishlistError.message}</div>;
  if (homesError) return <div>Error fetching homes: {homesError.message}</div>;

  return (
    <>
      <ChevronLeft
        className="cursor-pointer hover:bg-gray-100 rounded-full ml-12 mt-2 mb-2"
        onClick={handleGoBack}
      />
      <h1 className="text-3xl ml-12 font-bold mt-2 mb-2">
        {wishlistData?.wishlist.title}
      </h1>
      <div className="flex">
        <HomesList
          homes={homesData}
          isLoading={homesLoading}
          totalHomes={homesData?.length}
          isHomePage={false}
          wishlistName={title}
        />
        {position && <GoogleMap homes={homesData} position={position} />}
      </div>
    </>
  );
}

export default WishlistDetailPage;
