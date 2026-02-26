import React, { useState } from "react";
import {
  FaArrowLeft,
  FaPhoneAlt,
  FaWhatsapp,
  FaSms,
  FaCheckCircle,
} from "react-icons/fa";
import DigivahanLogo from "../assets/logo.png"; // apna correct path dena
import { useParams, useNavigate } from "react-router-dom";
import calculateAgeFromDate from "../utils/dateUtils";
import { useQuery } from "@tanstack/react-query";
import fetchUserDetails from "../utils/userApis";
import ContactTabs from "./Popuptabs/ContactTabs";
import SmsTabs from "./Popuptabs/SmsTabs";

const EmergencyContactUspage = () => {
  const [emergencyContact, setemergencyContact] = useState(null);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [callTo, setcallTo] = useState("general");
  const [showSmsPopup, setshowSmsPopup] = useState(false);
  const { qr_id } = useParams();
  const navigate = useNavigate();

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
      {showContactPopup && (
        <ContactTabs
          receiverNumber={
            callTo === "general" ? user.phone_number : emergencyContact
          }
          setShowContactPopup={setShowContactPopup}
        />
      )}

      {showSmsPopup && (
        <SmsTabs setshowSmsPopup={setshowSmsPopup} userId={user.user_id} />
      )}

      <div className="min-h-screen bg-gray-100 p-2 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white shadow-sm">
          <FaArrowLeft
            onClick={() => navigate(`/accident-notification/${qr_id}`)}
            className="text-lg cursor-pointer"
          />
          <h1 className="font-semibold text-lg mx-auto pr-6">Scan QR Code</h1>
        </div>

        {/* Profile Section */}
        <div className="bg-white p-6 text-center">
          <div className="relative inline-block">
            <img
              src={user.profile_pic}
              alt="profile"
              className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover"
            />
            <FaCheckCircle className="absolute bottom-1 right-1 text-green-500 bg-white rounded-full" />
          </div>

          <h2 className="text-lg font-semibold mt-3 flex items-center justify-center gap-1">
            {user.full_Name}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {calculateAgeFromDate(user.age) || "N/A"} year old •{" "}
            {user.gender || "N/A"}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {user.address || "Address not available"}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                setShowContactPopup(true);
                setcallTo("general");
              }}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <FaPhoneAlt /> Call
            </button>

            <button
              onClick={() => {
                setshowSmsPopup(true);
              }}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <FaSms /> SMS
            </button>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white p-4">
          <h3 className="font-semibold text-gray-700 mb-3">
            Emergency Contacts
          </h3>

          {user.emergency_contacts?.map((contact) => (
            <div
              key={contact._id}
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <img
                  src={contact.profile_pic}
                  alt={contact.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">
                    {contact.first_name} {contact.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{contact.relation}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setshowSmsPopup(true);
                  }}
                  className="text-green-500 text-lg"
                >
                  <FaSms />
                </button>
                <button
                  onClick={() => {
                    setShowContactPopup(true);
                    setemergencyContact(contact.phone_number);
                    setcallTo("emergency");
                  }}
                  className="text-blue-500 text-lg"
                >
                  <FaPhoneAlt />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 🔻 Digivahan Footer */}
        <div className="bg-white mt-3 p-5 text-justify rounded-b-xl">
          <img
            src={DigivahanLogo}
            alt="Digivahan"
            className="w-40 mx-auto mb-3"
          />

          <p className="text-xs text-gray-600 leading-relaxed">
            For a significantly better, smoother and highly reliable user
            experience with secure and uninterrupted connectivity, we strongly
            recommend downloading the official Digivahan mobile application
            directly from the Google Play Store.
          </p>

          <button
            onClick={() =>
              window.open(
                "https://play.google.com/store/apps/details?id=com.digivahan",
                "_blank",
              )
            }
            className="
            mt-4
            md:w-[30%]
            w-[45%]
            py-3
            rounded-lg
            bg-white
            border border-gray-300
            text-gray-700
            font-semibold
            text-sm
            shadow-sm
            active:scale-95
            transition
            duration-150
          "
          >
            Download Now
          </button>
        </div>
      </div>
    </main>
  );
};

export default EmergencyContactUspage;
