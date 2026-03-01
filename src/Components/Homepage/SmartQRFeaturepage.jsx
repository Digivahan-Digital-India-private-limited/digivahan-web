import React from "react";

function SmartQRFeaturepage() {
  return (
    <section className="max-w-7xl mx-auto py-10 px-4 md:px-6">
      <style>{`
        @keyframes qrRingGlow {
          0%   { transform: translate(-50%, -50%) scale(0.25); opacity: 0; }
          15%  { opacity: 0.85; }
          100% { transform: translate(-50%, -50%) scale(1);    opacity: 0; }
        }
        .qr-ring {
          position: absolute;
          width: 460px;
          height: 460px;
          border-radius: 50%;
          border: 2.5px solid rgba(234, 88, 12, 0.85);
          animation: qrRingGlow 3.4s ease-out infinite;
          animation-fill-mode: both;
          pointer-events: none;
          left: 50%;
          top: 50%;
          z-index: 0;
        }
        .qr-ring-2 { animation-delay: 1.7s; }
      `}</style>

      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-black mb-3">Smart QR Feature</h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Allow the public to connect with you instantly and securely by simply
          scanning your vehicle’s Smart QR.
        </p>
      </div>

      {/* Main row — text left, phone right */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">

        {/* Left: yellow bar + text */}
        <div className="flex items-stretch gap-5 flex-1 max-w-lg">
          <div className="w-1 self-stretch bg-yellow-400 rounded-full flex-shrink-0" />
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-black">
              Smart QR – Connect Securely in Seconds
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Enable instant and secure communication with you through your
              vehicle using our Smart QR feature. Anyone can simply scan the
              Smart QR placed on your vehicle to connect with you without
              sharing your personal phone number. This feature helps people
              reach out to you in situations like incorrect parking,
              emergencies, vehicle issues, or safety concerns — quickly and
              responsibly. Your privacy remains fully protected while ensuring
              smooth and reliable communication whenever it matters most. Smart
              QR adds an extra layer of safety, convenience, and peace of mind,
              making everyday vehicle interactions smarter and more secure.
            </p>
          </div>
        </div>

        {/* Right: phone + floating card + animated rings */}
        <div
          className="relative flex-shrink-0"
          style={{ width: "500px", height: "620px" }}
        >
          {/* 2 animated orange rings — centered on phone body */}
          <div className="qr-ring" />
          <div className="qr-ring qr-ring-2" />

          {/* Phone mockup — centered */}
          <img
            src="/Smart QR Feature/Mobile.png"
            alt="Smart QR Feature phone"
            loading="lazy"
            className="absolute"
            style={{
              width: "220px",
              height: "auto",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          />

          {/* Floating "Scan QR Code" card — overlaps upper screen of phone */}
          <img
            src="/Smart QR Feature/Group 513287.png"
            alt="Scan QR Code card"
            loading="lazy"
            className="absolute"
            style={{
              width: "250px",
              height: "auto",
              left: "50%",
              top: "135px",
              transform: "translateX(-50%)",
              zIndex: 20,
            }}
          />

          {/* Icons row (Scan QR, Check Vehicle, Check Challan, FASTag) — mid phone */}
          <img
            src="/Smart QR Feature/Group 523854.png"
            alt="QR feature icons"
            loading="lazy"
            className="absolute"
            style={{
              width: "250px",
              height: "auto",
              left: "50%",
              top: "265px",
              transform: "translateX(-50%)",
              zIndex: 20,
            }}
          />
        </div>

      </div>
    </section>
  );
}

export default SmartQRFeaturepage;
