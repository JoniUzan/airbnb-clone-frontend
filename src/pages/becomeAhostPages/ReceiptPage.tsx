import ReceiptDailog from "@/components/becomeAhostComponents/ReceiptDailog";
import { Home } from "@/layouts/BecomeAhostLayout";
import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";

function ReceiptPage() {
  const [isOpne, setIsOpen] = useState(false);
  const [, setSearchParams] = useSearchParams();
  const [newHome, setNewHome] =
    useOutletContext<[Home, React.Dispatch<React.SetStateAction<Home>>]>();

  useEffect(() => {
    setSearchParams({ step: "receipt" });
    const localStorageHome = localStorage.getItem("newHome");
    if (localStorageHome) {
      const homeObject = JSON.parse(localStorageHome);
      setNewHome(homeObject);
    }
  }, []);

  return (
    <div className="sm:h-screen flex mt-10 justify-center px-8 pb-8">
      <div className="lg:max-w-[60%]">
        <div className="space-y-4 mb-8">
          <h1 className="text-5xl font-semibold">Review your listing</h1>
          <p className="font-medium text-lg text-gray-500">
            Here's what we'll show to guests. Make sure everything looks good.
          </p>
        </div>
        <div className="sm:flex sm:gap-10 sm:items-start justify-center">
          <div
            onClick={() => setIsOpen(!isOpne)}
            className="p-4 rounded-3xl overflow-hidden shadow-2xl max-w-xs mx-auto sm:mx-0"
          >
            <div className="relative">
              <img src={newHome.imgUrls[0]} alt="" />
              <span
                className="absolute top-4 left-4 bg-white p-1 rounded-md z-10"
                style={{
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
              >
                Show Preview
              </span>
            </div>
            <div className="pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">{newHome.name}</span>
                <div className="flex items-center gap-1 text-lg">
                  <span className="font-medium">New</span>
                  <Star strokeWidth={3} size={16} />
                </div>
              </div>
              <span className="font-semibold text-lg">${newHome.price} </span>
              <span className="text-lg font-medium">night</span>
            </div>
          </div>
          <div className="flex flex-col gap-10 mt-8">
            <h2 className="text-2xl font-500">What's next?</h2>
            <div className="flex gap-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                className="h-14 w-14 fill-current text-gray-800"
              >
                <path d="M25 30H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h5a5 5 0 0 1 8 0h5a5 5 0 0 1 5 5v18a5 5 0 0 1-5 5zM7 4a3 3 0 0 0-3 3v18a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-6.11l-.29-.5a3 3 0 0 0-5.2 0l-.29.5zm17.41 8L23 10.59l-9.5 9.5-4.5-4.5L7.59 17l5.91 5.91zM16 6a1 1 0 1 0-1-1 1 1 0 0 0 1 1z"></path>
              </svg>
              <div>
                <h2 className="text-xl font-medium">
                  Confirm a few details and publish
                </h2>
                <p className="text-gray-500">
                  We’ll let you know if you need to verify your identity or
                  register with the local government.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                className="h-14 w-14 fill-current text-gray-800"
              >
                <path d="M11.67 0v1.67h8.66V0h2v1.67h6a2 2 0 0 1 2 1.85v16.07a2 2 0 0 1-.46 1.28l-.12.13L21 29.75a2 2 0 0 1-1.24.58H6.67a5 5 0 0 1-5-4.78V3.67a2 2 0 0 1 1.85-2h6.15V0zm16.66 11.67H3.67v13.66a3 3 0 0 0 2.82 3h11.18v-5.66a5 5 0 0 1 4.78-5h5.88zm-.08 8h-5.58a3 3 0 0 0-3 2.82v5.76zm-18.58-16h-6v6h24.66v-6h-6v1.66h-2V3.67h-8.66v1.66h-2z"></path>
              </svg>
              <div>
                <h2 className="text-xl font-medium">Set up your calendar</h2>
                <p className="text-gray-500">
                  Choose which dates your listing is available. It will be
                  visible 24 hours after you publish.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                className="h-14 w-14 fill-current text-gray-800"
              >
                <path d="M20.8 4.8a4.54 4.54 0 0 1 6.57 6.24l-.16.17L9 29.4a2 2 0 0 1-1.24.58L7.6 30H2v-5.59a2 2 0 0 1 .47-1.28l.12-.13zM19 9.4l-15 15V28h3.59l15-15zm6.8-3.2a2.54 2.54 0 0 0-3.46-.13l-.13.13L20.4 8 24 11.59l1.8-1.8c.94-.94.98-2.45.12-3.45z"></path>
              </svg>
              <div>
                <h2 className="text-xl font-medium">Adjust your settings</h2>
                <p className="text-gray-500">
                  Set house rules, select a cancellation policy, choose how
                  guests book, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReceiptDailog newHome={newHome} isOpen={isOpne} setIsOpen={setIsOpen} />
    </div>
  );
}

export default ReceiptPage;
