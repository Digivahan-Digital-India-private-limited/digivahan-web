import React from "react";
import qrImage from "../../assets/smart QR.png";

function SmartQRFeaturepage() {
  return (
    <section className="max-w-7xl mx-auto py-5 px-2 md:px-6 space-y-4">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-black">Smart QR Feature</h1>
        <p className="text-gray-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Allow the public to connect with you instantly and securely by simply
          scanning your vehicle’s Smart QR.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 bg-white p-4 md:p-8 rounded-lg">
        <div className="flex items-start md:items-center gap-6 md:gap-8 max-w-xl md:max-w-2xl">
          <div className="border-l-2 border-yellow-400 h-40 md:h-64"></div>
          <div>
            <h3 className="text-2xl font-semibold text-black mb-4">
              Smart QR – Connect Securely in Seconds
            </h3>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
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

        <div className="shrink-0">
          <img
            src={qrImage}
            alt="Smart QR code for secure vehicle communication"
            title="Smart QR Feature - Digivahan"
            loading="lazy"
            className="w-full md:max-w-xs max-w-sm h-auto"
          />
        </div>
      </div>
    </section>
  );
}

export default SmartQRFeaturepage;
