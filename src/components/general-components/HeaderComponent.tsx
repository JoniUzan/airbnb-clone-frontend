import { useState, useEffect, useCallback } from "react";
import { Menu, Search } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Modal from "./LoginModalComponent";
import { useAuth } from "@/providers/user.context";
import logo from "../../assets/airbnb-logo.webp"; // Original logo
import { Button } from "../ui/button";
import { useDate } from "@/hooks/useDate";
import { useGuestContext } from "@/providers/Guest-Context";
import CurrencySelector from "./CurrencySelector";
import { fetchNotifications } from "@/lib/http";
import { INotification } from "@/types";
import { useQuery } from "@tanstack/react-query";

function HeaderComponent() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isReplacementClicked, setIsReplacementClicked] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track window width
  const [isScrollListenerActive, setIsScrollListenerActive] = useState(true);
  const { loggedInUser, logout } = useAuth();
  const location = useLocation();
  const { checkDates } = useDate();
  const { guestCounts } = useGuestContext();
  const [selectedDestination, setSelectedDestination] = useState<string>("");

  const { data: notifications } = useQuery<INotification[], Error>({
    queryKey: ["notifications", loggedInUser?.user._id],
    queryFn: () => fetchNotifications(loggedInUser?.user._id as string),
    enabled: !!loggedInUser?.user._id,
  });

  const unreadNotifications = notifications?.filter(
    (notification) => !notification.read
  );

  const isHomePage = location.pathname === "/";

  const formatDates = () => {
    if (!checkDates?.from || !checkDates?.to) return "";

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

    const fromMonth = monthNames[checkDates.from.getMonth()];
    const fromDay = checkDates.from.getDate();
    const toDay = checkDates.to.getDate();

    return `${fromMonth} ${fromDay} - ${toDay}`;
  };

  const handleScroll = useCallback(() => {
    if (isScrollListenerActive) {
      if (window.scrollY > 0) {
        setIsScrolled(true);
        setIsReplacementClicked(false);
      } else if (window.scrollY === 0) {
        setIsScrolled(false);
      }
    }
  }, [isScrollListenerActive]);

  // Track window resize to update screen width
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleReplacementClick = () => {
    setIsReplacementClicked(true);
    setIsScrollListenerActive(false);
    setTimeout(() => {
      setIsScrollListenerActive(true);
    }, 1000);
  };

  return (
    <>
      <div
        className={`bg-white z-10 ${isReplacementClicked ? "z-50" : ""} ${
          isHomePage ? "sticky top-0" : ""
        }`}
      >
        <nav className="flex justify-between items-center p-3 md:px-20">
          <Link to="/">
            <img
              src={logo} // Change logo based on screen size
              alt="logo"
              className="w-[105px] h-[60px]" // Keep size consistent
            />
          </Link>

          <div className="md:flex gap-6 items-center hidden">
            <div
              className={`flex relative left-64 items-center transition-all duration-300 ${
                isScrolled && !isReplacementClicked
                  ? "opacity-0 translate-y-[-20px]"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "font-bold" : "")}
              >
                Stays
              </NavLink>
            </div>
            <div
              className={`relative right-6 transition-all duration-300 mt-2 ${
                isScrolled && !isReplacementClicked
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-[20px] pointer-events-none"
              }`}
            >
              <div
                className="flex items-center border border-gray-300 rounded-full py-2 shadow-sm text-sm cursor-pointer  md:ml-28 lg:w-auto lg:ml-0" // Adjust width based on screen size
                onClick={handleReplacementClick}
              >
                <div className="px-3 ml-4 border-r border-gray-300 font-semibold">
                  {selectedDestination ? selectedDestination : "Anywhere"}
                </div>
                <div className="px-3 border-r border-gray-300 font-semibold">
                  {checkDates ? formatDates() : "Any week"}
                </div>
                <div className="ml-2 text-gray-700 flex items-center justify-between gap-4">
                  {guestCounts.adults > 0 ? (
                    <p className="">
                      {guestCounts.adults + guestCounts.children} guest
                      {guestCounts.adults + guestCounts.children > 1
                        ? "s"
                        : ""}{" "}
                      {guestCounts.infants > 0
                        ? `${guestCounts.infants} infant${
                            guestCounts.infants > 1 ? "s" : ""
                          }`
                        : ""}
                      {guestCounts.pets > 0
                        ? `${
                            guestCounts.infants > 0 ||
                            guestCounts.adults + guestCounts.children > 0
                              ? " "
                              : ""
                          }${guestCounts.pets} pet${
                            guestCounts.pets > 1 ? "s" : ""
                          }`
                        : ""}
                    </p>
                  ) : (
                    "Add guests"
                  )}

                  <Button className="text-white font-800 p-3 rounded-full flex items-center justify-center mr-2">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block">
              <Link
                to="/becomeAhost"
                className="font-600 text-sm invisible md:invisible lg:visible"
              >
                Airbnb your home
              </Link>
            </div>
            <CurrencySelector />
            <div className="flex items-center border border-grey-300 rounded-full p-3 gap-4 hover:shadow-lg">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex gap-2">
                  <Menu className="w-4 h-4 self-center" />
                  <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
                    {loggedInUser ? (
                      <div className="bg-black w-6 h-6 rounded-full text-white flex justify-center items-center text-xs">
                        {loggedInUser.user.picture ? (
                          <img
                            src={loggedInUser.user.picture}
                            alt={loggedInUser.user.firstName[0]}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span>{loggedInUser.user.firstName[0]}</span>
                        )}
                      </div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 relative top-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="relative right-12 top-4 w-60 flex flex-col gap-2">
                  {loggedInUser ? (
                    <>
                      <Link to="/account/messages">
                        <DropdownMenuItem className="font-semibold">
                          Messages
                        </DropdownMenuItem>
                      </Link>
                      <Link to="/account/notifications">
                        <DropdownMenuItem className="font-semibold flex justify-between">
                          Notifications
                          {unreadNotifications &&
                            unreadNotifications.length > 0 && (
                              <div className="bg-red-500 text-white rounded-full w-4 h-4 flex justify-center items-center text-xs">
                                {unreadNotifications.length}
                              </div>
                            )}
                        </DropdownMenuItem>
                      </Link>
                      <Link to="/trips">
                        <DropdownMenuItem className="font-semibold">
                          Trips
                        </DropdownMenuItem>
                      </Link>
                      <Link to="/wishlists">
                        <DropdownMenuItem className="font-semibold">
                          Wishlists
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <Link to={"/hostPage"}>
                        <DropdownMenuItem>Manage listings</DropdownMenuItem>
                      </Link>

                      <Link to={"/account"}>
                        <DropdownMenuItem>Account</DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Gift cards</DropdownMenuItem>
                      <DropdownMenuItem>Help center</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          logout();
                          // Navigate after logging out
                          window.location.href = "/";
                        }}
                      >
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        className="font-bold"
                        onClick={() => setModalOpen(true)}
                      >
                        Log in
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setModalOpen(true)}>
                        Sign up
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Gift cards</DropdownMenuItem>
                      <Link to="/becomeAhost" className="text-sm">
                        <DropdownMenuItem>Airbnb your home</DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>Help center</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>

        {/* Conditionally render the SearchBar */}
        <div
          className={`transition-all duration-300 ${
            isScrolled && !isReplacementClicked && windowWidth >= 768
              ? "hidden"
              : "block"
          }`}
        >
          <SearchBar
            selectedDestination={selectedDestination}
            setSelectedDestination={setSelectedDestination}
          />
        </div>
        <hr className="pt-2 pb-4 mt-3" />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

export default HeaderComponent;
