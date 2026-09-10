import React, { useState, useEffect, useRef, useContext } from "react";
import {
  FaTimes,
  FaTrashAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaShieldAlt,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
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

  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    confirmText: "OK",
    cancelText: "Cancel",
    onConfirm: null,
    onCancel: null,
  });

  const showAlertModal = (title, message, type = "info", onClose = null) => {
    setFeedbackModal({
      isOpen: true,
      type,
      title,
      message,
      confirmText: "OK",
      onConfirm: () => {
        setFeedbackModal((prev) => ({ ...prev, isOpen: false }));
        if (onClose) onClose();
      },
      onCancel: null,
    });
  };

  const showConfirmModal = (title, message, onConfirm, onCancel = null) => {
    setFeedbackModal({
      isOpen: true,
      type: "confirm",
      title,
      message,
      confirmText: "Yes, Cancel Deletion",
      cancelText: "Keep Request",
      onConfirm: () => {
        setFeedbackModal((prev) => ({ ...prev, isOpen: false }));
        if (onConfirm) onConfirm();
      },
      onCancel: () => {
        setFeedbackModal((prev) => ({ ...prev, isOpen: false }));
        if (onCancel) onCancel();
      },
    });
  };

  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
    email: "",
    duration: 5,
    reason: "",
    description: "",
    confirm: false,
  });
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [deletionStatus, setDeletionStatus] = useState({ status: "LOADING", daysLeft: 0 });
  const [openFaq, setOpenFaq] = useState(null);

  const sectionRefs = useRef({});

  // Helper: Get formatted scheduled date for preview
  const getScheduledDateString = (days) => {
    const num = Number(days || 0);
    const d = new Date();
    d.setDate(d.getDate() + num);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    // Auto-fill user info from token & profile API
    const loadUserInfo = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("user_token");
        let decodedId = "";
        if (token) {
          try {
            const decoded = jwtDecode(token);
            decodedId = decoded.userId || decoded.user_id || "";
          } catch (e) {
            console.error("Token decode error:", e);
          }
        }

        // Fetch fresh profile from API
        const profile = await getProfile();
        
        if (profile) {
          setUserProfile({ ...profile, tokenUserId: decodedId });
          setFormData((prev) => ({
            ...prev,
            full_name: profile.name || `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
            mobile: profile.phone || "",
            email: profile.email || "",
          }));
        } else if (decodedId) {
          setUserProfile({ tokenUserId: decodedId });
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
        } else {
          setDeletionStatus({ status: "NONE", daysLeft: 0 });
        }
      } catch (err) {
        console.error("Error checking deletion status", err?.response?.data || err.message);
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          setDeletionStatus({ status: "NOT_LOGGED_IN", daysLeft: 0 });
        } else {
          setDeletionStatus({ status: "NONE", daysLeft: 0 });
        }
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
    document.body.style.overflow =
      isModalOpen || isOtpModalOpen || feedbackModal.isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, isOtpModalOpen, feedbackModal.isOpen]);

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
      showAlertModal(
        "Confirmation Required",
        "Please confirm that you understand this action is irreversible by ticking the checkbox.",
        "warning"
      );
      return;
    }

    const durationDays = Number(formData.duration);
    if (isNaN(durationDays) || durationDays < 0 || !Number.isInteger(durationDays)) {
      showAlertModal(
        "Invalid Duration",
        "Please enter a valid duration (0 or more days).",
        "warning"
      );
      return;
    }

    if (!formData.reason) {
      showAlertModal(
        "Reason Required",
        "Please select a reason for deletion.",
        "warning"
      );
      return;
    }

    const token = Cookies.get("user_token");

    // If user is already logged in with token, submit directly using active session
    if (token) {
      try {
        setLoading(true);
        const reasonText = formData.description?.trim()
          ? `${normalizeReasonForApi(formData.reason)} - ${formData.description.trim()}`
          : normalizeReasonForApi(formData.reason);

        const idToSend = formData.mobile?.trim() || userProfile?.phone || userProfile?.tokenUserId || userProfile?.id;

        if (!idToSend) {
          showAlertModal(
            "Account Identification",
            "Could not identify your account from token. Please enter your mobile number.",
            "error"
          );
          return;
        }

        const payload = {
          id: idToSend,
          duration: durationDays,
          reason: reasonText,
          deviceType: "web", // default web (hidden from user)
        };

        const response = await httpClient.post("/api/user-account/delete", payload);

        if (!response?.data?.success) {
          throw new Error(response?.data?.message || "Failed to submit account deletion request.");
        }

        setSuccess(response?.data?.message || "Your account deletion request has been submitted successfully.");
        setIsModalOpen(false);
        showAlertModal(
          durationDays === 0 ? "Account Deleted" : "Request Submitted",
          durationDays === 0
            ? "Your account has been deleted immediately."
            : `Delete account request submitted successfully! Your account will be permanently deleted in ${durationDays} day(s).`,
          "success",
          () => {
            window.location.reload();
          }
        );
      } catch (error) {
        showAlertModal(
          "Submission Failed",
          error.response?.data?.message || error.message || "Failed to submit deletion request.",
          "error"
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    // If not logged in, initiate OTP flow to verify ownership
    try {
      setLoading(true);
      const cleanPhone = formData.mobile.trim();
      if (!cleanPhone) {
        showAlertModal(
          "Mobile Number Required",
          "Please enter your registered mobile number.",
          "warning"
        );
        return;
      }
      localStorage.setItem("user_login_phone", cleanPhone);
      
      const res = await UserSignInwithOtp(cleanPhone);
      if (res) {
        setIsOtpModalOpen(true);
        setIsModalOpen(false); // Hide the main form, show OTP modal
      }
    } catch (error) {
      showAlertModal(
        "Failed to Send OTP",
        error.response?.data?.message || "Failed to send OTP to your number.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      showAlertModal(
        "Incomplete OTP",
        "Please enter the complete 4-digit OTP sent to your phone.",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);
      const verifyRes = await verifyUserOtp(otpValue);
      if (verifyRes) {
        const durationDays = Number(formData.duration ?? 5);
        const reasonText = formData.description?.trim()
          ? `${normalizeReasonForApi(formData.reason)} - ${formData.description.trim()}`
          : normalizeReasonForApi(formData.reason);

        const payload = {
          id: formData.mobile.trim(),
          duration: durationDays,
          reason: reasonText,
          deviceType: "web", // default web (hidden from user)
        };

        const response = await httpClient.post("/api/user-account/delete", payload);

        if (!response?.data?.success) {
          throw new Error(response?.data?.message || "Failed to submit account deletion request.");
        }

        setSuccess(response?.data?.message || "Your account deletion request has been submitted successfully.");
        setIsOtpModalOpen(false);
        showAlertModal(
          durationDays === 0 ? "Account Deleted" : "Request Submitted",
          durationDays === 0
            ? "Your account has been deleted immediately."
            : `Delete account request submitted successfully! Your account will be permanently deleted in ${durationDays} day(s).`,
          "success",
          () => {
            window.location.reload();
          }
        );
      }
    } catch (error) {
      showAlertModal(
        "Verification Failed",
        error.response?.data?.message || error.message || "Failed to verify OTP or submit request.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDeletion = async () => {
    showConfirmModal(
      "Cancel Account Deletion",
      "Are you sure you want to cancel your account deletion request? Your account will remain active.",
      async () => {
        try {
          setLoading(true);
          const response = await httpClient.post("/api/user-account/cancel-delete");
          if (response?.data?.success) {
            showAlertModal(
              "Deletion Cancelled",
              "Account deletion request has been cancelled successfully. Your account is now ACTIVE.",
              "success",
              () => {
                window.location.reload();
              }
            );
          } else {
            throw new Error(response?.data?.message || "Failed to cancel deletion request.");
          }
        } catch (err) {
          showAlertModal(
            "Cancellation Failed",
            err?.response?.data?.message || err.message || "Failed to cancel deletion.",
            "error"
          );
        } finally {
          setLoading(false);
        }
      }
    );
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
                <div className="mt-8 p-6 bg-amber-50 border-2 border-amber-300 rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <FaCheckCircle className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-amber-800">✅ Request Submitted</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        You already submitted for deleting account.
                        Your request is under review by our admin team.
                      </p>
                      <p className="text-xs text-amber-500 mt-2 font-semibold">
                        You will be notified once the process is complete.
                      </p>
                    </div>
                  </div>
                </div>
              ) : deletionStatus.status === "SCHEDULED" ? (
                <div className="mt-8 p-6 bg-red-50 border-2 border-red-300 rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <FaTrashAlt className="text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-red-800">⏳ Deletion Scheduled</h3>
                      <p className="text-sm text-red-700 mt-1">
                        Your account will be permanently deleted on{" "}
                        <span className="font-black text-red-900">
                          {deletionStatus.deletionDate
                            ? new Date(deletionStatus.deletionDate).toLocaleDateString("en-IN", {
                                day: "numeric", month: "long", year: "numeric",
                              })
                            : `${deletionStatus.daysLeft} day(s) from today`}
                        </span>.
                      </p>
                      {deletionStatus.daysLeft > 0 && (
                        <p className="text-xs text-red-500 mt-1 font-semibold">
                          {deletionStatus.daysLeft} day{deletionStatus.daysLeft !== 1 ? "s" : ""} remaining
                        </p>
                      )}
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={handleCancelDeletion}
                          disabled={loading}
                          className="px-5 py-2.5 bg-white border-2 border-red-500 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
                        >
                          {loading ? "Cancelling..." : "Cancel Deletion Request"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : deletionStatus.status === "NOT_LOGGED_IN" ? (
                <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center shrink-0">
                      <FaTimes className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Not Logged In</h3>
                      <p className="text-sm text-slate-700">Please log in to your account or enter your mobile number to request deletion.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-md cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    Request Deletion
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-delete mt-8 bg-linear-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer"
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
            {deletionStatus.status === "NONE" ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-red-600 font-bold px-10 py-4 rounded-xl hover:bg-red-50 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                Request Account Deletion
              </button>
            ) : deletionStatus.status === "IN_PROGRESS" ? (
              <div className="inline-block bg-white/20 border border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-base">
                ✅ Your deletion request is under review by admin.
              </div>
            ) : deletionStatus.status === "SCHEDULED" ? (
              <div className="inline-block bg-white/20 border border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-base">
                ⏳ Account will be deleted on{" "}
                <span className="font-black">
                  {deletionStatus.deletionDate
                    ? new Date(deletionStatus.deletionDate).toLocaleDateString("en-IN", {
                        day: "numeric", month: "long", year: "numeric",
                      })
                    : `${deletionStatus.daysLeft} day(s) from now`}
                </span>
              </div>
            ) : null}
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
              {/* Account Identification (Token se auto-fill ya manual input) */}
              {Cookies.get("user_token") ? (
                <div className="p-4 bg-linear-to-br from-slate-50 to-slate-100/70 border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-linear-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                      {formData.full_name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        {formData.full_name || "Digivahan User"}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                          <FaCheckCircle className="text-[10px]" /> Verified
                        </span>
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        📱 Mobile: <strong className="text-slate-800">+91 {formData.mobile || "Registered Mobile"}</strong>
                        {formData.email && <span className="ml-2 text-slate-500">| ✉️ {formData.email}</span>}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 shrink-0 hidden sm:inline-block">
                    🔑 Active Token
                  </span>
                </div>
              ) : (
                <>
                  {/* Full Name */}
                  <div className="transform transition-all duration-300 hover:scale-[1.01]">
                    <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-gray-800 transition-all duration-300"
                    />
                  </div>

                  {/* Mobile & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="transform transition-all duration-300 hover:scale-[1.01]">
                      <label className="text-sm font-semibold text-gray-700">Mobile Number *</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Registered mobile number"
                        required
                        className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-gray-800 transition-all duration-300"
                      />
                    </div>
                    <div className="transform transition-all duration-300 hover:scale-[1.01]">
                      <label className="text-sm font-semibold text-gray-700">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Registered email"
                        className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-gray-800 transition-all duration-300"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Duration Field (User enters or selects duration) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FaClock className="text-red-500" /> Deletion Timeline (Duration) *
                  </label>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    Number(formData.duration) === 0
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {Number(formData.duration) === 0 ? "⚡ Immediate Deletion" : `⏳ ${formData.duration} Day(s)`}
                  </span>
                </div>

                {/* Quick Selection Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { days: 0, label: "⚡ Immediate (0d)" },
                    { days: 5, label: "5 Days (Default)" },
                    { days: 15, label: "15 Days" },
                    { days: 30, label: "30 Days" },
                  ].map((opt) => (
                    <button
                      key={opt.days}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, duration: opt.days }))}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        Number(formData.duration) === opt.days
                          ? "bg-red-600 text-white border-red-600 shadow-sm scale-102"
                          : "bg-white text-slate-700 border-slate-300 hover:border-red-400 hover:bg-red-50/50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Custom Days Input */}
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs font-semibold text-slate-600 shrink-0">Enter Custom Days:</span>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className="w-24 px-3 py-1.5 border-2 border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:border-red-500 bg-white"
                  />
                  <span className="text-xs text-slate-500">(0 for immediate deletion, or number of days)</span>
                </div>

                {/* Live Info Preview */}
                <div className={`p-3 rounded-lg text-xs font-medium border ${
                  Number(formData.duration) === 0
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-blue-50 border-blue-200 text-blue-800"
                }`}>
                  {Number(formData.duration) === 0 ? (
                    <span>⚠️ <strong>Immediate Deletion:</strong> Your account, vehicles, and active QR codes will be permanently erased immediately upon submission.</span>
                  ) : (
                    <span>📅 <strong>Scheduled Deletion:</strong> Your account will be permanently deleted on <strong>{getScheduledDateString(formData.duration)}</strong> ({formData.duration} days from now). You can cancel anytime before this date!</span>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
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

              {/* Description */}
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.confirm}
                className="w-full bg-linear-to-r from-red-500 to-red-600 text-white py-4 rounded-lg font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
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

      {/* ─── FEEDBACK / ALERT / CONFIRMATION MODAL ─── */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => {
              if (feedbackModal.type !== "confirm") {
                setFeedbackModal((prev) => ({ ...prev, isOpen: false }));
              }
            }}
          />

          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 text-center transform animate-fade-in z-10">
            {/* Close button for non-confirm modals */}
            {feedbackModal.type !== "confirm" && (
              <button
                type="button"
                onClick={() => setFeedbackModal((prev) => ({ ...prev, isOpen: false }))}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-all cursor-pointer"
              >
                <FaTimes className="text-lg" />
              </button>
            )}

            {/* Icon Header */}
            <div className="mx-auto mb-4 flex items-center justify-center">
              {feedbackModal.type === "success" && (
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                  <FaCheckCircle className="text-3xl" />
                </div>
              )}
              {feedbackModal.type === "error" && (
                <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-inner">
                  <FaTimes className="text-3xl" />
                </div>
              )}
              {feedbackModal.type === "warning" && (
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
                  <FaExclamationTriangle className="text-3xl" />
                </div>
              )}
              {feedbackModal.type === "confirm" && (
                <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner">
                  <FaShieldAlt className="text-3xl" />
                </div>
              )}
              {feedbackModal.type === "info" && (
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                  <FaInfoCircle className="text-3xl" />
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {feedbackModal.title}
            </h3>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {feedbackModal.message}
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              {feedbackModal.type === "confirm" && (
                <button
                  type="button"
                  onClick={feedbackModal.onCancel}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold text-sm transition-all cursor-pointer"
                >
                  {feedbackModal.cancelText || "Cancel"}
                </button>
              )}
              <button
                type="button"
                onClick={feedbackModal.onConfirm}
                className={`flex-1 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all shadow-md cursor-pointer active:scale-95 ${
                  feedbackModal.type === "error" || feedbackModal.type === "confirm"
                    ? "bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-200"
                    : feedbackModal.type === "success"
                    ? "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-200"
                    : feedbackModal.type === "warning"
                    ? "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-200"
                    : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200"
                }`}
              >
                {feedbackModal.confirmText || "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccountPage;
