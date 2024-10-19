import Modal from "@/components/general-components/LoginModalComponent";
import TripsHeader from "@/components/general-components/TripsHeader";
import { useAuth } from "@/providers/user.context";
import { useState } from "react";
import { Outlet } from "react-router-dom";

function WishlistLayout() {
  const { loggedInUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {loggedInUser ? (
        <>
          <TripsHeader />
          <Outlet />
        </>
      ) : (
        <Modal isOpen={true} onClose={() => setIsOpen(!isOpen)} />
      )}
    </>
  );
}

export default WishlistLayout;
