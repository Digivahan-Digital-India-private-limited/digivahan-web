import React from "react";

const RenewalReminderpage = () => {
  return (
    <section className="max-w-7xl mx-auto md:px-6 py-2 rr-section-wrap">
      <style>{`
        /* Scale the phone canvas down on mobile only — md+ is untouched */
        .rr-image-container {
          transform-origin: top center;
        }
        @media (max-width: 479px) {
          .rr-image-container {
            transform: scale(0.70);
            margin-bottom: -138px; /* 460*(1-0.70) */
          }
          .rr-section-wrap { overflow-x: clip; }
        }
        @media (min-width: 480px) and (max-width: 767px) {
          .rr-image-container {
            transform: scale(0.82);
            margin-bottom: -83px; /* 460*(1-0.82) */
          }
          .rr-section-wrap { overflow-x: clip; }
        }
      `}</style>
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 p-3 md:p-8 rounded-lg">
        {/* Phone image wrapper — order-first ensures image is above text on mobile; md:order-none restores desktop order */}
        <div className="shrink-0 relative w-[300px] md:w-[400px] h-[460px] md:h-[560px] order-first md:order-none rr-image-container mx-auto md:mx-0">
          {/* Outer green ring — 4 red dots + 3 yellow/green dots, slow anti-clockwise */}
          <div className="absolute w-[290px] h-[290px] md:w-[390px] md:h-[390px] rounded-full border-[2px] border-green-500/40 top-[85px] left-[18px] md:top-[85px] md:left-[65px] animate-spin-ccw-slow">
            <div className="absolute w-2.5 h-2.5 bg-red-500 rounded-full shadow-md" style={{ left: 'calc(85.35% - 5px)', top: 'calc(85.35% - 5px)' }}></div>
            <div className="absolute w-2.5 h-2.5 bg-red-500 rounded-full shadow-md" style={{ left: 'calc(14.65% - 5px)', top: 'calc(85.35% - 5px)' }}></div>
            <div className="absolute w-2.5 h-2.5 bg-red-500 rounded-full shadow-md" style={{ left: 'calc(14.65% - 5px)', top: 'calc(14.65% - 5px)' }}></div>
            <div className="absolute w-2.5 h-2.5 bg-red-500 rounded-full shadow-md" style={{ left: 'calc(85.35% - 5px)', top: 'calc(14.65% - 5px)' }}></div>
            {/* yellow & green dots */}
            <div className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-md" style={{ left: 'calc(50% - 6px)', top: 'calc(0% - 6px)' }}></div>
            <div className="absolute w-3 h-3 bg-green-400 rounded-full shadow-md" style={{ left: 'calc(100% - 6px)', top: 'calc(50% - 6px)' }}></div>
            <div className="absolute w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-md" style={{ left: 'calc(50% - 5px)', top: 'calc(100% - 5px)' }}></div>
          </div>
          {/* Inner green ring — 3 red dots + 3 yellow/green dots, anti-clockwise */}
          <div className="absolute w-[230px] h-[230px] md:w-[310px] md:h-[310px] rounded-full border-[3px] border-green-500/70 top-[115px] left-[48px] md:top-[125px] md:left-[105px] animate-spin-ccw">
            <div className="absolute w-2.5 h-2.5 bg-red-500 rounded-full shadow-md" style={{ left: 'calc(100% - 5px)', top: 'calc(50% - 5px)' }}></div>
            <div className="absolute w-2.5 h-2.5 bg-red-500 rounded-full shadow-md" style={{ left: 'calc(25% - 5px)', top: 'calc(93.3% - 5px)' }}></div>
            <div className="absolute w-2.5 h-2.5 bg-red-500 rounded-full shadow-md" style={{ left: 'calc(25% - 5px)', top: 'calc(6.7% - 5px)' }}></div>
            {/* yellow & green dots */}
            <div className="absolute w-3 h-3 bg-green-400 rounded-full shadow-md" style={{ left: 'calc(0% - 6px)', top: 'calc(50% - 6px)' }}></div>
            <div className="absolute w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-md" style={{ left: 'calc(75% - 5px)', top: 'calc(6.7% - 5px)' }}></div>
            <div className="absolute w-3 h-3 bg-green-400 rounded-full shadow-md" style={{ left: 'calc(75% - 6px)', top: 'calc(93.3% - 6px)' }}></div>
          </div>
          {/* iPhone base image — right side, full height */}
          <img
            src="/Imp%20Renewal/iPhone.png"
            alt="iPhone Renewal Reminder"
            className="absolute z-10 w-[230px] md:w-[280px] h-auto top-0 right-[22px] md:right-0"
          />
          {/* Bike tab card — overlapping the bottom portion of the phone screen */}
          <img
            src="/Imp%20Renewal/bike%20tab.png"
            alt="Bike Tab Overlay"
            className="absolute z-20 w-[230px] md:w-[280px] h-auto bottom-[255px] md:bottom-[310px] left-[48px] md:left-[118px]"
          />
        </div>
        <div className="hidden md:block border-l-[5px] border-yellow-400 h-40 md:h-64 ml-8 md:ml-16"></div>
        <div className="flex-1 ml-0 md:ml-10">
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
