import { PopulateReservationResponse } from "@/pages/HostPage";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

import NotHaveReservaions from "./NotHaveReservaions";
import { Separator } from "../ui/separator";

interface CancelReservationProps {
  reservations: PopulateReservationResponse[];
  handleDeleteReservation: (reservationId: string) => void;
}

function CanceledReservations({
  reservations,
  handleDeleteReservation,
}: CancelReservationProps) {
  const filteredReservations = reservations!.filter(
    (reservation) => reservation.status === "cancelled"
  );

  return (
    <>
      {filteredReservations.length === 0 ? (
        <NotHaveReservaions />
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
            {filteredReservations.map((filteredReservation) => (
              <div key={filteredReservation._id} className="mb-4">
                <Card className="rounded-2xl">
                  <CardHeader>
                    {filteredReservation.home.name.length > 15 ? (
                      <CardTitle>
                        {filteredReservation.home.name.substring(0, 15)}...
                      </CardTitle>
                    ) : (
                      <CardTitle>{filteredReservation.home.name}</CardTitle>
                    )}

                    <CardDescription>
                      Reservation by {filteredReservation.user.firstName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Dates:{" "}
                      {new Date(
                        filteredReservation.startDate
                      ).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(
                        filteredReservation.endDate
                      ).toLocaleDateString()}
                    </p>
                    <p>Total Price: ${filteredReservation.totalPrice}</p>
                  </CardContent>
                  <CardFooter className="flex-col m-0 p-0">
                    <Separator />
                    <div className=" flex justify-between py-4 px-6 items-center">
                      <div>
                        <Button
                          onClick={() =>
                            handleDeleteReservation(filteredReservation._id)
                          }
                          variant="outline"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default CanceledReservations;
