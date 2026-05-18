import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Paperclip, Send, X, BookOpen } from "lucide-react";
import { httpClient } from "../../../../features/shared/api/httpClient";
import { toast } from "react-toastify";

const ReplyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = location.state?.query || {};
  const [replyText, setReplyText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const customerName = `${query.first_name || ""} ${query.last_name || ""}`.trim();
  const customerEmail = query.email || "";
  const customerQuestion = query.query || "";
  const queryType = query.query_type || "General";

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!replyText.trim()) {
      toast.error("Reply text cannot be empty");
      return;
    }
    if (!customerEmail) {
      toast.error("Customer email is missing");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("email", customerEmail);
      formData.append("replyText", replyText);
      formData.append("customerName", customerName);
      if (attachment) {
        formData.append("attachment", attachment);
      }

      const response = await httpClient.post("/api/admin/query/reply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success) {
        toast.success("Reply sent successfully via email");
        navigate(-1);
      } else {
        toast.error("Failed to send reply");
      }
    } catch (error) {
      console.error("Reply Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong while sending the reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddFaq = () => {
    if (!replyText.trim()) {
      toast.warning("Please write a reply first to use it as the FAQ answer.");
      return;
    }
    navigate("/post-faq", {
      state: {
        prefillQuestion: customerQuestion,
        prefillAnswer: replyText,
        prefillType: queryType,
      },
    });
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
            value={customerName}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email (ID)</label>
          <input
            type="text"
            value={customerEmail}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Query</label>
          <textarea
            value={customerQuestion}
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Paperclip className="w-4 h-4" />
              Choose File
            </button>
            {attachment && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">
                <span className="text-sm font-medium truncate max-w-xs">{attachment.name}</span>
                <button onClick={removeAttachment} className="hover:text-red-500 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSubmitting ? "Sending..." : "Submit Reply"}
          </button>

          {/* ✨ Add FAQ Button */}
          <button
            onClick={handleAddFaq}
            disabled={isSubmitting}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            Add FAQ
          </button>

          <button
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
};

export default ReplyPage;
