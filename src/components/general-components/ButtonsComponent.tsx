import { QueryFilter } from "@/types";
import React, { useEffect, useState } from "react";

interface ButtonsProps {
  setFilters: React.Dispatch<React.SetStateAction<QueryFilter>>;
  filterType: keyof QueryFilter;
  resetFilters: boolean;
  setIsResetFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

const Buttons: React.FC<ButtonsProps> = ({
  setFilters,
  filterType,
  resetFilters,
  setIsResetFilters,
}) => {
  const buttons: string[] = ["Any", "1", "2", "3", "4", "5", "6", "7", "8+"];

  const [chosenButton, setChosenButton] = useState<string>(buttons[0]);

  useEffect(() => {
    if (resetFilters) {
      setChosenButton(buttons[0]);
      handleClick("Any");
    }

    return () => setIsResetFilters(false);
  }, [resetFilters, buttons]);

  const handleClick = (value: string): void => {
    let newValue = value === "Any" ? undefined : value;
    setChosenButton(value);

    if (newValue === "8+") {
      newValue = "8";
    }
    setFilters((prevFilters: QueryFilter) => ({
      ...prevFilters,
      [filterType]: newValue,
    }));
  };

  return (
    <div className="flex gap-2">
      {buttons.map((button, index) => (
        <button
          key={index}
          aria-pressed={chosenButton === button}
          className={`px-4 py-2 rounded-full w-14 transition duration-150 ease-in-out text-xs ${
            chosenButton === button
              ? "bg-black text-white"
              : "bg-white border-[1px] border-gray-200 hover:border-black"
          }`}
          onClick={() => handleClick(button)}
        >
          {button}
        </button>
      ))}
    </div>
  );
};

export default Buttons;
