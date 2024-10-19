import Amenities from "@/components/becomeAhostComponents/Amenities";
import { Home } from "@/layouts/BecomeAhostLayout";
import {
  Wifi,
  Thermometer,
  Sun,
  Tv,
  AirVent,
  AlertCircle,
  Laptop,
  Lock,
  Bed,
  Coffee,
  Microwave,
  CookingPot,
  Accessibility,
  Hand,
  Home as HomeIcon,
  Refrigerator,
  CircleParking,
  Shirt,
  WashingMachine,
  BriefcaseMedical,
  FlameKindling,
  AlarmSmoke,
  Anvil,
  DoorClosed,
  Milk,
  Bath,
  BedDouble,
  ShowerHead,
  DoorOpen,
  Building,
  Cable,
  EthernetPort,
  Shield,
  Waves,
  Dumbbell,
  Cigarette,
  Minus,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";

export const essentialsAmenities: { name: AmenityName; icon: JSX.Element }[] = [
  { name: "Wifi", icon: <Wifi size={"36px"} /> },
  { name: "Kitchen", icon: <Refrigerator size={"36px"} /> },
  { name: "Parking", icon: <CircleParking size={"36px"} /> },
  { name: "Heating", icon: <Thermometer size={"36px"} /> },
  { name: "TV", icon: <Tv size={"36px"} /> },
  { name: "Washer", icon: <WashingMachine size={"36px"} /> },
  { name: "Dryer", icon: <WashingMachine size={"36px"} /> },
  { name: "Essentials", icon: <Sun size={"36px"} /> },
  { name: "Hangers", icon: <Shirt size={"36px"} /> },
  { name: "Air conditioning", icon: <AirVent size={"36px"} /> },
  { name: "Hair dryer", icon: <AlarmSmoke size={"36px"} /> },
  { name: "Iron", icon: <Anvil size={"36px"} /> },
  { name: "Laptop friendly workspace", icon: <Laptop size={"36px"} /> },
  { name: "Private entrance", icon: <DoorClosed size={"36px"} /> },
  { name: "Shampoo", icon: <Milk size={"36px"} /> },
  { name: "Hot water", icon: <Bath size={"36px"} /> },
  { name: "Bed linens", icon: <Bed size={"36px"} /> },
  { name: "Extra pillows and blankets", icon: <BedDouble size={"36px"} /> },
  { name: "Microwave", icon: <Microwave size={"36px"} /> },
  { name: "Coffee maker", icon: <Coffee size={"36px"} /> },
  { name: "Refrigerator", icon: <Refrigerator size={"36px"} /> },
  { name: "Dishwasher", icon: <CookingPot size={"36px"} /> },
  { name: "Cooking basics", icon: <CookingPot size={"36px"} /> },
  { name: "Oven", icon: <Microwave size={"36px"} /> },
  { name: "Stove", icon: <Microwave size={"36px"} /> },
];

export const standoutAmenities: { name: AmenityName; icon: JSX.Element }[] = [
  { name: "Wide doorway", icon: <DoorOpen size={"36px"} /> },
  { name: "Elevator", icon: <Building size={"36px"} /> },
  { name: "Wide entryway", icon: <DoorOpen size={"36px"} /> },
  { name: "Accessible-height bed", icon: <Bed size={"36px"} /> },
  { name: "Step-free access", icon: <Accessibility size={"36px"} /> },
  { name: "Accessible-height toilet", icon: <Accessibility size={"36px"} /> },
  { name: "Fixed grab bars for shower", icon: <Hand size={"36px"} /> },
  { name: "Handheld shower head", icon: <ShowerHead size={"36px"} /> },
  { name: "Lowered electrical outlets", icon: <HomeIcon size={"36px"} /> },
  { name: "Wide hallways", icon: <DoorOpen size={"36px"} /> },
  { name: "Roll-in shower", icon: <ShowerHead size={"36px"} /> },
  { name: "Braille signage", icon: <HomeIcon size={"36px"} /> },
  { name: "Internet", icon: <EthernetPort size={"36px"} /> },
  { name: "Cable TV", icon: <Cable size={"36px"} /> },
  { name: "Free street parking", icon: <CircleParking size={"36px"} /> },
  { name: "Pool", icon: <Waves size={"36px"} /> },
  { name: "Hot tub", icon: <Bath size={"36px"} /> },
  { name: "Gym", icon: <Dumbbell size={"36px"} /> },
  { name: "Smoking allowed", icon: <Cigarette size={"36px"} /> },
  { name: "Doorman", icon: <DoorClosed size={"36px"} /> },
];

export const safetyAmenities: { name: AmenityName; icon: JSX.Element }[] = [
  { name: "Smoke detector", icon: <AlertCircle size={"36px"} /> },
  { name: "First aid kit", icon: <BriefcaseMedical size={"36px"} /> },
  { name: "Fire extinguisher", icon: <FlameKindling size={"36px"} /> },
  { name: "Lock on bedroom door", icon: <Lock size={"36px"} /> },
  { name: "Safety card", icon: <Shield size={"36px"} /> },
];
export const accessibilityAmenities: {
  name: AmenityName;
  icon: JSX.Element;
}[] = [
  { name: "Step-free guest entrance", icon: <Accessibility size={"36px"} /> },
  {
    name: "Guest entrance wider than 32 inches",
    icon: <Accessibility size={"36px"} />,
  },
  { name: "Accessible parking spot", icon: <Accessibility size={"36px"} /> },
  {
    name: "Step-free path to the guest entrance",
    icon: <Accessibility size={"36px"} />,
  },
  { name: "Step-free bedroom access", icon: <Accessibility size={"36px"} /> },
  {
    name: "Bedroom entrance wider than 32 inches",
    icon: <Accessibility size={"36px"} />,
  },
  { name: "Step-free bathroom access", icon: <Accessibility size={"36px"} /> },
  {
    name: "Bathroom entrance wider than 32 inches",
    icon: <Accessibility size={"36px"} />,
  },
  { name: "Toilet grab bar", icon: <Minus size={"36px"} /> },
  { name: "Shower grab bar", icon: <Minus size={"36px"} /> },
  { name: "Step-free shower", icon: <ShowerHead size={"36px"} /> },
  { name: "Shower or bath chair", icon: <Accessibility size={"36px"} /> },
  { name: "Ceiling or mobile hoist", icon: <Accessibility size={"36px"} /> },
];

export type AmenityName =
  | "Wifi"
  | "Kitchen"
  | "Parking"
  | "Heating"
  | "Essentials"
  | "Hangers"
  | "TV"
  | "Air conditioning"
  | "Washer"
  | "Dryer"
  | "Smoke detector"
  | "First aid kit"
  | "Fire extinguisher"
  | "Hair dryer"
  | "Iron"
  | "Laptop friendly workspace"
  | "Private entrance"
  | "Shampoo"
  | "Lock on bedroom door"
  | "Hot water"
  | "Bed linens"
  | "Extra pillows and blankets"
  | "Microwave"
  | "Coffee maker"
  | "Refrigerator"
  | "Dishwasher"
  | "Cooking basics"
  | "Oven"
  | "Stove"
  | "Accessible parking spot"
  | "Step-free path to the guest entrance"
  | "Step-free bedroom access"
  | "Shower or bath chair"
  | "Wide doorway"
  | "Elevator"
  | "Wide entryway"
  | "Accessible-height bed"
  | "Step-free access"
  | "Accessible-height toilet"
  | "Fixed grab bars for shower"
  | "Handheld shower head"
  | "Lowered electrical outlets"
  | "Wide hallways"
  | "Roll-in shower"
  | "Braille signage"
  | "Internet"
  | "Cable TV"
  | "Safety card"
  | "Free street parking"
  | "Pool"
  | "Hot tub"
  | "Gym"
  | "Smoking allowed"
  | "Doorman"
  | "Step-free guest entrance"
  | "Guest entrance wider than 32 inches"
  | "Bedroom entrance wider than 32 inches"
  | "Step-free bathroom access"
  | "Bathroom entrance wider than 32 inches"
  | "Toilet grab bar"
  | "Shower grab bar"
  | "Step-free shower"
  | "Ceiling or mobile hoist";

function SelectAmenities() {
  const [, setNewHome] =
    useOutletContext<[Home, React.Dispatch<React.SetStateAction<Home>>]>();

  const [, setSearchParams] = useSearchParams();

  // Initialize selected amenities with values from localStorage or default to an empty array
  const [selected, setSelected] = useState<AmenityName[]>(() => {
    const localStorageHome = localStorage.getItem("newHome");
    const homeObject = localStorageHome ? JSON.parse(localStorageHome) : {};
    return homeObject?.amenities || [];
  });

  // Initialize accessibility amenities with values from localStorage or default to an empty array
  const [accessibilitySelected, setAccessibilitySelected] = useState<
    AmenityName[]
  >(() => {
    const localStorageHome = localStorage.getItem("newHome");
    const homeObject = localStorageHome ? JSON.parse(localStorageHome) : {};
    return homeObject?.accessibility || [];
  });

  useEffect(() => {
    setSearchParams({ step: "amenities" });
    handleNewHomeUpdate();
  }, [selected, accessibilitySelected]);

  function handleNewHomeUpdate() {
    const localStorageHome = localStorage.getItem("newHome");
    const homeObject = localStorageHome ? JSON.parse(localStorageHome) : {};

    const updatedHome = {
      ...homeObject,
      amenities: selected,
      accessibility: accessibilitySelected,
    };

    setNewHome(updatedHome);
    localStorage.setItem("newHome", JSON.stringify(updatedHome));
  }

  return (
    <div className="flex justify-center p-5 ">
      <div className="space-y-10 max-w-[720px]">
        <div className="pl-2 space-y-2">
          <h1 className="text-4xl font-[500]">
            Tell guests what your place has to offer
          </h1>
          <p className="text-lg text-[#9d9d9d]">
            You can add more amenities after you publish your listing.
          </p>
        </div>

        <h2 className="pl-2 font-500 text-xl">
          What about these guest favorites?
        </h2>
        <section className="grid md:grid-cols-3 grid-cols-2 gap-4">
          {essentialsAmenities.map((amenity, index) => (
            <Amenities
              key={index}
              selected={selected}
              setSelected={setSelected}
              icon={amenity.icon}
              name={amenity.name}
            />
          ))}
        </section>
        <h2 className="pl-2 font-500 text-xl">
          Do you have any standout amenities?
        </h2>
        <section className="grid md:grid-cols-3 grid-cols-2 gap-4">
          {standoutAmenities.map((amenity, index) => (
            <Amenities
              key={index}
              selected={selected}
              setSelected={setSelected}
              icon={amenity.icon}
              name={amenity.name}
            />
          ))}
        </section>
        <h2 className="pl-2 font-500 text-xl ">
          Do you have any of these safety items?
        </h2>
        <section className="grid md:grid-cols-3 grid-cols-2 gap-4">
          {safetyAmenities.map((amenity, index) => (
            <Amenities
              key={index}
              selected={selected}
              setSelected={setSelected}
              icon={amenity.icon}
              name={amenity.name}
            />
          ))}
        </section>
        <h2 className="pl-2 font-500 text-xl ">
          Do you have any of these Accessibility features?
        </h2>
        <section className="grid md:grid-cols-3 grid-cols-2 gap-4">
          {accessibilityAmenities.map((amenity, index) => (
            <Amenities
              key={index}
              selected={accessibilitySelected}
              setSelected={setAccessibilitySelected}
              icon={amenity.icon}
              name={amenity.name}
            />
          ))}
        </section>
      </div>
    </div>
  );
}

export default SelectAmenities;
