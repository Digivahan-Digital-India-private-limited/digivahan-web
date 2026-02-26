import React, { useState } from "react";
import { ArrowLeft, Bell, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyVirtualQRList() {
  const navigate = useNavigate();
  const [qrList] = useState([
    {
      id: 1,
      name: "Ramesh Kumar",
      vehicleName: "Honda Nexon",
      vehicleNumber: "UKO9AD7656",
      email: "RameshKumar@Gmail.com",
      phoneNumber: "9897000001",
      qrCode: "UKO9AD7656",
      image: "https://images.unsplash.com/photo-1552821728-8ac588f1f498?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Shamsher Tiwari",
      vehicleName: "Honda City",
      vehicleNumber: "HR07RS0987",
      email: "ShamsherTiwari@Gmail.com",
      phoneNumber: "9876543210",
      qrCode: "UP09R5423",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "George Ansari",
      vehicleName: "Suzuki Super",
      vehicleNumber: "UP09R5423",
      email: "GeorgeAnsari@Gmail.com",
      phoneNumber: "9123456789",
      qrCode: "UP09R5423",
      image: "https://images.unsplash.com/photo-1552821554-5fefe8c9ef14?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      name: "Suresh Khan",
      vehicleName: "Cruz",
      vehicleNumber: "UK07A0001",
      email: "SureshKhan@Gmail.com",
      phoneNumber: "9234567890",
      qrCode: "UK07A0001",
      image: "https://images.unsplash.com/photo-1555215695-3004221b04d5?w=100&h=100&fit=crop",
    },
    {
      id: 5,
      name: "Shiba Ambani",
      vehicleName: "Scorpio",
      vehicleNumber: "HR09K2109",
      email: "ShibaAmbani@Gmail.com",
      phoneNumber: "9345678901",
      qrCode: "HR09K2109",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=100&h=100&fit=crop",
    },
  ]);

  const handleDownload = (qr) => {
    navigate("/ios/my-virtual-qr-detail", { state: { qr } });
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
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
          <h1 className="text-xl font-bold text-gray-900">Virtual QR Code</h1>

          {/* Notification Bell */}
          <button className="w-6 h-6 flex items-center justify-center">
            <Bell className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="overflow-y-auto bg-white px-4 py-4"
        style={{ height: "calc(100vh - 105px)" }}
      >
        <div className="space-y-3">
          {qrList.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
            >
              {/* Profile and Info */}
              <div className="flex items-center gap-4 flex-1">
                {/* Profile Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover"
                />

                {/* User Info */}
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.vehicleName}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.qrCode}</p>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={() => handleDownload(item)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ml-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
