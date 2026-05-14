import React, { useState, useEffect, useRef, useContext } from "react";
import { FaTimes, FaTrashAlt, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { httpClient } from "../features/shared/api/httpClient";
import { MyContext } from "../ContextApi/DataProvider";
import { getProfile } from "../features/profile/services/profileApi";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

const REASON_LABELS = {
  privacy: "Privacy concerns",
  "privacy concerns": "Privacy concerns",
  not_using: "No longer using the app",
  "no longer using the app": "No longer using the app",
  multiple_accounts: "Have multiple accounts",
  "have multiple accounts": "Have multiple accounts",
  data_concerns: "Data security concerns",
  "data security concerns": "Data security concerns",
  poor_experience: "Poor experience",
  "poor experience": "Poor experience",
  other: "Other",
};

const normalizeReasonForApi = (reason) => {
  const key = String(reason || "").trim().toLowerCase();
  return REASON_LABELS[key] || reason;
};

const DeleteAccountPage = () => {
  const { UserSignInwithOtp, verifyUserOtp } = useContext(MyContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpInputsRef = useRef([]);

  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
    email: "",
    reason: "",
    description: "",
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [deletionStatus, setDeletionStatus] = useState({ status: "LOADING", daysLeft: 0 });
  const [openFaq, setOpenFaq] = useState(null);

  const sectionRefs = useRef({});

  useEffect(() => {
    // Auto-fill user info from localStorage or API
    const loadUserInfo = async () => {
      try {
        setLoading(true);
        // Always fetch fresh profile from API (getProfile handles internal fallback)
        const profile = await getProfile();
        
        if (profile) {
          setFormData((prev) => ({
            ...prev,
            full_name: profile.name || `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
            mobile: profile.phone || "",
            email: profile.email || "",
          }));
        }
      } catch (err) {
        console.error("Error loading user info", err);
      } finally {
        setLoading(false);
      }
    };
    loadUserInfo();
    
    // Check deletion status
    const checkStatus = async () => {
      const token = Cookies.get("user_token");
      if (!token) {
        setDeletionStatus({ status: "NOT_LOGGED_IN", daysLeft: 0 });
        return;
      }

      try {
        const response = await httpClient.get("/api/delete-account/status");
        if (response?.data?.success) {
          setDeletionStatus(response.data.data);
        }
      } catch (err) {
        console.error("Error checking deletion status", err);
        setDeletionStatus({ status: "NONE", daysLeft: 0 });
      }
    };
    checkStatus();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isModalOpen]);

  const setRef = (key) => (el) => { sectionRefs.current[key] = el; };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasteData.length === 4) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      otpInputsRef.current[3]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.confirm) {
      alert("Please confirm that you understand this action is irreversible.");
      return;
    }

    try {
      setLoading(true);
      const cleanPhone = formData.mobile.trim();
      localStorage.setItem("user_login_phone", cleanPhone);
      
      const res = await UserSignInwithOtp(cleanPhone);
      if (res) {
        setIsOtpModalOpen(true);
        setIsModalOpen(false); // Hide the main form, show OTP modal
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      alert("Please enter the complete 4-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const verifyRes = await verifyUserOtp(otpValue);
      if (verifyRes) {
        // OTP verified successfully, now submit the deletion request
        const payload = {
          name: formData.full_name.trim(),
          phoneNumber: formData.mobile.trim(),
          email: formData.email.trim(),
          reason: normalizeReasonForApi(formData.reason),
          otherReason: formData.description.trim(),
        };

        const response = await httpClient.post("/api/delete-account/raise", payload);

        if (!response?.data?.success) {
          throw new Error(response?.data?.message || "Failed to submit account deletion request.");
        }

        setSuccess(response?.data?.message || "Your account deletion request has been submitted. Our team will process it within 3–7 working days.");
        setFormData({ ...formData, reason: "", description: "", confirm: false });
        
        // Refresh the page after 2.5 seconds to show the new status
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Failed to verify OTP or submit request.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: "1", text: "Enter your registered mobile number or email ID." },
    { num: "2", text: "Provide your full name as per your Digivahan account." },
    { num: "3", text: "Submit the deletion request form." },
    { num: "4", text: "Verify your identity if required." },
  ];

  const warnings = [
    "Your account will be permanently removed from our system.",
    "You will lose access to all associated data and services.",
    "Any saved vehicle information, history, or records linked to your account may be deleted.",
    "This action cannot be undone once processed.",
  ];

  const retentionItems = [
    { icon: "⚖️", title: "Legal Compliance", desc: "Data required by law for regulatory purposes." },
    { icon: "🛡️", title: "Fraud Prevention", desc: "Information needed to detect or prevent fraud." },
    { icon: "📋", title: "Regulatory Obligations", desc: "Records mandated by applicable regulations." },
    { icon: "🔍", title: "Dispute Resolution", desc: "Data required to resolve pending disputes." },
  ];

  const faqs = [
    { q: "Can I recover my account after deletion?", a: "No. Once your account is deleted, this action is irreversible. All data is permanently removed and cannot be recovered." },
    { q: "How long does the deletion process take?", a: "Account deletion requests are typically processed within 3–7 working days after identity verification." },
    { q: "Will I receive a confirmation after deletion?", a: "Yes. You may receive a confirmation via email or SMS once your account has been successfully deleted." },
    { q: "What happens to my active orders or services?", a: "We recommend resolving all active orders and service requests before submitting a deletion request to avoid complications." },
    { q: "Why is some data retained after deletion?", a: "Certain data may be retained for legal compliance, fraud prevention, regulatory obligations, or dispute resolution as required by law." },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.8) translateY(-50px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse-red {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3); }
          50% { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .scroll-anim { opacity: 0; transform: translateY(30px); transition: all 0.7s ease; }
        .scroll-anim.visible { opacity: 1; transform: translateY(0); }
        .scroll-left { opacity: 0; transform: translateX(-40px); transition: all 0.7s ease; }
        .scroll-left.visible { opacity: 1; transform: translateX(0); }
        .scroll-right { opacity: 0; transform: translateX(40px); transition: all 0.7s ease; }
        .scroll-right.visible { opacity: 1; transform: translateX(0); }
        .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .fade-in-left { animation: fadeInLeft 0.8s ease-out forwards; }
        .fade-in-right { animation: fadeInRight 0.8s ease-out forwards; }
        .scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .modal-slide-in { animation: modalSlideIn 0.4s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-t1 { transition-delay: 0.1s; }
        .delay-t2 { transition-delay: 0.2s; }
        .delay-t3 { transition-delay: 0.3s; }
        .delay-t4 { transition-delay: 0.4s; }
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .btn-delete { animation: pulse-red 2.5s infinite; }
        .backdrop-blur-active { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        .warning-card { transition: all 0.3s ease; }
        .warning-card:hover { transform: translateX(6px); border-color: rgba(239,68,68,0.5); }
        .step-card { transition: all 0.35s ease; }
        .step-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 16px 32px rgba(0,0,0,0.1); }
        .retention-card { transition: all 0.35s ease; }
        .retention-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .faq-item { transition: all 0.3s ease; }
        .faq-answer { overflow: hidden; transition: max-height 0.4s ease, opacity 0.3s ease; }
      `}</style>

      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-red-50">

        {/* ─── HERO SECTION ─── */}
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left text */}
            <div className="fade-in-left space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center shadow-lg">
                  <FaTrashAlt className="text-2xl text-red-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Delete Account</h1>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>At Digivahan, we respect your right to control your personal data. If you wish to permanently delete your account, you can request account deletion through this page.</p>
                <p>We aim to provide a transparent and secure process for handling such requests. Before proceeding, please read through all the information carefully.</p>
                <p>Once your request is verified, our team will process it within a defined timeframe. This action is <strong>irreversible</strong> — any data associated with your account will be permanently removed.</p>
                <p>If you're unsure about deleting your account, consider reaching out to our support team first. We may be able to resolve your concern without requiring account deletion.</p>
              </div>

              {deletionStatus.status === "LOADING" ? (
                <div className="mt-8 p-4 bg-slate-100 rounded-xl animate-pulse">
                  <div className="h-4 bg-slate-200 w-1/2 rounded mx-auto"></div>
                </div>
              ) : deletionStatus.status === "IN_PROGRESS" ? (
                <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center shrink-0">
                    <FaCheckCircle className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-amber-800">Request Submitted</h3>
                    <p className="text-sm text-amber-700">You already submitted a request for deletion.</p>
                  </div>
                </div>
              ) : deletionStatus.status === "SCHEDULED" ? (
                <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center shrink-0">
                    <FaTrashAlt className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-800">Deletion Scheduled</h3>
                    <p className="text-sm text-red-700">Your account will be permanently deleted in <span className="font-bold">{deletionStatus.daysLeft} days</span>.</p>
                  </div>
                </div>
              ) : deletionStatus.status === "NOT_LOGGED_IN" ? (
                <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center shrink-0">
                    <FaTimes className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Not Logged In</h3>
                    <p className="text-sm text-slate-700 mb-3">Please log in to your account to request deletion.</p>
                    <a href="/user-login-page" className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all">
                      Login to Continue
                    </a>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-delete mt-8 bg-linear-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  Request Account Deletion
                </button>
              )}
            </div>

            {/* Right image */}
            <div className="fade-in-right delay-200">
              <div className="relative group">
                <div className="absolute -inset-4 bg-linear-to-r from-red-400 to-red-600 rounded-3xl blur-2xl opacity-25"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-4/3">
                  <img
                    src="/Delete Account.webp"
                    alt="Account Security"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
                  {/* Overlay badge */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="text-xs font-bold text-red-600">Irreversible Action</p>
                      <p className="text-xs text-gray-500">Please proceed with caution</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── BEFORE YOU PROCEED ─── */}
        <div className="bg-red-50 py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div ref={setRef("warn")} className="scroll-anim text-center mb-10">
              <span className="inline-block px-4 py-1.5 bg-red-100 text-red-700 text-sm font-semibold rounded-full mb-3">Important</span>
              <h2 className="text-3xl font-bold text-gray-900">📋 Before You Proceed</h2>
              <p className="text-gray-500 mt-2 max-w-xl mx-auto">Please note the following before submitting your deletion request:</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {warnings.map((warn, i) => (
                <div
                  key={i}
                  ref={setRef(`warn${i}`)}
                  className={`scroll-anim delay-t${i + 1} warning-card flex items-start gap-4 bg-white border-l-4 border-red-400 rounded-xl p-5 shadow-sm`}
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-500 font-bold text-sm">{i + 1}</div>
                  <p className="text-gray-700 text-sm leading-relaxed">{warn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── HOW TO REQUEST ─── */}
        <div className="bg-white py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div ref={setRef("stepsTitle")} className="scroll-anim text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full mb-3">Process</span>
              <h2 className="text-3xl font-bold text-gray-900">🔄 How to Request Account Deletion</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {steps.map((step, i) => (
                <div
                  key={i}
                  ref={setRef(`step${i}`)}
                  className={`scroll-anim delay-t${i + 1} step-card bg-linear-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 text-center shadow-md`}
                >
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-md shadow-yellow-200">
                    {step.num}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>

            <div ref={setRef("ctaStep")} className="scroll-anim text-center mt-10">
              {deletionStatus.status === "NONE" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-linear-to-r from-red-500 to-red-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  Submit Deletion Request
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── PROCESSING TIMELINE ─── */}
        <div className="bg-linear-to-br from-gray-900 to-gray-800 py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div ref={setRef("timeline")} className="scroll-anim text-center mb-10">
              <h2 className="text-3xl font-bold text-white">⏱️ Processing Timeline</h2>
              <p className="text-gray-400 mt-2">What to expect after submitting your request</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {[
                { icon: "📅", title: "3–7 Working Days", desc: "Account deletion requests are typically processed within 3–7 working days." },
                { icon: "📩", title: "Confirmation Notice", desc: "You may receive a confirmation via email or SMS once your account has been successfully deleted." },
              ].map((item, i) => (
                <div key={i} ref={setRef(`tl${i}`)} className={`scroll-anim delay-t${i + 1} bg-white/10 border border-white/20 rounded-2xl p-6 text-center backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-1`}>
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── DATA RETENTION POLICY ─── */}
        <div className="bg-white py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div ref={setRef("retention")} className="scroll-anim text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-3">Policy</span>
              <h2 className="text-3xl font-bold text-gray-900">📦 Data Retention Policy</h2>
              <p className="text-gray-500 mt-3 max-w-2xl mx-auto">While your account will be deleted, certain information may be retained for a limited period if required for:</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {retentionItems.map((item, i) => (
                <div key={i} ref={setRef(`ret${i}`)} className={`scroll-anim delay-t${i + 1} retention-card bg-linear-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6 text-center shadow-md`}>
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div ref={setRef("retNote")} className="scroll-anim mt-8 max-w-3xl mx-auto bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-blue-700 text-sm text-center font-medium">🔒 Such data will be securely stored and <strong>not used for marketing purposes</strong>.</p>
            </div>
          </div>
        </div>

        {/* ─── NEED HELP ─── */}
        <div className="bg-red-50 py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div ref={setRef("help")} className="scroll-anim max-w-3xl mx-auto text-center">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-red-100">
                <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">❓</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Need Help?</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  If you are facing issues with your account and do not wish to delete it, we recommend contacting our support team first. We may be able to resolve your concern without deleting your account.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="/contact-page" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    Contact Support
                  </a>
                  <a href="/Raise-concern-page" className="bg-white hover:bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-xl border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    Raise a Concern
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── FAQ ─── */}
        <div className="bg-white py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div ref={setRef("faqTitle")} className="scroll-anim text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  ref={setRef(`faq${i}`)}
                  className={`scroll-anim delay-t${Math.min(i + 1, 4)} faq-item bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                    <span className={`text-yellow-500 font-bold text-xl shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                  </button>
                  <div
                    className="faq-answer"
                    style={{ maxHeight: openFaq === i ? "200px" : "0", opacity: openFaq === i ? 1 : 0 }}
                  >
                    <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── BOTTOM CTA ─── */}
        <div ref={setRef("cta")} className="scroll-anim bg-linear-to-r from-red-500 to-red-600 py-14 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-3">Ready to Delete Your Account?</h2>
            <p className="text-red-100 mb-7">This action is permanent and cannot be undone. Please make sure you've read all the information above before proceeding.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-red-600 font-bold px-10 py-4 rounded-xl hover:bg-red-50 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Request Account Deletion
            </button>
          </div>
        </div>
      </div>

      {/* ─── MODAL FORM ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-active"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto modal-slide-in">
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all duration-300"
            >
              <FaTimes className="text-2xl" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-3">
                <FaTrashAlt className="text-2xl text-red-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Delete Account Request</h2>
              <p className="text-gray-500 text-sm mt-2">Please fill in the details below to submit your deletion request.</p>
            </div>

            {/* Warning banner */}
            <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 text-sm font-semibold">⚠️ Warning: This action is permanent and irreversible. All your data will be deleted.</p>
            </div>

            {success && (
              <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <p className="text-green-700 font-semibold text-sm">{success}</p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  readOnly
                  className="w-full mt-1 px-4 py-3 border-2 border-gray-200 bg-gray-100 text-gray-600 rounded-lg focus:outline-none cursor-not-allowed transition-all duration-300"
                />
              </div>

              {/* Mobile & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <label className="text-sm font-semibold text-gray-700">Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Registered mobile number"
                    required
                    readOnly
                    className="w-full mt-1 px-4 py-3 border-2 border-gray-200 bg-gray-100 text-gray-600 rounded-lg focus:outline-none cursor-not-allowed transition-all duration-300"
                  />
                </div>
                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Registered email"
                    required
                    readOnly
                    className="w-full mt-1 px-4 py-3 border-2 border-gray-200 bg-gray-100 text-gray-600 rounded-lg focus:outline-none cursor-not-allowed transition-all duration-300"
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <label className="text-sm font-semibold text-gray-700">Reason for Deletion *</label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 hover:border-red-300 bg-white"
                >
                  <option value="">Select a reason</option>
                  <option value="Privacy concerns">Privacy concerns</option>
                  <option value="No longer using the app">No longer using the app</option>
                  <option value="Have multiple accounts">Have multiple accounts</option>
                  <option value="Data security concerns">Data security concerns</option>
                  <option value="Poor experience">Poor experience</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <label className="text-sm font-semibold text-gray-700">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Please describe your reason for account deletion..."
                  required
                  className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 hover:border-red-300 resize-none"
                />
              </div>

              {/* Confirmation checkbox */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="confirm"
                    checked={formData.confirm}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 accent-red-500 shrink-0"
                  />
                  <span className="text-sm text-red-700 leading-relaxed">
                    I understand that this action is <strong>permanent and irreversible</strong>. All my data, vehicle records, and account information will be permanently deleted. I confirm that I want to proceed with the account deletion request.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !formData.confirm}
                className="w-full bg-linear-to-r from-red-500 to-red-600 text-white py-4 rounded-lg font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Submitting...
                  </span>
                ) : "Submit Deletion Request"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── OTP VERIFICATION MODAL ─── */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-active"
            onClick={() => setIsOtpModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 modal-slide-in">
            {/* Close */}
            <button
              onClick={() => setIsOtpModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all duration-300"
            >
              <FaTimes className="text-2xl" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 mb-4">
              <FaCheckCircle />
              Account Verification
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">Verify Deletion Request</h1>
            <p className="text-sm text-slate-600 mb-6">
              Enter the 4-digit OTP sent to +91 {formData.mobile}.
              This step is required to securely confirm your account deletion.
            </p>

            {success && (
              <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <p className="text-green-700 font-semibold text-sm">{success}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleVerifyOtpAndSubmit}>
              <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="h-12 w-12 sm:h-14 sm:w-14 text-center text-lg font-semibold border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-4 text-white text-base font-semibold transition-all ${
                  loading
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-200"
                }`}
              >
                {loading ? "Verifying..." : "Verify and Request Deletion"}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsOtpModalOpen(false);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <FaArrowLeft />
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccountPage;
