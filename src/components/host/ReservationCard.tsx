import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PopulateReservationResponse } from "@/pages/HostPage";
import { Separator } from "../ui/separator";

function ReservationCard({
  filteredReservation,
}: {
  filteredReservation: PopulateReservationResponse;
}) {
  return (
    <div>
      {filteredReservation && (
        <div className="mb-4">
          <Card className="rounded-2xl">
            <CardHeader>
              {filteredReservation.home?.name.length > 15 ? (
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
                {new Date(filteredReservation.startDate).toLocaleDateString()} -{" "}
                {new Date(filteredReservation.endDate).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className=" flex-col m-0 p-0 items-start">
              <Separator />
              <p className="py-4 px-6">
                Total Price: ${filteredReservation.totalPrice}
              </p>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

export default ReservationCard;
