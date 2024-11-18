import BecomeAhostFooter from "@/components/becomeAhostComponents/BecomeAhostFooter";
import BecomeAhostHeader from "@/components/becomeAhostComponents/BecomeAhostHeader";

import { IHome } from "@/types";
import { useState } from "react";

import { Outlet } from "react-router-dom";
export type Home = Omit<IHome, "_id">;

function BecomeAhostLayout() {
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
      <div>
        <BecomeAhostHeader />
        <Outlet context={[newHome, setNewHome]} />
        <BecomeAhostFooter />
      </div>
    </>
  );
}

export default BecomeAhostLayout;
