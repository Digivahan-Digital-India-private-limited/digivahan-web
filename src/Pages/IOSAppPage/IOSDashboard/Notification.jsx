import React, { useState } from "react";
import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const navigate = useNavigate();
  
  // State to track notifications - toggle this to test both states
  const [notifications] = useState([
    {
      id: 1,
      name: "Rajat Malik",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      message: "Accident Alert",
      time: "04:54 pm",
      type: "accident",
      buttonText: "Chat Now",
      buttonType: "chat"
    },
    {
      id: 2,
      name: "Guest User78534",
      avatar: null,
      message: "Road Block Alert",
      time: "04:54 pm", 
      type: "roadblock",
      buttonText: "Chat Now",
      buttonType: "chat"
    },
    {
      id: 3,
      name: "Niharika Begam",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      message: "Blocked Vehicle Alert",
      time: "04:54 pm",
      type: "blocked",
      buttonText: "Chat Now", 
      buttonType: "chat"
    },
    {
      id: 4,
      name: "Guest User68514",
      avatar: null,
      message: "Unknown Issue Alert",
      time: "04:54 pm",
      type: "unknown",
      buttonText: "Chat Now",
      buttonType: "chat"
    },
    {
      id: 5,
      name: "Honda City",
      avatar: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=100&h=100&fit=crop",
      message: "Your QR is delivered.",
      time: "04:54 pm",
      type: "delivery",
      buttonText: "Check Now",
      buttonType: "check"
    },
    {
      id: 6,
      name: "Guest User78533",
      avatar: null,
      message: "No Parking Alert",
      time: "04:54 pm",
      type: "parking",
      buttonText: "Chat Now",
      buttonType: "chat"
    },
    {
      id: 7,
      name: "Julfigar Pandey",
      avatar: "https://randomuser.me/api/portraits/men/78.jpg",
      message: "Unknown Issue Alert", 
      time: "04:54 pm",
      type: "unknown",
      buttonText: "Chat Now",
      buttonType: "chat"
    },
    {
      id: 8,
      name: "Guest User78535",
      avatar: null,
      message: "Road Block Alert",
      time: "04:54 pm",
      type: "roadblock", 
      buttonText: "Chat Now",
      buttonType: "chat"
    },
    {
      id: 9,
      name: "Sagufta Garg",
      avatar: "https://randomuser.me/api/portraits/women/24.jpg",
      message: "Unknown Issue Alert",
      time: "04:54 pm",
      type: "unknown",
      buttonText: "Chat Now",
      buttonType: "chat"
    },
    {
      id: 10,
      name: "Tacsun",
      avatar: "https://images.unsplash.com/photo-1494976866556-6812c9d1c72e?w=100&h=100&fit=crop",
      message: "Your QR is out for delivery",
      time: "04:54 pm",
      type: "delivery",
      buttonText: "Check Now",
      buttonType: "check"
    },
    {
      id: 11,
      name: "Guest User78530",
      avatar: null,
      message: "Request for Doc Access",
      time: "04:54 pm",
      type: "document",
      buttonText: "Check Now",
      buttonType: "check"
    },
    {
      id: 12,
      name: "George Khan",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      message: "No Parking Alert",
      time: "04:54 pm",
      type: "parking",
      buttonText: "Chat Now",
      buttonType: "chat"
    }
  ]);

  const handleBack = () => {
    navigate("/ios/dashboard");
  };

  const handleNotificationAction = (notification, actionType) => {
    console.log(`${actionType} clicked for notification:`, notification.id);
    
    if (actionType === "chat") {
      navigate("/ios/chat", { 
        state: { notification } 
      });
    } else if (actionType === "check") {
      navigate("/ios/document-vault", { 
        state: { notification } 
      });
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "accident":
        return "🚨";
      case "roadblock":
        return "🚧";
      case "blocked":
        return "🚫";
      case "unknown":
        return "❗";
      case "delivery":
        return "📦";
      case "parking":
        return "🅿️";
      case "document":
        return "📄";
      default:
        return "🔔";
    }
  };

  const isEmpty = notifications.length === 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-blue-500 flex items-center justify-center border-2 border-green-500 overflow-hidden hover:opacity-90 transition"
          >
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
          <h1 className="font-semibold text-gray-900">Notification</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          // Empty State
          <div className="flex flex-col items-center justify-center px-6 py-16 min-h-full">
            {/* Illustration */}
            <div className="mb-8 w-full max-w-xs">
              <svg
                className="w-full h-auto"
                viewBox="0 0 300 350"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background elements */}
                <circle cx="60" cy="80" r="15" fill="#4CAF50" opacity="0.8" />
                <text x="67" y="86" fill="white" fontSize="12" fontWeight="bold">7</text>
                
                <circle cx="240" cy="100" r="15" fill="#4CAF50" opacity="0.8" />
                <text x="244" y="106" fill="white" fontSize="12" fontWeight="bold">10</text>
                
                <circle cx="80" cy="180" r="12" fill="#FF9800" opacity="0.8" />
                <text x="86" y="186" fill="white" fontSize="10" fontWeight="bold">5</text>
                
                <circle cx="220" cy="200" r="12" fill="#4CAF50" opacity="0.8" />
                <text x="226" y="206" fill="white" fontSize="10" fontWeight="bold">3</text>
                
                <circle cx="260" cy="160" r="10" fill="#FF9800" opacity="0.8" />
                <text x="265" y="166" fill="white" fontSize="9" fontWeight="bold">2</text>

                {/* Speech bubbles */}
                <path d="M40 120 L90 120 L90 140 L45 140 Z" fill="#E8F5E9" stroke="#4CAF50" strokeWidth="1"/>
                <text x="50" y="133" fill="#4CAF50" fontSize="8">Digivahan</text>
                
                <path d="M200 70 L250 70 L250 90 L205 90 Z" fill="#FFF3E0" stroke="#FF9800" strokeWidth="1"/>
                
                {/* Plant pot */}
                <rect x="60" y="280" width="40" height="50" fill="#4CAF50" rx="5"/>
                <ellipse cx="80" cy="280" rx="20" ry="8" fill="#388E3C"/>
                
                {/* Plant leaves */}
                <ellipse cx="70" cy="250" rx="8" ry="25" fill="#4CAF50" transform="rotate(-20 70 250)"/>
                <ellipse cx="90" cy="245" rx="6" ry="20" fill="#4CAF50" transform="rotate(15 90 245)"/>
                <ellipse cx="75" cy="240" rx="5" ry="18" fill="#4CAF50" transform="rotate(-5 75 240)"/>
                <ellipse cx="85" cy="235" rx="7" ry="22" fill="#4CAF50" transform="rotate(25 85 235)"/>

                {/* Woman figure */}
                {/* Head */}
                <circle cx="150" cy="140" r="25" fill="#D4A574"/>
                
                {/* Hair */}
                <path d="M125 130 Q150 105 175 130 Q175 120 170 115 Q150 100 130 115 Q125 120 125 130 Z" fill="#2E2E2E"/>
                
                {/* Face features */}
                <circle cx="142" cy="135" r="2" fill="#2E2E2E"/>
                <circle cx="158" cy="135" r="2" fill="#2E2E2E"/>
                <path d="M145 150 Q150 155 155 150" stroke="#2E2E2E" strokeWidth="1.5" fill="none"/>
                
                {/* Body */}
                <rect x="135" y="165" width="30" height="45" fill="#4CAF50" rx="15"/>
                
                {/* Arms */}
                <ellipse cx="120" cy="180" rx="8" ry="20" fill="#D4A574"/>
                <ellipse cx="180" cy="180" rx="8" ry="20" fill="#D4A574"/>
                
                {/* Crossed arms position */}
                <ellipse cx="140" cy="190" rx="6" ry="15" fill="#D4A574" transform="rotate(30 140 190)"/>
                <ellipse cx="160" cy="190" rx="6" ry="15" fill="#D4A574" transform="rotate(-30 160 190)"/>
                
                {/* Legs */}
                <rect x="140" y="210" width="8" height="40" fill="#2E2E2E"/>
                <rect x="152" y="210" width="8" height="40" fill="#2E2E2E"/>
                
                {/* Shoes */}
                <ellipse cx="144" cy="255" rx="8" ry="5" fill="#5D4037"/>
                <ellipse cx="156" cy="255" rx="8" ry="5" fill="#5D4037"/>

                {/* Desk/Table */}
                <rect x="200" y="240" width="60" height="8" fill="#8D6E63"/>
                <rect x="205" y="248" width="4" height="30" fill="#6D4C41"/>
                <rect x="250" y="248" width="4" height="30" fill="#6D4C41"/>
                
                {/* Drawers */}
                <rect x="210" y="250" width="35" height="8" fill="#A0927E"/>
                <rect x="210" y="260" width="35" height="8" fill="#A0927E"/>
                <rect x="210" y="270" width="35" height="8" fill="#A0927E"/>
                
                {/* Drawer handles */}
                <circle cx="240" cy="254" r="1.5" fill="#5D4037"/>
                <circle cx="240" cy="264" r="1.5" fill="#5D4037"/>
                <circle cx="240" cy="274" r="1.5" fill="#5D4037"/>
              </svg>
            </div>

            {/* Title and Description */}
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
              No Notifications Yet
            </h2>
            <p className="text-gray-400 text-center text-sm mb-2">
              You're all caught up!
            </p>
            <p className="text-gray-400 text-center text-sm leading-relaxed px-4">
              We'll let you know when something new comes up.
            </p>
          </div>
        ) : (
          // Notifications List
          <div className="px-4 py-6">
            <div className="space-y-0">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className="flex items-center justify-between gap-4 py-4 px-2 hover:bg-gray-50 transition">
                    {/* Left Side - Avatar and Content */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0">
                        {notification.avatar ? (
                          <img
                            src={notification.avatar}
                            alt={notification.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {notification.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                              {notification.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs">{getAlertIcon(notification.type)}</span>
                              <p className="text-sm text-gray-500 truncate">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400 ml-2 shrink-0">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Action Button */}
                    <button
                      onClick={() => handleNotificationAction(notification, notification.buttonType)}
                      className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded shrink-0 transition-colors"
                    >
                      {notification.buttonText}
                    </button>
                  </div>

                  {/* Divider */}
                  {index < notifications.length - 1 && (
                    <div className="h-px bg-gray-200 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;