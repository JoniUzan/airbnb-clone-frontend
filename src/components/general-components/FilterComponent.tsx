import { X } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Buttons from "./ButtonsComponent";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { BookingOptions, QueryFilter } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchHomeCountByFilers } from "@/lib/http";
import { Switch } from "../ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { updateSearchParams } from "@/lib/utils";
import { SetURLSearchParams } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  initialFilters: QueryFilter;
}

const languages: string[] = [
  "Chinese",
  "English",
  "French",
  "German",
  "Italian",
  "Japanese",
  "Korean",
  "Portuguese",
  "Russian",
  "Spanish",
  "Arabic",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "Greek",
  "Hebrew",
  "Norwegian",
  "Polish",
  "Swedish",
  "Turkish",
  "Azerbaijani",
  "Bosnian",
  "Bulgarian",
  "Macedonian",
  "Persian",
  "Romanian",
  "Serbian",
  "Ukrainian",
];

const accessibilityFeatures: string[] = [
  "Step-free guest entrance",
  "Guest entrance wider than 32 inches",
  "Accessible parking spot",
  "Step-free path to the guest entrance",
  "Step-free bedroom access",
  "Bedroom entrance wider than 32 inches",
  "Step-free bathroom access",
  "Bathroom entrance wider than 32 inches",
  "Toilet grab bar",
  "Shower grab bar",
  "Step-free shower",
  "Shower or bath chair",
  "Ceiling or mobile hoist",
];

type LanguageCheck = {
  [key: string]: boolean;
};

type AccessibilityCheck = {
  [key: string]: boolean;
};

const FilterModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  searchParams,
  setSearchParams,
  initialFilters,
}) => {
  const [isResetFilters, setIsResetFilters] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [checkedState, setCheckedState] = useState({
    Wifi: false,
    Kitchen: false,
    Washer: false,
    Dryer: false,
    "Air conditioning": false,
    Heating: false,
    "Dedicated workspace": false,
    TV: false,
    "Hair dryer": false,
    Iron: false,
    Pool: false,
    "Hot tub": false,
    "Free parking": false,
    "EV charger": false,
    Crib: false,
    "King bed": false,
    Gym: false,
    "BBQ grill": false,
    Breakfast: false,
    "Indoor fireplace": false,
    "Smoking allowed": false,
    Beachfront: false,
    Waterfront: false,
    "Smoke alarm": false,
    "Carbon monoxide alarm": false,
  });
  const [languageCheck, setLanguageCheck] = useState<LanguageCheck>(
    languages.reduce((acc, language) => {
      acc[language] = false;
      return acc;
    }, {} as LanguageCheck)
  );

  const [accessibilityCheck, setAccessibilityCheck] =
    useState<AccessibilityCheck>(
      accessibilityFeatures.reduce((acc, feature) => {
        acc[feature] = false;
        return acc;
      }, {} as AccessibilityCheck)
    );

  const modalRef = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(false);
  const [filters, setFilters] = useState<QueryFilter>({
    type: undefined,
    roomType: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    beds: undefined,
    bathrooms: undefined,
    hostLanguage: undefined,
    amenities: undefined,
    capacity: undefined,
    accessibility: undefined,
    InstantBook: undefined,
    SelfCheckIn: undefined,
    AllowsPets: undefined,
    location: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  const [bookingOptionsCheck, setBookingOptionsCheck] =
    useState<BookingOptions>({
      InstantBook: false,
      SelfCheckIn: false,
      AllowsPets: false,
    });

  const [minPrice, setMinPrice] = useState(
    Number(searchParams.get("minPrice")) || 0
  );
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get("maxPrice")) || 1500
  );

  const { data: count } = useQuery<number | string>({
    queryKey: ["count", filters],
    queryFn: () => fetchHomeCountByFilers(filters),
  });

  const resetFilters = () => {
    setIsResetFilters(true);
    setCheckedState({
      Wifi: false,
      Kitchen: false,
      Washer: false,
      Dryer: false,
      "Air conditioning": false,
      Heating: false,
      "Dedicated workspace": false,
      TV: false,
      "Hair dryer": false,
      Iron: false,
      Pool: false,
      "Hot tub": false,
      "Free parking": false,
      "EV charger": false,
      Crib: false,
      "King bed": false,
      Gym: false,
      "BBQ grill": false,
      Breakfast: false,
      "Indoor fireplace": false,
      "Smoking allowed": false,
      Beachfront: false,
      Waterfront: false,
      "Smoke alarm": false,
      "Carbon monoxide alarm": false,
    });
    setBookingOptionsCheck({
      InstantBook: false,
      SelfCheckIn: false,
      AllowsPets: false,
    });
    setAccessibilityCheck(
      accessibilityFeatures.reduce((acc, feature) => {
        acc[feature] = false;
        return acc;
      }, {} as AccessibilityCheck)
    );
    setLanguageCheck(
      languages.reduce((acc, language) => {
        acc[language] = false;
        return acc;
      }, {} as LanguageCheck)
    );
    setFilters(initialFilters);
    setMinPrice(0);
    setMaxPrice(1500);
  };

  const handleFilterClick = () => {
    const params: Record<string, string> = {};

    if (filters.type) params.type = filters.type;

    params.roomType = filters.roomType === undefined ? "" : filters.roomType;

    if (filters.minPrice !== 0) params.minPrice = minPrice.toString();
    if (filters.maxPrice !== 1500) params.maxPrice = maxPrice.toString();

    params.bedrooms = filters.bedrooms === undefined ? "" : filters.bedrooms;
    params.beds = filters.beds === undefined ? "" : filters.beds;
    params.bathrooms = filters.bathrooms === undefined ? "" : filters.bathrooms;

    if (filters.hostLanguage === undefined) {
      params.hostLanguage = "";
    } else if (Array.isArray(filters.hostLanguage)) {
      params.hostLanguage = filters.hostLanguage.join(",");
    } else if (filters.hostLanguage) {
      params.hostLanguage = filters.hostLanguage;
    }

    if (filters.capacity) params.capacity = filters.capacity.toString();

    if (filters.accessibility === undefined) params.accessibility = "";
    else if (filters.accessibility)
      params.accessibility = filters.accessibility.toString();

    if (filters.location) params.location = filters.location;

    if (filters.startDate) params.startDate = filters.startDate.toISOString();
    if (filters.endDate) params.endDate = filters.endDate.toISOString();

    if (filters.amenities === undefined) params.amenities = "";
    else if (filters.amenities && filters.amenities.length > 0) {
      params.amenities = filters.amenities.join(",");
    }

    if (filters.InstantBook) {
      params.InstantBook = "true";
    } else {
      params.InstantBook = "";
    }
    if (filters.SelfCheckIn) {
      params.SelfCheckIn = "true";
    } else {
      params.SelfCheckIn = "";
    }
    if (filters.AllowsPets) {
      params.AllowsPets = "true";
    } else {
      params.AllowsPets = "";
    }

    // Update the URL with the new query parameters
    updateSearchParams(params, searchParams, setSearchParams);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 100); // Quicker hide for subtle exit animation
    }
  }, [isOpen]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;

    setCheckedState((prevState) => ({
      ...prevState,
      [id]: checked,
    }));

    if (checked) {
      updateFiltersState(id);
    } else {
      removeFilter(id);
    }
  };

  const updateFiltersState = (value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      amenities: prevFilters.amenities
        ? [...prevFilters.amenities, value]
        : [value],
    }));
  };

  const removeFilter = (value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      amenities: prevFilters.amenities
        ? prevFilters.amenities.filter((amenity) => amenity !== value)
        : [],
    }));
  };

  const handleLanguageChange = (language: string) => {
    setLanguageCheck((prevState) => ({
      ...prevState,
      [language]: !prevState[language],
    }));

    setFilters((prevFilters) => {
      const updatedLanguages = prevFilters.hostLanguage
        ? prevFilters.hostLanguage.includes(language)
          ? prevFilters.hostLanguage.filter((lang) => lang !== language) // Remove the language if it exists
          : [...prevFilters.hostLanguage, language] // Add the language if it doesn't exist
        : [language]; // Initialize with the new language if `hostLanguage` is undefined

      return {
        ...prevFilters,
        hostLanguage: updatedLanguages,
      };
    });
  };

  const handleSwitchClick = (state: keyof QueryFilter) => {
    setBookingOptionsCheck((prevState) => {
      return {
        ...prevState,
        [state]: !prevState[state],
      };
    });

    setFilters((prevFilters) => ({
      ...prevFilters,
      [state]: !prevFilters[state] === false ? undefined : true,
    }));
  };

  const handleAccessibilityChange = (access: string) => {
    setAccessibilityCheck((prevState) => ({
      ...prevState,
      [access]: !prevState[access],
    }));

    setFilters((prevFilters) => {
      const updatesAccessibility = prevFilters.accessibility
        ? prevFilters.accessibility.includes(access)
          ? prevFilters.accessibility.filter((acc) => acc !== access)
          : [...prevFilters.accessibility, access]
        : [access];

      return {
        ...prevFilters,
        accessibility: updatesAccessibility,
      };
    });
  };

  if (!show) return null;

  return (
    <div
      onClick={handleOutsideClick}
      className={`font-montserrat fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 transition-opacity duration-300 ease-out ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-lg p-6 pt-0 pb-0 w-[45rem] max-h-[37rem] overflow-auto transform transition-all duration-500 ease-out ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="flex justify-between items-center border-b pb-2 sticky top-0 bg-white h-20">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close modal"
          >
            <X />
          </button>
          <h3 className="font-semibold">Filters</h3>
          <div></div>
        </div>
        <div>
          <div className="pb-4 ">
            <h1 className="font-600 text-xl">Type of place</h1>
            <div className="w-full flex justify-center items-center">
              <Tabs
                defaultValue="anytype"
                className="w-[400px]"
                value={
                  filters.roomType === undefined
                    ? "anytype"
                    : filters.roomType === "Private room"
                    ? "room"
                    : filters.roomType === "Entire home/apt"
                    ? "entire"
                    : "anytype"
                }
              >
                <TabsContent value="anytype">
                  Search rooms, entire homes, or any type of place
                </TabsContent>
                <TabsContent value="room">
                  A room in a home, plus access to shared spaces.
                </TabsContent>
                <TabsContent value="entire">
                  A home all to yourself.
                </TabsContent>
                <div className="flex flex-col justify-center items-center">
                  <TabsList>
                    <TabsTrigger
                      value="anytype"
                      onClick={() =>
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          roomType: undefined,
                        }))
                      }
                    >
                      Any Type
                    </TabsTrigger>
                    <TabsTrigger
                      value="room"
                      onClick={() =>
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          roomType: "Private room",
                        }))
                      }
                    >
                      Room
                    </TabsTrigger>
                    <TabsTrigger
                      value="entire"
                      onClick={() =>
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          roomType: "Entire home/apt",
                        }))
                      }
                    >
                      Entire Home
                    </TabsTrigger>
                  </TabsList>
                </div>
              </Tabs>
            </div>
          </div>
          <hr className="pb-4" />
          <div className="space-y-2 pb-4">
            <h1 className="font-600 text-xl pb-2">Price Range</h1>
            <p className="text-xs">Nightly prices including fees and taxes</p>
            <Slider
              range
              min={0}
              max={1500}
              step={2}
              defaultValue={[minPrice, maxPrice]}
              value={[minPrice, maxPrice]}
              allowCross={false}
              trackStyle={[{ backgroundColor: "black" }]}
              handleStyle={[{ borderColor: "black" }, { borderColor: "black" }]}
              railStyle={{ backgroundColor: "lightgray" }}
              onChange={(value: number | number[]) => {
                if (Array.isArray(value)) {
                  const [min, max] = value;
                  setMinPrice(min);
                  setMaxPrice(max);

                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    minPrice: min,
                    maxPrice: max,
                  }));
                } else {
                  // Handle the case where value is not an array if necessary
                  console.error("Expected an array, but got:", value);
                }
              }}
            />
            <div className="flex justify-between">
              <div className="flex flex-col items-center">
                <Label
                  htmlFor="min-price"
                  className="text-[12px] text-gray-600 font-600"
                >
                  Minimum
                </Label>
                <input
                  type="number"
                  id="min-price"
                  min="0"
                  max="1500"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(Number(e.target.value));
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      minPrice: Number(e.target.value),
                    }));
                  }}
                  className="no-arrows h-10 border-[1px] border-gray-300 rounded-full text-center px-2 py-1 text-[16px] focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="flex flex-col items-center">
                <Label
                  htmlFor="max-price"
                  className="text-[12px] text-gray-600 font-600"
                >
                  Maximum
                </Label>
                <input
                  type="number"
                  id="max-price"
                  min="0"
                  max="1500"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      maxPrice: Number(e.target.value),
                    }));
                  }}
                  className="no-arrows h-10 border-[1px] border-gray-300 rounded-full text-center px-2 py-1 text-[16px] focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>
          <hr className="pb-4" />
          <div className="space-y-4 pb-4">
            <h1 className="font-600 text-xl pb-2">Rooms and beds</h1>
            <p className="text-[16px]">Bedrooms</p>
            <Buttons
              setFilters={setFilters}
              filterType="bedrooms"
              resetFilters={isResetFilters}
              setIsResetFilters={setIsResetFilters}
            />
            <p className="text-[16px]">Beds</p>
            <Buttons
              setFilters={setFilters}
              filterType="beds"
              resetFilters={isResetFilters}
              setIsResetFilters={setIsResetFilters}
            />
            <p className="text-[16px]">Bathrooms</p>
            <Buttons
              setFilters={setFilters}
              filterType="bathrooms"
              resetFilters={isResetFilters}
              setIsResetFilters={setIsResetFilters}
            />
          </div>
          <hr className="pb-4" />
          <div>
            <h1 className="font-600 text-xl pb-2">Amenities</h1>
            <p className="pb-4 text-[16px] font-bold">Essentials</p>
            <div className="grid grid-cols-2 gap-5 pb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="Wifi"
                  checked={checkedState.Wifi}
                  onChange={handleCheckboxChange}
                />
                <Label htmlFor="wifi" className="ml-3">
                  Wifi
                </Label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="Kitchen"
                  checked={checkedState.Kitchen}
                  onChange={handleCheckboxChange}
                />
                <Label htmlFor="kitchen" className="ml-3">
                  Kitchen
                </Label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="Washer"
                  checked={checkedState.Washer}
                  onChange={handleCheckboxChange}
                />
                <Label htmlFor="washer" className="ml-3">
                  Washer
                </Label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="Dryer"
                  checked={checkedState.Dryer}
                  onChange={handleCheckboxChange}
                />
                <Label htmlFor="Dryer" className="ml-3">
                  Dryer
                </Label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="Air conditioning"
                  checked={checkedState["Air conditioning"]}
                  onChange={handleCheckboxChange}
                />
                <Label htmlFor="air" className="ml-3">
                  Air conditioning
                </Label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="Heating"
                  checked={checkedState.Heating}
                  onChange={handleCheckboxChange}
                />
                <Label htmlFor="Heating" className="ml-3">
                  Heating
                </Label>
              </div>
              {showMore && (
                <>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Dedicated workspace"
                      checked={checkedState["Dedicated workspace"]}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="workspace" className="ml-3">
                      Dedicated workspace
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="TV"
                      checked={checkedState.TV}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="TV" className="ml-3">
                      TV
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Hair dryer"
                      checked={checkedState["Hair dryer"]}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="dryer" className="ml-3">
                      Hair dryer
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Iron"
                      checked={checkedState.Iron}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="Iron" className="ml-3">
                      Iron
                    </Label>
                  </div>
                  <p className="col-span-2 text-[16px] font-bold">Features</p>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Pool"
                      checked={checkedState.Pool}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="pool" className="ml-3">
                      Pool
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Hot tub"
                      checked={checkedState["Hot tub"]}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="tub" className="ml-3">
                      Hot tub
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Free parking"
                      checked={checkedState["Free parking"]}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="parking" className="ml-3">
                      Free parking
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="EV charger"
                      checked={checkedState["EV charger"]}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="charger" className="ml-3">
                      EV charger
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Crib"
                      checked={checkedState.Crib}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="crib" className="ml-3">
                      Crib
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="King bed"
                      checked={checkedState["King bed"]}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="king" className="ml-3">
                      King bed
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Gym"
                      checked={checkedState.Gym}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="gym" className="ml-3">
                      Gym
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="BBQ grill"
                      checked={checkedState["BBQ grill"]}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="bbq" className="ml-3">
                      BBQ grill
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Breakfast"
                      checked={checkedState.Breakfast}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="breakfast" className="ml-3">
                      Breakfast
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Indoor fireplace"
                      checked={checkedState["Indoor fireplace"]}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="fireplace" className="ml-3">
                      Indoor fireplace
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Smoking allowed"
                      checked={checkedState["Smoking allowed"]}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="smoking" className="ml-3">
                      Smoking allowed
                    </Label>
                  </div>
                  <p className="col-span-2 text-[16px] font-bold">Location</p>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Beachfront"
                      checked={checkedState.Beachfront}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="Beachfront" className="ml-3">
                      Beachfront
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Waterfront"
                      checked={checkedState.Waterfront}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="Waterfront" className="ml-3">
                      Waterfront
                    </Label>
                  </div>
                  <p className="col-span-2 text-[16px] font-bold">Safety</p>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Smoke alarm"
                      checked={checkedState["Smoke alarm"]}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="smokealarm" className="ml-3">
                      Smoke alarm
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Carbon monoxide alarm"
                      checked={checkedState["Carbon monoxide alarm"]}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="Carbon" className="ml-3">
                      Carbon monoxide alarm
                    </Label>
                  </div>
                </>
              )}
            </div>
            <button
              className="underline font-bold text-[14px]"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show less" : "Show more"}
            </button>
          </div>
          <hr className="pb-4" />
          <div className="flex flex-col gap-4 pb-4">
            <h1 className="font-600 text-xl pb-2">Booking options</h1>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <Label htmlFor="instant-book" className="text-[16px]">
                  Instant Book
                </Label>
                <Label
                  htmlFor="instant-book"
                  className="text-[14px] text-gray-500"
                >
                  Listings you can book without waiting for Host approval
                </Label>
              </div>
              <Switch
                id="instant-book"
                checked={bookingOptionsCheck.InstantBook}
                onCheckedChange={() => handleSwitchClick("InstantBook")}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <Label htmlFor="self-check-in" className="text-[16px]">
                  Self check-in
                </Label>
                <Label
                  htmlFor="self-check-in"
                  className="text-[14px] text-gray-500"
                >
                  Easy access to the property once you arrive
                </Label>
              </div>
              <Switch
                id="self-check-in"
                checked={bookingOptionsCheck.SelfCheckIn}
                onCheckedChange={() => handleSwitchClick("SelfCheckIn")}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <Label htmlFor="pets" className="text-[16px]">
                  Allows pets
                </Label>
                <Label
                  htmlFor="pets"
                  className="text-[14px] text-gray-500 underline font-bold"
                >
                  Bringing a service animal?
                </Label>
              </div>
              <Switch
                id="pets"
                checked={bookingOptionsCheck.AllowsPets}
                onCheckedChange={() => handleSwitchClick("AllowsPets")}
              />
            </div>
          </div>
        </div>
        <hr className="pb-4" />
        <div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-[22px] font-bold">
                Accessibility features
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-5 pb-4">
                  {accessibilityFeatures.map((accessibility) => {
                    return (
                      <div key={accessibility} className="flex items-center">
                        <input
                          type="checkbox"
                          id={accessibility}
                          checked={accessibilityCheck[accessibility]}
                          onChange={() =>
                            handleAccessibilityChange(accessibility)
                          }
                          className="w-5 h-5 border-[1px] border-gray-300 rounded-sm checked:bg-black checked:text-white checked:hover:bg-black hover:bg-gray-200"
                          style={{
                            WebkitAppearance: "none",
                            MozAppearance: "none",
                            appearance: "none",
                          }}
                        />
                        <label
                          htmlFor={accessibility}
                          className="ml-3 text-[16px] font-500"
                        >
                          {accessibility}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-[22px] font-bold">
                Host language
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-5 pb-4">
                  {languages.map((language) => {
                    return (
                      <div key={language}>
                        <input
                          type="checkbox"
                          id={language}
                          checked={languageCheck[language]}
                          onChange={() => handleLanguageChange(language)}
                        />
                        <label
                          htmlFor={language}
                          className="ml-3 text-[16px] font-500"
                        >
                          {language}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="sticky bottom-0 bg-white flex items-center justify-between h-20">
          <Button variant="new" onClick={handleFilterClick}>
            Show {count} places
          </Button>
          <Button variant="new" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
