import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { IHome } from "@/types";
import { useNavigate } from "react-router-dom";

interface ListingCardProps {
  listing: IHome;
}

function ListingCard({ listing }: ListingCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/hostPage/editHome/${listing._id}/addPhotos`);
        localStorage.setItem("newHome", JSON.stringify(listing));
      }}
    >
      <Card className=" border-none shadow-none ">
        <CardContent className="p-0 m-0">
          <img className="rounded-2xl" src={listing.imgUrls[0]} alt="" />
        </CardContent>
        <CardFooter className="m-0 p-0 mt-3">
          <div>
            <p>{listing.name}</p>

            <p className="text-gray-400">
              {listing.loc.country} {listing.loc.city}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ListingCard;
