import HomeType from "@/components/becomeAhostComponents/HomeType";
import { Home } from "@/layouts/BecomeAhostLayout";
import React, { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";

const types: { icon: string; name: section }[] = [
  {
    icon: "https://a0.muscache.com/im/pictures/mediaverse/category_icon/original/3e5243c8-4d15-4c6b-97e3-7ba2bb7bb880.png",
    name: "Icons",
  },
  {
    icon: "https://a0.muscache.com/pictures/c0a24c04-ce1f-490c-833f-987613930eca.jpg",
    name: "National Parks",
  },
  {
    icon: "https://a0.muscache.com/pictures/3b1eb541-46d9-4bef-abc4-c37d77e3c21b.jpg",
    name: "Amazing Views",
  },
  {
    icon: "https://a0.muscache.com/pictures/c8e2ed05-c666-47b6-99fc-4cb6edcde6b4.jpg",
    name: "Luxe",
  },
  {
    icon: "https://a0.muscache.com/pictures/677a041d-7264-4c45-bb72-52bff21eb6e8.jpg",
    name: "Lakefront",
  },
  {
    icon: "https://a0.muscache.com/pictures/50861fca-582c-4bcc-89d3-857fb7ca6528.jpg",
    name: "Design",
  },
  {
    icon: "https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg",
    name: "Amazing Pools",
  },
  {
    icon: "https://a0.muscache.com/pictures/c5a4f6fc-c92c-4ae8-87dd-57f1ff1b89a6.jpg",
    name: "OMG!",
  },
  {
    icon: "https://a0.muscache.com/pictures/732edad8-3ae0-49a8-a451-29a8010dcc0c.jpg",
    name: "Cabins",
  },
  {
    icon: "https://a0.muscache.com/pictures/bcd1adc0-5cee-4d7a-85ec-f6730b0f8d0c.jpg",
    name: "Beachfront",
  },
  {
    icon: "https://a0.muscache.com/pictures/31c1d523-cc46-45b3-957a-da76c30c85f9.jpg",
    name: "Campers",
  },
  {
    icon: "https://a0.muscache.com/pictures/8e507f16-4943-4be9-b707-59bd38d56309.jpg",
    name: "Islands",
  },
  {
    icon: "https://a0.muscache.com/pictures/10ce1091-c854-40f3-a2fb-defc2995bcaf.jpg",
    name: "Beach",
  },
  {
    icon: "https://a0.muscache.com/pictures/ca25c7f3-0d1f-432b-9efa-b9f5dc6d8770.jpg",
    name: "Camping",
  },
  {
    icon: "https://a0.muscache.com/pictures/a6dd2bae-5fd0-4b28-b123-206783b5de1d.jpg",
    name: "Desert",
  },
  {
    icon: "https://a0.muscache.com/pictures/8b44f770-7156-4c7b-b4d3-d92549c8652f.jpg",
    name: "Arctic",
  },
  {
    icon: "https://a0.muscache.com/pictures/3271df99-f071-4ecf-9128-eb2d2b1f50f0.jpg",
    name: "Tiny homes",
  },
  {
    icon: "https://a0.muscache.com/pictures/957f8022-dfd7-426c-99fd-77ed792f6d7a.jpg",
    name: "Surfing",
  },
  {
    icon: "https://a0.muscache.com/pictures/1d477273-96d6-4819-9bda-9085f809dad3.jpg",
    name: "A-frames",
  },
  {
    icon: "https://a0.muscache.com/pictures/ee9e2a40-ffac-4db9-9080-b351efc3cfc4.jpg",
    name: "Tropical",
  },
  {
    icon: "https://a0.muscache.com/pictures/4221e293-4770-4ea8-a4fa-9972158d4004.jpg",
    name: "Caves",
  },
  {
    icon: "https://a0.muscache.com/pictures/6b639c8d-cf9b-41fb-91a0-91af9d7677cc.jpg",
    name: "Golfing",
  },
  {
    icon: "https://a0.muscache.com/pictures/5ed8f7c7-2e1f-43a8-9a39-4edfc81a3325.jpg",
    name: "Bed & breakfast",
  },
  {
    icon: "https://a0.muscache.com/pictures/d7445031-62c4-46d0-91c3-4f29f9790f7a.jpg",
    name: "Earth homes",
  },
  {
    icon: "https://a0.muscache.com/pictures/33dd714a-7b4a-4654-aaf0-f58ea887a688.jpg",
    name: "Historical homes",
  },
  {
    icon: "https://a0.muscache.com/pictures/60ff02ae-d4a2-4d18-a120-0dd274a95925.jpg",
    name: "Vineyards",
  },
];
export type section =
  | "Icons"
  | "National Parks"
  | "Amazing Views"
  | "Luxe"
  | "Lakefront"
  | "Design"
  | "Amazing Pools"
  | "OMG!"
  | "Cabins"
  | "Beachfront"
  | "Campers"
  | "Islands"
  | "Beach"
  | "Camping"
  | "Desert"
  | "Arctic"
  | "Tiny homes"
  | "Surfing"
  | "A-frames"
  | "Tropical"
  | "Caves"
  | "Golfing"
  | "Bed & breakfast"
  | "Earth homes"
  | "Historical homes"
  | "Vineyards";

function SelectTypePage() {
  const [newHome, setNewHome] =
    useOutletContext<[Home, React.Dispatch<React.SetStateAction<Home>>]>();

  const [selected, setSelected] = useState<section | undefined>(undefined);

  const [, setSearchParams] = useSearchParams();
  useEffect(() => {
    setSearchParams({ step: "" });

    // Retrieve the stored newHome from localStorage
    const localStorageHome = localStorage.getItem("newHome");

    if (localStorageHome) {
      // Parse the localStorageHome string into a JavaScript object
      const updetedHome = JSON.parse(localStorageHome) as Home;

      // Check if there is a type already selected in the stored home object
      if (updetedHome && updetedHome.type) {
        setSelected(updetedHome.type as section); // Assuming 'type' is the property for home type
        setSearchParams({ step: "selectType" });
      }
    }
  }, []);
  console.log(selected);

  return (
    <div className="flex justify-center px-8 pb-2">
      <div className="space-y-10">
        <h1 className="text-center text-3xl font-[600]">
          Which of these best describes your place?
        </h1>
        <section className="grid md:grid-cols-3 grid-cols-2 gap-4">
          {types.map((type, index) => (
            <HomeType
              key={index}
              selected={selected}
              setSelected={setSelected}
              icon={type.icon}
              name={type.name}
              setNewHome={setNewHome}
              newHome={newHome}
            />
          ))}
        </section>
      </div>
    </div>
  );
}

export default SelectTypePage;
