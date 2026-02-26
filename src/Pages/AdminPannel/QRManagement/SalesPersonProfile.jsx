import React from "react";
import { useNavigate } from "react-router-dom";

const SalesPersonProfile = ({ info }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/sales-details-page")}
      className="bg-linear-to-br from-white to-white/70 h-24 w-52 rounded-md border border-gray-200 hover:shadow-lg transition-shadow p-3"
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {info.full_name}
          </h3>
          <p className="text-xs text-gray-500">SP-{info.SP}</p>
        </div>
      </div>
      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded-full border border-blue-200">
        <span className="text-xs text-blue-700">QR Assigned:</span>
        <span className="text-xs font-semibold text-blue-700">
          {info.QR_Assigned}
        </span>
      </div>
    </div>
  );
};

export default SalesPersonProfile;
