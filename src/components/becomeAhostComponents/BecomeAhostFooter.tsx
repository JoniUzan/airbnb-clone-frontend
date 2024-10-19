import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import { Home } from "@/layouts/BecomeAhostLayout";
import { createNewHome } from "@/lib/http";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";

function BecomeAhostFooter() {
  useOutletContext<[Home, React.Dispatch<React.SetStateAction<Home>>]>();
  const [progressOneValue, setProgressOneValue] = useState(0);
  const [progressTowValue, setProgressTowValue] = useState(0);
  const [progressThreeValue, setProgressThreeValue] = useState(0);

  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { toast } = useToast();
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const stepParam = searchParams.get("step");
    setStep(stepParam);
  }, [searchParams]);

  useEffect(() => {
    handleProgress();
    handleDisabled();
  }, [step, location.pathname]);


// use react query to upload the new listing
  const mutation = useMutation({
    mutationFn: createNewHome, // Use mutationFn to pass the function
    onSuccess: () => {
      toast({
        title: "Upload New Listing",
        description: "Welcome Aboard! You’re Officially a Host",
      });
      navigate("/hostPage");
    },
    onError: (error) => {
      console.error("Error while posting new home:", error);
      toast({
        title: "Error",
        description:
          "There was an issue creating your listing. Please try again.",
      });
    },
  });

  function handleDisabled() {
    const enabledSteps = [
      "stepOne",
      "selectType",
      "selectRoomType",
      "selectLocation",
      "floorPlan",
      "stepTwo",
      "amenities",
      "addPhotos",
      "addTitle",
      "addDescription",
      "stepThree",
      "bookType",
      "addPrice",
      "receipt",
    ];

    setIsDisabled(!enabledSteps.includes(step!));
  }

  function handleUploadHome() {
    try {
      const localStorageHome = localStorage.getItem("newHome");
      const homeObject = localStorageHome ? JSON.parse(localStorageHome) : {};

      // Ensure correct types
      homeObject.price = Number(homeObject.price.replace(/,/g, "")); // Convert price to number
      homeObject.capacity = Number(homeObject.capacity);
      homeObject.bathrooms = Number(homeObject.bathrooms);
      homeObject.bedrooms = Number(homeObject.bedrooms);
      homeObject.beds = Number(homeObject.beds);

      console.log("Home Object:", homeObject); // Log to inspect the object before sending

      mutation.mutate(homeObject); // Trigger the mutation
    } catch (error) {
      console.error("Error while preparing to create new home:", error);
    }
  }

  function handleProgress() {
    const lastSegment = location.pathname.split("/").pop();
    if (lastSegment === "becomeAhost") {
      setProgressOneValue(0);
    } else if (lastSegment === "selectType") {
      setProgressOneValue(20);
    } else if (lastSegment === "selectRoomType") {
      setProgressOneValue(40);
    } else if (lastSegment === "selectLocation") {
      setProgressOneValue(60);
    } else if (lastSegment === "floorPlan") {
      setProgressOneValue(80);
    } else if (lastSegment === "stepTwo") {
      setProgressOneValue(100);
      setProgressTowValue(0);
    } else if (lastSegment === "amenities") {
      setProgressOneValue(100);
      setProgressTowValue(20);
    } else if (lastSegment === "addPhotos") {
      setProgressOneValue(100);
      setProgressTowValue(40);
    } else if (lastSegment === "addTitle") {
      setProgressOneValue(100);
      setProgressTowValue(60);
    } else if (lastSegment === "addDescription") {
      setProgressOneValue(100);
      setProgressTowValue(80);
    } else if (lastSegment === "stepThree") {
      setProgressOneValue(100);
      setProgressTowValue(100);
      setProgressThreeValue(0);
    } else if (lastSegment === "bookType") {
      setProgressOneValue(100);
      setProgressTowValue(100);
      setProgressThreeValue(25);
    } else if (lastSegment === "addPrice") {
      setProgressOneValue(100);
      setProgressTowValue(100);
      setProgressThreeValue(50);
    } else if (lastSegment === "receipt") {
      setProgressOneValue(100);
      setProgressTowValue(100);
      setProgressThreeValue(75);
    }
  }

  async function handleNext() {
    if (step === "stepOne") {
      navigate("selectType");
    } else if (step === "selectType") {
      navigate("selectRoomType");
    } else if (step === "selectRoomType") {
      navigate("selectLocation");
    } else if (step === "selectLocation") {
      navigate("floorPlan");
    } else if (step === "floorPlan") {
      navigate("stepTwo");
    } else if (step === "stepTwo") {
      navigate("amenities");
    } else if (step === "amenities") {
      navigate("addPhotos");
    } else if (step === "addPhotos") {
      navigate("addTitle");
    } else if (step === "addTitle") {
      navigate("addDescription");
    } else if (step === "addDescription") {
      navigate("stepThree");
    } else if (step === "stepThree") {
      navigate("bookType");
    } else if (step === "bookType") {
      navigate("addPrice");
    } else if (step === "addPrice") {
      navigate("receipt");
    }
    if (step === "receipt") {
      handleUploadHome();
    }
  }

  function handleBack() {
    const lastSegment = location.pathname.split("/").pop();

    if (lastSegment === "selectLocation") {
      navigate("selectRoomType");
    } else if (lastSegment === "selectRoomType") {
      navigate("selectType");
    } else if (lastSegment === "selectType") {
      navigate("");
    } else if (lastSegment === "floorPlan") {
      navigate("selectLocation");
    } else if (lastSegment === "stepTwo") {
      navigate("floorPlan");
    } else if (lastSegment === "amenities") {
      navigate("stepTwo");
    } else if (lastSegment === "addPhotos") {
      navigate("amenities");
    } else if (lastSegment === "addTitle") {
      navigate("addPhotos");
    } else if (lastSegment === "addDescription") {
      navigate("addTitle");
    } else if (lastSegment === "stepThree") {
      navigate("addDescription");
    } else if (lastSegment === "bookType") {
      navigate("stepThree");
    } else if (lastSegment === "addPrice") {
      navigate("bookType");
    } else if (lastSegment === "receipt") {
      navigate("addPrice");
    }
  }

  return (
    <footer className="sticky bottom-0 left-0 w-full bg-white">
      <div className="flex space-x-1">
        <Progress
          value={progressOneValue}
          className="rounded-none h-[0.4rem] bg-[#DDDDDD]"
        />
        <Progress
          value={progressTowValue}
          className="rounded-none h-[0.4rem] bg-[#DDDDDD]"
        />
        <Progress
          value={progressThreeValue}
          className="rounded-none h-[0.4rem] bg-[#DDDDDD]"
        />
      </div>
      <div className="flex justify-between px-14 py-6">
        <Button
          onClick={handleBack}
          variant={"ghost"}
          className="underline text-md"
        >
          Back
        </Button>
        <Button
          disabled={isDisabled}
          onClick={handleNext}
          className="text-white bg-gray-800 px-7 py-6 text-md rounded-lg hover:bg-black"
        >
          Next
        </Button>
      </div>
    </footer>
  );
}

export default BecomeAhostFooter;
