import React, { useState, useRef } from "react";
import { ArrowLeft, Bell, Check, User, Mail, Phone, Briefcase, Lock, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BasicDetails() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState("https://randomuser.me/api/portraits/men/75.jpg");
  const [profileComplete] = useState(70);

  const [formData, setFormData] = useState({
    firstName: "Shamsudeen",
    lastName: "Tiwari",
    email: "Shamsudeen.Tiwari@Secural.com",
    phoneNumber: "9897000007",
    occupation: "Select your Occupation",
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

  const handleUpdateDetails = () => {
    console.log("Updated details:", formData);
    // Add API call or navigation logic here
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
                strokeDasharray={`${(75 * 2 * Math.PI * profileComplete) / 100} ${75 * 2 * Math.PI}`}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
              />
            </svg>

            {/* Profile Picture */}
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg relative z-10">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Camera Icon Button */}
            <button
              onClick={handleProfileImageClick}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-yellow-400 text-gray-800 rounded-full p-2 hover:bg-yellow-500 transition-colors z-20"
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

        {/* Basic Details Section */}
        <div className="space-y-6">
          {/* Section Title */}
          <h2 className="text-xl font-bold text-gray-900">Basic Details</h2>

          {/* First Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              First Name
            </label>
            <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3">
              <User className="w-5 h-5 text-green-500" />
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
              <User className="w-5 h-5 text-green-500" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Email Address Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3">
              <Mail className="w-5 h-5 text-green-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
              <Check className="w-5 h-5 text-green-500" />
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
              <Check className="w-5 h-5 text-green-500" />
            </div>
          </div>

          {/* Occupation Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Occupation
            </label>
            <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3">
              <Briefcase className="w-5 h-5 text-green-500" />
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              >
                <option value="Select your Occupation">Select your Occupation</option>
                <option value="Student">Student</option>
                <option value="Working Professional">Working Professional</option>
                <option value="Self Employed">Self Employed</option>
                <option value="Entrepreneur">Entrepreneur</option>
                <option value="Retired">Retired</option>
                <option value="Homemaker">Homemaker</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Update Details Button */}
          <button
            onClick={handleUpdateDetails}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-6"
          >
            Update Details
          </button>
        </div>
      </div>
    </div>
  );
}
