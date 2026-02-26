import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Bell, Camera, Phone, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddEmergencyContact() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  const [profileImage, setProfileImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCameraView, setShowCameraView] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    relation: "Select Relation",
    phoneNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileImageClick = () => {
    setShowImageModal(true);
  };

  const handleTakePhoto = async () => {
    setShowImageModal(false);
    setShowCameraView(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
      setShowCameraView(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const imageData = canvasRef.current.toDataURL("image/jpeg");
      setProfileImage(imageData);
      closeCameraView();
    }
  };

  const closeCameraView = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCameraView(false);
  };

  const handleChooseFromGallery = () => {
    fileInputRef.current?.click();
    setShowImageModal(false);
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

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleAdd = () => {
    console.log("Added contact:", formData, profileImage);
    // Add API call or navigation logic here
  };

  const relationshipOptions = [
    "Select Relation",
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
          <h1 className="text-xl font-bold text-gray-900">Add Emergency Contact</h1>

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
            {profileImage ? (
              <div className="w-40 h-40 rounded-full border-4 border-green-500 overflow-hidden shadow-lg">
                <img
                  src={profileImage}
                  alt="Contact"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-40 h-40 rounded-full border-4 border-green-500 overflow-hidden shadow-lg bg-gray-300 flex items-center justify-center">
                <Users className="w-20 h-20 text-gray-600" />
              </div>
            )}

            {/* Camera Icon Button */}
            <button
              onClick={handleProfileImageClick}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors z-20"
            >
              <Camera className="w-5 h-5" />
            </button>

            {/* Hidden Gallery File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Hidden Canvas for Camera Capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* User Name Text */}
          <p className="text-gray-900 font-semibold">User Name</p>
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
                placeholder="Enter your first name"
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
                placeholder="Enter your last name"
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
              <span className="text-gray-500">+91</span>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-6"
          >
            Add
          </button>
        </div>
      </div>

      {/* Image Selection Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-80 mx-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Select Image</h2>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Description */}
            <p className="text-sm text-gray-600 mb-6">
              Please select or capture a image to upload at your profile through given option.
            </p>

            {/* Modal Options */}
            <div className="space-y-3">
              {/* Take Photo Option */}
              <button
                onClick={handleTakePhoto}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-900 font-semibold">Take Photo</span>
              </button>

              {/* Choose from Gallery Option */}
              <button
                onClick={handleChooseFromGallery}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-900 font-semibold">Choose from Gallery</span>
              </button>

              {/* Cancel Option */}
              <button
                onClick={() => setShowImageModal(false)}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <X className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-900 font-semibold">Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Camera View */}
      {showCameraView && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Camera Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="flex-1 w-full object-cover"
          />

          {/* Camera Controls */}
          <div className="bg-black py-8 flex items-center justify-around px-10">
            {/* Cancel */}
            <button
              onClick={closeCameraView}
              className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Capture Button */}
            <button
              onClick={capturePhoto}
              className="w-20 h-20 bg-white rounded-full border-4 border-gray-400 flex items-center justify-center"
            >
              <div className="w-14 h-14 bg-white rounded-full border-2 border-gray-300" />
            </button>

            {/* Spacer */}
            <div className="w-12 h-12" />
          </div>
        </div>
      )}
    </div>
  );
}
