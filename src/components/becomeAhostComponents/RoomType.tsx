import { Home } from "@/layouts/BecomeAhostLayout";
import { selection } from "@/pages/becomeAhostPages/SelectRoomTypePage";
import React from "react";
import { useSearchParams } from "react-router-dom";

interface RoomTypeProps {
  selected: selection;
  setSelected: React.Dispatch<React.SetStateAction<selection>>;
  icon: JSX.Element;
  name: selection;
  description: string;
  setNewHome: React.Dispatch<React.SetStateAction<Home>>;
  newHome: Home;
}

function RoomType({
  selected,
  setSelected,
  icon,
  name,
  description,
  setNewHome,
  newHome,
}: RoomTypeProps) {

  const [, setSearchParams] = useSearchParams();

  const handleClick = () => {
    setSelected(name);
    setSearchParams({ step: "selectRoomType" });

    if (name) {
      const localStorageHome = localStorage.getItem("newHome");

      // Check if localStorageHome exists and parse it to an object
      const homeObject = localStorageHome ? JSON.parse(localStorageHome) : {};

      // Update the homeObject with the new roomType
      const updatedHome = { ...homeObject, roomType: name };

      // Update the state and localStorage
      setNewHome(updatedHome);
      localStorage.setItem("newHome", JSON.stringify(updatedHome));
    }
    console.log(newHome);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex justify-between items-center border lg:min-w-56 p-4 rounded-xl pt-6 space-y-2 font-[500] 
          ${
            selected === name
              ? "border-black border-[3px] bg-[#F7F7F7]"
              : "border-gray-300 hover:border-[3px] hover:border-black"
          }
         
          transition-transform duration-150 ease-in-out`}
    >
      <div>
        <p className="text-xl font-[500]">{name}</p>
        <p className="text-[#9D9D9D]">{description}</p>
      </div>
      <div className="pb-4">{icon}</div>
    </div>
  );
}
export default RoomType;
