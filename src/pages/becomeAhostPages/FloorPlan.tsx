import { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import Card from "@/components/general-components/GuestCard";
import { Home } from "@/layouts/BecomeAhostLayout";

type FloorPlan = "Guests" | "Bedrooms" | "Beds" | "Bathrooms";

function FloorPlan() {
  const [, setNewHome] =
    useOutletContext<[Home, React.Dispatch<React.SetStateAction<Home>>]>();
  const [, setSearchParams] = useSearchParams();

  // Initialize guestCounts with values from localStorage or default values
  const [guestCounts, setGuestCounts] = useState(() => {
    const localStorageHome = localStorage.getItem("newHome");
    const homeObject = localStorageHome ? JSON.parse(localStorageHome) : null;

    return {
      Guests: homeObject?.capacity || 1,
      Bedrooms: homeObject?.bedrooms || 0,
      Beds: homeObject?.beds || 1,
      Bathrooms: homeObject?.bathrooms || 1,
    };
  });

  useEffect(() => {
    setSearchParams({ step: "floorPlan" });
    handleNewHomeUpdate();
  }, [guestCounts]);

  function handleNewHomeUpdate() {
    const localStorageHome = localStorage.getItem("newHome");

    // Check if localStorageHome exists and parse it to an object
    const homeObject = localStorageHome ? JSON.parse(localStorageHome) : {};

    // Update the homeObject with the new roomType
    const updatedHome = {
      ...homeObject,
      capacity: guestCounts.Guests,
      bedrooms: guestCounts.Bedrooms,
      bathrooms: guestCounts.Bathrooms,
      beds: guestCounts.Beds,
    };

    // Update the state and localStorage
    setNewHome(updatedHome);
    localStorage.setItem("newHome", JSON.stringify(updatedHome));
  }

  const handleIncrement = (key: FloorPlan) => {
    setGuestCounts((prevCounts) => {
      return {
        ...prevCounts,
        [key]: prevCounts[key] + 1,
      };
    });
  };

  const handleDecrement = (key: FloorPlan) => {
    if (guestCounts.Guests === 1 && key === "Guests") return;
    if (guestCounts.Beds === 1 && key === "Beds") return;
    if (guestCounts.Bathrooms === 1 && key === "Bathrooms") return;
    setGuestCounts((prevCounts) => {
      return {
        ...prevCounts,
        [key]: prevCounts[key] > 0 ? prevCounts[key] - 1 : 0,
      };
    });
  };

  return (
    <div className="flex flex-col justify-center  h-screen max-w-[740px] mx-auto pb-[400px] p-6">
      <div className="pl-3 space-y-2">
        <h1 className="text-3xl font-[500]">
          Share some basics about your place
        </h1>
        <p className="text-lg text-[#9d9d9d] mb-8">
          You'll add more details later, like bed types.
        </p>
      </div>

      <div className="border-b py-2">
        <Card
          title="Guests"
          paragraph=""
          count={guestCounts.Guests}
          onIncrement={() => handleIncrement("Guests")}
          onDecrement={() => handleDecrement("Guests")}
        />
      </div>
      <div className="border-b py-2">
        <Card
          title="Bedrooms"
          paragraph=""
          count={guestCounts.Bedrooms}
          onIncrement={() => handleIncrement("Bedrooms")}
          onDecrement={() => handleDecrement("Bedrooms")}
        />
      </div>
      <div className="border-b py-2">
        <Card
          title="Beds"
          paragraph=""
          count={guestCounts.Beds}
          onIncrement={() => handleIncrement("Beds")}
          onDecrement={() => handleDecrement("Beds")}
        />
      </div>
      <div className="border-b py-2">
        <Card
          title="Bathrooms"
          paragraph=""
          count={guestCounts.Bathrooms}
          onIncrement={() => handleIncrement("Bathrooms")}
          onDecrement={() => handleDecrement("Bathrooms")}
        />
      </div>
    </div>
  );
}

export default FloorPlan;
