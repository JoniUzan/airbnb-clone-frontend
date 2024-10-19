import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchHomeById,
  fetchHomeReservations,
  findOrCreateChatroom,
} from "@/lib/http";
import { DateRange, IHome, IReservation } from "@/types";
import { IReview } from "@/types";
import { Star, StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { iconMap, AmenityKey } from "./AmenityIconMap";
import ReviewsSection from "./Reviews";
import { NavLink } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RatingBreakdown from "./RatingBreackdown";
import { Calendar } from "../ui/calendar";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, updateSearchParams } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Guests from "./Guests";
import { Link as ScrollLink } from "react-scroll";
import { useGuestContext } from "@/providers/Guest-Context";
import { useDate } from "@/hooks/useDate";
import GoogleMap from "../googleMaps/GoogleMap";
import { useCurrency } from "@/providers/CurrencyContext";
import { Textarea } from "../ui/textarea";
import { useAuth } from "@/providers/user.context";

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

function HomeDetails() {
  const { currency, } = useCurrency();
  const { guestCounts } = useGuestContext();
  const { id } = useParams<{ id: string }>();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isStickyHeaderVisible, setIsStickyHeaderVisible] = useState(false);
  const [isPriceCardButtonVisible, setIsPriceCardButtonVisible] =
    useState(true);
  const { checkDates, setCheckDates } = useDate();
  const priceCardRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [newMessage, setNewMessage] = useState("");
  const { loggedInUser } = useAuth();
  const userId = loggedInUser?.user._id;
  const Navigate = useNavigate();

  const {
    data: home,
    isLoading,
    error,
  } = useQuery<IHome | null>({
    queryKey: ["home", id],
    queryFn: () => fetchHomeById(id as string),
  });

  const hostId = home?.host._id;

  const position: { lat: number; lng: number } = {
    lat: home?.loc.lat ?? 0,
    lng: home?.loc.lan ?? 0,
  };

  const getReservedDates = (reservations: IReservation[]): Date[] => {
    return reservations.flatMap((reservation) => {
      const dates: Date[] = [];
      for (
        let currentDate = new Date(reservation.startDate);
        currentDate <= new Date(reservation.endDate);
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        dates.push(new Date(currentDate));
      }
      return dates;
    });
  };

  const { data: reservations } = useQuery<IReservation[]>({
    queryKey: ["reservations", id],
    queryFn: () => fetchHomeReservations(id as string),
  });

  useEffect(() => {
    // Set a timeout to scroll to the top after 1 second (1000 milliseconds)
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }, 0);

    // Cleanup function to clear the timeout if the component unmounts before the timeout completes
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    console.error("Error fetching reservations:", error);
  }

  const reservedDates = reservations ? getReservedDates(reservations) : [];

  const adjustDateForLocalTimeZone = (date: Date): Date => {
    const offset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    return new Date(date.getTime() - offset);
  };

  useEffect(() => {
    const params: Record<string, string> = {};
    if (checkDates?.from) {
      const localCheckInDate = adjustDateForLocalTimeZone(checkDates.from);
      params.checkIn = localCheckInDate.toISOString();
    }
    if (checkDates?.to) {
      const localCheckOutDate = adjustDateForLocalTimeZone(checkDates.to);
      params.checkOut = localCheckOutDate.toISOString();
    }

    const totalGuests =
      guestCounts.adults +
      guestCounts.children +
      guestCounts.infants +
      guestCounts.pets;

    if (totalGuests > 0) {
      params.guests = totalGuests.toString();
    }
    updateSearchParams(params, searchParams, setSearchParams);
  }, [checkDates, guestCounts, searchParams, setSearchParams]);

  const handleDateChange = (newDates: DateRange | undefined) => {
    setCheckDates(newDates);
  };

  useEffect(() => {
    const currentRef = priceCardRef.current;

    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPriceCardButtonVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
      console.log("Observer unobserved");
    };
  }, [priceCardRef.current]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 550) {
        setIsStickyHeaderVisible(true);
      } else {
        setIsStickyHeaderVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading home details</div>;
  if (!home) return <div>No home details available.</div>;

  const handleReviewDialogChange = (open: boolean) => {
    setIsReviewDialogOpen(open);
  };

  const handleClear = () => {
    setCheckDates(undefined);
  };

  const calculateNights = (checkDates: DateRange | undefined) => {
    if (!checkDates || !checkDates.from || !checkDates.to) return 0;

    const diffInTime = checkDates.to.getTime() - checkDates.from.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24); // Convert milliseconds to days

    return diffInDays;
  };

  const homePrice =
    currency === "USD" ? `$${home.price}` : `₪${Math.round(home.price * 3.7)}`;

  const numericalPrice =
    currency === "USD" ? home.price : Math.round(home.price * 3.7);

  const totalNights = calculateNights(checkDates);
  const totalPrice = numericalPrice * totalNights;

  const formattedTotalPrice =
    currency === "USD" ? `$${totalPrice}` : `₪${totalPrice}`;

  const CleaningFee = 35;
  const AirbnbServiceFee = 67;
  const Texas = 12;

  const numericFormattedTotalPrice = parseFloat(
    formattedTotalPrice.replace(/[^0-9.-]+/g, "")
  );
  const totalPriceUSD =
    numericFormattedTotalPrice + CleaningFee + AirbnbServiceFee + Texas;

  const totalPriceILS =
    Math.round(numericalPrice * totalNights) +
    Math.round(CleaningFee * 3.7) +
    Math.round(AirbnbServiceFee * 3.7) +
    Math.round(Texas * 3.7);
  // Calculate the overall rating
  const calculateOverallAverageRating = (reviews: IReview[]) => {
    if (reviews.length === 0) return 0;

    let totalRating = 0;
    const numCategories = 6;
    reviews.forEach((review) => {
      totalRating += review.rate.Accuracy;
      totalRating += review.rate["Check-in"];
      totalRating += review.rate.Cleanliness;
      totalRating += review.rate.Communication;
      totalRating += review.rate.Location;
      totalRating += review.rate.Value;
    });
    return (totalRating / (numCategories * reviews.length)).toFixed(1);
  };

  function handleSendNewNessage(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    try {
      findOrCreateChatroom(userId, hostId, userId, newMessage);
      Navigate("../account/messages");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div id="photos">
      {/* New Sticky Header */}
      {isStickyHeaderVisible && (
        <div className="sticky top-0 bg-white border-b z-50 h-20 ">
          <div className="p-4 px-16 flex justify-between items-center self-center h-full">
            <div>
              <ScrollLink
                to="photos"
                smooth={true}
                duration={500}
                className="text-[0.85rem] font-semibold px-3 cursor-pointer"
              >
                Photos
              </ScrollLink>
              <ScrollLink
                to="amenities"
                smooth={true}
                duration={500}
                className="text-[0.85rem] font-semibold px-3 cursor-pointer"
              >
                Amenities
              </ScrollLink>
              <ScrollLink
                to="reviews"
                smooth={true}
                duration={500}
                className="text-[0.85rem] font-semibold px-3 cursor-pointer"
              >
                Reviews
              </ScrollLink>
              <ScrollLink
                to="location"
                smooth={true}
                duration={500}
                className="text-[0.85rem] font-semibold px-3 cursor-pointer"
              >
                Location
              </ScrollLink>
            </div>
            <div>
              {!isPriceCardButtonVisible &&
                (checkDates === undefined || guestCounts.adults === 0 ? (
                  <div className="flex gap-4 items-center">
                    <div className="flex flex-col">
                      <p>Add dates for prices</p>
                      <p>
                        <div className="text-xs flex items-center gap-1">
                          <div className="flex items-center gap-1">
                            <Star fill="black" width="12px" />
                            {home.reviews.length > 0 ? (
                              <p className="font-semibold">
                                {calculateOverallAverageRating(home.reviews)}
                              </p>
                            ) : (
                              <p>New</p>
                            )}
                          </div>
                          {home.reviews.length > 0 && (
                            <>
                              <span className=" text-black">•</span>
                              {home.reviews.length} review
                              {home.reviews.length > 1 ? "s" : ""}
                            </>
                          )}
                        </div>
                      </p>
                    </div>
                    <ScrollLink
                      to="amenitiesButton"
                      smooth={true}
                      duration={500}
                    >
                      <Button
                        variant={"secondary"}
                        className="text-white p-6 px-1 rounded-lg text-md mr-8"
                      >
                        Check availability
                      </Button>
                    </ScrollLink>
                  </div>
                ) : (
                  <div className="flex gap-4 items-center">
                    <div className="flex flex-col">
                      <p className="flex justify-center items-center gap-1">
                        <span className="font-semibold">{homePrice}</span>{" "}
                        <span className="text-xs">night</span>
                      </p>
                      <p>
                        <div className="text-xs flex items-center gap-1">
                          <div className="flex items-center gap-1">
                            <Star fill="black" width="12px" />
                            {home.reviews.length > 0 ? (
                              <p className="font-semibold">
                                {calculateOverallAverageRating(home.reviews)}
                              </p>
                            ) : (
                              <p>New</p>
                            )}
                          </div>
                          {home.reviews.length > 0 && (
                            <>
                              {" "}
                              <span className=" text-black">•</span>
                              {home.reviews.length} review
                              {home.reviews.length > 1 ? "s" : ""}
                            </>
                          )}
                        </div>
                      </p>
                    </div>

                    <NavLink
                      to={`/reservation/${
                        home._id
                      }/?guests=${guestCounts}/&&checkIn=${
                        checkDates?.from
                          ? encodeURIComponent(checkDates.from.toISOString())
                          : ""
                      }/&checkOut=${
                        checkDates?.to
                          ? encodeURIComponent(checkDates.to.toISOString())
                          : ""
                      }`}
                    >
                      <Button
                        variant={"secondary"}
                        className="text-white p-6 px-10 rounded-lg text-md mr-8"
                      >
                        Reserve
                      </Button>
                    </NavLink>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-20">
        <div className="flex justify-between items-center">
          {/* Name */}
          <h1 className="text-2xl font-semibold">{home.name}</h1>
        </div>

        {/* Images */}
        <div className="flex mt-4">
          {/* Large Image */}
          <div className="w-1/2 pr-2">
            <img
              src={home.imgUrls[0]}
              alt={`${home.name} - Main Image`}
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>

          {/* Small Images */}
          <div className="w-1/2 grid grid-cols-2 gap-2 h-[300px]">
            {home.imgUrls.slice(1, 5).map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${home.name} - Image ${index + 1}`}
                className="w-full h-[calc(300px/2-2px)] object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        <div className="flex gap-24 mt-4">
          {/* Room Type */}
          <div className="w-[80rem]">
            <div className="mt-4">
              <h2 className="text-xl font-semibold">
                {home.roomType} in {home.loc.address}
              </h2>
            </div>
            {/* Room Details */}
            <div className="flex items-center gap-1 text-sm">
              {[
                `${home.capacity} guest${home.capacity > 1 ? "s" : ""}`,
                `${home.bedrooms} bedroom${home.bedrooms > 1 ? "s" : ""}`,
                home.beds ? `${home.beds} bed${home.beds > 1 ? "s" : ""}` : "",
                `${home.bathrooms} bath${home.bathrooms > 1 ? "s" : ""}`,
              ]
                .filter((detail) => detail)
                .map((detail, index, array) => (
                  <>
                    <p className="flex items-center">{detail}</p>
                    {index < array.length - 1 && (
                      <span className="text-black">•</span>
                    )}
                  </>
                ))}
            </div>

            {/* Rating and Number of Reviews */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star fill="black" width="16px" />
                {home.reviews.length > 0 ? (
                  <p className="text-lg font-semibold">
                    {calculateOverallAverageRating(home.reviews)}
                  </p>
                ) : (
                  <p className="font-semibold text-lg">New</p>
                )}
              </div>
              {home.reviews.length > 0 && (
                <>
                  <span className=" text-black">•</span>
                  <Button
                    variant={null}
                    className="text-sm px-0 underline font-semibold"
                    onClick={() => setIsReviewDialogOpen(true)}
                  >
                    {home.reviews.length} review
                    {home.reviews.length > 1 ? "s" : ""}
                  </Button>
                </>
              )}
            </div>
            <hr className="mt-6" />
            {/* Host Details */}
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-4">
                <img
                  src={home.host.imgUrl}
                  alt={home.host.fullname}
                  className="w-10 h-10 rounded-full mt-2"
                />
                <div>
                  <h2 className="font-semibold ">
                    Hosted by {home.host.fullname}
                  </h2>
                  {home.host.isSuperhost && (
                    <div className="flex items-center gap-1 text-xs">
                      <p>Superhost</p>
                      <span className="text-black">•</span>
                      <p>10 years hosting</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Dialog>
                  <DialogTrigger>
                    <Button variant="new" className="flex justify-end">
                      Message Host
                    </Button>
                  </DialogTrigger>
                  <DialogContent className=" mb-10 max-h-[40rem] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold mt-8">
                        Message Host
                      </DialogTitle>
                    </DialogHeader>
                    <Textarea
                      placeholder="Write a message..."
                      onChange={(e) => setNewMessage(e.target.value)}
                    ></Textarea>
                    <Button
                      variant="secondary"
                      onClick={(e) => handleSendNewNessage(e)}
                    >
                      Submit
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <hr className="mt-6" />
            {/* Booking Options */}
            <div className="mt-4">
              <div className="flex flex-col gap-2">
                {home.host.isSuperhost && (
                  <div className="flex items-start  mt-1 gap-6 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                      role="presentation"
                      focusable="false"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "currentcolor",
                      }}
                    >
                      <path d="M16 17a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM25.67.33a2 2 0 0 1 2 1.85v6.54a2 2 0 0 1-.97 1.7l-.14.08-9.67 4.84a2 2 0 0 1-1.61.07l-.17-.07-9.67-4.84a2 2 0 0 1-1.1-1.62V2.33a2 2 0 0 1 1.84-2h.15zm0 2H6.33v6.39L16 13.55l9.67-4.83z"></path>
                    </svg>
                    <div>
                      <p className="font-500">Superhost</p>
                      <p className="text-gray-600 text-xs">
                        Superhosts are experienced, highly rated Hosts.
                      </p>
                    </div>
                  </div>
                )}
                {home.bookingOptions.SelfCheckIn && (
                  <div className="flex items-start  mt-1 gap-6 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                      role="presentation"
                      focusable="false"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "currentColor",
                      }}
                    >
                      <path d="M24.33 1.67a2 2 0 0 1 2 1.85v24.81h3v2H2.67v-2h3V3.67a2 2 0 0 1 1.85-2h.15zm-4 2H7.67v24.66h12.66zm4 0h-2v24.66h2zm-7 11a1.33 1.33 0 1 1 0 2.66 1.33 1.33 0 0 1 0-2.66z"></path>
                    </svg>
                    <div>
                      <p className="font-500">Self check-in</p>
                      <p className="text-gray-600 text-xs">
                        Check yourself in with the smartlock.
                      </p>
                    </div>
                  </div>
                )}
                {home.bookingOptions.AllowsPets && (
                  <div className="flex items-start  mt-1 gap-6 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                      role="presentation"
                      focusable="false"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "currentColor",
                      }}
                    >
                      <path d="M13.7 13.93a4 4 0 0 1 5.28.6l.29.37 4.77 6.75a4 4 0 0 1 .6 3.34 4 4 0 0 1-4.5 2.91l-.4-.08-3.48-.93a1 1 0 0 0-.52 0l-3.47.93a4 4 0 0 1-2.94-.35l-.4-.25a4 4 0 0 1-1.2-5.2l.23-.37 4.77-6.75a4 4 0 0 1 .96-.97zm3.75 1.9a2 2 0 0 0-2.98.08l-.1.14-4.84 6.86a2 2 0 0 0 2.05 3.02l.17-.04 4-1.07a1 1 0 0 1 .5 0l3.97 1.06.15.04a2 2 0 0 0 2.13-2.97l-4.95-7.01zM27 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM5 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm22 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM5 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6-10a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm10 0a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM11 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path>
                    </svg>
                    <div>
                      <p className="font-500">Furry friends welcome</p>
                      <p className="text-gray-600 text-xs">
                        Bring your pets along for the stay.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <hr className="mt-6" />
            {/* Summary */}
            <div className="mt-6 space-y-4">
              <div className="flex gap-1 items-center p-3 px-4 bg-gray-100 rounded-lg">
                <span className="text-sm font-500">
                  Some info has been automatically translated.
                </span>
                <button
                  aria-label="Show original"
                  type="button"
                  className=" underline font-600"
                >
                  Show original
                </button>
              </div>
              <p id="amenities">{home.summary}</p>
            </div>
            <hr className="mt-6" />
            {/* Amenities */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {home.amenities.slice(0, 10).map((amenity, index) => {
                  const amenityKey = amenity as AmenityKey;
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      {iconMap[amenityKey] || <div className="w-6 h-6" />}{" "}
                      <p>{amenity}</p>
                    </div>
                  );
                })}
              </div>
              {home.amenities.length > 10 && (
                <Dialog>
                  <DialogTrigger id="amenitiesButton">
                    <Button
                      variant={"outline"}
                      className="mt-8 hover:bg-gray-50 p-6 border-black text-sm font-semibold"
                      aria-label={`Show all ${home.amenities.length} amenities`}
                    >
                      Show all {home.amenities.length} amenities
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl mb-10 max-h-[40rem] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold mt-8">
                        What this place offers
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 h-[70vh] flex flex-col gap-8 ">
                      {home.amenities.map((amenity, index) => {
                        const amenityKey = amenity as AmenityKey;
                        return (
                          <div
                            key={index}
                            className="flex items-center space-x-2 py-2 border-b border-gray-200"
                          >
                            {iconMap[amenityKey] || <div className="w-6 h-6" />}{" "}
                            <p>{amenity}</p>
                          </div>
                        );
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <hr className="mt-10" />
            {/* dates */}
            <div className="mt-10 flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <p className="text-xl font-600">Select check-in date</p>
                <p className="text-xs text-gray-600 font-500">
                  Minimum stay: 1 nights
                </p>
              </div>
              <Calendar
                classNames={{
                  months:
                    "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                  month: "space-y-4 w-full flex flex-col",
                  table: "w-full h-full border-collapse space-y-1",
                  head_row: "",
                  row: "w-full mt-2",
                }}
                disabled={reservedDates}
                mode="range"
                selected={checkDates}
                onSelect={(ev) => {
                  handleDateChange(ev as DateRange | undefined);
                }}
                fromDate={new Date()}
                numberOfMonths={2}
                initialFocus
              />
              <Button
                variant={null}
                className="underline hover:bg-gray-100 self-end"
                onClick={handleClear}
              >
                Clear dates
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <div className="sticky top-28">
              {" "}
              {/* This div handles the sticky positioning */}
              <Card className="w-[23rem] shadow-xl">
                <CardHeader>
                  <CardTitle className="font-400 text-xl">
                    {checkDates ? `${homePrice} night` : "Add dates for prices"}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="border rounded-lg ">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={null}
                          className={cn(
                            "flex w-full border-b ",
                            !checkDates && "text-muted-foreground py-6"
                          )}
                        >
                          <div className="flex w-full ">
                            <div className="flex justify-start text-left flex-col w-1/2 pr-4 border-r">
                              <div className="text-black font-600 text-[10px]">
                                CHECK-IN
                              </div>
                              <div className="text-gray-500 font-500 text-xs">
                                {checkDates && checkDates.from
                                  ? `${
                                      monthNames[
                                        checkDates.from?.getMonth() ?? 0
                                      ] + " "
                                    }${checkDates.from?.getDate() ?? ""}`
                                  : "Add dates"}
                              </div>
                            </div>

                            <div className="flex justify-start text-left flex-col w-1/2 pl-4">
                              <div className="text-black font-600 text-[10px]">
                                CHECKOUT
                              </div>
                              <div className="text-gray-500 font-500 text-xs">
                                {checkDates && checkDates.to
                                  ? `${
                                      monthNames[
                                        checkDates.to?.getMonth() ?? 0
                                      ] + " "
                                    }${checkDates.to?.getDate() ?? ""}`
                                  : "Add dates"}
                              </div>
                            </div>
                          </div>
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          disabled={reservedDates}
                          mode="range"
                          selected={checkDates}
                          onSelect={(ev) => {
                            handleDateChange(ev as DateRange | undefined);
                          }}
                          numberOfMonths={2}
                          fromDate={new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <div className="border-b py-2 w-full">
                      <Guests
                        checkDates={checkDates}
                        dropdownClassName="border border-gray-300 rounded-none"
                        className="hover:bg-transparent "
                        showSearchButton={false}
                        label="GUESTS"
                        labelClassName="text-black font-600 text-[10px] "
                        initializeWithOneAdult={true}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter ref={priceCardRef} className="flex flex-col gap-3">
                  <Button
                    variant={"secondary"}
                    className="w-full text-white text-md py-6"
                  >
                    {checkDates && guestCounts.adults > 0 ? (
                      <NavLink to={`/reservation/${home._id}`}>Reserve</NavLink>
                    ) : (
                      "Check availability"
                    )}
                  </Button>

                  {checkDates && (
                    <div className="w-full flex flex-col gap-2">
                      <p className="text-xs text-center">
                        You won't be charged yet
                      </p>
                      <div className="flex justify-between">
                        <p className="underline">
                          {homePrice} x {calculateNights(checkDates)} nights
                        </p>
                        <p>{formattedTotalPrice}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="underline">Cleaning fee</p>
                        <p>
                          {currency === "USD"
                            ? `$${CleaningFee}`
                            : `₪${Math.round(CleaningFee * 3.7)}`}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="underline">Airbnb service fee</p>
                        {currency === "USD"
                          ? `$${AirbnbServiceFee}`
                          : `₪${Math.round(AirbnbServiceFee * 3.7)}`}
                      </div>
                      <div className="flex justify-between">
                        <p className="underline">Taxes</p>
                        {currency === "USD"
                          ? `$${Texas}`
                          : `₪${Math.round(Texas * 3.7)}`}
                      </div>
                      <hr className="mt-2" />
                      <div className="flex justify-between font-semibold mt-2">
                        <p>Total</p>
                        <p>
                          {currency === "USD"
                            ? `$${totalPriceUSD}`
                            : `₪${totalPriceILS}`}
                        </p>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
        <hr id="reviews" className="mt-10" />

        {/* Rating Breakdown */}

        {home.reviews.length > 0 ? (
          <>
            <RatingBreakdown reviews={home.reviews} />
            <hr className="mt-10" />
            <ReviewsSection
              reviews={home.reviews}
              isDialogOpen={isReviewDialogOpen}
              onDialogOpenChange={handleReviewDialogChange}
            />
          </>
        ) : (
          <div className="flex flex-col gap-6 mt-10">
            <p className="text-2xl font-semibold">No reviews (yet)</p>
            <p className="w-[30%] font-semibold flex gap-4">
              <StarIcon className="w-8 h-8" /> This host has reviews for other
              places to stay.
            </p>
            <hr className="mt-10" />
          </div>
        )}

        {/* Reviews */}

        <div
          id="location"
          className=" w-full flex flex-col gap-4 items-center mt-6"
        >
          <p className="text-2xl font-semibold self-start">Where you’ll be</p>
          <p className="text-md self-start">{home.loc.city}</p>
          {position && (
            <GoogleMap
              homes={[home]}
              position={position}
              zoom={17}
              width="100%"
              scroll="none"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeDetails;
