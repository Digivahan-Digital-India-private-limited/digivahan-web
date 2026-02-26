import React, { useState } from "react";
import { ArrowLeft, Bell, Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdate = () => {
    setShowSuccess(true);
  };

  const handleLogin = () => {
    setShowSuccess(false);
    navigate("/ios/profile");
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        {/* Status Bar */}
        <div className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-gray-700">
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Back + Profile Pic */}
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
            <div className="relative">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-green-500">
                <img
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-lg font-bold text-gray-900">Change Password</h1>

          {/* Bell */}
          <button>
            <Bell className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-36 h-36 rounded-full border-4 border-green-500 overflow-hidden shadow-lg mb-3">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-gray-900 font-semibold text-base">Shamsudeen Tiwari</p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Current Password
            </label>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
              <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                placeholder="Enter your password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
              <button onClick={() => toggleVisibility("current")}>
                {showPasswords.current ? (
                  <Eye className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              New Password
            </label>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
              <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <input
                type={showPasswords.newPass ? "text" : "password"}
                name="newPassword"
                placeholder="Enter new  password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
              <button onClick={() => toggleVisibility("newPass")}>
                {showPasswords.newPass ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Confirm password
            </label>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
              <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
              <button onClick={() => toggleVisibility("confirm")}>
                {showPasswords.confirm ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-4"
          >
            Update
          </button>
        </div>
      </div>

      {/* Success Popup Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-gray-300 flex flex-col items-center">
          {/* Blurred background content */}
          <div className="absolute inset-0 flex flex-col items-center blur-sm pointer-events-none">
            {/* Digivahan Logo */}
            <div className="mt-16 mb-8">
              <img
                src="/logo.png"
                alt="Digivahan"
                className="w-56 object-contain"
              />
            </div>

            {/* Fake form fields at bottom */}
            <div className="absolute bottom-0 w-full px-8 space-y-3 pb-10">
              <div className="h-12 bg-white rounded-xl border border-gray-300" />
              <div className="h-12 bg-white rounded-xl border border-gray-300" />
              <div className="h-12 bg-yellow-400 rounded-xl" />
              <div className="flex items-center gap-2 justify-center py-1">
                <div className="flex-1 h-px bg-gray-500" />
                <span className="text-gray-600 text-sm font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-500" />
              </div>
              <div className="h-12 bg-gray-400 rounded-xl" />
            </div>
          </div>

          {/* Popup Card — centered over background */}
          <div className="relative z-10 mx-6 mt-auto mb-auto bg-white rounded-2xl shadow-2xl py-10 px-8 flex flex-col items-center text-center w-[320px]">
            {/* Success Badge */}
            <img
              src="/success 1.png"
              alt="Success"
              className="w-24 h-24 object-contain mb-5"
            />

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Password Changed
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Your password has been changed. Please use the new password next time you log in.
            </p>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-12 rounded-full transition-colors text-sm"
            >
              Login
            </button>
          </div>

          {/* OR + Login with number below card */}
          <div className="relative z-10 w-full px-8 mt-6 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-500" />
              <span className="text-gray-600 text-sm font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-500" />
            </div>
            <button className="w-full h-12 bg-gray-400 rounded-xl text-white font-semibold text-sm">
              Login with number
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
