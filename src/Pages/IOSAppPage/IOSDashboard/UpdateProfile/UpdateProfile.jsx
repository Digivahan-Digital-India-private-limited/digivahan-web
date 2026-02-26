import React, { useState } from "react";
import { ArrowLeft, Bell, Users, TreePine, MapPin, Phone, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const [userProfile] = useState({
    name: "Shamsudeen Tiwari",
    profileImage: "https://randomuser.me/api/portraits/men/75.jpg",
    profileComplete: 70,
  });

  const menuItems = [
    {
      id: 1,
      icon: Users,
      label: "Basic Details",
      progress: "3/5",
      isComplete: false,
      color: "text-green-600",
    },
    {
      id: 2,
      icon: TreePine,
      label: "Public Details",
      progress: null,
      isComplete: true,
      color: "text-green-600",
    },
    {
      id: 3,
      icon: MapPin,
      label: "Address Book",
      progress: null,
      isComplete: true,
      color: "text-green-600",
    },
    {
      id: 4,
      icon: Phone,
      label: "Emergency Contacts",
      progress: null,
      isComplete: true,
      color: "text-green-600",
    },
    {
      id: 5,
      icon: Bell,
      label: "Set Default & Primary",
      progress: "1/2",
      isComplete: false,
      color: "text-yellow-600",
    },
    {
      id: 6,
      icon: Lock,
      label: "Change Password",
      progress: null,
      isComplete: false,
      color: "text-gray-600",
    },
  ];

  const handleMenuClick = (itemId) => {
    if (itemId === 1) {
      navigate("/ios/basic-details");
    } else if (itemId === 2) {
      navigate("/ios/public-details");
    } else if (itemId === 4) {
      navigate("/ios/emergency-contacts-list");
    } else if (itemId === 6) {
      navigate("/ios/change-password");
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
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
          <h1 className="text-xl font-bold text-gray-900">Profile update</h1>

          {/* Notification Bell */}
          <button className="w-6 h-6 flex items-center justify-center">
            <Bell className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          {/* Profile Picture with Circular Progress */}
          <div className="relative mb-4 w-40 h-40 flex items-center justify-center">
            {/* SVG Circular Progress */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 160">
              {/* Background Circle */}
              <circle
                cx="80"
                cy="80"
                r="75"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="4"
              />
              {/* Progress Circle */}
              <circle
                cx="80"
                cy="80"
                r="75"
                fill="none"
                stroke="#22c55e"
                strokeWidth="4"
                strokeDasharray={`${(75 * 2 * Math.PI * userProfile.profileComplete) / 100} ${75 * 2 * Math.PI}`}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
              />
            </svg>

            {/* Profile Picture */}
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg relative z-10">
              <img
                src={userProfile.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Complete Badge */}
            <button className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-yellow-400 text-gray-800 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap hover:bg-yellow-500 transition-colors z-20">
              {userProfile.profileComplete}% Complete
            </button>
          </div>

          {/* User Name */}
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            {userProfile.name}
          </h2>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                {/* Left Side - Icon and Label */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <IconComponent className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <span className="text-base font-semibold text-gray-900">
                    {item.label}
                  </span>
                </div>

                {/* Right Side - Status or Progress */}
                <div className="flex items-center gap-2">
                  {item.isComplete ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <span className="text-sm font-semibold text-gray-600">
                      {item.progress}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Version Footer */}
      <div className="text-center py-6">
        <p className="text-xs text-gray-400">version 1.2</p>
      </div>
    </div>
  );
}
