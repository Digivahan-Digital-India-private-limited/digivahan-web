import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import fetchUserDetails from "../utils/userApis";
import { useNavigate, useParams } from "react-router-dom";
import calculateAgeFromDate from "../utils/dateUtils";
import NoParking from "../assets/No Parking.png";
import CongestedParking from "../assets/Congested Parking.png";
import CarLightsWindowsOpen from "../assets/Car Lights  Windows Open.png";
import CarHornorAlarmGoingOn from "../assets/Car Horn or Alarm Going On.png";
import UnknownIssueAlert from "../assets/Unknown Issue Alert.png";
import AccidentAlert from "../assets/Accident Alert.png";
import DownloadApptabs from "./Popuptabs/DownloadApptabs";
import NotAssigned from "./ErrorUIPage/NotAssigned";
import Undermaintenance from "./ErrorUIPage/Undermaintenance";

const notificationOptions = {
  vehicle: [
    {
      id: 1,
      title: "No Parking",
      icon: NoParking,
      issue_type: "no_parking",
      notification_type: "Vehicle",
      message: "Your car is parking in no parking zone.",
    },
    {
      id: 2,
      title: "Congested Parking",
      icon: CongestedParking,
      issue_type: "congested_parking",
      notification_type: "Vehicle",
      message: "Your vehicle is causing parking congestion. Please move it.",
    },
    {
      id: 3,
      title: "Car Lights / Windows Open",
      icon: CarLightsWindowsOpen,
      issue_type: "car_lights_windows_left_open",
      notification_type: "Vehicle",
      message: "Your car lights or windows are open.",
    },
    {
      id: 4,
      title: "Car Horn or Alarm Going On",
      icon: CarHornorAlarmGoingOn,
      issue_type: "car_horn_alarm_going_on",
      notification_type: "Vehicle",
      message: "Your car alarm or horn is going on.",
    },
    {
      id: 5,
      title: "Unknown Issue Alert",
      icon: UnknownIssueAlert,
      issue_type: "unknown_issue_alert",
      notification_type: "Vehicle",
      message: "An unknown issue has been detected with your vehicle.",
    },
    {
      id: 6,
      title: "Accident Alert",
      icon: AccidentAlert,
      issue_type: "accident_alert",
      notification_type: "Vehicle",
      message: "Your vehicle met with an accident.",
    },
  ],

  pet: [
    {
      id: 1,
      title: "Pet Issue Alert",
      icon: UnknownIssueAlert,
      issue_type: "pet_notification",
      notification_type: "Pet",
      message: "There is an issue related to your pet.",
    },
  ],

  other: [
    {
      id: 1,
      title: "Other Notification",
      icon: UnknownIssueAlert,
      issue_type: "other_notification",
      notification_type: "Other",
      message: "You have received a notification.",
    },
  ],
};

const SendNotificationpage = () => {
  const [selected, setSelected] = useState(null);
  const [issueType, setissueType] = useState(null);
  const [cooldown, setCooldown] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showPopup, setShowPopup] = useState(false);
  const [firstIssueType, setFirstIssueType] = useState(null);
  const [lockNotifications, setLockNotifications] = useState(false);

  const navigate = useNavigate();
  const { qr_id } = useParams();

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user-details", qr_id], // 🔥 UNIQUE PER QR
    queryFn: () => fetchUserDetails(qr_id),
    enabled: !!qr_id, // qr_id ho tabhi call
    staleTime: 5 * 60 * 1000, // 5 min tak API dobara hit nahi
    cacheTime: 10 * 60 * 1000, // memory me rakhega
  });

  useEffect(() => {
    const inProgress = localStorage.getItem("notificationInProgress");
    const savedIssue = localStorage.getItem("activeIssueType");
    const startTime = localStorage.getItem("notificationStartTime");

    if (inProgress && savedIssue && startTime) {
      const elapsed = Math.floor((Date.now() - Number(startTime)) / 1000);
      const remaining = 30 - elapsed;

      if (remaining > 0) {
        setCooldown(true);
        setShowPopup(true);
        setissueType(savedIssue);
        setFirstIssueType(savedIssue);
        setLockNotifications(true);
        setTimer(remaining);

        // find id from issue_type
        const allReasons = Object.values(notificationOptions).flat();
        const matched = allReasons.find(
          (item) => item.issue_type === savedIssue,
        );

        if (matched) {
          setSelected(matched.id);
        }
      } else {
        // time already passed → cleanup
        localStorage.removeItem("notificationInProgress");
        localStorage.removeItem("activeIssueType");
        localStorage.removeItem("notificationStartTime");
      }
    }
  }, []);

  useEffect(() => {
    if (timer > 0 || !issueType) return;

    // 🧹 clear saved state
    localStorage.removeItem("notificationInProgress");
    localStorage.removeItem("activeIssueType");
    localStorage.removeItem("notificationStartTime");

    setCooldown(false);
    setSelected(null);
    setShowPopup(false);
    setTimer(30);

    navigate(`/connect-tabs/${qr_id}/${issueType}`);
  }, [timer, issueType, navigate, qr_id]);

  useEffect(() => {
    if (!cooldown) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  useEffect(() => {
    if (timer > 0 || !issueType) return;

    setCooldown(false);
    setSelected(null);
    setShowPopup(false);
    setTimer(30);

    navigate(`/connect-tabs/${qr_id}/${issueType}`);
  }, [timer, issueType, navigate, qr_id]);

  // Filter Notification Type base on product type
  const activeReasons = user?.product_type
    ? notificationOptions[user.product_type] || []
    : [];

  const handleSendNotification = async () => {
    if (!selected || !user || isSending) return;

    // ⏳ Cooldown block
    if (cooldown) return;

    const notificationdetails = activeReasons.find(
      (data) => data.id === selected,
    );
    if (!notificationdetails) return;
    const currentIssue = notificationdetails.issue_type;
    setFirstIssueType(currentIssue);
    setissueType(currentIssue);

    const NAVIGATION_ONLY_ISSUES = [
      "accident_alert",
      "pet_notification",
      "other_notification",
      "doc_access",
    ];

    if (NAVIGATION_ONLY_ISSUES.includes(notificationdetails.issue_type)) {
      if (notificationdetails.issue_type === "doc_access") {
        navigate(`/access-vehicle-doc/${qr_id}`);
      } else {
        navigate(`/accident-notification/${qr_id}`);
      }
      return;
    }

    setIsSending(true);

    try {
      const payload = {
        receiver_id: user.user_id,
        notification_type: notificationdetails.notification_type,
        notification_title: notificationdetails.title,
        message: notificationdetails.message,
        link: "",
        vehicle_id: user.vehicle_id || "",
        issue_type: notificationdetails.issue_type,
        latitude: "",
        longitude: "",
        incident_proof: [],
        seen_status: false,
      };

      await axios.post("http://localhost:3000/api/notifications/send", payload);

      if (!lockNotifications) {
        setLockNotifications(true); // first successful send ke baad disable
      }
      // 🔐 Save state for refresh restore
      localStorage.setItem("notificationInProgress", "true");
      localStorage.setItem("activeIssueType", currentIssue);
      localStorage.setItem("notificationStartTime", Date.now().toString());

      setCooldown(true);
      setShowPopup(true); // 👈 YE LINE ADD KARO (popup open)
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to send notification");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isError && error.type !== "SERVER_ERROR") {
    return <NotAssigned message={error.message} />;
  }

  if (isError && error.type === "SERVER_ERROR") {
    return <Undermaintenance />;
  }

  return (
    <main>
      {showPopup && (
        <DownloadApptabs
          timer={timer}
          onClose={() => {
            // allow manual close ONLY after 15 sec
            if (timer <= 15) {
              setShowPopup(false);
            }
          }}
        />
      )}

      <div className="min-h-screen max-w-6xl mx-auto bg-gray-100 p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/")} className="text-xl">
            ←
          </button>
          <h1 className="font-semibold text-lg">Scan QR Code</h1>
        </div>

        {/* 👤 Profile Card */}
        <div className="bg-white rounded-xl p-3 shadow mb-6">
          <div className="flex items-start flex-col md:flex-row justify-between gap-4">
            {/* Left: Profile Info */}
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
        </div>

        {/* Reason Title */}
        <h3 className="font-medium mb-4 text-gray-700">
          Please select the reason why you want to contact the owner
        </h3>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {activeReasons.map((item) => {
            const isSelected = selected === item.id;
            const isDisabled =
              lockNotifications && item.issue_type !== firstIssueType;
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isDisabled) return;
                  if (!cooldown) setSelected(item.id);
                }}
                className={`relative rounded-xl border bg-white ${
                  isSelected ? "border-orange-500 bg-orange-50" : ""
                }
      ${
        isDisabled
          ? "opacity-40 pointer-events-none"
          : cooldown && !isSelected
            ? "opacity-40 pointer-events-none"
            : "cursor-pointer"
      }`}
              >
                {/* ⏱️ TIMER OVERLAY – ONLY ON SELECTED */}
                {cooldown && isSelected && (
                  <div className="absolute inset-0 z-10 bg-black/60 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      00:{timer < 10 ? `0${timer}` : timer}
                    </span>
                  </div>
                )}

                <div className="flex flex-col items-center justify-center text-center p-3 space-y-2 h-full">
                  <img src={item.icon} alt="" className="h-12 object-cover" />
                  <p className="text-xs text-gray-600">{item.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Button */}
        <button
          disabled={!selected || isSending}
          onClick={handleSendNotification}
          className="w-full bg-orange-400 disabled:bg-orange-200 text-white py-3 rounded-xl font-semibold"
        >
          {cooldown
            ? `Please wait ${timer}s`
            : isSending
              ? "Sending..."
              : "Send Notification"}
        </button>
      </div>
    </main>
  );
};

export default SendNotificationpage;
