import EditHomeSideBar from "@/components/host/EditHomeSideBar";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { updateListing } from "@/lib/http";
import { IHome } from "@/types";
import Loader from "@/components/ui/Loader";
import { useMediaQuery } from "react-responsive"; // For detecting screen size
import { Sheet, SheetTrigger, SheetContent } from "../components/ui/sheet"; // Import ShadCN Sheet
import { Menu } from "lucide-react";

function EditHomeLayout() {
  // Load initial state from localStorage, or fallback to default values
  const [newHome, setNewHome] = useState<IHome>(() => {
    const localStorageHome = localStorage.getItem("newHome");
    return localStorageHome
      ? JSON.parse(localStorageHome)
      : {
          name: "",
          type: "string",
          capacity: 0,
          imgUrls: [],
          price: 0,
          summary: "",
          amenities: [],
          bathrooms: 0,
          bedrooms: 0,
          beds: 0,
          roomType: "",
          host: {
            _id: "",
            fullname: "",
            location: "",
            about: "",
            thumbnailUrl: "",
            imgUrl: "",
            isSuperhost: false,
          },
          loc: {
            country: "",
            countryCode: "",
            city: "",
            address: "",
            lat: 0,
            lan: 0,
          },
          reviews: [],
          likedByUsers: [],
          bookingOptions: {
            InstantBook: false,
            SelfCheckIn: true,
            AllowsPets: true,
          },
          accessibility: [],
        };
  });

  // Whenever newHome changes, update localStorage
  useEffect(() => {
    localStorage.setItem("newHome", JSON.stringify(newHome));
  }, [newHome]);

  const { toast } = useToast();

  // Mutation to handle the update request
  const { mutate, status } = useMutation({
    mutationFn: updateListing,
    onSuccess: () => {
      toast({
        title: "Update Listing",
        description: "Your listing has been successfully updated!",
      });
    },
    onError: (error) => {
      console.error("Error while updating home:", error);
      toast({
        title: "Error",
        description:
          "There was an issue updating your listing. Please try again.",
      });
    },
  });

  // Derive the isLoading state from the status
  const isLoading = status === "pending";

  // Handle the update by triggering the mutation
  function handleUpdate() {
    const localStorageHome = localStorage.getItem("newHome");
    if (localStorageHome) {
      const updatedHome = JSON.parse(localStorageHome);
      mutate(updatedHome);
      setNewHome(updatedHome);
    }
  }

  // Use media query to check for large screens
  const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });

  return (
    <div className="flex h-full">
      {isLargeScreen ? (
        <div className="w-[30%] border-r border-r-[#DDDDDD] ml-20">
          <EditHomeSideBar newHome={newHome} />
        </div>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="ml-4 mt-4 absolute">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4">
            <EditHomeSideBar newHome={newHome} />
          </SheetContent>
        </Sheet>
      )}
      <div className="w-full lg:w-[70%] flex flex-col">
        <div className="flex-1 overflow-auto mt-11">
          <ScrollArea className="h-full w-full">
            <Outlet context={[newHome, setNewHome]} />
          </ScrollArea>
        </div>
        <footer className="sticky bottom-0 w-full bg-white p-4 border border-[#DDDDDD]">
          <div className="flex justify-end p-4 mr-32 ">
            <Button
              onClick={handleUpdate}
              className="p-7 text-md rounded-xl"
              variant={"new"}
              disabled={isLoading} // Disable the button while loading
            >
              {isLoading ? <Loader /> : "Save"}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default EditHomeLayout;
