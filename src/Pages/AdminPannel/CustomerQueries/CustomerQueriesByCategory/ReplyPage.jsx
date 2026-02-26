import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Paperclip, Send } from "lucide-react";

const ReplyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = location.state?.query || {};
  const [replyText, setReplyText] = useState("");

  const handleSubmit = () => {
    console.log("Reply submitted:", replyText);
    navigate(-1);
  };

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
            <span className="text-2xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Admin User</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reply to Customer Query</h1>
          <p className="text-gray-600 mt-1">Provide a detailed response to the customer</p>
        </div>
      </div>

      {/* Reply Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
          <input
            type="text"
            value={query.customerName || ""}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer ID</label>
          <input
            type="text"
            value={query.customerId || ""}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Query</label>
          <textarea
            value={query.question || ""}
            disabled
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Reply <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Type your reply here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Attach Files (Optional)</label>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Paperclip className="w-4 h-4" />
            Attach File
          </button>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Submit Reply
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
};

export default ReplyPage;
