import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaTimes } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";
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

const mapApiTypeToTab = (type = "") => {
  const normalized = type.toLowerCase();

  if (normalized.includes("general")) return "General";
  if (normalized.includes("technical")) return "Technical";
  if (normalized.includes("account")) return "Account";
  if (normalized.includes("payment") || normalized.includes("billing")) {
    // Distinguish between "Payment / Billing" and "Cancellation / Return" (Billing key)
    if (normalized.includes("cancellation") || normalized.includes("return")) return "Billing";
    return "Payment";
  }
  if (normalized.includes("order") || normalized.includes("service status")) return "Order Status";
  if (normalized.includes("product") || normalized.includes("complaint")) return "Product";
  if (normalized.includes("feedback") || normalized.includes("suggestion")) return "Support";
  if (normalized.includes("escalation")) return "Escalation";
  if (normalized.includes("onboarding") || normalized.includes("setup")) return "Onboarding / Setup";
  if (normalized.includes("subscription")) return "Subscription";
  if (normalized.includes("verification")) return "Verification Queries";

  return type || "General";
};

const Contactpage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    category: "General",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState("General");
  const [faqData, setFaqData] = useState([]);
  const [faqLoading, setFaqLoading] = useState(false);
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  useEffect(() => {
    const fetchFaqByCategory = async () => {
      try {
        setFaqLoading(true);
        const queryValue = FAQ_TYPE_MAP[selectedFaqCategory] || selectedFaqCategory;
        const response = await axios.get(`${BASE_URL}/api/faq/list`, {
          params: { list: queryValue },
        });

        const list = Array.isArray(response?.data?.data) ? response.data.data : [];
        const normalizedFaqs = list.map((faqItem) => ({
          id: faqItem?._id,
          question: faqItem?.question || "",
          answer: faqItem?.answer || "",
          type: faqItem?.type || "",
          category: mapApiTypeToTab(faqItem?.type),
        }));

        setFaqData(normalizedFaqs);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
        setFaqData([]);
      } finally {
        setFaqLoading(false);
      }
    };

    fetchFaqByCategory();
  }, [selectedFaqCategory]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const token = Cookies.get("user_token");
      if (!token) {
        toast.error("Please login first to submit your query.");
        setLoading(false);
        return;
      }

      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        query_type: formData.category,
        query: formData.message,
      };

      const response = await axios.post(`${BASE_URL}/api/user/submit-query`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        setSuccess("Your message has been sent successfully! 💙");
        toast.success("Query submitted successfully!");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          category: "General",
          message: "",
        });
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess("");
        }, 2000);
      } else {
        throw new Error(response.data?.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Query Submission Error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to send message 😔";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const baseFaqCategories = [
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
  const faqCategories = baseFaqCategories;

  const filteredFaqData = faqData.filter((faq) => faq.category === selectedFaqCategory);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-50px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }
        
        .fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }
        
        .scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }
        
        .modal-slide-in {
          animation: modalSlideIn 0.4s ease-out forwards;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .backdrop-blur-active {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
      `}</style>

      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="fade-in-left space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <FaPhoneAlt className="text-4xl text-yellow-500" />
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Contact Us</h1>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="flex items-start gap-2">
                  <span className="text-2xl">🏠</span>
                  <span><strong>Let's Connect with Digivahan</strong></span>
                </p>
                
                <p>
                  At Digivahan, we believe that strong relationships are built on trust, transparency, and timely support. We are committed to making your vehicle-related journey simple, reliable, and hassle-free.
                </p>
                
                <p>
                  Whether you have a question about our services, need technical assistance, want help with vehicle details, or are facing any issue — our dedicated support team is always ready to guide you at every step.
                </p>
                
                <p>
                  We understand how important accurate information and quick responses are in the automotive space. That's why we focus on providing clear communication, fast resolutions, and dependable assistance whenever you reach out to us.
                </p>
                
                <p>
                  If you are a customer looking for support, a dealer interested in onboarding, or a business exploring partnership opportunities — Digivahan welcomes you.
                </p>
                
                <p>
                  Your satisfaction, trust, and long-term association matter the most to us. We don't just respond to queries — we build connections.
                </p>
                
                <p className="flex items-start gap-2">
                  <span className="text-2xl">🤝</span>
                  <span>Let's move forward together with confidence and reliability.</span>
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-8 bg-linear-to-r from-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
              >
                Open Contact Form
              </button>
            </div>

            {/* Right Image */}
            <div className="fade-in-right delay-200">
              <div className="relative group">
                <div className="absolute -inset-4 bg-linear-to-r from-yellow-400 to-yellow-600 rounded-3xl blur-2xl opacity-25"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-4/3">
                  <img
                    src="/Contact Us.webp"
                    alt="Contact Team"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-3">
                    <span className="text-yellow-500 text-xl">📞</span>
                    <div>
                      <p className="text-xs font-bold text-gray-800">We're Here to Help</p>
                      <p className="text-xs text-gray-500">Mon – Sat, 10am – 6pm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 fade-in-up">
              FAQ Section
            </h2>

            <div className="flex flex-wrap justify-center gap-3 mb-10 fade-in-up delay-100">
              {faqCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedFaqCategory(category)}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold border transition-all duration-300 ${
                    selectedFaqCategory === category
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-800 border-gray-300 hover:border-blue-500"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {faqLoading && (
                <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl border border-gray-200 text-center text-gray-600">
                  Loading FAQs...
                </div>
              )}

              {!faqLoading && filteredFaqData.map((faq, index) => (
                <div
                  key={faq.id || index}
                  className={`bg-linear-to-br from-gray-50 to-white p-6 rounded-xl shadow-md hover-lift border-l-4 border-yellow-500 fade-in-up delay-${Math.min((index + 1) * 100, 400)}`}
                >
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    {index + 1}. {faq.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}

              {!faqLoading && filteredFaqData.length === 0 && (
                <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl border border-gray-200 text-center text-gray-600">
                  No FAQs available in this category.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-active"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto modal-slide-in">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all duration-300"
            >
              <FaTimes className="text-2xl" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Contact Form
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                We'd love to hear from you. Please fill out the form below.
              </p>
            </div>

            {success && (
              <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <p className="text-green-700 font-semibold">{success}</p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <label className="text-sm font-semibold text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                    className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300"
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <label className="text-sm font-semibold text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                    className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <label className="text-sm font-semibold text-gray-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300"
                />
              </div>

              {/* Phone */}
              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <label className="text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300"
                />
              </div>

              {/* Select Query Category */}
              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <label className="text-sm font-semibold text-gray-700">
                  Select Query Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-700 transition-all duration-300 hover:border-yellow-300 font-semibold cursor-pointer"
                >
                  <option value="General">General Information Queries</option>
                  <option value="Technical">Technical Queries</option>
                  <option value="Account">Account Related</option>
                  <option value="Payment">Payment / Billing</option>
                  <option value="Order Status">Order / Service Status</option>
                  <option value="Product">Product / Service Complaints</option>
                  <option value="Support">Feedback & Suggestions</option>
                  <option value="Billing">Cancellation / Return</option>
                  <option value="Escalation">Escalation</option>
                  <option value="Onboarding / Setup">Onboarding / Setup</option>
                  <option value="Subscription">Subscription</option>
                  <option value="Verification Queries">Verification Queries</option>
                </select>
              </div>

              {/* Query */}
              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <label className="text-sm font-semibold text-gray-700">
                  Your Query *
                </label>
                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  required
                  className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-yellow-500 to-yellow-600 text-white py-4 rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Contactpage;
