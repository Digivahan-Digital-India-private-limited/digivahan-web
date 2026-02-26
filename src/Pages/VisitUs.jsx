import React from "react";
import HeropageImage from "../assets/visitus.png";
import Qrimage from "../assets/visitus-2.png"

const VisitUs = () => {
  return (
    <main className="w-full h-full">
      <section className="w-full bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Power of Smart Fleet Management
              <span className="block text-blue-600 mt-2">with Digivahan</span>
            </h2>

            <p className="text-gray-600 text-lg mb-6">
              Digivahan brings safety, efficiency, real-time tracking,
              compliance and smarter operations — all in one powerful platform.
              Visit our app to explore advanced fleet solutions designed to move
              your business forward.
            </p>

            <div className="flex gap-4">
              <button className="bg-blue-600 text-[12px] md:text-sm text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Visit Our App
              </button>

              <button className="border border-blue-600 text-[12px] md:text-sm text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
                Learn More
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center">
            <img
              src={HeropageImage}
              alt="Digivahan Fleet Management"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* HEADING */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How Digivahan QR Works
          </h2>
          <p className="text-gray-600 mb-12">
            Follow these simple steps to instantly connect with the vehicle
            owner using the Digivahan app.
          </p>

          {/* STEPS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* STEP 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                📱
              </div>
              <h3 className="text-lg font-semibold mb-2">Open Digivahan App</h3>
              <p className="text-gray-500 text-sm">
                Install and open the Digivahan app on your mobile device to get
                started.
              </p>
            </div>

            {/* STEP 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 mb-4">
                📷
              </div>
              <h3 className="text-lg font-semibold mb-2">Scan the QR Code</h3>
              <p className="text-gray-500 text-sm">
                Tap on the <strong>Scan QR</strong> option and scan the QR code
                placed on the vehicle.
              </p>
            </div>

            {/* STEP 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                💬
              </div>
              <h3 className="text-lg font-semibold mb-2">Send Notification</h3>
              <p className="text-gray-500 text-sm">
                Choose or type a message like <em>No Parking</em>,{" "}
                <em>Accident</em>, or any important notification and send it
                instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-14">
          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Scan QR & Instantly Notify Vehicle Owner
            </h2>

            <p className="text-gray-600 text-lg mb-6">
              Digivahan introduces a smart QR-based communication system that
              allows anyone to instantly connect with a vehicle owner in case of
              parking, safety, or road-related issues — without sharing personal
              contact details.
            </p>

            <ul className="space-y-4 text-gray-600">
              <li className="flex gap-3">
                <span className="text-green-600">✔</span>
                <span>
                  Open the <strong>Digivahan App</strong> and tap on the
                  <strong> Scan QR</strong> option.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="text-green-600">✔</span>
                <span>Scan the QR code already placed on the vehicle.</span>
              </li>

              <li className="flex gap-3">
                <span className="text-green-600">✔</span>
                <span>
                  Select a quick notification such as
                  <strong> No Parking</strong>, <strong>Accident</strong>, or
                  <strong> Road Block</strong>.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="text-green-600">✔</span>
                <span>
                  Send the alert instantly to the registered vehicle owner.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="text-green-600">✔</span>
                <span>
                  Start a secure in-app chat for further communication if
                  required.
                </span>
              </li>
            </ul>

            <p className="mt-6 text-gray-600">
              This smart system helps reduce delays, improve road safety, and
              enables hassle-free communication — all powered by Digivahan.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center">
            <img
              src={Qrimage}
              alt="Scan QR and send notification to vehicle owner"
              className="w-full max-w-lg"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default VisitUs;
