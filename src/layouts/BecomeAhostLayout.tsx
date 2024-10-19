import BecomeAhostFooter from "@/components/becomeAhostComponents/BecomeAhostFooter";
import BecomeAhostHeader from "@/components/becomeAhostComponents/BecomeAhostHeader";
import Modal from "@/components/general-components/LoginModalComponent";
import { useAuth } from "@/providers/user.context";
import { IHome } from "@/types";
import { useState } from "react";

import { Outlet } from "react-router-dom";
export type Home = Omit<IHome, "_id">;

function BecomeAhostLayout() {
  const { loggedInUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const [newHome, setNewHome] = useState<Home>({
    name: "",
    type: "string",
    capacity: 0,
    imgUrls: [],
    price: 0,
    summary: "",
    amenities: [],
    bathrooms: 0,
    bedrooms: 0,
    beds: 0,
    roomType: "",
    host: {
      _id: "",
      fullname: "",
      location: "",
      about: "",
      thumbnailUrl: "",
      imgUrl: "",
      isSuperhost: false,
    },
    loc: {
      country: "",
      countryCode: "",
      city: "",
      address: "",
      lat: 0,
      lan: 0,
    },
    reviews: [],
    likedByUsers: [],
    bookingOptions: {
      InstantBook: false,
      SelfCheckIn: true,
      AllowsPets: true,
    },
    accessibility: [],
  });

  return (
    <>
      {loggedInUser ? (
        <div>
          <BecomeAhostHeader />
          <Outlet context={[newHome, setNewHome]} />
          <BecomeAhostFooter />
        </div>
      ) : (
        <Modal isOpen={true} onClose={() => setIsOpen(!isOpen)} />
      )}
    </>
  );
}

export default BecomeAhostLayout;
