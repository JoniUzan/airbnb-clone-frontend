import { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/user.context";

interface CardData {
  id: number;
  icon: JSX.Element;
  text: string;
  value: string;
}

const ProfilePage = () => {
  const { loggedInUser } = useAuth();
  const [cardData, setCardData] = useState<CardData[]>([]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const initializeData = () => {
    if (!loggedInUser?.user) return [];

    const formattedBirthday = loggedInUser.user.birthday
      ? formatDate(loggedInUser.user.birthday.toString())
      : "";

    const wishlistsTitles =
      loggedInUser.user.wishlists && loggedInUser.user.wishlists.length > 0
        ? loggedInUser.user.wishlists
            .map((wishlist) => wishlist.title)
            .join(", ")
        : "wishlists..";

    const initialData: CardData[] = [
      {
        id: 1,
        icon: <span className="text-gray-500">✉️</span>, // Email icon
        text: "Email",
        value: loggedInUser.user.email || "",
      },
      {
        id: 2,
        icon: <span className="text-gray-500">👤</span>, // Name icon
        text: "Name",
        value: `${loggedInUser.user.firstName || ""} ${
          loggedInUser.user.lastName || ""
        }`,
      },
      {
        id: 3,
        icon: <span className="text-gray-500">🎂</span>, // Birthday icon
        text: "Birthday",
        value: formattedBirthday,
      },
      {
        id: 4,
        icon: <span className="text-gray-500">📋</span>, // Wishlists icon
        text: "Wishlists",
        value: wishlistsTitles,
      },
    ];

    return initialData;
  };

  useEffect(() => {
    setCardData(initializeData());
  }, [loggedInUser]); // Depend on loggedInUser to update when it changes

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-10 lg:px-16 xl:px-32">
      {/* Left Side: User Card */}
      <div className="w-full lg:w-auto lg:flex-shrink-0">
        <Card className="border-none shadow-xl rounded-2xl w-full lg:w-96">
          <CardHeader>
            <div className="flex flex-col gap-4 items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-black flex items-center justify-center">
                <span className="text-4xl md:text-6xl font-bold text-white">
                  {loggedInUser?.user.firstName[0].toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex flex-col gap-2 text-center">
                <CardTitle>
                  {loggedInUser?.user.firstName.toUpperCase() || "USER"}
                </CardTitle>
                <CardDescription className="flex items-center justify-center font-semibold text-black">
                  Guest
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Right Side: Information Cards */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl md:text-2xl font-semibold mb-2">Your profile</h1>
        <p className="mb-4 text-sm md:text-base">
          The information you share will be used across Airbnb to help other
          guests and Hosts get to know you. Learn more
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cardData.map((data) => (
            <Card
              key={data.id}
              className="flex flex-col p-3 md:p-4 border border-gray-200 shadow-md rounded-lg"
            >
              <div className="flex items-center space-x-2.5">
                <div className="flex-shrink-0">{data.icon}</div>
                <div className="min-w-0 flex-1 overflow-hidden text-ellipsis">
                  {typeof data.value === "string"
                    ? data.value
                    : JSON.stringify(data.value)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
