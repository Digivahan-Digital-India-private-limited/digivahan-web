import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BlockedQR = () => {
  const navigate = useNavigate();
  const [qrInput, setQrInput] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [action, setAction] = useState("");

  const handleCheck = () => {
    if (!qrInput.trim()) return;
    setShowDetails(true);
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    qrInput
  )}`;

  return (
    <div className="w-full h-screen overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-1">
            QR Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage and monitor QR code allocation
          </p>
        </div>

        <button
          onClick={() => navigate("/qr-panel")}
          className="text-blue-600 text-sm hover:underline mb-6 inline-block"
        >
          ← Back to Overview
        </button>

        {/* Search Card */}
        <div className="bg-white rounded-lg shadow-sm border p-5 space-y-4">
          <div>
            <h1 className="text-2xl">Blocked QR Code Management</h1>
            <p className="text-[16px] text-gray-600">
              Check and manage blocked QR codes
            </p>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              placeholder="Enter QR ID (e.g., QR-2025-001)"
              className="flex-1 border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleCheck}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              🔍 Check QR
            </button>
          </div>
        </div>

        {/* Result Section */}
        <div
          className={`mt-6 transition-all duration-700 ${
            showDetails
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex items-start gap-8">
            {/* QR */}
            <div className="bg-white p-4 rounded-xl shadow">
              <img src={qrImageUrl} alt="QR" className="w-40 h-40" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm text-gray-500">QR ID</p>
                <p className="font-semibold">{qrInput}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Blocked Date</p>
                <input
                  type="text"
                  value="28-11-2025"
                  readOnly
                  className="border rounded-lg px-4 py-2 w-48 bg-white"
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">Blocked Reason</p>
                <textarea
                  rows="3"
                  readOnly
                  className="w-full border rounded-lg p-4 bg-white"
                  value="Suspicious activity detected on multiple transactions"
                />
              </div>
            </div>
          </div>

          {/* Action Dropdown */}
          <div className="mt-6">
            <p className="mb-2 font-medium">Select Action</p>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full border-2 border-red-500 rounded-xl px-4 py-3"
            >
              <option value="">Choose an action...</option>
              <option value="delete">Delete QR Code</option>
              <option value="track">Track User</option>
              <option value="unblock">Unblock QR Code</option>
            </select>

            {/* Action Based UI */}
            {action === "delete" && (
              <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <p className="text-red-700 font-medium mb-4">
                  ⚠ Warning: This will permanently delete the QR code from the
                  system.
                </p>
                <button
                  onClick={() => setShowDetails(false)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                  🗑 Delete QR Code
                </button>
              </div>
            )}

            {action === "unblock" && (
              <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                <p className="font-medium mb-2">
                  Justification for Unblocking{" "}
                  <span className="text-red-500">*</span>
                </p>
                <textarea
                  rows="4"
                  placeholder="Provide detailed reason for unblocking this QR code..."
                  className="w-full border rounded-lg p-4 mb-4"
                />
                <button
                  onClick={() => setShowDetails(false)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  🔓 Unblock QR Code
                </button>
              </div>
            )}

            {action === "track" && (
              <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                <p className="text-blue-700 mb-4">
                  View complete user profile and transaction history
                </p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                  👁 Track User Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedQR;
