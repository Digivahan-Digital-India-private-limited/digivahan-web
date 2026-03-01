import React from "react";

const VehicleTrackingpage = () => {
  return (
    <section className="max-w-7xl mx-auto py-10 px-4 md:px-6">
      <style>{`
        @keyframes vtRingOut {
          0%   { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
          15%  { opacity: 0.85; }
          100% { transform: translate(-50%, -50%) scale(1);   opacity: 0; }
        }
        .vt-ring {
          position: absolute;
          width: 440px;
          height: 440px;
          border-radius: 50%;
          border: 2.5px solid rgba(234, 88, 12, 0.85);
          animation: vtRingOut 3.4s ease-out infinite;
          animation-fill-mode: both;
          pointer-events: none;
          z-index: 1;
          left: 50%;
          top: 46%;
        }
        .vt-ring-2 { animation-delay: 1.7s; }
      `}</style>

      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-black mb-3">Track Your All Vehicles</h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Easily track all your vehicles in one place with real-time location,
          status updates, and instant alerts.
        </p>
      </div>

      {/* Main row */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">

        {/* ── Phone + cards + rings ── */}
        {/*
          Container: 660px  |  Phone: 210px centered at 330px
          Phone left edge : 330-105 = 225px
          Phone right edge: 330+105 = 435px
          Left  card left:0  width:240 → right edge 240px → 15px behind phone ✓
          Right card right:0 width:240 → left  edge 420px → 15px behind phone ✓
        */}
        <div className="relative shrink-0" style={{ width: "660px", height: "540px" }}>

          {/* 2 animated gold rings — lowest layer */}
          <div className="vt-ring" />
          <div className="vt-ring vt-ring-2" />

          {/* ── LEFT card image ── */}
          <img
            src="/Personal VG/Left car.png"
            alt="Rohit's car card"
            className="absolute"
            style={{ left: "30px", top: "70px", width: "240px", height: "auto", zIndex: 40 }}
          />

          {/* ── PHONE — z-20, cards overlap its edges ── */}
          <div
            className="absolute"
            style={{ left: "50%", top: "20px", transform: "translateX(-50%)", zIndex: 20 }}
          >
            <img
              src="/Personal VG/mobile.png"
              alt="Virtual Garage App"
              loading="lazy"
              style={{ width: "210px", height: "auto" }}
            />
          </div>

          {/* ── RIGHT card image ── */}
          <img
            src="/Personal VG/Right Car.png"
            alt="Hasan's car card"
            className="absolute"
            style={{ right: "30px", top: "70px", width: "240px", height: "auto", zIndex: 40 }}
          />

        </div>

        {/* ── Right text section ── */}
        <div className="flex items-stretch gap-5 flex-1 max-w-md">
          <div className="w-1 self-stretch bg-yellow-400 rounded-full shrink-0" />
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-black">
              Your Personal Virtual Garage
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Manage all your vehicles effortlessly from one intelligent and
              secure Virtual Garage designed just for you. Get instant access to
              complete vehicle details, important records, and real-time status
              updates — all in one place. Store and manage essential documents
              like insurance, PUC, registration. Receive timely reminders before
              due dates so you never miss renewals, or compliance deadlines
              again. Whether you own one vehicle or many, your Virtual Garage
              keeps everything organized, accessible, and stress-free — anytime,
              anywhere, right at your fingertips.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default VehicleTrackingpage;
