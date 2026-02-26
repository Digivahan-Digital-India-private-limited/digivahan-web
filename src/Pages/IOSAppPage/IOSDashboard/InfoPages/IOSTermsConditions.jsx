import React from "react";
import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TermsAndConditionsPage from "../../../TermsAndConditionsPage";

export default function IOSTermsConditions() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* iOS Header */}
      <div className="shrink-0 bg-white border-b border-gray-200">
        {/* Status Bar */}
        <div className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-gray-700">
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>
        {/* Nav Bar */}
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Terms & Conditions</h1>
          <button>
            <Bell className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <TermsAndConditionsPage />
      </div>
    </div>
  );
}
