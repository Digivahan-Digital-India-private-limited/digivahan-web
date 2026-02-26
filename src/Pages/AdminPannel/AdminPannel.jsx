import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminPannel = () => {
  return (
    <main className="w-full h-screen flex lg:flex-row flex-col overflow-hidden">
      <Sidebar />

      {/* Right content area */}
      <section className="flex-1 w-full overflow-y-auto">
        <Outlet />
      </section>
    </main>
  );
};

export default AdminPannel;
