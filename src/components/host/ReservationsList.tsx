import { PopulateReservationResponse } from "@/pages/HostPage";
import ReservationCard from "./ReservationCard";
import NotHaveReservaions from "./NotHaveReservaions";

function ReservationsList({
  reservations,
}: {
  reservations: PopulateReservationResponse[];
}) {
  return (
    <div>
      {reservations.length === 0 ? (
        <p>
          <NotHaveReservaions />
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
          {reservations.map((reservations) => (
            <ReservationCard
              key={reservations._id}
              filteredReservation={reservations}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReservationsList;
