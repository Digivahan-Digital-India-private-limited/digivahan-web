import React, { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MyVirtualQRDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDownloading, setIsDownloading] = useState(false);

  const qrData = location.state?.qr || {
    id: 2,
    name: "George Ansari",
    vehicleName: "Suzuki Super",
    vehicleNumber: "UP09R5423",
    qrCode: "UP09R5423",
    email: "GeorgeAnsari@Gmail.com",
    phoneNumber: "9123456789",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
  };

  // Generate QR code image URL using QR Server API
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    qrData.qrCode
  )}`;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${qrData.name}_${qrData.vehicleName}_QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download QR Code");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-green-50 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-green-50 border-b border-gray-200">
        {/* Status Bar */}
        <div className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-gray-700">
          <span>9:41</span>
          <div className="flex gap-1">
            <span>📡</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Top Navigation Bar */}
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>

          {/* Title */}
          <h1 className="text-lg font-bold text-gray-900">My Virtual QR Code</h1>

          {/* Spacer */}
          <div className="w-6"></div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {/* QR Code Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100">
          {/* QR Code Image with Download Button */}
          <div className="flex justify-center mb-8 relative">
            {/* Download Me Button - Positioned on top border */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <span className="inline-block bg-green-200 text-green-600 font-semibold px-5 py-2 rounded-full text-sm">
                Download Me
              </span>
            </div>

            {/* QR Code with yellow border */}
            <div className="border-4 border-yellow-400 rounded-3xl p-5 bg-yellow-50">
              <img
                src={qrImageUrl}
                alt="Virtual QR Code"
                className="w-56 h-56 rounded-2xl"
              />
            </div>
          </div>

          {/* Digivahan Logo */}
          <div className="text-center">
            <img
              src="/Tranparent Logo In Black 1@2x.png"
              alt="Digivahan"
              className="h-16 mx-auto"
            />
          </div>
        </div>

        {/* Vehicle and Owner Details Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-8">Details</h2>

          {/* Details Grid */}
          <div className="space-y-6">
            {/* Vehicle Name */}
            <div className="flex justify-between items-start gap-4">
              <p className="text-sm font-medium text-gray-700 flex-shrink-0 pt-3">Vehicle Name</p>
              <div className="flex-1 text-right">
                <p className="text-sm font-semibold text-gray-900 bg-gray-100 rounded-lg p-3">
                  {qrData?.vehicleName || "-"}
                </p>
              </div>
            </div>

            {/* Vehicle Number */}
            <div className="flex justify-between items-start gap-4">
              <p className="text-sm font-medium text-gray-700 flex-shrink-0 pt-3">Vehicle Number</p>
              <div className="flex-1 text-right">
                <p className="text-sm font-semibold text-gray-900 bg-gray-100 rounded-lg p-3">
                  {qrData?.vehicleNumber || "-"}
                </p>
              </div>
            </div>

            {/* Owner Name */}
            <div className="flex justify-between items-start gap-4">
              <p className="text-sm font-medium text-gray-700 flex-shrink-0 pt-3">Owner name</p>
              <div className="flex-1 text-right">
                <p className="text-sm font-semibold text-gray-900 bg-gray-100 rounded-lg p-3">
                  {qrData?.name || "-"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex justify-between items-start gap-4">
              <p className="text-sm font-medium text-gray-700 flex-shrink-0 pt-3">Email</p>
              <div className="flex-1 text-right">
                <p className="text-sm font-semibold text-gray-900 bg-gray-100 rounded-lg p-3">
                  {qrData?.email || "-"}
                </p>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex justify-between items-start gap-4">
              <p className="text-sm font-medium text-gray-700 flex-shrink-0 pt-3">Phone Number</p>
              <div className="flex-1 text-right">
                <p className="text-sm font-semibold text-gray-900 bg-gray-100 rounded-lg p-3">
                  {qrData?.phoneNumber || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors mt-8"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? "Downloading..." : "Download"}
          </button>
        </div>

        {/* Bottom spacing */}
        <div className="mb-6"></div>
      </div>
    </div>
  );
}
