import { useState, useEffect } from "react";
import { fetchHomeById, fetchUserWishlists } from "@/lib/http";
import { useAuth } from "@/providers/user.context";
import { IWishlist, IHome, IWishlistResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

function WishlistPage() {
  const { loggedInUser } = useAuth();
  const userId = loggedInUser?.user._id;

  // State to hold home data
  const [homeData, setHomeData] = useState<{ [key: string]: IHome }>({});

  // Fetch user wishlists
  const { data, error, isLoading } = useQuery<IWishlistResponse, Error>({
    queryKey: ["userWishlists", userId],
    queryFn: () => fetchUserWishlists(userId),
    enabled: !!userId,
  });

  const userWishlists = data?.wishlists || [];

  useEffect(() => {
    // Function to fetch home details for all item IDs
    const fetchHomes = async () => {
      const homes: { [key: string]: IHome } = {};
      for (const wishlist of userWishlists) {
        const firstItemId = wishlist.list[0]; // Take the first item in the list
        if (firstItemId && !homes[firstItemId]) {
          try {
            const home = await fetchHomeById(firstItemId);
            homes[firstItemId] = home;
          } catch (err) {
            console.error(`Failed to fetch home with ID ${firstItemId}:`, err);
          }
        }
      }
      setHomeData(homes);
    };

    fetchHomes();
  }, [userWishlists]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading wishlists: {error.message}</div>;
  }

  if (!userWishlists || userWishlists.length === 0) {
    return <div>NO WISHLIST FOUND</div>;
  }

  return (
    <>
      <div className="mx-24">
        <h1 className="text-3xl font-bold font-montserrat mb-4">Wishlists</h1>

        <div className="grid grid-cols-4 font-montserrat">
          {userWishlists.map((wishlist: IWishlist) => {
            // Use the first item from the wishlist
            const firstItemId = wishlist.list[0];
            const home = homeData[firstItemId];

            return (
              <Link to={wishlist.title} key={wishlist.title}>
                <div className="cursor-pointer">
                  <div>
                    {home?.imgUrls.length > 0 ? (
                      <img
                        loading="lazy"
                        src={home.imgUrls[0]}
                        alt={home.name}
                        className="w-[280px] h-[280px] border-4 border-white shadow-xl rounded-3xl"
                      />
                    ) : (
                      <div>No images available</div>
                    )}
                  </div>
                  <h2 className="font-500 mt-2">
                    {wishlist.title.length > 20
                      ? `${wishlist.title.slice(0, 20)}...`
                      : wishlist.title}
                  </h2>
                  <h2 className="font-500 mt-1 text-gray-500 text-xs">
                    {wishlist.list.length} saved
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default WishlistPage;
