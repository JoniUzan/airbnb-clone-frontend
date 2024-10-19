import HomeType from "@/components/becomeAhostComponents/HomeType";
import { Home } from "@/layouts/BecomeAhostLayout";
import React, { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";

const types: { icon: string; name: section }[] = [
  {
    icon: "https://a0.muscache.com/pictures/f60700bc-8ab5-424c-912b-6ef17abc479a.jpg",
    name: "Barn",
  },
  {
    icon: "https://a0.muscache.com/pictures/5ed8f7c7-2e1f-43a8-9a39-4edfc81a3325.jpg",
    name: "Bed & breakfast",
  },
  {
    icon: "https://a0.muscache.com/pictures/687a8682-68b3-4f21-8d71-3c3aef6c1110.jpg",
    name: "Boat",
  },

  {
    icon: "https://a0.muscache.com/pictures/732edad8-3ae0-49a8-a451-29a8010dcc0c.jpg",
    name: "Cabins",
  },
  {
    icon: "https://a0.muscache.com/pictures/251c0635-cc91-4ef7-bb13-1084d5229446.jpg",
    name: "Casas particulares",
  },
  {
    icon: "https://a0.muscache.com/pictures/1b6a8b70-a3b6-48b5-88e1-2243d9172c06.jpg",
    name: "Castle",
  },
  {
    icon: "https://a0.muscache.com/pictures/4221e293-4770-4ea8-a4fa-9972158d4004.jpg",
    name: "Caves",
  },
  {
    icon: "https://a0.muscache.com/pictures/0ff9740e-52a2-4cd5-ae5a-94e1bfb560d6.jpg",
    name: "Containers",
  },
  {
    icon: "https://a0.muscache.com/pictures/e4b12c1b-409b-4cb6-a674-7c1284449f6e.jpg",
    name: "Cycladic homes",
  },
  {
    icon: "https://a0.muscache.com/pictures/c9157d0a-98fe-4516-af81-44022118fbc7.jpg",
    name: "Dammusos",
  },
  {
    icon: "https://a0.muscache.com/pictures/89faf9ae-bbbc-4bc4-aecd-cc15bf36cbca.jpg",
    name: "Domes",
  },
  {
    icon: "https://a0.muscache.com/pictures/d7445031-62c4-46d0-91c3-4f29f9790f7a.jpg",
    name: "Earth homes",
  },
  {
    icon: "https://a0.muscache.com/pictures/aaa02c2d-9f0d-4c41-878a-68c12ec6c6bd.jpg",
    name: "Farm",
  },
  {
    icon: "https://a0.muscache.com/pictures/c027ff1a-b89c-4331-ae04-f8dee1cdc287.jpg",
    name: "Houseboats",
  },

  {
    icon: "https://a0.muscache.com/pictures/7ff6e4a1-51b4-4671-bc9a-6f523f196c61.jpg",
    name: "Riads",
  },
  {
    icon: "https://a0.muscache.com/pictures/827c5623-d182-474a-823c-db3894490896.jpg",
    name: "Ryokans",
  },
  {
    icon: "https://a0.muscache.com/pictures/747b326c-cb8f-41cf-a7f9-809ab646e10c.jpg",
    name: "Shepherd’s huts",
  },
  {
    icon: "https://a0.muscache.com/pictures/3271df99-f071-4ecf-9128-eb2d2b1f50f0.jpg",
    name: "Tiny homes",
  },
  {
    icon: "https://a0.muscache.com/pictures/d721318f-4752-417d-b4fa-77da3cbc3269.jpg",
    name: "Tower",
  },
  {
    icon: "https://a0.muscache.com/pictures/4d4a4eba-c7e4-43eb-9ce2-95e1d200d10e.jpg",
    name: "Treehouses",
  },
  {
    icon: "https://a0.muscache.com/pictures/33848f9e-8dd6-4777-b905-ed38342bacb9.jpg",
    name: "Trulli",
  },
  {
    icon: "https://a0.muscache.com/pictures/5cdb8451-8f75-4c5f-a17d-33ee228e3db8.jpg",
    name: "Windmill",
  },
  {
    icon: "https://a0.muscache.com/pictures/4759a0a7-96a8-4dcd-9490-ed785af6df14.jpg",
    name: "Yurts",
  },
];
export type section =
  | "Barn"
  | "Bed & breakfast"
  | "Boat"
  | "Cabins"
  | "Casas particulares"
  | "Castle"
  | "Caves"
  | "Containers"
  | "Cycladic homes"
  | "Dammusos"
  | "Domes"
  | "Earth homes"
  | "Farm"
  | "Houseboats"
  | "Riads"
  | "Ryokans"
  | "Shepherd’s huts"
  | "Tiny homes"
  | "Tower"
  | "Treehouses"
  | "Trulli"
  | "Windmill"
  | "Yurts";

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
