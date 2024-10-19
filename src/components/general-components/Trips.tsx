import { useAuth } from "@/providers/user.context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchHomeById, getAllUserReservations } from "@/lib/http";
import tripImage from "../../assets/tripImage.webp";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IHome } from "@/types";
import { CalendarDays, MapPin, User } from "lucide-react";

type PopulateReservationResponse = {
  _id: string;
  user: {
    firstName: string;
    _id: string;
  };
  host: string;
  home: {
    name: string;
    _id: string;
  };
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
};

function Trips() {
  const { loggedInUser } = useAuth();
  const [homes, setHomes] = useState<{ [key: string]: IHome }>({});

  const { data: reservations, isLoading: reservationsLoading } = useQuery<
    PopulateReservationResponse[]
  >({
    queryKey: ["reservations", loggedInUser?.user._id],
    queryFn: () => getAllUserReservations(),
    enabled: !!loggedInUser?.user._id,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Filter current (upcoming) and past trips
  const currentTrips = reservations?.filter(
    (reservation) => new Date(reservation.endDate) >= new Date()
  );

  const pastTrips = reservations?.filter(
    (reservation) => new Date(reservation.endDate) < new Date()
  );

  useEffect(() => {
    const fetchHomes = async () => {
      if (reservations) {
        const homePromises = reservations.map((reservation) =>
          fetchHomeById(reservation.home._id)
        );
        const homeData = await Promise.all(homePromises);
        const homeMap = homeData.reduce((acc, home) => {
          acc[home._id] = home;
          return acc;
        }, {} as { [key: string]: IHome });
        setHomes(homeMap);
      }
    };

    fetchHomes();
  }, [reservations]);

  if (reservationsLoading) return <div>Loading...</div>;

  return (
    <div className="p-8 md:p-16 lg:p-24">
      <h1 className="text-4xl font-semibold mb-8">Trips</h1>

      {/* Current trips section */}
      {currentTrips && currentTrips.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTrips.map((reservation) => {
              const home = homes[reservation.home._id];
              const firstImage = home?.imgUrls[0];
              return (
                <Card
                  key={reservation._id}
                  className="border-none overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <img
                      className="w-full h-full object-cover"
                      src={firstImage || "/api/placeholder/400/300"}
                      alt={`${home?.loc.city} property`}
                    />
                    <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded-full text-sm font-medium">
                      {reservation.status}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {home?.loc.city}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <p className="text-sm">{`Hosted by ${home?.host.fullname}`}</p>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        <p className="text-sm">
                          {new Date(reservation.startDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}{" "}
                          -
                          {new Date(reservation.endDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </p>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <p className="text-sm">{home?.loc.address}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link to={`/homes/${home?._id}`}>
                        <Button variant={"outline"} className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Past trips section */}
          {pastTrips && pastTrips.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-semibold mb-8">Where you've been</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pastTrips.map((reservation) => {
                  const home = homes[reservation.home._id];
                  const firstImage = home?.imgUrls[0];
                  return (
                    <Card
                      key={reservation._id}
                      className="border-none overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                      style={{ transform: "scale(0.75)" }} // 1/4 size of the original card
                    >
                      <div className="relative h-36">
                        <img
                          className="w-full h-full object-cover"
                          src={firstImage || "/api/placeholder/400/300"}
                          alt={`${home?.loc.city} property`}
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-xl font-semibold mb-2">
                          {home?.loc.city}
                        </h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            <p className="text-sm">{`Hosted by ${home?.host.fullname}`}</p>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            <p className="text-sm">
                              {new Date(
                                reservation.startDate
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}{" "}
                              -
                              {new Date(reservation.endDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <p className="text-sm">{home?.loc.address}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link to={`/homes/${home?._id}`}>
                            <Button variant={"outline"} className="w-full">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="flex flex-col md:flex-row h-full">
            <div className="flex flex-col justify-between p-6 md:w-1/2">
              <div>
                <div className="mb-6">
                  <svg
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                    style={{
                      display: "block",
                      height: "48px",
                      width: "48px",
                      fill: "rgb(227, 28, 95)",
                      stroke: "currentcolor",
                    }}
                  >
                    <g stroke="none">
                      <path
                        d="M15.629 22.596l-2.735 2.801a2 2 0 0 1-2.792.07L7.554 22.67c-.73 2.89-1.162 4.807-1.295 5.75-.134.942-.213 1.72-.238 2.334-.005.238.013.6.056 1.086.17 1.21.515 2.33 1.011 3.333 1.825 3.69 5.47 5.748 8.949 5.869 3.31.115 5.517-.794 8.313-3.48l2.715-2.752-11.436-12.214z"
                        opacity=".2"
                      ></path>
                      <path d="M28.207 9.793c.469.468.79 1.028.965 1.622l.62-.622a3.828 3.828 0 0 1 5.755 5.026 3.829 3.829 0 0 1 1.81 6.23l-1.77 1.78c.452.133.885.351 1.272.655l.348.309a3.828 3.828 0 0 1 .154 5.252l-10.437 10.56c-1.044.935-1.74 1.522-2.086 1.76-1.884 1.375-3.787 2.15-6.1 2.464-.723.155-1.868.196-3.432.123-7.054-.575-12.678-6.198-13.257-13.25-.146-2.892.572-6.85 2.153-11.876 1.019-3.917 1.793-6.789 2.323-8.616.239-1.315 2.137-1.414 3.72-.754l.327.15c1.867.933 2.87 2.808 2.462 5.299l-.735 4.381L22.793 9.793a3.828 3.828 0 0 1 5.414 0zm-3.877 1.302L12.836 22.578c4.186 4.427 4.186 11.502-.204 16.054l-1.414-1.414c3.64-3.642 3.708-9.504.153-13.28L9.93 22.343l1.09-6.54c.351-1.752-.204-2.84-1.341-3.409-.34-.18-.777-.286-1.31-.317-1.986 7.282-3.228 11.911-3.726 13.886-.422 1.887-.634 3.556-.634 5.01.235 6.32 5.165 11.443 11.405 11.98 1.127.058 2.14.024 3.039-.104 1.998-.271 3.588-.919 5.221-2.11.613-.33 4.653-4.311 12.12-11.946a1.828 1.828 0 0 0-2.463-2.698l-6.057 6.045-1.362-1.467 9.882-9.88a1.829 1.829 0 0 0 .203-2.345l-.203-.24a1.828 1.828 0 0 0-2.586 0l-9.785 9.784-1.363-1.467 11.734-11.732a1.829 1.829 0 0 0 .203-2.345l-.203-.24a1.829 1.829 0 0 0-2.463-.113L19.57 23.844l-1.362-1.467 8.586-8.584a1.829 1.829 0 0 0 .112-2.463l-.235-.235a1.829 1.829 0 0 0-2.34 0zM47 17v2h-5v-2h5zM42.293 4.293l1.414 1.414-4 4-1.414-1.414 4-4zM31 1v5h-2V1h2z"></path>
                    </g>
                  </svg>
                </div>
                <CardTitle className="text-2xl mb-4">
                  No trips booked...yet!
                </CardTitle>
                <CardContent className="text-lg p-0">
                  <p>
                    Time to dust off your bags and start planning your next
                    adventure.
                  </p>
                </CardContent>
              </div>
              <CardFooter className="p-0 mt-6">
                <Link to="/">
                  <Button
                    variant="secondary"
                    className="text-white text-lg px-6 py-3"
                  >
                    Start searching
                  </Button>
                </Link>
              </CardFooter>
            </div>
            <div className="md:w-1/2">
              <img
                src={tripImage}
                alt="Trip illustration"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Trips;
