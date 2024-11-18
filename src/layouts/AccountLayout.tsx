import TripsHeader from "@/components/general-components/TripsHeader";
import { Outlet } from "react-router-dom";

function AccountLayout() {
  return (
    <div>
      <TripsHeader />
      <Outlet />
    </div>
  );
}

export default AccountLayout;
