import React from "react";
import { useNavigate } from "react-router-dom";

const AllottedQrCode = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            QR Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage and monitor QR code allocation
          </p>
        </div>
        {/* Back Link */}
        <button
          onClick={() => navigate("/qr-panel")}
          className="text-blue-600 text-sm hover:underline mb-6 inline-block"
        >
          ← Back to Overview
        </button>
        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Check Assigned QR Code
            </h2>
            <p className="text-sm text-gray-500">
              Enter QR ID to view details and status
            </p>
          </div>

          {/* Input Field with Button */}
          <div className="space-y-3">
            <div>
              <label htmlFor="text">
                <p className="  text-[12px] text-gray-600">
                  Number of QR to be Allotted *
                </p>
              </label>
              <input
                type="text"
                placeholder="Enter Number (e.g., No)"
                className=" w-200 border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div className="">
              <label htmlFor="text">
                <p className="text-[12px] text-gray-600">Sales Person ID *</p>
              </label>
              <input
                type="text"
                placeholder="Enter Sales person (e.g., sp-105)"
                className=" w-200 border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <button className="p-2 bg-orange-500 w-full text-white rounded-md">
              Allot Qr code
            </button>

            <div className=" bg-orange-100 p-2 rounded-lg border border-orange-500">
              <p className="text-orange-600 text-[14px]">
                <strong className="text-orange-800">Note</strong>: Once allotted, QR codes will be assigned to the sales
                person's account and reflected in their dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllottedQrCode;
