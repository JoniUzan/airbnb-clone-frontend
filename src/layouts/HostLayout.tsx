import HostHeader from "@/components/host/HostHeader";
import { Outlet } from "react-router-dom";

function HostLayout() {
  return (
    <div>
      <HostHeader />
      <Outlet />
    </div>
  );
}

export default HostLayout;
