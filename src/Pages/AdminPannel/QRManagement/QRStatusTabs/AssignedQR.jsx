import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AssignedQR = () => {
  const navigate = useNavigate();
  const [qrInput, setQrInput] = useState("");
  const [showQR, setShowQR] = useState(false);

  const handleCheck = () => {
    if (!qrInput.trim()) return;
    setShowQR(true);
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    qrInput
  )}`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/qr-panel")}
          className="text-blue-600 text-sm hover:underline mb-6 inline-block"
        >
          ← Back to Overview
        </button>

        <div className="bg-white rounded-lg shadow-sm border p-8 mt-6">
          <h2 className="text-lg font-semibold mb-1">Check Assigned QR Code</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter QR ID to view details and status
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              placeholder="Enter QR ID"
              className="flex-1 border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCheck}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Check QR
            </button>
          </div>
        </div>

        {/* Smooth QR Section */}
        <div
          className={`mt-6 transform transition-all duration-700 ease-out ${
            showQR
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-90 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="bg-blue-50 border rounded-xl p-6 flex gap-6 items-center">
            <img
              src={qrImageUrl}
              alt="QR"
              className="w-32 h-32 rounded shadow"
            />
            <div>
              <h3 className="text-lg font-semibold mb-2">QR Code Details</h3>
              <p className="text-sm text-gray-600">
                QR Number: <b>{qrInput}</b>
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                ✔ Assigned
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedQR;
