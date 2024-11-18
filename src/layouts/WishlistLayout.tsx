
import TripsHeader from "@/components/general-components/TripsHeader";
import { Outlet } from "react-router-dom";

function WishlistLayout() {
  return (
    <>
      <TripsHeader />
      <Outlet />
    </>
  );
}

export default WishlistLayout;
