import { AmenityName } from "@/pages/becomeAhostPages/SelectAmenities";
import React, { useState } from "react";


interface HomeTypeProps {
  icon: JSX.Element;
  name: AmenityName;
  setSelected: React.Dispatch<React.SetStateAction<AmenityName[]>>;
  selected: AmenityName[];
}

function Amenities({ icon, name, selected, setSelected }: HomeTypeProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);

    if (selected.includes(name)) {
      // If the item is already selected, remove it from the array
      setSelected(selected.filter((item) => item !== name));
    } else {
      // If the item is not selected, add it to the array
      setSelected([...selected, name]);
    }

    setTimeout(() => {
      setIsClicked(false);
    }, 150); // Briefly scale down
  };

  return (
    <div
      onClick={handleClick}
      className={`border lg:min-w-56 p-4 rounded-xl pt-6 space-y-2 font-[500] 
        ${
          selected.includes(name)
            ? "border-black border-[3px] bg-[#F7F7F7]"
            : "border-gray-300 hover:border-[3px] hover:border-black"
        }
        ${isClicked ? "scale-95" : ""}
        transition-transform duration-150 ease-in-out`}
    >
      <div className="w-[36px]">{icon}</div>
      <p className="text-lg">{name}</p>
    </div>
  );
}

export default Amenities;
