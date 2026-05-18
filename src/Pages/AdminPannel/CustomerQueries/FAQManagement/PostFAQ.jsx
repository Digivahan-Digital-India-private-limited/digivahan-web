import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HelpCircle, CheckCircle, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";
const FAQ_STORAGE_KEY = "digivahan_posted_faqs";

// Maps short key → full backend type string
const FAQ_TYPE_MAP = {
  General: "General Information Queries",
  Technical: "Technical Queries",
  Account: "Account Related",
  Payment: "Payment / Billing",
  "Order Status": "Order / Service Status",
  Product: "Product / Service Complaints",
  Support: "Feedback & Suggestions",
  Billing: "Cancellation / Return",
  Escalation: "Escalation",
  "Onboarding / Setup": "Onboarding / Setup",
  Subscription: "Subscription",
  "Verification Queries": "Verification Queries",
};

// Maps contact-form query_type values → PostFAQ questionType key
const QUERY_TYPE_TO_CATEGORY = {
  General: "General",
  "Contact Form": "General",
  Technical: "Technical",
  Account: "Account",
  Payment: "Payment",
  "Order Status": "Order Status",
  Product: "Product",
  Support: "Support",
  Billing: "Billing",
  Escalation: "Escalation",
  "Onboarding / Setup": "Onboarding / Setup",
  Subscription: "Subscription",
  "Verification Queries": "Verification Queries",
};

const questionTypes = [
  "General",
  "Technical",
  "Account",
  "Payment",
  "Order Status",
  "Product",
  "Support",
  "Billing",
  "Escalation",
  "Onboarding / Setup",
  "Subscription",
  "Verification Queries",
];

const PostFAQ = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read pre-fill data passed from ReplyPage
  const prefill = location.state || {};
  const prefillType = QUERY_TYPE_TO_CATEGORY[prefill.prefillType] || "General";

  const [formData, setFormData] = useState({
    questionType: prefillType,
    question: prefill.prefillQuestion || "",
    answer: prefill.prefillAnswer || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successDialog, setSuccessDialog] = useState({ isOpen: false, message: "" });

  // Manage FAQ list state below
  const [selectedFaqCategory, setSelectedFaqCategory] = useState("General");
  const [faqData, setFaqData] = useState([]);
  const [faqLoading, setFaqLoading] = useState(false);

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetFaqId, setTargetFaqId] = useState(null);
  const [isDeletingFaq, setIsDeletingFaq] = useState(false);

  const fetchFaqByCategory = async (category) => {
    try {
      setFaqLoading(true);
      const typeValue = FAQ_TYPE_MAP[category] || category;
      const response = await axios.get(`${BASE_URL}/api/faq/list`, {
        params: { type: typeValue },
      });

      const list = Array.isArray(response?.data?.data) ? response.data.data : [];
      const normalizedFaqs = list.map((faqItem) => ({
        id: faqItem?._id,
        question: faqItem?.question || "",
        answer: faqItem?.answer || "",
        type: faqItem?.type || "",
      }));

      setFaqData(normalizedFaqs);
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
      setFaqData([]);
    } finally {
      setFaqLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqByCategory(selectedFaqCategory);
  }, [selectedFaqCategory]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const question = formData.question.trim();
    const answer = formData.answer.trim();

    if (!formData.questionType || !question || !answer) {
      toast.error("Please fill Question Type, Question and Answer.");
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

      // Instantly switch tab to this category and refresh list
      setSelectedFaqCategory(formData.questionType);
      fetchFaqByCategory(formData.questionType);

      setFormData({ questionType: "General", question: "", answer: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to post FAQ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteFaqModal = (faqId) => {
    setTargetFaqId(faqId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetFaqId) return;
    try {
      setIsDeletingFaq(true);
      const response = await axios.delete(`${BASE_URL}/api/faq/delete/${targetFaqId}`);
      if (response.data?.success || response.status === 200) {
        toast.success("FAQ deleted successfully!");
        setFaqData((prev) => prev.filter((faq) => faq.id !== targetFaqId));
      } else {
        toast.error("Failed to delete FAQ");
      }
    } catch (error) {
      console.error("Delete FAQ error:", error);
      toast.error(error.response?.data?.message || "Failed to delete FAQ");
    } finally {
      setIsDeletingFaq(false);
      setShowDeleteModal(false);
      setTargetFaqId(null);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <main className="w-full min-h-screen overflow-y-auto bg-gray-50 md:p-6 p-3">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                Delete FAQ?
              </h3>
              <p className="text-center text-gray-600 mb-6">
                Are you sure you want to delete this FAQ? This action cannot be undone and it will be removed instantly from the user panel.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTargetFaqId(null);
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeletingFaq}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                >
                  {isDeletingFaq ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
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

      {/* Pre-fill notice banner */}
      {prefill.prefillQuestion && (
        <div className="max-w-6xl mx-auto mb-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-700 font-medium">
            Customer query and your reply have been pre-filled below. Review before posting.
          </p>
        </div>
      )}

      {/* Container Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 md:p-4 rounded-full">
              <HelpCircle className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Post FAQ</h1>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
            >
              {questionTypes.map((type) => (
                <option key={type} value={type}>
                  {FAQ_TYPE_MAP[type] || type}
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

      {/* Existing FAQs Section */}
      <div className="max-w-6xl mx-auto mt-10 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-12">
        <div className="p-6 md:p-8 border-b border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Manage Existing FAQs
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            View, filter, and delete active FAQs across categories
          </p>
        </div>

        {/* Category Tabs */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-wrap gap-2.5 justify-start">
            {questionTypes.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedFaqCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                  selectedFaqCategory === category
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:bg-blue-50/30"
                }`}
              >
                {FAQ_TYPE_MAP[category] || category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs List */}
        <div className="p-6 md:p-8">
          {faqLoading ? (
            <div className="py-12 text-center text-gray-500">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="font-medium text-sm">Loading FAQs...</p>
            </div>
          ) : faqData.length === 0 ? (
            <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-medium text-base">No FAQs posted under this category yet.</p>
              <p className="text-xs text-gray-400 mt-1">Create one using the form above!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {faqData.map((faq, index) => (
                <div
                  key={faq.id || index}
                  className="bg-gray-50 p-6 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2.5 text-base flex items-start gap-2.5">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5">
                        {index + 1}
                      </span>
                      <span>{faq.question}</span>
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed pl-7">{faq.answer}</p>
                  </div>

                  <div className="flex justify-end mt-4 pt-3 border-t border-gray-200/60">
                    <button
                      onClick={() => openDeleteFaqModal(faq.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete FAQ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Success Dialog */}
      {successDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">FAQ Posted!</h3>
            <p className="text-gray-600 mb-6">{successDialog.message}</p>
            <button
              type="button"
              onClick={() => {
                setSuccessDialog({ isOpen: false, message: "" });
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
