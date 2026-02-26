import React, { useState, useRef } from "react";
import { ArrowLeft, Bell, Camera, Phone, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function EditEmergencyContact() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(
    location.state?.contactImage || "https://randomuser.me/api/portraits/women/44.jpg"
  );

  const [formData, setFormData] = useState({
    firstName: location.state?.firstName || "Sabnam",
    lastName: location.state?.lastName || "Tiwari",
    relation: location.state?.relation || "Wife",
    phoneNumber: location.state?.phoneNumber || "9897000001",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    console.log("Updated contact:", formData);
    // Add API call or navigation logic here
  };

  const relationshipOptions = [
    "Friend",
    "Family",
    "Spouse",
    "Wife",
    "Husband",
    "Mother",
    "Father",
    "Sister",
    "Brother",
    "Daughter",
    "Son",
    "Other",
  ];

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
          <h1 className="text-xl font-bold text-gray-900">Edit Emergency Contact</h1>

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
          {/* Profile Picture with Green Border */}
          <div className="relative mb-4">
            <div className="w-40 h-40 rounded-full border-4 border-green-500 overflow-hidden shadow-lg">
              <img
                src={profileImage}
                alt="Contact"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Camera Icon Button */}
            <button
              onClick={handleProfileImageClick}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors z-20"
            >
              <Camera className="w-5 h-5" />
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Emergency Contact Form */}
        <div className="space-y-6">
          {/* First Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              First Name
            </label>
            <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3">
              <Users className="w-5 h-5 text-green-500" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Last Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Last Name
            </label>
            <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3">
              <Users className="w-5 h-5 text-green-500" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Relation Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Relation
            </label>
            <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3">
              <Users className="w-5 h-5 text-green-500" />
              <select
                name="relation"
                value={formData.relation}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              >
                {relationshipOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Phone Number
            </label>
            <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3">
              <Phone className="w-5 h-5 text-green-500" />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-6"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
