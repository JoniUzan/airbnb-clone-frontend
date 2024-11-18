import { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Guests from "./Guests";
import { DateRange } from "@/types";
import { useDate } from "@/hooks/useDate";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

interface SearchBarProps {
  selectedDestination: string;
  setSelectedDestination: (destination: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  selectedDestination,
  setSelectedDestination,
}) => {
  const { checkDates, setCheckDates } = useDate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>(selectedDestination);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  useEffect(() => {
    if (menuDropdownOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [menuDropdownOpen]);

  useEffect(() => {
    setInputValue(selectedDestination);
  }, [selectedDestination]);

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    setShowSuggestions(false);
    setMenuDropdownOpen(false);

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelectedDestination(address);
    console.log("Selected location:", { lat, lng });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setInputValue(newValue);

    // Only show suggestions if there's input text
    setShowSuggestions(newValue.length > 0);
    // Close the menu dropdown when typing
    if (menuDropdownOpen) setMenuDropdownOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value) {
      handleSelect(value);
    }
  };

  const handlePredefinedSelection = (destination: string): void => {
    setSelectedDestination(destination);
    setMenuDropdownOpen(false);
    setShowSuggestions(false);
    setValue(destination, false);
    setInputValue(destination);
  };

  return (
    <div className="flex flex-col items-center text-xs ">
      <div className="flex justify-center  items-center border border-gray-300 rounded-full shadow-md shadow-gray-300 font-500">
        <div className="p-0 sm:p-3 md:px-6 flex-1 text-left hover:bg-gray-200 rounded-full ">
          <DropdownMenu
            open={menuDropdownOpen}
            onOpenChange={setMenuDropdownOpen}
          >
            <div className="flex flex-col ">
              <DropdownMenuTrigger asChild>
                <Button
                  variant={null}
                  className="h-0 flex justify-start text-xs text-left"
                >
                  <div className="text-black font-600">Where</div>
                </Button>
              </DropdownMenuTrigger>
              <input
                type="text"
                ref={inputRef}
                className="ml-4 w-16 sm:w-full border-none outline-none bg-transparent focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:border-none focus:outline-none focus:shadow-none"
                style={{ boxShadow: "none", border: "none", outline: "none" }}
                placeholder={
                  !ready && !selectedDestination
                    ? "Loading..."
                    : selectedDestination || "Search destinations"
                }
                disabled={!ready}
                onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                  e.stopPropagation();
                  // Show suggestions if there's input text
                  if (inputValue) setShowSuggestions(true);
                }}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                value={inputValue}
              />
              {status === "OK" && showSuggestions && (
                <ul className="absolute w-[30%] bg-white rounded-3xl shadow-lg mt-10  max-h-[500px] overflow-y-auto z-[9999] border border-gray-200">
                  {data.map(({ place_id, description }) => (
                    <li
                      key={place_id}
                      className="p-4 hover:bg-gray-100 cursor-pointer text-sm transition-colors border-b  last:border-b-0 border-gray-100 text-gray-700"
                      onClick={() => handleSelect(description)}
                    >
                      {description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <DropdownMenuContent className="rounded-3xl relative top-4 p-6">
              <DropdownMenuLabel>Search by region</DropdownMenuLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3">
                <DropdownMenuItem
                  onClick={() => handlePredefinedSelection("I'm flexible")}
                >
                  <div className="space-y-2">
                    <img
                      src="https://a0.muscache.com/pictures/f9ec8a23-ed44-420b-83e5-10ff1f071a13.jpg?im_w=320"
                      alt="flexible"
                      className="w-[122px] h-[122px] rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <p className="font-500">I'm flexible</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePredefinedSelection("Europe")}
                >
                  <div className="space-y-2">
                    <img
                      src="https://a0.muscache.com/im/pictures/7b5cf816-6c16-49f8-99e5-cbc4adfd97e2.jpg?im_w=320"
                      alt="Europe"
                      className="w-[122px] h-[122px] rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <p className="font-500">Europe</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePredefinedSelection("London")}
                >
                  <div className="space-y-2">
                    <img
                      src="https://a0.muscache.com/im/pictures/ea5598d7-2b07-4ed7-84da-d1eabd9f2714.jpg?im_w=320"
                      alt="Italy"
                      className="w-[122px] h-[122px] rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <p className="font-500">London</p>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handlePredefinedSelection("United States")}
                >
                  <div className="space-y-2">
                    <img
                      src="https://a0.muscache.com/im/pictures/4e762891-75a3-4fe1-b73a-cd7e673ba915.jpg?im_w=320"
                      alt="UnitedState"
                      className="w-[122px] h-[122px] rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <p className="font-500">United States</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePredefinedSelection("Israel")}
                >
                  <div className="space-y-2">
                    <img
                      src="https://a0.muscache.com/im/pictures/09be1400-6a42-4a4f-90f6-897e50110031.jpg?im_w=320"
                      alt="Greece"
                      className="w-[122px] h-[122px] rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <p className="font-500">Israel</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePredefinedSelection("South America")}
                >
                  <div className="space-y-2">
                    <img
                      src="https://a0.muscache.com/im/pictures/06a30699-aead-492e-ad08-33ec0b383399.jpg?im_w=320"
                      alt="SouthAmerica"
                      className="w-[122px] h-[122px] rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <p className="font-500">South America</p>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={null}
              className={cn(
                " flex font-normal self-center text-xs",
                !checkDates && "text-muted-foreground"
              )}
            >
              <div className="hover:bg-gray-200 rounded-full p-0 sm:p-3 md:pr-10 flex justify-center text-left flex-col">
                <div className="text-black font-600  text-xs">Check in</div>

                <div className="text-gray-500 font-500">
                  {checkDates && checkDates.from
                    ? `${monthNames[checkDates.from?.getMonth() ?? 0] + " "}${
                        checkDates.from?.getDate() ?? ""
                      }`
                    : "Add dates"}
                </div>
              </div>
              <div className="hover:bg-gray-200 rounded-full p-3 md:pr-10 flex justify-center text-left flex-col">
                <div className="text-black font-600">Check out</div>
                <div className="text-gray-500  font-500">
                  {checkDates && checkDates.to
                    ? `${monthNames[checkDates.to?.getMonth() ?? 0] + " "}${
                        checkDates.to?.getDate() ?? ""
                      }`
                    : "Add dates"}
                </div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={checkDates}
              onSelect={(ev) => {
                setCheckDates(ev as DateRange | undefined);
              }}
              numberOfMonths={2}
              fromDate={new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Guests
          checkDates={checkDates}
          selectedDestination={selectedDestination}
        />
      </div>
    </div>
  );
};

export default SearchBar;
