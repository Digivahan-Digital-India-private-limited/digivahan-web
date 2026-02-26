import React from "react";
import { Bell } from "lucide-react";

export default function EmergencyContactsEmpty() {

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
          {/* Profile Picture */}
          <div className="relative w-10 h-10">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-gray-900">Emergency Contacts</h1>

          {/* Notification Bell */}
          <button className="w-6 h-6 flex items-center justify-center">
            <Bell className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center px-6 py-16">
        {/* No Contact Icon */}
        <div className="relative mb-8">
          {/* Green Address Book */}
          <div className="w-64 h-80 bg-green-500 rounded-2xl relative">
            {/* Spiral Binding */}
            <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-around py-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-4 h-6 bg-white rounded-r-lg"></div>
              ))}
            </div>

            {/* User Icon Circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {/* Outer green circle */}
              <div className="w-32 h-32 bg-green-300 rounded-full flex items-center justify-center">
                {/* Inner circle */}
                <div className="w-24 h-24 bg-green-200 rounded-full flex items-center justify-center">
                  {/* User Icon */}
                  <div className="flex flex-col items-center">
                    {/* Head */}
                    <div className="w-12 h-12 bg-yellow-300 rounded-full mb-2"></div>
                    {/* Body */}
                    <div className="w-16 h-10 bg-yellow-300 rounded-t-full"></div>
                  </div>
                </div>
              </div>

              {/* Red X Badge */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">✕</span>
              </div>
            </div>

            {/* No Contact Text */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
              <p className="text-white font-bold text-lg">No Contact</p>
            </div>
          </div>
        </div>

        {/* No Contacts Found Text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">No Contacts Found</h2>
        <p className="text-gray-500 text-center">
          Please add some contacts for your safety.
        </p>
      </div>
    </div>
  );
}
