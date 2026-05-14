import React from "react";
import { Outlet } from "react-router-dom";
import MarketplaceNavbar from "./MarketplaceNavbar";
import { Footer } from "../../../../Layout/Footer";

const MarketplaceLayout = () => {
  return (
    <div className="min-h-screen bg-[#f2f7fb]">
      <MarketplaceNavbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MarketplaceLayout;
