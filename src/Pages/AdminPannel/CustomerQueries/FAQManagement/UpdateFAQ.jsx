import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digicapital.co.in";
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

const UpdateFAQ = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    questionType: "General",
    selectedQuestionId: "",
    editedQuestion: "",
    editedAnswer: "",
  });
  const [faqOptions, setFaqOptions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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

  const fetchFaqByType = async (questionType) => {
    try {
      setIsLoadingQuestions(true);
      const queryValue = FAQ_TYPE_MAP[questionType] || questionType;
      const response = await axios.get(`${BASE_URL}/api/faq/list`, {
        params: { list: queryValue },
      });
      const list = Array.isArray(response?.data?.data) ? response.data.data : [];
      const normalizedFaqs = list.map((faq) => ({
        id: faq?._id,
        question: faq?.question || "",
        answer: faq?.answer || "",
      }));
      setFaqOptions(normalizedFaqs);
    } catch (error) {
      console.error("Failed to fetch FAQ list:", error);
      setFaqOptions([]);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchFaqByType(formData.questionType);
  }, [formData.questionType]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      questionType: value,
      selectedQuestionId: "",
      editedQuestion: "",
      editedAnswer: "",
    }));
  };

  const handleQuestionSelect = (faqId) => {
    const selectedFaq = faqOptions.find((faq) => faq.id === faqId);

    setFormData((prev) => ({
      ...prev,
      selectedQuestionId: faqId,
      editedQuestion: selectedFaq?.question || "",
      editedAnswer: selectedFaq?.answer || "",
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.questionType ||
      !formData.selectedQuestionId ||
      !formData.editedQuestion.trim() ||
      !formData.editedAnswer.trim()
    ) {
      alert("Please select question type, question, and update both question and answer.");
      return;
    }

    const payload = {
      type: FAQ_TYPE_MAP[formData.questionType] || formData.questionType,
      question: formData.editedQuestion.trim(),
      answer: formData.editedAnswer.trim(),
    };

    try {
      setIsUpdating(true);
      const response = await axios.put(
        `${BASE_URL}/api/faq/update/${formData.selectedQuestionId}`,
        payload,
      );
      setSuccessDialog({
        isOpen: true,
        message: response?.data?.message || "FAQ updated successfully.",
      });
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update FAQ.");
    } finally {
      setIsUpdating(false);
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
              onChange={(e) => handleQuestionTypeChange(e.target.value)}
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
              value={formData.selectedQuestionId}
              onChange={(e) => handleQuestionSelect(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            >
              <option value="">Choose a question...</option>
              {isLoadingQuestions ? (
                <option disabled>Loading questions...</option>
              ) : (
                faqOptions.map((faq) => (
                  <option key={faq.id} value={faq.id}>
                    {faq.question}
                  </option>
                ))
              )}
            </select>
          </div>

          {formData.selectedQuestionId && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edit Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.editedQuestion}
                  onChange={(e) => handleInputChange("editedQuestion", e.target.value)}
                  placeholder="Update the selected question"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edit Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="5"
                  value={formData.editedAnswer}
                  onChange={(e) => handleInputChange("editedAnswer", e.target.value)}
                  placeholder="Update the answer for selected question"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-start gap-3 p-6 md:p-8 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={isUpdating || isLoadingQuestions}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Edit className="w-4 h-4" />
            {isUpdating ? "Updating..." : "Update FAQ"}
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
              className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition font-medium"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default UpdateFAQ;
