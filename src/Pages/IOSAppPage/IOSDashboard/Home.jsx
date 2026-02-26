import React from "react";
import { Bell, LogOut, QrCode, Car, FileText, CreditCard, Package, Download, Home as HomeIcon, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyGarage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/ios/login");
  };

  const handleProfileClick = () => {
    navigate('/ios/profile');
  };

  const handleNotificationClick = () => {
    navigate('/ios/notifications');
  };

  const handleScanNow = () => {
    console.log("Scan Now clicked");
    // Here you would typically open camera for QR scanning
  };

  const handleFeatureClick = (feature) => {
    console.log(`${feature} clicked`);
    // Handle navigation to different features
  };

  const features = [
    { id: 1, name: "Scan QR Code", icon: <QrCode className="w-6 h-6" />, color: "text-gray-700" },
    { id: 2, name: "Check Vehicle", icon: <Car className="w-6 h-6" />, color: "text-gray-700" },
    { id: 3, name: "Check Challan", icon: <FileText className="w-6 h-6" />, color: "text-gray-700" },
    { id: 4, name: "Fast Tag", icon: <CreditCard className="w-6 h-6" />, color: "text-gray-700" },
    { id: 5, name: "Activate QR", icon: <QrCode className="w-6 h-6" />, color: "text-gray-700" },
    { id: 6, name: "My Garage", icon: <HomeIcon className="w-6 h-6" />, color: "text-gray-700" },
    { id: 7, name: "Download QR", icon: <Download className="w-6 h-6" />, color: "text-gray-700" },
    { id: 8, name: "Order QR", icon: <ShoppingCart className="w-6 h-6" />, color: "text-gray-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleProfileClick}
              className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-blue-500 flex items-center justify-center border-2 border-green-500 overflow-hidden hover:opacity-90 transition"
            >
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
            <h1 className="font-semibold text-gray-900">Home</h1>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleNotificationClick}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* QR Scan Card */}
        <div className="bg-linear-to-r from-green-100 to-green-200 rounded-2xl p-6 mb-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-yellow-200 rounded-full translate-y-12 translate-x-12 opacity-50"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            {/* QR Code Icon */}
            <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Scan QR Code</h2>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Scan a QR code of Digivahan to contact the owner
              </p>
              <button
                onClick={handleScanNow}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Scan Now
              </button>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => handleFeatureClick(feature.name)}
              className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-2">
                <span className={feature.color}>{feature.icon}</span>
              </div>
              <span className="text-xs text-gray-700 text-center font-medium leading-tight">
                {feature.name}
              </span>
            </button>
          ))}
        </div>

        {/* How to use QR Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to use QR</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=500&h=300&fit=crop"
              alt="How to use QR code - showing mobile phone scanning QR code on vehicle"
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGarage;