import React from "react";
import personalimage from "../../assets/Your personal vitrual garage.png";

const VehicleTrackingpage = () => {
  return (
    <section className="max-w-7xl mx-auto py-4 px-4 md:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-black mb-4">
          Track Your All Vehicles
        </h1>
        <p className="text-gray-700 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Easily track all your vehicles in one place with real-time location,
          status updates, and instant alerts.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 bg-white p-4 md:p-8 rounded-lg">
        <div className="flex items-start md:items-center gap-2 md:gap-4">
          <img
            src={personalimage}
            alt="Your personal virtual garage - Digivahan vehicle management"
            title="Your Personal Virtual Garage"
            loading="lazy"
            className="w-full md:max-w-xs lg:max-w-sm h-auto"
          />
          <div className="border-l-2 border-yellow-400 h-40 md:h-64"></div>
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="text-2xl font-semibold text-black">
            Your Personal Virtual Garage
          </h3>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Manage all your vehicles effortlessly from one intelligent and
            secure Virtual Garage designed just for you. Get instant access to
            complete vehicle details, important records, and real-time status
            updates — all in one place. Store and manage essential documents
            like insurance, PUC, registration. Receive timely reminders before
            due dates so you never miss renewals, or compliance deadlines again.
            Whether you own one vehicle or many, your Virtual Garage keeps
            everything organized, accessible, and stress-free — anytime,
            anywhere, right at your fingertips.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VehicleTrackingpage;
