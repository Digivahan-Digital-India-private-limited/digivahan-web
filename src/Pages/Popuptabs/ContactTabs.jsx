import React, { useEffect, useRef, useState } from "react";
import Callimage from "../../assets/call.png";
import Connecting from "../../assets/connecting.png";
import SignalConnecting from "../../assets/signalconnecting.png"
import axios from "axios";

const ContactTabs = ({ setShowContactPopup, receiverNumber }) => {
  const [contactNumber, setContactNumber] = useState(
    localStorage.getItem("agentNumber") || "",
  );
  const [hasSavedNumber, setHasSavedNumber] = useState(
    !!localStorage.getItem("agentNumber"),
  );
  const [status, setStatus] = useState("INPUT");

  const timeoutRef = useRef(null); // 👈 cleanup ke liye

  // 🔁 Load agent number from localStorage
  useEffect(() => {
    // 🧹 cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleContinue = async () => {
    try {
      if (!contactNumber) {
        alert("Please enter your mobile number");
        return;
      }

      setStatus("CONNECTING");

      localStorage.setItem("agentNumber", contactNumber);

      await axios.post("http://localhost:3000/api/user/contact-via-call", {
        receiver: receiverNumber,
        agent: contactNumber,
      });

      // ✅ API SUCCESS
      setStatus("ARRANGED");

      // ⏱️ close after 1 minute
      timeoutRef.current = setTimeout(() => {
        setShowContactPopup(false);
      }, 60 * 1000);
    } catch (error) {
      console.error(error);
      setStatus("INPUT");
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-2xl p-6 w-80 text-center">
        {/* =========================
          🧾 INPUT STATE
         ========================= */}
        {status === "INPUT" && (
          <>
            <button
              onClick={() => setShowContactPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>

            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <img src={Callimage} alt="Call" />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Enter your number
            </h2>

            {/* ===============================
        🟢 CASE 1: NUMBER EXISTS
       =============================== */}
            {hasSavedNumber ? (
              <>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  Kya aap <b>{contactNumber}</b> number se owner ke sath connect
                  hona chahte hain? Agar nahi to dusra number daalein.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setContactNumber("");
                      localStorage.removeItem("agentNumber");
                      setHasSavedNumber(false);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium"
                  >
                    Change Number
                  </button>

                  <button
                    onClick={handleContinue}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold"
                  >
                    Make a call
                  </button>
                </div>
              </>
            ) : (
              /* ===============================
          🔵 CASE 2: NO SAVED NUMBER
         =============================== */
              <>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  Apna mobile number enter karein taaki hum aapke liye ek secure
                  masked call arrange kar saken.
                </p>

                <input
                  type="tel"
                  placeholder="Enter your number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <button
                  onClick={handleContinue}
                  className="w-full mt-5 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold"
                >
                  Make a call
                </button>
              </>
            )}
          </>
        )}

        {status === "CONNECTING" && (
          <>
            <div className="flex justify-center mb-4">
              <img
                src={Connecting}
                alt="Connecting"
                className="w-20 h-20 animate-pulse"
              />
            </div>

            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Virtual Call Initiating
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed">
              Kripya pratiksha karein, call connect ho rahi hai.
            </p>

            <div className="mt-4 flex justify-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </>
        )}

        {status === "ARRANGED" && (
          <>
            <div className="flex justify-center mb-4">
              <img src={SignalConnecting} alt="Call Arranged" className="w-20 h-20" />
            </div>

            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Call Arranged
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed">
              Aapke liye virtual call arrange ho chuki hai.
              <br />
              Kripya pratiksha karein, jald hi call connect ho jayegi.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactTabs;
