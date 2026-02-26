import React, { useRef, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import fetchUserDetails from "../utils/userApis";
import { useParams, useNavigate } from "react-router-dom";
import calculateAgeFromDate from "../utils/dateUtils";
import { toast } from "react-toastify";

function AccidentNotification() {
  const [images, setImages] = useState([]);
  const [message, setmessage] = useState("");
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const { qr_id } = useParams();

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user-details", qr_id], // 🔥 unique per QR
    queryFn: () => fetchUserDetails(qr_id),
    enabled: !!qr_id,
    staleTime: 5 * 60 * 1000, // 5 min cache
    cacheTime: 10 * 60 * 1000,
  });

  const PRODUCT_TO_ISSUE = {
    vehicle: "accident_alert",
    pet: "pet_notification",
    other: "other_notification",
  };

  const issuetype = user
    ? PRODUCT_TO_ISSUE[user.product_type] || "other_notification"
    : "";

  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationError("");
      },
      () => {
        setLocationError("Location permission denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  // ➕ Open file picker
  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
  };

  // 📸 Handle file select
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      console.log("TYPE:", file.type);
      console.log("SIZE:", file.size / 1024 / 1024, "MB");

      // 👇 YAHAN check karo
      if (file.type === "image/heic" || file.type === "image/heif") {
        alert("iPhone image detected. Please wait, converting...");
        // agar convert nahi kar rahe ho, toh bas backend ko auto pe chhod do
        // ya yahin block mat karo, sirf log ke liye rakho
      }

      try {
        const formData = new FormData();
        formData.append("folder_name", "Alert_Image");
        formData.append("image", file);

        const res = await axios.post(
          "http://localhost:3000/api/v1/notification/image",
          formData,
        );

        toast.success("Image Uploaded successfully!");
        setImages((prev) => [
          ...prev,
          {
            image_url: res.data.data.image_url,
            public_id: res.data.data.public_id,
          },
        ]);
      } catch (error) {
        console.error("Image upload failed", error);
        alert("Image upload failed");
      }
    }

    e.target.value = "";
  };

  const handleDeleteImage = async (public_id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/notification/delete-image",
        { public_id },
      );

      if (res) {
        toast.success("Image Deleted successfully!");
      }

      // 🔥 Frontend state se bhi hata do
      setImages((prev) => prev.filter((img) => img.public_id !== public_id));
    } catch (error) {
      console.error("Delete image failed", error);
      alert("Failed to delete image");
    }
  };

  const handleSendNotification = async () => {
    if (!issuetype) {
      return toast.error("Issue type not determined. Please try again.");
    }

    // 🚨 Location mandatory check
    if (!location) {
      alert("Please enable incident location...");
      return; // 👈 yahin se function stop
    }

    if (images.length < 2) {
      alert("Please upload at least two image..");
      return; // 👈 yahin se function stop
    }

    try {
      setIsSending(true); // 👈 start loading
      const payload = {
        receiver_id: user.user_id || user._id,
        notification_type: user.product_type,
        notification_title: "Accident Alert",
        message: message,
        link: "",
        vehicle_id: user.vehicle_id || "",
        issue_type: issuetype,
        latitude: location?.latitude || "",
        longitude: location?.longitude || "",
        incident_proof: images.map((img) => img.image_url), // ✅ HERE
        seen_status: false,
      };

      const response = await axios.post(
        "http://localhost:3000/api/notifications/send",
        payload,
      );
      // console.log("Notification sent:", response.data);
      if (response) {
        toast.success("Alert Sent successfully!");
        navigate(`/emergency-notification/${qr_id}`);
        setmessage("");
        setImages([]);
      }
    } catch (error) {
      console.error("Send notification error:", error);
      alert(error?.response?.data?.message || "Failed to send notification");
    } finally {
      setIsSending(false); // 👈 stop loading
    }
  };

  // ⏳ Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // ❌ Error
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-orange-400 text-white px-6 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main>
      <div className="min-h-screen bg-gray-100 p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate("/")} className="text-xl">
            ←
          </button>
          <h1 className="font-semibold text-lg">Scan QR Code</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl p-4 shadow mb-4">
          <div className="flex items-center gap-4">
            <img
              src={user.profile_pic}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
            />
            <div>
              <h2 className="font-semibold text-lg">{user.full_Name}</h2>
              <p className="text-sm text-gray-500">
                {calculateAgeFromDate(user.age) || "N/A"} year old •{" "}
                {user.gender || "N/A"}
              </p>
              <p className="text-xs text-gray-400">
                {user.address || "Address not available"}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3">
          Please fill all necessary details before having a chat with person.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Describe the situation
          </label>
          <textarea
            placeholder="Describe the situation"
            rows={4}
            value={message}
            onChange={(e) => setmessage(e.target.value)}
            className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* 📸 Share a photo */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Share a photo
          </label>

          {/* Add Photo Box */}
          <div
            onClick={handleAddPhotoClick}
            className="border-2 border-dashed rounded-xl p-4 text-center text-gray-400 cursor-pointer hover:border-orange-400"
          >
            ➕ Add Photos
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment" // 👈 Back camera open karega
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {/* 🖼️ Preview Images */}
          {images.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {images.map((img, index) => (
                <div key={index} className="relative w-16 h-16 group">
                  {/* Image */}
                  <img
                    src={img.image_url}
                    alt="uploaded"
                    className="w-16 h-16 rounded-lg object-cover border"
                  />

                  {/* ❌ Delete button (hover only) */}
                  <button
                    onClick={() => handleDeleteImage(img.public_id)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Current location
          </label>
          <div
            onClick={getLiveLocation}
            className="h-40 rounded-xl overflow-hidden border cursor-pointer"
          >
            {location ? (
              <iframe
                title="map"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-200 text-gray-500">
                Tap to get live location
              </div>
            )}
          </div>

          {locationError && (
            <p className="text-xs text-red-500 mt-1">{locationError}</p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleSendNotification}
          disabled={isSending}
          className="w-full bg-orange-400 disabled:bg-orange-200 text-white py-3 rounded-xl font-semibold"
        >
          {isSending ? "Sending..." : "Send Alert"}
        </button>
      </div>
    </main>
  );
}

export default AccidentNotification;
