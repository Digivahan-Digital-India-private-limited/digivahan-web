import React from "react";
import Heropage from "./Heropage";
import Categorypage from "./Categorypage";
import OrderQRSection from "./OrderQRSection";
import VehicleTrackingpage from "./VehicleTrackingpage";
import SmartQRFeaturepage from "./SmartQRFeaturepage";
import RenewalReminderpage from "./RenewalReminderpage";

function Homepage() {
  return (
    <main className="w-full h-full">
      <Heropage />
      <Categorypage />
      <OrderQRSection />
      <VehicleTrackingpage />
      <SmartQRFeaturepage />
      <RenewalReminderpage />
    </main>
  );
}

export default Homepage;
