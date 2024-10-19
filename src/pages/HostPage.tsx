import PendingReservation from "@/components/host/PendingReservation";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  createUserNotification,
  deleteReservation,
  findOrCreateChatroom,
  getAllHostReservations,
  queryClient,
  updateReservationStatus,
} from "@/lib/http";
import { useAuth } from "@/providers/user.context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import ReservationsList from "@/components/host/ReservationsList";
import NotHaveReservaions from "@/components/host/NotHaveReservaions";
import Modal from "@/components/general-components/LoginModalComponent";
import SkeletonReservations from "@/components/host/SkeletonReservations";

import imageOne from "../assets/resource-one.webp";
import imageTow from "../assets/rerources-two.webp";
import imageThree from "../assets/resources-three.webp";
import imageFour from "../assets/resources-four.webp";
import ResourcesCard from "@/components/host/ResourcesCard";
import { Link } from "react-router-dom";
import CanceledReservations from "@/components/host/CanceledReservations";

type selectedReservations =
  | "Checking out"
  | "Currently hosting"
  | "Arriving soon"
  | "Upcoming"
  | "Pending"
  | "Canceled";

export type PopulateReservationResponse = {
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

const resources = [
  {
    image: imageOne,
    text: "The Messages tab is your new inbox",
    link: "https://www.airbnb.com/resources/hosting-homes/a/the-messages-tab-is-your-new-inbox-678",
  },
  {
    image: imageTow,
    text: "Earning dashboard adds interactive charts and reporting hub",
    link: "https://www.airbnb.com/resources/hosting-homes/a/earnings-dashboard-a-better-look-at-your-bottom-line-675",
  },
  {
    image: imageThree,
    text: "Upgraded profiles tell you more avout your guests",
    link: "https://www.airbnb.com/resources/hosting-homes/a/know-more-about-your-guests-with-profile-upgrades-676",
  },
  {
    image: imageFour,
    text: "Listings tab upgrades give you even more control",
    link: "https://www.airbnb.com/resources/hosting-homes/a/more-control-in-the-listings-tab-677",
  },
];

function HostPage() {
  let content = <NotHaveReservaions />;
  const { loggedInUser } = useAuth();
  const [selected, setSelected] = useState<selectedReservations>();
  const [isModalOpen, setModalOpen] = useState(true);
  useEffect(() => {
    if (loggedInUser) {
      setModalOpen(false);
    }
  }, [loggedInUser]);

  //get all host reservations using react query
  const {
    data: reservations,
    error: reservationsError,
    isLoading: reservationsLoading,
  } = useQuery<PopulateReservationResponse[]>({
    queryKey: ["reservations"],
    queryFn: () => getAllHostReservations(),
  });

  //update reservation status using react query
  const updateMutation = useMutation({
    mutationFn: async ({
      reservationId,
      status,
    }: {
      reservationId: string;
      status: string;
    }) => {
      const reservation = reservations?.find((r) => r._id === reservationId);
      if (!reservation) throw new Error("Reservation not found");

      // Update reservation status
      await updateReservationStatus(reservationId, status);

      return { reservation, status };
    },
    onSuccess: async ({ reservation, status }) => {
      let descriptionMessage = "";
      let userNotificationMessage = "";

      switch (status) {
        case "confirmed":
          descriptionMessage =
            "The reservation has been successfully confirmed!";
          userNotificationMessage = `Your reservation to ${reservation.home.name} has been confirmed! Enjoy your stay :)`;
          break;
        case "canceled":
          descriptionMessage = "The reservation has been canceled.";
          userNotificationMessage = `Your reservation to ${reservation.home.name} has been canceled.`;
          break;
        default:
          descriptionMessage = "The reservation status has been updated.";
          userNotificationMessage = "Your reservation status has been updated.";
      }

      // Display toast notification
      toast({
        title: "Reservation status",
        description: descriptionMessage,
      });

      try {
        // Send user notification
        await createUserNotification(
          reservation.user._id,
          userNotificationMessage,
          reservation._id
        );

        await findOrCreateChatroom(
          reservation.user._id,
          reservation.host,
          reservation.host,
          `Hi ${reservation.user.firstName},\n
          \n
          Thank you for booking ${reservation.home.name}! We're thrilled to host you and want to ensure you have a wonderful stay. 😊`
        );
      } catch (error) {
        console.error("Error sending user notification:", error);
      }

      // Invalidate the specific query by its key
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
    onError: (error) => {
      console.error("Error while updating reservation status:", error);
      toast({
        title: "Error",
        description:
          "There was an issue updating the reservation status. Please try again.",
      });
    },
  });
  //delete canceld reservation
  const deleteMutation = useMutation({
    mutationFn: ({ reservationId }: { reservationId: string }) =>
      deleteReservation(reservationId),
    onSuccess: () => {
      toast({
        title: "Delete Reservation",
        description: "The reservation has been deleted.",
      });

      // Invalidate the specific query by its key
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
    onError: (error) => {
      console.error("Error while deleting reservation:", error);
      toast({
        title: "Error",
        description:
          "There was an issue deleting the reservation. Please try again.",
      });
    },
  });

  function handleReservationStatusUpdate(
    reservationId: string,
    status: string
  ) {
    updateMutation.mutate({ reservationId, status });
  }

  function handleDeleteReservation(reservationId: string) {
    deleteMutation.mutate({ reservationId: reservationId });
  }

  if (reservationsLoading) {
    content = (
      <div>
        <SkeletonReservations count={4} />
      </div>
    );
  }
  if (reservationsError) {
    const errorStatus = (reservationsError as any).status;

    if (errorStatus === 404) {
      content = <NotHaveReservaions />;
    } else {
      content = <div>Error, please try again</div>;
    }
  }
  if (reservations && reservations.length === 0) {
    content = <div>no reservation found</div>;
  }

  /////show reservation type///////
  if (reservations && selected === "Pending") {
    content = (
      <PendingReservation
        reservations={reservations}
        handleReservationStatusUpdate={handleReservationStatusUpdate}
      />
    );
  } else if (reservations && selected === "Canceled") {
    content = (
      <CanceledReservations
        reservations={reservations}
        handleDeleteReservation={handleDeleteReservation}
      />
    );
  } else if (reservations && selected === "Upcoming") {
    // Filter confirmed reservations
    const confirmedReservations = reservations.filter(
      (reservation) => reservation.status === "confirmed"
    );
    content = <ReservationsList reservations={confirmedReservations} />;
  } else if (reservations && selected === "Arriving soon") {
    const arrivingSoonReservations = reservations!.filter((reservation) => {
      const today = new Date();
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0); // Set time to midnight

      const reservationStartDate = new Date(reservation.startDate);
      reservationStartDate.setHours(0, 0, 0, 0); // Set time to midnight

      // Check if the reservation start date is the next day
      return (
        reservation.status === "confirmed" &&
        reservationStartDate.getTime() === nextDay.getTime()
      );
    });
    content = <ReservationsList reservations={arrivingSoonReservations} />;
  } else if (reservations && selected === "Currently hosting") {
    const currentlyHostingReservations = reservations!.filter((reservation) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to midnight

      const reservationStartDate = new Date(reservation.startDate);
      reservationStartDate.setHours(0, 0, 0, 0); // Set time to midnight

      const reservationEndDate = new Date(reservation.endDate);
      reservationEndDate.setHours(0, 0, 0, 0); // Set time to midnight

      // Check if today is after the start date and before the end date
      return (
        reservation.status === "confirmed" &&
        today >= reservationStartDate && // After the start date
        today <= reservationEndDate // Before the end date
      );
    });

    content = <ReservationsList reservations={currentlyHostingReservations} />;
  } else if (reservations && selected === "Checking out") {
    const checkingOutTodayReservations = reservations!.filter((reservation) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to midnight

      const reservationEndDate = new Date(reservation.endDate);
      reservationEndDate.setHours(0, 0, 0, 0); // Set time to midnight

      // Check if today is the checkout day
      return (
        reservation.status === "confirmed" &&
        today.getTime() === reservationEndDate.getTime() // Today is the checkout day
      );
    });
    content = <ReservationsList reservations={checkingOutTodayReservations} />;
  }
  return (
    <div className=" p-10 sm:p-20 md:p-28">
      <h1 className="text-3xl font-500 mb-10 ">
        Welcome back, {loggedInUser?.user.firstName}
      </h1>

      <section>
        {reservations ? (
          <h2 className="text-2xl font-500 py-8">
            Your reservations ({reservations.length})
          </h2>
        ) : (
          <h2 className="text-2xl font-500 py-8">Your reservations (0)</h2>
        )}

        <div className="space-x-2">
          <Button
            onClick={() => setSelected("Checking out")}
            className="bg-white border-[1.5px] border-gray-300 rounded-full hover:border-black hover:bg-white p-2"
          >
            Checking out
          </Button>
          <Button
            onClick={() => setSelected("Currently hosting")}
            className="bg-white border-[1.5px] border-gray-300 rounded-full hover:border-black hover:bg-white p-2"
          >
            Currently hosting
          </Button>
          <Button
            onClick={() => setSelected("Arriving soon")}
            className="bg-white border-[1.5px] border-gray-300 rounded-full hover:border-black hover:bg-white p-2"
          >
            Arriving soon
          </Button>
          <Button
            onClick={() => setSelected("Upcoming")}
            className="bg-white border-[1.5px] border-gray-300 rounded-full hover:border-black hover:bg-white p-2"
          >
            Upcoming
          </Button>
          <Button
            onClick={() => setSelected("Pending")}
            className="bg-white border-[1.5px] border-gray-300 rounded-full hover:border-black hover:bg-white p-2"
          >
            Pending
          </Button>
          <Button
            onClick={() => setSelected("Canceled")}
            className="bg-white border-[1.5px] border-gray-300 rounded-full hover:border-black hover:bg-white p-2"
          >
            Canceled
          </Button>
        </div>
        {content}
      </section>

      <section>
        <h2 className="text-2xl font-500 py-8">Resources and tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 py-6">
          {resources.map((resource) => {
            return (
              <Link to={resource.link}>
                <ResourcesCard img={resource.image} text={resource.text} />
              </Link>
            );
          })}
        </div>
      </section>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen} />
    </div>
  );
}

export default HostPage;
