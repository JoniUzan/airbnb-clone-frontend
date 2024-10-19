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
      : "N/A";

    const wishlistsTitles =
      loggedInUser.user.wishlists && loggedInUser.user.wishlists.length > 0
        ? loggedInUser.user.wishlists
            .map((wishlist) => wishlist.title)
            .join(", ")
        : "N/A";

    const initialData: CardData[] = [
      {
        id: 1,
        icon: <span className="text-gray-500">✉️</span>, // Email icon
        text: "Email",
        value: loggedInUser.user.email || "N/A",
      },
      {
        id: 2,
        icon: <span className="text-gray-500">👤</span>, // Name icon
        text: "Name",
        value: `${loggedInUser.user.firstName || "N/A"} ${
          loggedInUser.user.lastName || "N/A"
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
    <div className="flex gap-10 p-10 px-32">
      {/* Left Side: User Card */}
      <div className="flex mr-5">
        <Card className="border-none shadow-xl rounded-2xl h-60 w-96 mt-10">
          <CardHeader>
            <div className="flex flex-col gap-4 items-center">
              <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center mr-2.5">
                <span className="text-6xl font-bold text-white">
                  {loggedInUser?.user.firstName[0].toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex flex-col gap-2">
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
      <div className="flex-2">
        <h1 className="text-2xl font-semibold mb-2">Your profile</h1>
        <p className="mb-4">
          The information you share will be used across Airbnb to help other
          guests and Hosts get to know you. Learn more
        </p>
        <div className="grid grid-cols-auto-fill min-w-[200px] gap-2">
          {cardData.map((data) => (
            <Card
              key={data.id}
              className="flex flex-col p-4 border border-gray-200 shadow-md rounded-lg"
            >
              <div className="flex items-center mb-2">
                <div className="mr-2.5">{data.icon}</div>
                <div>
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
