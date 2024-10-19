import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import Card from "./GuestCard";
import { ScrollArea } from "../ui/scroll-area";
import { DateRange } from "@/types";
import { updateSearchParams } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import cn from "classnames";
import { useGuestContext } from "@/providers/Guest-Context";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

type GuestType = "adults" | "children" | "infants" | "pets";

interface GuestProps {
  checkDates: DateRange | undefined;
  selectedDestination?: string;
  className?: string; // Prop for custom styles on the container
  dropdownClassName?: string; // Prop for custom styles on the dropdown content
  showSearchButton?: boolean; // Prop to control whether the search button is shown
  label?: string; // Prop for customizable label text
  labelClassName?: string; // Prop for custom styles on the label text
  initializeWithOneAdult?: boolean; // Prop to initialize with one adult and control decrement behavior
}

function Guests({
  checkDates,
  selectedDestination,
  className,
  dropdownClassName,
  showSearchButton = true,
  label = "Who",
  labelClassName = "text-black font-600",
  initializeWithOneAdult = false,
}: GuestProps) {
  const { guestCounts, setGuestCounts } = useGuestContext();
  const location = useLocation();
  const isHomeDetailsPage = location.pathname.startsWith("/homes/");

  useEffect(() => {
    if (isHomeDetailsPage && guestCounts.adults === 0) {
      setGuestCounts((prevCounts) => ({
        ...prevCounts,
        adults: 1,
      }));
    }
  }, [isHomeDetailsPage, guestCounts.adults, setGuestCounts]);

  const handleIncrement = (key: GuestType) => {
    setGuestCounts((prevCounts) => {
      if (key !== "adults" && prevCounts.adults === 0) {
        return {
          ...prevCounts,
          adults: 1,
          [key]: prevCounts[key] + 1,
        };
      } else {
        return {
          ...prevCounts,
          [key]: prevCounts[key] + 1,
        };
      }
    });
  };

  const handleDecrement = (key: GuestType) => {
    setGuestCounts((prevCounts) => {
      if (key === "adults") {
        const { children, infants, pets } = prevCounts;
        if (
          initializeWithOneAdult &&
          prevCounts.adults === 1 &&
          children === 0 &&
          infants === 0 &&
          pets === 0
        ) {
          return prevCounts; // Prevent decrement if it's the only adult and no other guests
        } else if (prevCounts.adults > 0) {
          // Check if other guest types are greater than 0
          if (
            prevCounts.adults === 1 &&
            (prevCounts.children > 0 ||
              prevCounts.infants > 0 ||
              prevCounts.pets > 0)
          ) {
            return prevCounts; // Prevent decrement to 0 if there are other guests
          }
          return {
            ...prevCounts,
            adults: prevCounts.adults - 1,
          };
        } else {
          return prevCounts; // Prevent decrement below zero
        }
      } else {
        return {
          ...prevCounts,
          [key]: prevCounts[key] > 0 ? prevCounts[key] - 1 : 0,
        };
      }
    });
  };

  const isAdultDecrementDisabled =
    initializeWithOneAdult &&
    guestCounts.adults === 1 &&
    (guestCounts.children > 0 ||
      guestCounts.infants > 0 ||
      guestCounts.pets > 0);

  let displayText = "Add guests";
  const totalGuests = guestCounts.adults + guestCounts.children;

  if (totalGuests > 0) {
    displayText = `${totalGuests} guest${totalGuests > 1 ? "s" : ""}`;

    if (guestCounts.infants > 0) {
      displayText += `, ${guestCounts.infants} infant${
        guestCounts.infants > 1 ? "s" : ""
      }`;
    }

    if (guestCounts.pets > 0) {
      displayText += `, ${guestCounts.pets} pet${
        guestCounts.pets > 1 ? "s" : ""
      }`;
    }
  }

  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearchClick = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    ev.preventDefault();
    ev.stopPropagation();

    const params: Record<string, string> = {};

    if (checkDates?.from) {
      params.checkIn = checkDates.from.toISOString();
    }
    if (checkDates?.to) {
      params.checkOut = checkDates.to.toISOString();
    }

    if (selectedDestination) {
      if (selectedDestination === "United States") {
        params.location = "USA";
      } else if (selectedDestination === "I'm flexible") {
        params.location = "";
      } else {
        params.location = selectedDestination;
      }
    }

    const totalGuests =
      guestCounts.adults +
      guestCounts.children +
      guestCounts.infants +
      guestCounts.pets;

    if (totalGuests > 0) {
      params.capacity = totalGuests.toString();
    }

    updateSearchParams(params, searchParams, setSearchParams);
  };

  return (
    <div
      className={cn(
        "flex items-center hover:bg-gray-200 rounded-full py-2",
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={null}
            className="md:mr-14 text-xs flex flex-col justify-center items-start py-7 "
          >
            <div className={labelClassName}>{label}</div>
            <div className="text-gray-500">{displayText}</div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn("w-96 rounded-lg", dropdownClassName)}
        >
          <ScrollArea className="h-72">
            <DropdownMenuItem>
              <Card
                title="Adults"
                paragraph="Ages 13 or above"
                count={guestCounts.adults}
                onIncrement={() => handleIncrement("adults")}
                onDecrement={() => handleDecrement("adults")}
                isDecrementDisabled={isAdultDecrementDisabled}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Card
                title="Children"
                paragraph="Ages 2-12"
                count={guestCounts.children}
                onIncrement={() => handleIncrement("children")}
                onDecrement={() => handleDecrement("children")}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Card
                title="Infants"
                paragraph="Under 2"
                count={guestCounts.infants}
                onIncrement={() => handleIncrement("infants")}
                onDecrement={() => handleDecrement("infants")}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Card
                title="Pets"
                paragraph="Bringing a service animal?"
                count={guestCounts.pets}
                onIncrement={() => handleIncrement("pets")}
                onDecrement={() => handleDecrement("pets")}
              />
            </DropdownMenuItem>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
      {showSearchButton && (
        <Button
          className="text-white font-800 p-3 rounded-full flex items-center justify-center mr-2"
          onClick={(ev) => handleSearchClick(ev)}
        >
          <Search className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

export default Guests;
