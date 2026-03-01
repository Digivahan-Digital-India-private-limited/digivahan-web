import React from "react";
import renewalImage from "../../assets/Important renewal.png";

const RenewalReminderpage = () => {
  return (
    <section className="max-w-7xl mx-auto md:px-6 py-2">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 p-3 md:p-8 rounded-lg">
        {/* Phone image wrapper */}
        <div className="shrink-0 relative flex items-center justify-center">
          <img
            src={renewalImage}
            alt="Renewal Reminder"
            className="relative w-full md:max-w-xs max-w-sm h-auto z-10 transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02]"
          />
        </div>
        <div className="border-l-2 border-yellow-400 h-40 md:h-64"></div>
        <div className="flex-1">
          <h3 className="text-3xl font-bold text-black">Never Miss an</h3>
          <h3 className="text-3xl font-bold text-black mb-4">
            Important Renewal
          </h3>
          <p className="text-gray-800 sm:text-sm text-base leading-relaxed">
            Stay completely stress-free with our smart alert system that
            continuously tracks your vehicle’s insurance and PUC expiry dates
            for you. No more last-minute panic or forgotten deadlines —
            everything is monitored automatically in the background. You’ll
            receive timely reminders and instant notifications directly on your
            dashboard as well as through push alerts, well before any expiry.
            This ensures you always have enough time to renew your documents
            without interruptions or penalties. By keeping your vehicle
            compliant and fully covered at all times, our renewal alerts help
            you drive with confidence, safety, and complete peace of mind —
            every single day.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RenewalReminderpage;
