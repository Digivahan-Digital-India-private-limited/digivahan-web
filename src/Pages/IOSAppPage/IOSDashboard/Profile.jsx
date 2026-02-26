import React, { useState } from "react";
import { ArrowLeft, Bell, ShoppingBag, QrCode, User, Info, FileText, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(true);

  const handleBack = () => {
    navigate("/ios/dashboard");
  };

  const menuItems = [
    {
      id: 1,
      icon: Bell,
      label: "Notification",
      hasToggle: true,
    },
    {
      id: 2,
      icon: ShoppingBag,
      label: "My Order",
      hasToggle: false,
    },
    {
      id: 3,
      icon: QrCode,
      label: "My Virtual QRs",
      hasToggle: false,
    },
    {
      id: 4,
      icon: User,
      label: "Update Profile",
      hasToggle: false,
    },
    {
      id: 5,
      icon: Info,
      label: "About Us",
      hasToggle: false,
    },
    {
      id: 6,
      icon: FileText,
      label: "Terms & Conditions",
      hasToggle: false,
    },
    {
      id: 7,
      icon: Shield,
      label: "Privacy & Policy",
      hasToggle: false,
    },
  ];

  const handleMenuClick = (itemId) => {
    switch (itemId) {
      case 1:
        navigate("/ios/notifications");
        break;
      case 2:
        navigate("/ios/my-order");
        break;
      case 3:
        navigate("/ios/my-virtual-qr-list");
        break;
      case 4:
        navigate("/ios/update-profile");
        break;
      case 5:
        navigate("/ios/about-us");
        break;
      case 6:
        navigate("/ios/terms-conditions");
        break;
      case 7:
        navigate("/ios/privacy-policy");
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Back Button */}
      <div className="absolute top-6 left-4 z-10">
        <button
          onClick={handleBack}
          className="w-10 h-10 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow-md hover:bg-opacity-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-linear-to-b from-green-100 to-green-50 px-6 pt-16 pb-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-6">
            {/* Green Circle Background */}
            <div className="w-full h-full bg-green-500 rounded-full border-4 border-green-600"></div>
            
            {/* Profile Image */}
            <div className="absolute inset-3 rounded-full overflow-hidden">
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Orange Badge */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-orange-400 rounded-full border-3 border-white"></div>
          </div>

          {/* User Name */}
          <h2 className="text-2xl font-bold text-gray-900 text-center">Shamsudeen Tiwari</h2>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-0">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className="w-full flex items-center justify-between py-5 px-4 hover:bg-gray-50 transition rounded-lg"
                >
                  {/* Left Side - Icon and Label */}
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-green-500">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-gray-900 font-medium text-lg">{item.label}</span>
                  </div>

                  {/* Right Side - Toggle or Arrow */}
                  {item.hasToggle ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotification(!notification);
                      }}
                      className="relative w-14 h-8 rounded-full transition-colors"
                      style={{
                        backgroundColor: notification ? "#FF9800" : "#CCCCCC",
                      }}
                    >
                      {/* Toggle Slider */}
                      <div
                        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200"
                        style={{
                          transform: notification ? "translateX(28px)" : "translateX(2px)",
                        }}
                      />
                    </button>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>

                {/* Divider */}
                {index < menuItems.length - 1 && (
                  <div className="h-px bg-gray-200 mx-4" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-12 pb-8 text-center">
          <p className="text-xs text-gray-400 font-medium">
            DIGIVAHAN DIGITAL INDIA PRIVATE LIMITED ®
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
