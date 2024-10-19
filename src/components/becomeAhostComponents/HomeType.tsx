import { Home } from "@/layouts/BecomeAhostLayout";
import { section } from "@/pages/becomeAhostPages/SelectTypePage";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/providers/user.context"; // Assuming you have a user context


interface HomeTypeProps {
  icon: string;
  name: section;
  setSelected: React.Dispatch<React.SetStateAction<section | undefined>>;
  selected: section | undefined;
  setNewHome: React.Dispatch<React.SetStateAction<Home>>;
  newHome: Home;
}

function HomeType({
  icon,
  name,
  selected,
  setSelected,
  setNewHome,
  newHome,
}: HomeTypeProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [, setSearchParams] = useSearchParams();
  const { loggedInUser } = useAuth(); // Access loggedInUser from context

  const handleClick = () => {
    setIsClicked(true);
    setSelected(name);

    // Assuming loggedInUser has the structure { user: { ... } }
    const user = loggedInUser?.user;

    if (name && user) {
      const updatedHome = {
        ...newHome,
        type: name,
        host: {
          _id: user._id,
          fullname: `${user.firstName} ${user.lastName}`,
          imgUrl: user.picture || "", // Adjust based on your actual user object structure
          location: "", // Assuming you have this field in user object
          about: "", // Assuming you have this field in user object
          thumbnailUrl: "", // Assuming you have this field in user object
          isSuperhost: false, // Assuming you have this field in user object
        },
      };
      console.log("Updated Home:", updatedHome); // Check the updated home object
      setNewHome(updatedHome);
      localStorage.setItem("newHome", JSON.stringify(updatedHome));
    } else {
      console.error("User or name is missing. Cannot update newHome.");
    }

    setTimeout(() => {
      setIsClicked(false);
    }, 150); // Briefly scale down
    setSearchParams({ step: "selectType" });

    console.log(newHome);
  };

  return (
    <div
      onClick={handleClick}
      className={`border lg:min-w-56 p-4 rounded-xl pt-6 space-y-2 font-[500] 
        ${
          selected === name
            ? "border-black border-[3px] bg-[#F7F7F7]"
            : "border-gray-300 hover:border-[3px] hover:border-black"
        }
        ${isClicked ? "scale-95" : ""}
        transition-transform duration-150 ease-in-out`}
    >
      <img className="w-[36px]" src={icon} alt="" />
      <p>{name}</p>
    </div>
  );
}

export default HomeType;
