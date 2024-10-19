import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Home } from "@/layouts/BecomeAhostLayout";
import { useOutletContext, useSearchParams } from "react-router-dom";

function AddPricePage() {
  const [, setNewHome] =
    useOutletContext<[Home, React.Dispatch<React.SetStateAction<Home>>]>();

  // Initialize price with the value from localStorage if it exists, or set it to "0"
  const [price, setPrice] = useState<string>(() => {
    const localStorageHome = localStorage.getItem("newHome");
    const homeObject = localStorageHome ? JSON.parse(localStorageHome) : {};
    return homeObject?.price ? String(homeObject.price) : "0"; // Make sure it's a string
  });

  const [isFocused, setIsFocused] = useState(false);
  const [guestPriceOpen, setGuestPriceOpen] = useState(true);
  const [youEarnOpen, setYouEarnOpen] = useState(false);
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams({ step: "addPrice" });
    handleNewHomeUpdate();
  }, [price]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Remove any non-numeric characters
    if (value.length > 5) {
      value = value.slice(0, 5); // Ensure the input doesn't exceed 5 characters
    }

    // Add commas after every 3 digits
    const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    setPrice(formattedValue);
  };

  function handleNewHomeUpdate() {
    const localStorageHome = localStorage.getItem("newHome");

    // Check if localStorageHome exists and parse it to an object
    const homeObject = localStorageHome ? JSON.parse(localStorageHome) : {};

    // Update the homeObject with the new price
    const updatedHome = {
      ...homeObject,
      price: price,
    };

    // Update the state and localStorage
    setNewHome(updatedHome);
    localStorage.setItem("newHome", JSON.stringify(updatedHome));
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center pt-10 px-8">
      <div className="space-y-2 mb-8 md:w-[30%]">
        <h1 className="text-4xl font-[500] ">Now, set your price</h1>
        <p className="text-lg text-[#9d9d9d]">You can change it anytime.</p>
      </div>
      <div
        className={`flex justify-center items-center space-x-2 text-9xl font-bold`}
      >
        <span>$</span>
        <Input
          id="price"
          type="text"
          value={price}
          onChange={handlePriceChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="text-9xl h-44 font-bold border-none outline-none focus:ring-0 focus:border-none md:w-[30%]"
        />
        {!isFocused && (
          <Label
            htmlFor="price"
            className="cursor-pointer border rounded-full p-2"
          >
            <Pencil />
          </Label>
        )}
      </div>
      <div className="md:w-[40%] w-full space-y-4">
        <div
          onClick={() => {
            setYouEarnOpen(false);
            setGuestPriceOpen(true);
          }}
          className="border border-black p-6 rounded-xl space-y-4 focus:outline-none focus:ring-2 focus:ring-black"
          tabIndex={0}
        >
          {guestPriceOpen && (
            <div className="border-b pb-4 space-y-3">
              <div className="flex justify-between text-lg">
                <span>Base Price</span>
                <span>${price}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Guest service fee</span>
                <span>
                  $
                  {price && !isNaN(Number(price.replace(/,/g, "")))
                    ? (
                        parseFloat(price.replace(/,/g, "")) * 0.14
                      ).toLocaleString()
                    : "0"}
                </span>
              </div>
            </div>
          )}
          <div
            className={`flex justify-between text-lg font-[500] ${
              !guestPriceOpen && "cursor-pointer"
            }`}
          >
            <span>Guest Price</span>
            <span>
              {price && !isNaN(Number(price.replace(/,/g, "")))
                ? (parseFloat(price.replace(/,/g, "")) * 1.14).toLocaleString()
                : "0"}
            </span>
          </div>
        </div>
        <div
          onClick={() => {
            setYouEarnOpen(true);
            setGuestPriceOpen(false);
          }}
          className="border border-black p-6 rounded-xl space-y-4 focus:outline-none focus:ring-2 focus:ring-black"
          tabIndex={0}
        >
          {youEarnOpen && (
            <div className="border-b pb-4 space-y-3 ">
              <div className="flex justify-between text-lg">
                <span>Base Price</span>
                <span>${price}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Host service fee</span>
                <span>
                  -$
                  {price && !isNaN(Number(price.replace(/,/g, "")))
                    ? (
                        parseFloat(price.replace(/,/g, "")) * 0.03
                      ).toLocaleString()
                    : "0"}
                </span>
              </div>
            </div>
          )}
          <div
            className={`flex justify-between text-lg font-[500] ${
              !youEarnOpen && "cursor-pointer"
            }`}
          >
            <span>You earn</span>
            <span>
              {price && !isNaN(Number(price.replace(/,/g, "")))
                ? (parseFloat(price.replace(/,/g, "")) * 0.97).toLocaleString()
                : "0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPricePage;
