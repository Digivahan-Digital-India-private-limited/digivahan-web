import React, { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import BottomNavigation from "./BottomNavigation";

const routeTitles = {
  "/dashboard": "My Account",
  "/vehicles": "My Garage",
  "/vehicles/add": "Add Vehicle",
  "/virtual-qr": "My Virtual QR List",
  "/orders": "My Orders",
  "/notifications": "Notifications",
  "/chat": "Support Chat",
  "/document-vault": "Document Vault",
  "/profile": "My Profile",
  "/profile/update": "Update Profile",
  "/profile/basic-details": "Basic Details",
  "/profile/public-details": "Public Details",
  "/profile/change-password": "Change Password",
  "/profile/emergency-contacts": "Emergency Contacts",
  "/profile/emergency-contacts/add": "Add Emergency Contact",
};

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const title = useMemo(() => {
    if (pathname.startsWith("/marketplace/buy/") && pathname !== "/marketplace/buy/compare") {
      return "Car Details";
    }

    if (pathname.startsWith("/vehicles/") && pathname.endsWith("/qr")) {
      return "My Virtual QR";
    }

    if (pathname.startsWith("/vehicles/") && pathname !== "/vehicles/add") {
      return "Vehicle Details";
    }

    if (pathname.startsWith("/virtual-qr/")) {
      return "Virtual QR Detail";
    }

    if (pathname.startsWith("/orders/") && pathname.endsWith("/track")) {
      return "Track Order";
    }

    if (pathname.startsWith("/orders/") && pathname.endsWith("/review")) {
      return "Review Order";
    }

    if (pathname.startsWith("/orders/") && pathname.endsWith("/delivery")) {
      return "Delivery Address";
    }

    if (pathname.startsWith("/orders/") && pathname.endsWith("/payment")) {
      return "Payment";
    }

    if (pathname.startsWith("/orders/") && pathname.endsWith("/success")) {
      return "Order Successful";
    }

    if (pathname.startsWith("/profile/emergency-contacts/") && pathname.endsWith("/edit")) {
      return "Edit Emergency Contact";
    }

    return routeTitles[pathname] || "DigiVahan";
  }, [pathname]);

  return (
    <div className="h-screen overflow-hidden bg-[#f7faf7]">
      <div className="flex h-full w-full overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header
            onOpenSidebar={() => setSidebarOpen(true)}
            title={title}
            actionButton={{
              to: "/marketplace",
              label: "Open Marketplace",
            }}
          />

          <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4 sm:px-6 lg:pb-8">
            <Outlet />
          </main>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
