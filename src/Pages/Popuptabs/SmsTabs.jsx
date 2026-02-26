import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SmsTabs = ({ setshowSmsPopup, userId, issueType }) => {
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    // if (!issueType) {
    //   toast.error("Issue type missing");
    //   return;
    // }

    try {
      setLoading(true);

      const payload = {
        user_id: userId,
        issue_type: issueType || "accident_alert", // ✅ props se aa raha hai
      };

      await axios.post(
        "http://localhost:3000/api/send/sms-notification",
        payload
      );

      toast.success("📩 SMS sent successfully");
      setshowSmsPopup(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to send SMS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-xl p-6 w-80">
        {/* Close */}
        <button
          onClick={() => setshowSmsPopup(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-6 text-gray-800 text-center">
          Send SMS Alert
        </h2>

        {/* Continue Button */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full bg-blue-500 disabled:bg-blue-300 text-white py-2 rounded-lg font-medium"
        >
          {loading ? "Sending..." : "Continue & Send SMS"}
        </button>
      </div>
    </div>
  );
};

export default SmsTabs;
