import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";

const UpdateFAQ = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    questionType: "General",
    selectedQuestion: "",
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

  const existingQuestions = [
    "How do I create an account?",
    "What are your business hours?",
    "How can I contact support?",
    "How do I reset my password?",
    "What payment methods do you accept?",
    "How can I track my order?",
    "What is your refund policy?",
    "How do I update my profile?",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Update FAQ:", formData);
    // Add API call here
    navigate("/customer-queries");
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
            <div className="bg-green-100 p-3 md:p-4 rounded-full">
              <Edit className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Update FAQ
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Modify an existing FAQ
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            >
              {questionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Select Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Question <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.selectedQuestion}
              onChange={(e) =>
                handleInputChange("selectedQuestion", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            >
              <option value="">Choose a question...</option>
              {existingQuestions.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-start gap-3 p-6 md:p-8 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Update FAQ
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
};

export default UpdateFAQ;
