import BookType from "@/components/becomeAhostComponents/BookType";
import { Home } from "@/layouts/BecomeAhostLayout";
import { MessageSquareText, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";

interface BookTypeData {
  icon: JSX.Element;
  name: selection;
  description: string;
}

const roomType: BookTypeData[] = [
  {
    icon: <Zap size={"40px"} strokeWidth={1} />,
    name: "Use Instant Book",
    description: "Guests can book automatically.",
  },
  {
    icon: <MessageSquareText size={"40px"} strokeWidth={1} />,
    name: "Approve or decline requests",
    description: "Guests must ask if they can book.",
  },
];

export type selection =
  | "Use Instant Book"
  | "Approve or decline requests"
  | undefined;

function SelectBookType() {
  const [, setNewHome] =
    useOutletContext<[Home, React.Dispatch<React.SetStateAction<Home>>]>();

  // Initialize selected booking option from localStorage if it exists
  const [selected, setSelected] = useState<selection>(() => {
    const localStorageHome = localStorage.getItem("newHome");
    const homeObject = localStorageHome ? JSON.parse(localStorageHome) : {};
    return homeObject?.bookingOptions?.InstantBook
      ? "Use Instant Book"
      : "Approve or decline requests";
  });

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams({ step: "bookType" });
  }, [setSearchParams]);

  useEffect(() => {
    // When selected changes, update localStorage and newHome state
    handleNewHomeUpdate(selected);
  }, [selected]);

  function handleNewHomeUpdate(selection: selection) {
    const localStorageHome = localStorage.getItem("newHome");

    // Check if localStorageHome exists and parse it to an object
    const homeObject = localStorageHome ? JSON.parse(localStorageHome) : {};

    let updatedHome = {
      ...homeObject,
      bookingOptions: {
        ...homeObject.bookingOptions, // Ensure the previous bookingOptions are preserved
        InstantBook: selection === "Use Instant Book",
      },
    };

    // Update the state and localStorage
    setNewHome(updatedHome);
    localStorage.setItem("newHome", JSON.stringify(updatedHome));
  }

  return (
    <div className="flex justify-center h-screen pt-20 px-8">
      <div className="space-y-10">
        <h1 className="text-left text-3xl font-[600]">
          Decide how you’ll confirm reservations
        </h1>
        <section className="grid gap-4">
          {roomType.map((type, index) => (
            <BookType
              key={index}
              selected={selected}
              setSelected={setSelected}
              icon={type.icon}
              name={type.name}
              description={type.description}
              handleNewHomeUpdate={handleNewHomeUpdate}
            />
          ))}
        </section>
      </div>
    </div>
  );
}

export default SelectBookType;
