import React from "react";
import { MdOutlineClose } from "react-icons/md";

const DownloadApptabs = ({ timer, onClose }) => {
  const showClose = timer <= 15; // ⭐ key logic

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-xl p-6 w-80 text-center">
        {/* ❌ Close only after 15 sec */}
        {showClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
          >
            <MdOutlineClose />
          </button>
        )}
  
        <h2 className="text-lg font-semibold mb-3">
          Download App for Better Experience
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Please wait while we connect you to the next step…
        </p>

        <a
          href="https://play.google.com/store/apps/details?id=com.digivahan"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 bg-green-500 text-white px-4 py-2 rounded-lg font-medium"
        >
          Download App
        </a>
      </div>
    </div>
  );
};

export default DownloadApptabs;
