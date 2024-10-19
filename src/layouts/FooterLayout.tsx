import Footer from "@/components/general-components/Footer";
import React from "react";
import { Outlet } from "react-router-dom";

const FooterLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default FooterLayout;
