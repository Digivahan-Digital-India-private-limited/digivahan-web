import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digicapital.co.in";
const FAQ_STORAGE_KEY = "digivahan_posted_faqs";
const FAQ_TYPE_MAP = {
  General: "General Information Queries",
  Technical: "Technical Queries",
  Account: "Account Queries",
  Payment: "Payment Queries",
  "Order Status": "Order Status Queries",
  Product: "Product Queries",
  Billing: "Billing Queries",
  Support: "Support Queries",
};

const PostFAQ = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    questionType: "General",
    question: "",
    answer: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successDialog, setSuccessDialog] = useState({
    isOpen: false,
    message: "",
  });

  const questionTypes = [
    "General",
    "Technical",
    "Account",
    "Payment",
    "Order Status",
    "Product",
    "Billing",
    "Support",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const question = formData.question.trim();
    const answer = formData.answer.trim();

    if (!formData.questionType || !question || !answer) {
      alert("Please fill Question Type, Question and Answer.");
      return;
    }

    const payload = {
      type: FAQ_TYPE_MAP[formData.questionType] || formData.questionType,
      question,
      answer,
    };

    try {
      setIsSubmitting(true);
      const response = await axios.post(`${BASE_URL}/api/faq/add`, payload);
      const createdFaq = response?.data?.data;

      const faqForUi = {
        id: createdFaq?._id || `${Date.now()}`,
        category: payload.type,
        question: createdFaq?.question || payload.question,
        answer: createdFaq?.answer || payload.answer,
        createdAt: createdFaq?.createdAt || new Date().toISOString(),
      };

      const existingFaqs = JSON.parse(localStorage.getItem(FAQ_STORAGE_KEY) || "[]");
      const updatedFaqs = [faqForUi, ...existingFaqs];
      localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(updatedFaqs));

      setSuccessDialog({
        isOpen: true,
        message: response?.data?.message || "FAQ posted successfully.",
      });
      setFormData({
        questionType: "General",
        question: "",
        answer: "",
      });
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to post FAQ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/customer-queries");
  };

  return (
    <main className="w-full min-h-screen overflow-y-auto bg-gray-50 md:p-6 p-3">
      {/* Top Header - Search & User */}
      <header className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-1/2 relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative text-xl">
            🔔
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              1
            </span>
          </button>
          <span className="text-gray-700">👤 Admin User</span>
        </div>
      </header>

      {/* Container Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 md:p-4 rounded-full">
              <HelpCircle className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Post FAQ
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Add a new frequently asked question
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 md:p-8 space-y-5">
          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Question Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.questionType}
              onChange={(e) => handleInputChange("questionType", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              {questionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter the question..."
              value={formData.question}
              onChange={(e) => handleInputChange("question", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Enter the detailed answer..."
              value={formData.answer}
              onChange={(e) => handleInputChange("answer", e.target.value)}
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-start gap-3 p-6 md:p-8 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Posting..." : "Post FAQ"}
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>

      {successDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Success</h3>
            <p className="text-gray-600 mb-6">{successDialog.message}</p>
            <button
              type="button"
              onClick={() => {
                setSuccessDialog({ isOpen: false, message: "" });
                navigate("/customer-queries");
              }}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default PostFAQ;
