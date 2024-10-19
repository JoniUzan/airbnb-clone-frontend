import HeaderComponent from "@/components/general-components/HeaderComponent";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <HeaderComponent />
      <Outlet />
    </>
  );
}

export default MainLayout;
