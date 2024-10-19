import { useState } from "react";
import logo from "../../assets/airbnb-logo.webp";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/user.context";
import CurrencySelector from "./CurrencySelector";

function TripsHeader() {
  const { loggedInUser, logout } = useAuth();
  const [, setModalOpen] = useState(false);
  return (
    <>
      <header className="flex justify-between items-center px-24 pt-9 sticky top-0 z-20 bg-white pb-7 h-20 border-b">
        <Link to="/">
          <img className="w-[105px] h-[60px]" src={logo} alt="" />
        </Link>
        <div className="flex justify-center items-center gap-6">
          <Link to="/becomeAhost" className="font-600 text-sm">
            Airbnb your home
          </Link>
          <CurrencySelector />
          <div className="flex items-center border border-gray-300 rounded-full p-3 gap-4 hover:shadow-lg">
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
                      <DropdownMenuItem className="font-semibold">
                        Notifications
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
                    <DropdownMenuItem>Airbnb your home</DropdownMenuItem>
                    <DropdownMenuItem>Help center</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}

export default TripsHeader;
