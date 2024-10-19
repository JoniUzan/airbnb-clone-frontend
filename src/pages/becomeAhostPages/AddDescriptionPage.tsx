import { Textarea } from "@/components/ui/textarea";
import { Home } from "@/layouts/BecomeAhostLayout";
import React, { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";

function AddDescriptionPage() {
  const [, setNewHome] =
    useOutletContext<[Home, React.Dispatch<React.SetStateAction<Home>>]>();

  // Initialize description with the summary from localStorage if it exists
  const [text, setText] = useState(() => {
    const localStorageHome = localStorage.getItem("newHome");
    const homeObject = localStorageHome ? JSON.parse(localStorageHome) : {};
    return homeObject?.summary || ""; // Start with the summary from localStorage, or an empty string if it doesn't exist
  });

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (text.length > 0) {
      setSearchParams({ step: "addDescription" });
    } else {
      setSearchParams({ step: "" });
    }
    handleNewHomeUpdate();
  }, [text]);

  function handleNewHomeUpdate() {
    const localStorageHome = localStorage.getItem("newHome");

    // Check if localStorageHome exists and parse it to an object
    const homeObject = localStorageHome ? JSON.parse(localStorageHome) : {};

    // Update the homeObject with the new description (summary)
    const updatedHome = {
      ...homeObject,
      summary: text,
    };

    // Update the state and localStorage
    setNewHome(updatedHome);
    localStorage.setItem("newHome", JSON.stringify(updatedHome));
  }

  return (
    <div className="h-screen flex justify-center mt-20 px-8">
      <div className="max-w-[700px] w-full space-y-6">
        <div className="pl-2 space-y-2">
          <h1 className="text-4xl font-[500]">Create your description</h1>
          <p className="text-lg text-[#9d9d9d]">
            Share what makes your place special.
          </p>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          className="w-full"
        />
        <div className="text-sm text-gray-500 font-600">{text.length}/500</div>
      </div>
    </div>
  );
}

export default AddDescriptionPage;
