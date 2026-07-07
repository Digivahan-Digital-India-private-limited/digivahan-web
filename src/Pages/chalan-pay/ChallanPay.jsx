import React, { useState, useEffect } from "react";
import logo from "../../assets/Group 8.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaChevronRight, FaCheckCircle, FaExclamationTriangle, FaExternalLinkAlt, FaHistory, FaTimes } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { initChallanFlow, verifyChallanOtp, getChallanHistory, getChallanPaymentUrl, refreshChallanData, directSearchChallanData, getChallanCredits } from "../../utils/challanService";
import { getReceiptUrl } from "../../utils/challanWebhookService";

const ChallanPay = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: RC, 2: Phone, 3: OTP, 4: Results
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rcNumber: "",
    phone: "",
    otp: ["", "", "", "", "", ""], // 6-digit OTP
  });
  
  const [flowId, setFlowId] = useState("");
  const [challans, setChallans] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [payingChallan, setPayingChallan] = useState(null); // Track which challan is being paid

  const [activeTab, setActiveTab] = useState("UNPAID"); // UNPAID, PAID, UNDER_PROCESS
  const [webhookRecords, setWebhookRecords] = useState([]);

  // History State
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedRc, setExpandedRc] = useState(null);

  // Refresh State
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🪙 Credits State
  const [credits, setCredits] = useState(null);
  const [receiptLoadingId, setReceiptLoadingId] = useState(null);

  const handleRefreshData = async () => {
    if (!formData.rcNumber) return;

    // 🪙 Block if no credits
    if (credits !== null && credits <= 0) {
      toast.error("You have used all your credits. You cannot refresh anymore.");
      return;
    }

    setIsRefreshing(true);
    try {
      const token = Cookies.get("token");
      if (token) {
        // Fetch webhooks
        const historyRes = await getChallanHistory();
        if (historyRes.status && historyRes.history) {
          setWebhookRecords(historyRes.history);
          const savedState = JSON.parse(localStorage.getItem("challan_pay_state") || "{}");
          
          const currentToken = Cookies.get("token") || Cookies.get("user_token");
          if (currentToken) {
            try { savedState.userId = jwtDecode(currentToken).userId; } catch(e) {}
          }

          savedState.webhookRecords = historyRes.history;
          localStorage.setItem("challan_pay_state", JSON.stringify(savedState));
        }
      }
      // Fetch challans
      const challanRes = await refreshChallanData(formData.rcNumber);
      if (challanRes.status && challanRes.challans) {
        setChallans(challanRes.challans);
        const savedState = JSON.parse(localStorage.getItem("challan_pay_state") || "{}");
        
        const currentToken = Cookies.get("token") || Cookies.get("user_token");
        if (currentToken) {
          try { savedState.userId = jwtDecode(currentToken).userId; } catch(e) {}
        }

        savedState.challans = challanRes.challans;
        localStorage.setItem("challan_pay_state", JSON.stringify(savedState));

        // 🪙 Update credits if returned
        if (challanRes.challan_credits !== null && challanRes.challan_credits !== undefined) {
          setCredits(challanRes.challan_credits);
        }
      }
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error("Refresh error:", error);
      // 🪙 Handle no_credits error from backend
      if (error?.error_type === "no_credits" || (typeof error === "string" && error.includes("credits"))) {
        setCredits(0);
        toast.error("You have used all your credits!");
      } else if (typeof error === "string" && (error.toLowerCase().includes("deleted") || error.toLowerCase().includes("deactivated") || error.toLowerCase().includes("blocked"))) {
        toast.error(error);
        clearChallanPageData();
        Cookies.remove("token");
        Cookies.remove("user_token");
      } else {
        toast.error("Failed to refresh data");
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewReceipt = async (recordId, receiptFile) => {
    try {
      setReceiptLoadingId(recordId);
      const key = receiptFile || "";
      if (!key) {
        toast.error("Receipt file key not found.");
        return;
      }
      const result = await getReceiptUrl(key);
      const pdfUrl = result?.url || result?.data?.url || result?.data;
      if (pdfUrl && typeof pdfUrl === "string") {
        window.open(pdfUrl, "_blank", "noreferrer");
      } else {
        toast.error("Could not retrieve the receipt URL.");
      }
    } catch (err) {
      console.error("[ViewReceipt] Error:", err);
      toast.error("Failed to load receipt.");
    } finally {
      setReceiptLoadingId(null);
    }
  };

  // View Details Modal State
  const [viewDetailsItem, setViewDetailsItem] = useState(null);

  // Helper to fully reset this page's state and localStorage
  const clearChallanPageData = () => {
    localStorage.removeItem("challan_pay_state");
    setStep(1);
    setFlowId("");
    setFormData({ rcNumber: "", phone: "", otp: ["", "", "", "", "", ""] });
    setChallans([]);
    setUserDetails(null);
    setWebhookRecords([]);
    setActiveTab("UNPAID");
    setCredits(null);
  };

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    const token = Cookies.get("token") || Cookies.get("user_token");
    let currentUserId = null;
    if (token) {
      try { currentUserId = jwtDecode(token).userId; } catch(e) {}
    }

    // 🔐 AUTH GUARD on mount: if no token, clear any stale saved state
    if (!token) {
      localStorage.removeItem("challan_pay_state");
      // No restoration — stay on Step 1
    } else {
      // 🪙 Fetch credits on mount — also validates that the user still exists in DB
      getChallanCredits()
        .then(res => {
          if (res.status) {
            setCredits(res.challan_credits);

            // ✅ Only restore state AFTER validating the user still exists and token is valid
            const savedState = localStorage.getItem("challan_pay_state");
            if (savedState) {
              try {
                const parsed = JSON.parse(savedState);

                // 🔥 STRICT ISOLATION: Ensure the state belongs to the CURRENTLY logged-in user!
                // If it's old state (no userId) or mismatched userId, wipe it aggressively!
                if (!parsed.userId || parsed.userId !== currentUserId) {
                  console.warn("[ChallanPay] State belongs to a different user ID or is old. Wiping state.");
                  clearChallanPageData();
                  return; // Stop restoring
                }

                setStep(parsed.step || 1);
                setFlowId(parsed.flowId || "");
                setFormData(prev => ({
                  ...prev,
                  rcNumber: parsed.rcNumber || "",
                  phone: parsed.phone || ""
                }));
                setChallans(parsed.challans || []);
                setUserDetails(parsed.userDetails || null);
                setWebhookRecords(parsed.webhookRecords || []);

                // Fetch fresh webhook records to update status if returning to the page
                if (parsed.step === 4 && Cookies.get("token")) {
                  getChallanHistory().then(historyRes => {
                    if (historyRes.status && historyRes.history) {
                      setWebhookRecords(historyRes.history);
                      parsed.webhookRecords = historyRes.history;
                      localStorage.setItem("challan_pay_state", JSON.stringify(parsed));
                    }
                  }).catch(e => console.error("Failed to fetch fresh history:", e));
                }
              } catch (err) {
                console.error("Failed to restore state:", err);
              }
            }
          }
        })
        .catch((err) => {
          // Any auth failure (401/404) from this endpoint = user deleted or session invalid
          // Wipe localStorage and reset the page to Step 1
          console.warn("[ChallanPay] Credit fetch failed — clearing stale data:", err);
          clearChallanPageData();
          Cookies.remove("token");
          Cookies.remove("user_token");
        });
    }

    // 👁️ TOKEN WATCHER — poll every 1.5s; if token disappears (logout/delete), reset page
    const tokenWatcher = setInterval(() => {
      const currentToken = Cookies.get("token") || Cookies.get("user_token");
      if (!currentToken) {
        clearChallanPageData();
        clearInterval(tokenWatcher);
        return;
      }

      // 🔥 Detect if user logged into another account in a different tab
      try {
        const newUserId = jwtDecode(currentToken).userId;
        if (currentUserId && newUserId !== currentUserId) {
          console.warn("[ChallanPay] User changed in background tab. Wiping state.");
          clearChallanPageData();
          currentUserId = newUserId; // Update to avoid loop
        }
      } catch(e) {}
    }, 1500);

    // Load Razorpay script in the background asynchronously to make the payment gateway open faster without preload warnings
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      clearInterval(tokenWatcher); // ✅ Cleanup watcher on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleRCNext = async (e) => {
    e.preventDefault();
    if (formData.rcNumber.trim().length < 4) {
      toast.error("Please enter a valid RC number");
      return;
    }
    
    // 🪙 Block if no credits
    if (credits !== null && credits <= 0) {
      toast.error("You have used all your credits. You cannot search any more challans.");
      return;
    }
    
    // Check if user is logged in
    const isLoggedIn = !!(Cookies.get("token") || Cookies.get("user_token"));
    if (isLoggedIn) {
      try {
        setLoading(true);
        const data = await directSearchChallanData(formData.rcNumber);
        if (data.status) {
          const { user } = data;
          const realChallans = user?.challans || data.challans || [];
          
          setChallans(realChallans);
          setUserDetails(user || null);

          // 🪙 Update credits from response
          if (data.challan_credits !== null && data.challan_credits !== undefined) {
            setCredits(data.challan_credits);
          }

          // Fetch history
          let fetchedWebhookRecords = [];
          try {
            const historyRes = await getChallanHistory();
            if (historyRes.status && historyRes.history) {
              fetchedWebhookRecords = historyRes.history;
              setWebhookRecords(fetchedWebhookRecords);
            }
          } catch (e) {
            console.error("Failed to fetch history silently:", e);
          }

          setStep(4);
          toast.success("Challan details fetched successfully!");

          // Save state to localStorage for persistence on refresh
          const currentToken = Cookies.get("token") || Cookies.get("user_token");
          let currentUserId = null;
          if (currentToken) {
            try {
              currentUserId = jwtDecode(currentToken).userId;
            } catch(e) {}
          }

          const stateToSave = {
            userId: currentUserId,
            step: 4,
            rcNumber: formData.rcNumber,
            phone: user?.basic_details?.phone_number || formData.phone,
            challans: realChallans,
            userDetails: user || null,
            webhookRecords: fetchedWebhookRecords
          };
          localStorage.setItem("challan_pay_state", JSON.stringify(stateToSave));
        }
      } catch (error) {
        // 🪙 Handle no_credits error
        if (error?.error_type === "no_credits" || (typeof error === "string" && error.includes("credits"))) {
          setCredits(0);
          toast.error("You have used all your credits!");
          return;
        } else if (typeof error === "string" && (error.toLowerCase().includes("deleted") || error.toLowerCase().includes("deactivated") || error.toLowerCase().includes("blocked"))) {
          toast.error(error);
          clearChallanPageData();
          Cookies.remove("token");
          Cookies.remove("user_token");
          return;
        }
        console.error("Direct fetch failed, falling back to OTP flow:", error);
        setStep(2);
      } finally {
        setLoading(false);
      }
    } else {
      setStep(2);
    }
  };

  const handleInitFlow = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      toast.error("Please enter a 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      const data = await initChallanFlow(formData.phone, formData.rcNumber);

      if (data.status) {
        setFlowId(data.flow_id);
        setStep(3);
        toast.success(data.message || "OTP sent successfully");
        
        // Save minimal state to survive refresh during OTP step
        localStorage.setItem("challan_pay_state", JSON.stringify({
          step: 3,
          flowId: data.flow_id,
          rcNumber: formData.rcNumber,
          phone: formData.phone
        }));
      }
    } catch (error) {
      toast.error(error.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyFlow = async (e) => {
    if (e) e.preventDefault();
    const otpString = formData.otp.join("");
    if (otpString.length < 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const otpString = formData.otp.join("");
      console.log(`[ChallanPay] Verifying OTP: ${otpString} for flow: ${flowId}`);
      
      const data = await verifyChallanOtp(flowId, otpString);

      if (data.status) {
        const { user } = data;
        const realChallans = user.challans || [];
        
        console.log(`[ChallanPay] Received ${realChallans.length} real challans from backend`);
        setChallans(realChallans);
        setUserDetails(user);

        // Save token to Cookies if available
        if (data.token) {
          Cookies.set("token", data.token, { expires: 7, path: "/" });
          localStorage.setItem("user", JSON.stringify(user));
        } else if (user.token) {
          Cookies.set("token", user.token, { expires: 7, path: "/" });
          localStorage.setItem("user", JSON.stringify(user));
        }

        // 🪙 Update credits from response
        if (data.user && (data.user.challan_credits !== null && data.user.challan_credits !== undefined)) {
          setCredits(data.user.challan_credits);
        } else if (user.challan_credits !== null && user.challan_credits !== undefined) {
          setCredits(user.challan_credits);
        }

        // Fetch webhook records to identify under process challans
        let fetchedWebhookRecords = [];
        try {
          if (user.token) {
            const historyRes = await getChallanHistory();
            if (historyRes.status && historyRes.history) {
              fetchedWebhookRecords = historyRes.history;
              setWebhookRecords(fetchedWebhookRecords);
            }
          }
        } catch (e) {
          console.error("Failed to fetch history silently:", e);
        }

        setStep(4);
        toast.success(data.message || "Verification successful");
        
        // Save state to localStorage for persistence on refresh
        const currentToken = Cookies.get("token") || Cookies.get("user_token");
        let currentUserId = null;
        if (currentToken) {
          try {
            currentUserId = jwtDecode(currentToken).userId;
          } catch(e) {}
        }

        const stateToSave = {
          userId: currentUserId,
          step: 4,
          rcNumber: formData.rcNumber,
          phone: formData.phone,
          challans: realChallans,
          userDetails: user,
          webhookRecords: fetchedWebhookRecords
        };
        localStorage.setItem("challan_pay_state", JSON.stringify(stateToSave));
      }
    } catch (error) {
      toast.error(error.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    localStorage.removeItem("challan_pay_state");
    setStep(1);
    setFormData({
      rcNumber: "",
      phone: "",
      otp: ["", "", "", "", "", ""],
    });
    setChallans([]);
    setUserDetails(null);
    setFlowId("");
    setActiveTab("UNPAID");
    setWebhookRecords([]);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value) && value !== "") return;
    const newOtp = [...formData.otp];
    newOtp[index] = value ? value.substring(value.length - 1) : "";
    setFormData({ ...formData, otp: newOtp });
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const resendOtp = async () => {
    try {
      setLoading(true);
      const data = await initChallanFlow(formData.phone, formData.rcNumber);
      if (data.status) {
        setFlowId(data.flow_id);
        setFormData({ ...formData, otp: ["", "", "", "", "", ""] });
        toast.success(data.message || "OTP resent successfully");
      }
    } catch (error) {
      toast.error(error.toString());
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    // Always wipe the saved session so next search starts fresh (especially for guest users)
    localStorage.removeItem("challan_pay_state");
    localStorage.removeItem("user");

    // 🔐 Because main app users use "user_token" and guest users use "token",
    // we simply wipe "token" to ensure guest sessions are cleared.
    // We do NOT wipe "user_token" so real app logged-in users stay logged in.
    Cookies.remove("token", { path: "/" });

    setFormData({
      rcNumber: "",
      phone: "",
      otp: ["", "", "", "", "", ""],
    });
    setStep(1);
    setChallans([]);
    setUserDetails(null);
    setFlowId("");
    setActiveTab("UNPAID");
    setWebhookRecords([]);
    setCredits(null); // ✅ Reset credits so new search isn't blocked by stale 0 value
  };

  const handleViewHistory = async () => {
    try {
      setLoadingHistory(true);
      setShowHistory(true);
      const data = await getChallanHistory();
      if (data.status) {
        setHistoryData(data.history || []);
      }
    } catch (error) {
      toast.error(error.toString());
      setShowHistory(false);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handlePayNow = async (challan) => {
    try {
      setPayingChallan(challan.challanNumber);
      const vehicleNumber = formData.rcNumber;
      
      if (!vehicleNumber) {
        toast.error("Vehicle number not found. Please search again.");
        setPayingChallan(null);
        return;
      }

      console.log(`[ChallanPay] Requesting payment URL for ${vehicleNumber} and challan ${challan.challanNumber}`);
      const data = await getChallanPaymentUrl(vehicleNumber, [challan.challanNumber]);
      
      if (data.status && data.paymentUrl) {
        let cleanUrl = data.paymentUrl.trim();
        
        // Remove outer quotes if they exist
        if (cleanUrl.startsWith('"') && cleanUrl.endsWith('"')) {
          cleanUrl = cleanUrl.substring(1, cleanUrl.length - 1);
        }

        // Unescape backslashes for newlines and quotes correctly
        // We only unescape what is strictly necessary to keep the HTML valid
        cleanUrl = cleanUrl
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');

        const isHtml = cleanUrl.toLowerCase().includes("<!doctype html>") || 
                       cleanUrl.toLowerCase().includes("<html");

        if (isHtml) {
          console.log("[ChallanPay] Opening payment HTML...");
          // Writing to a new window is often more reliable for script execution
          const paymentWindow = window.open("", "_self");
          if (paymentWindow) {
            paymentWindow.document.open();
            paymentWindow.document.write(cleanUrl);
            paymentWindow.document.close();
          } else {
            // Fallback to current document if popup is blocked
            document.open();
            document.write(cleanUrl);
            document.close();
          }
        } else {
          window.location.href = cleanUrl;
        }
      } else {
        toast.error(data.message || "Failed to generate payment URL");
      }
    } catch (error) {
      console.error("[ChallanPay] Payment error:", error);
      toast.error(error.toString() || "An error occurred while initiating payment");
    } finally {
      setPayingChallan(null);
    }
  };

  const hasToken = !!(Cookies.get("token") || Cookies.get("user_token"));

  return (
    <div className="min-h-screen bg-[#dce8f5] flex items-center justify-center p-4 md:p-8 font-['Nunito']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        
        .container-custom {
          display: flex;
          gap: 24px;
          max-width: 1200px;
          width: 100%;
          align-items: flex-start;
        }

        /* LEFT PANEL — wider than right */
        .left-panel {
          flex: 0 0 620px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .digital-india-card {
          background: linear-gradient(135deg, #4facf7 0%, #2563eb 50%, #4c1ddc 100%);
          border-radius: 20px;
          padding: 48px 36px 44px;   /* ↑ increased from 36/28/32 */
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .rocket-icon {
          width: 72px; height: 72px;  /* ↑ 64→72 */
          background: #f97316;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
          font-size: 32px;            /* ↑ 28→32 */
          position: relative; z-index: 1;
        }

        .stats-row {
          display: flex;
          gap: 16px;                  /* ↑ 12→16 */
          justify-content: center;
          position: relative; z-index: 1;
        }

        .stat-box {
          background: rgba(255,255,255,0.18);
          border-radius: 12px;
          padding: 14px 36px;         /* ↑ 12/24→14/36 */
          text-align: center;
          color: #fff;
        }

        .how-it-works-card {
          background: #fff;
          border-radius: 20px;
          padding: 36px 32px 32px;   /* ↑ 28/24/24→36/32/32 */
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;         /* ↑ 14/16→16/18 */
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 12px;        /* ↑ 10→12 */
        }

        .feature-item.green { background: #f0fdf4; color: #16a34a; }
        .feature-item.blue { background: #eff6ff; color: #2563eb; }
        .feature-item.purple { background: #faf5ff; color: #9333ea; }

        .feature-icon {
          width: 40px; height: 40px;  /* ↑ 36→40 */
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;            /* ↑ 18→20 */
          flex-shrink: 0;
        }
        .feature-item.green .feature-icon { background: #16a34a; color: #fff; }
        .feature-item.blue .feature-icon { background: #2563eb; color: #fff; }
        .feature-item.purple .feature-icon { background: #9333ea; color: #fff; }

        /* RIGHT PANEL */
        .right-panel { flex: 1; min-width: 0; }
        .right-card {
          background: #fff;
          border-radius: 20px;
          padding: 36px 32px;
        }

        .vehicle-input-wrapper {
          display: flex;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .ind-badge {
          padding: 0 18px;
          background: #fff;
          color: #3730a3;
          font-weight: 800;
          font-size: 15px;
          display: flex; align-items: center;
          border-right: 1.5px solid #e2e8f0;
          min-width: 68px;
          justify-content: center;
        }

        .regular-input {
          width: 100%;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 18px;
          font-size: 16px;
          outline: none;
          margin-bottom: 20px;
        }

        .otp-box {
          width: 52px; height: 56px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          text-align: center;
          font-size: 22px;
          font-weight: 800;
          outline: none;
        }

        .btn-primary {
          width: 100%;
          padding: 16px;
          background: linear-gradient(90deg, #6366f1, #4f46e5);
          color: #fff;
          font-size: 16px;
          font-weight: 800;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.15s;
        }

        .btn-primary:active { transform: translateY(2px); }

        .guarantee-box {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #f0fdf4;
          border-radius: 12px;
          padding: 16px 18px;
          margin-bottom: 22px;
        }

        .challan-card {
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .challan-row {
          display: flex;
          justify-content: space-between;
          font-size: 13.5px;
          padding: 6px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        @media (max-width: 1000px) {
          .container-custom { flex-direction: column; }
          .left-panel { width: 100%; flex: none; }
          .right-card { padding: 24px; }
        }
      `}</style>



      <div className="container-custom">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="digital-india-card">
            <div className="rocket-icon">🚀</div>
            <h2 className="text-white font-extrabold text-lg mb-2">Digital India Initiative</h2>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Empowering millions of vehicle owners with instant access to traffic violation information
            </p>
            <div className="stats-row">
              <div className="stat-box">
                <div className="text-xl font-black">30+</div>
                <div className="text-[10px] uppercase font-bold opacity-80">Crore Vehicle</div>
              </div>
              <div className="stat-box">
                <div className="text-xl font-black">24/7</div>
                <div className="text-[10px] uppercase font-bold opacity-80">Service</div>
              </div>
            </div>
          </div>

          <div className="how-it-works-card shadow-sm">
            <h3 className="text-slate-800 font-extrabold text-lg mb-4 flex items-center gap-2">📄 How It Works?</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              The Challan System manages all your challan requests on your behalf. You simply make the payment, and our team ensures settlement within 3-4 days for all online and virtual court challans.
            </p>

            <div className="space-y-3">
              <div className="feature-item green">
                <div className="feature-icon">🔔</div>
                Instant Notification
              </div>
              <div className="feature-item blue">
                <div className="feature-icon">💳</div>
                Online Payment Facility
              </div>
              <div className="feature-item purple">
                <div className="feature-icon">🌐</div>
                Digital Record keeping
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="right-card shadow-xl">
            <h1 className="text-slate-900 font-black text-3xl md:text-4xl text-center mb-2">Stay updated on your challans.</h1>
            <p className="text-slate-500 text-sm text-center mb-10">Built for India's 30+ crore vehicles - growing with you every day.</p>

            {/* STEP 1: Vehicle Number */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-slate-700 font-bold text-sm mb-2">Enter vehicle number</div>
                <div className="vehicle-input-wrapper focus-within:border-indigo-400 transition-all">
                  <div className="ind-badge">IND</div>
                  <input
                    type="text"
                    placeholder="HR XX N 9090"
                    className="flex-1 p-4 outline-none font-bold text-lg uppercase"
                    value={formData.rcNumber}
                    onChange={(e) => setFormData({ ...formData, rcNumber: e.target.value.toUpperCase() })}
                  />
                </div>
                <button className="btn-primary mb-6" onClick={handleRCNext}>Search Challan Details</button>
                <hr className="border-slate-100 mb-6" />
                <div className="guarantee-box">
                  <span className="text-2xl">🏅</span>
                  <p className="text-sm text-slate-700">Settlement within <strong className="text-green-600">3 – 4 days</strong>, or get a <strong className="text-green-600">100% refund</strong> – guaranteed</p>
                </div>
                <div className="flex flex-wrap justify-between gap-4 text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-1"><span className="text-green-600">✅</span> Official RTO Data</div>
                  <div className="flex items-center gap-1"><span className="text-green-600">✅</span> 100% Free & Secure</div>
                  <div className="flex items-center gap-1"><span className="text-green-600">✅</span> Instant Results</div>
                </div>
              </div>
            )}

            {/* STEP 2: Phone Number */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-slate-700 font-bold text-sm mb-2">Enter phone number</div>
                <input
                  type="tel"
                  placeholder="Enter your mobile number"
                  maxLength={10}
                  className="regular-input focus:border-indigo-400 transition-all font-bold text-lg"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                />
                <button className="btn-primary mb-6 disabled:opacity-70" onClick={handleInitFlow} disabled={loading}>
                  {loading ? "Processing..." : "Send OTP"}
                </button>
                <div className="text-center">
                    <button onClick={() => setStep(1)} className="text-indigo-600 font-bold text-sm hover:underline">← Change Vehicle</button>
                </div>
              </div>
            )}

            {/* STEP 3: OTP */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                <div className="text-slate-700 font-bold text-sm mb-1">Enter 6-digit OTP</div>
                <p className="text-slate-500 text-sm mb-6">OTP sent to <span className="text-indigo-600 font-bold">+91 {formData.phone.replace(/.(?=.{4})/g, "X")}</span></p>
                
                <div className="flex justify-center gap-2 mb-6">
                  {formData.otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="otp-box focus:border-indigo-400 transition-all"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    />
                  ))}
                </div>

                <p className="text-slate-500 text-sm mb-8">
                  Didn't receive? <button onClick={resendOtp} className="text-indigo-600 font-extrabold hover:underline" disabled={loading}>Resend OTP</button>
                </p>

                <button className="btn-primary mb-8 disabled:opacity-70" onClick={handleVerifyFlow} disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                
                <div className="text-center">
                    <button onClick={() => setStep(2)} className="text-slate-400 font-bold text-sm hover:text-slate-600">Change phone number?</button>
                </div>
              </div>
            )}

            {/* STEP 4: Results */}
            {step === 4 && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                {/* Calculate counts */}
                {(() => {
                  // Process challans into categories
                  const processedChallans = challans.map(challan => {
                    // Find the latest webhook record for this challan (by createdAt)
                    const matchingRecords = webhookRecords.filter(r =>
                      r.challanNumber === challan.challanNumber
                    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    const latestRecord = matchingRecords[0]; // most recent webhook record

                    let category = "UNPAID"; // default

                    if (challan.transactionStatus === 'PAID') {
                      // Already marked as fully PAID from RTO data
                      category = "PAID";
                    } else if (latestRecord) {
                      const txStatus = latestRecord.transactionStatus?.toLowerCase();
                      const ioStatus = latestRecord.ioStatus?.toLowerCase();

                      if (txStatus === 'success' || txStatus === 'paid') {
                        category = "PAID";
                      } else if (txStatus === 'failed' && ioStatus === 'refund') {
                        // Payment failed + refund issued → treat as FAILED (hide)
                        category = "FAILED";
                      } else if (txStatus === 'captured') {
                        // Payment captured by gateway: if refunded, treat as FAILED (hide)
                        // If settled, mark PAID, else UNDER PROCESS
                        if (ioStatus === 'refund') {
                          category = "FAILED";
                        } else if (latestRecord.isSettled === true) {
                          category = "PAID";
                        } else {
                          category = "UNDER_PROCESS";
                        }
                      } else if (txStatus === 'initiated') {
                        // Payment initiated but not captured yet → keep as UNPAID
                        category = "UNPAID";
                      }
                      // For any other status (e.g. failed without refund), stays UNPAID
                    }

                    return { ...challan, category, _webhookRecord: latestRecord };
                  });

                  // Add orphaned webhook records (challans paid but no longer returned by RTO API)
                  const isMatchingRc = (webhookRc, actualRc) => {
                    if (!webhookRc || !actualRc) return false;
                    const cleanActual = actualRc.replace(/[^A-Z0-9]/ig, '').toUpperCase();
                    const cleanWebhook = webhookRc.toUpperCase();
                    if (cleanWebhook.includes('*')) {
                      const visiblePart = cleanWebhook.replace(/\*/g, '');
                      return visiblePart.length > 0 && cleanActual.endsWith(visiblePart);
                    }
                    return cleanWebhook === cleanActual;
                  };

                  const currentVehicleWebhooks = webhookRecords.filter(r => 
                    r.transactionStatus !== 'SEARCHED' && isMatchingRc(r.rcNumber, formData.rcNumber)
                  );

                  const latestWebhooksByChallan = {};
                  currentVehicleWebhooks.forEach(r => {
                    if (!r.challanNumber) return;
                    if (!latestWebhooksByChallan[r.challanNumber] || new Date(r.createdAt) > new Date(latestWebhooksByChallan[r.challanNumber].createdAt)) {
                      latestWebhooksByChallan[r.challanNumber] = r;
                    }
                  });

                  Object.values(latestWebhooksByChallan).forEach(wh => {
                    const exists = processedChallans.find(c => c.challanNumber === wh.challanNumber);
                    if (!exists) {
                      let category = "UNPAID";
                      const txStatus = wh.transactionStatus?.toLowerCase();
                      const ioStatus = wh.ioStatus?.toLowerCase();

                      if (txStatus === 'success' || txStatus === 'paid') category = "PAID";
                      else if (txStatus === 'failed' && ioStatus === 'refund') category = "FAILED";
                      else if (txStatus === 'captured') {
                        if (ioStatus === 'refund') category = "FAILED";
                        else if (wh.isSettled === true) category = "PAID";
                        else category = "UNDER_PROCESS";
                      } else if (txStatus === 'initiated') category = "UNPAID";

                      // If it's a paid or under process record, we definitely want to show it
                      if (category === "PAID" || category === "UNDER_PROCESS" || wh.isSettled) {
                        processedChallans.push({
                          challanNumber: wh.challanNumber,
                          offence: "Traffic Violation", // Default fallback since RTO deleted it
                          amountSettledAt: wh.amountSettledAt || 0,
                          transactionStatus: category,
                          location: "Not available",
                          createdAt: wh.createdAt,
                          category: category,
                          _webhookRecord: wh
                        });
                      }
                    }
                  });

                  const unpaidCount = processedChallans.filter(c => c.category === 'UNPAID').length;
                  const displayChallans = processedChallans.filter(c => c.category === activeTab);

                  return (
                    <>
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                        <div>
                          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Vehicle Number</div>
                          <div className="flex items-center gap-3">
                            <div className="text-slate-900 font-black text-xl">{formData.rcNumber}</div>
                            <button 
                              onClick={handleRefreshData} 
                              disabled={isRefreshing || (credits !== null && credits <= 0)}
                              className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100 font-bold transition disabled:opacity-50"
                            >
                              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                            </button>
                          </div>
                        </div>
                        {/* 🪙 CREDIT BADGE */}
                        <div className="flex flex-col items-end gap-1">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black border ${
                            credits === null
                              ? 'bg-slate-50 border-slate-200 text-slate-500'
                              : credits <= 0
                              ? 'bg-red-50 border-red-200 text-red-600'
                              : credits <= 3
                              ? 'bg-amber-50 border-amber-200 text-amber-700'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          }`}>
                            <span className="text-base">🪙</span>
                            <div>
                              <div className="text-[10px] uppercase tracking-wider opacity-70">Credits Left</div>
                              <div className="text-sm font-black">{credits === null ? '...' : credits} / 3</div>
                            </div>
                          </div>
                          {credits !== null && credits <= 0 && (
                            <div className="text-[10px] text-red-500 font-bold text-right">
                              All credits used!
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 🚫 NO CREDITS BANNER */}
                      {credits !== null && credits <= 0 && (
                        <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                          <span className="text-2xl">🚫</span>
                          <div>
                            <div className="text-red-700 font-black text-sm">You have used all your credits!</div>
                            <div className="text-red-500 text-xs font-medium">You cannot search or refresh any more challans with this account.</div>
                            <div className="text-orange-500 text-xs font-semibold mt-1">🔄 Your credits will automatically restore after 3 days.</div>
                          </div>
                        </div>
                      )}

                      {/* TABS */}
                      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-2 overflow-x-auto custom-scrollbar">
                        <button
                          onClick={() => setActiveTab("UNPAID")}
                          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-all ${
                            activeTab === "UNPAID"
                              ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          Unpaid ({processedChallans.filter(c => c.category === 'UNPAID').length})
                        </button>
                        <button
                          onClick={() => setActiveTab("UNDER_PROCESS")}
                          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-all ${
                            activeTab === "UNDER_PROCESS"
                              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          Under Process ({processedChallans.filter(c => c.category === 'UNDER_PROCESS').length})
                        </button>
                        <button
                          onClick={() => setActiveTab("PAID")}
                          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-all ${
                            activeTab === "PAID"
                              ? "text-green-600 border-b-2 border-green-600 bg-green-50/50"
                              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          Paid ({processedChallans.filter(c => c.category === 'PAID').length})
                        </button>
                      </div>

                      {displayChallans.length > 0 ? (
                        <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                          {displayChallans.map((challan, idx) => {
                            const isPaid = challan.category === 'PAID';
                            const isUnderProcess = challan.category === 'UNDER_PROCESS';
                            
                            return (
                              <div key={idx} className={`challan-card hover:border-indigo-200 transition-all shadow-sm ${isPaid ? 'opacity-80 bg-slate-50/50' : ''} ${isUnderProcess ? 'border-blue-200 bg-blue-50/30' : ''}`}>
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <div className="text-slate-400 text-[10px] font-black uppercase">Challan Number</div>
                                    <div className="text-slate-800 font-extrabold text-sm">{challan.challanNumber}</div>
                                  </div>
                                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${isPaid ? 'bg-green-100 text-green-700' : isUnderProcess ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {isPaid ? 'PAID' : isUnderProcess ? 'PROCESSING' : 'UNPAID'}
                                  </span>
                                </div>
                          
                          <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold">Amount</span><span className={`font-black text-lg ${isPaid ? 'text-slate-600' : 'text-red-500'}`}>₹{challan.amountSettledAt || 0}</span></div>
                              <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold">Date</span><span className="text-slate-700 font-bold">{new Date(challan.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                              <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold">Reason</span><span className="text-slate-700 font-bold">{challan.offence}</span></div>
                          </div>

                          {challan.category === 'UNPAID' && (
                            <button 
                              onClick={() => handlePayNow(challan)}
                              disabled={payingChallan === challan.challanNumber}
                              className={`w-full py-3 text-white rounded-xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                                payingChallan === challan.challanNumber 
                                  ? 'bg-indigo-400 cursor-not-allowed' 
                                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                              }`}
                            >
                               {payingChallan === challan.challanNumber ? (
                                 <>
                                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                   Initiating Payment...
                                 </>
                               ) : (
                                 'Pay Now'
                               )}
                            </button>
                          )}
                          
                          {challan.category === 'UNDER_PROCESS' && (
                            <div className="space-y-2">
                              <div className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-xs flex items-center justify-center gap-2 border border-blue-100">
                                <FaCheckCircle /> Payment Processing (Settlement in 3-4 days)
                              </div>
                              {challan._webhookRecord ? (
                                <div className="mt-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                  <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                                    {challan._webhookRecord.requestId && (
                                      <div className="col-span-2">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Request ID</span>
                                        <span className="text-xs font-semibold text-slate-700 break-all">{challan._webhookRecord.requestId}</span>
                                      </div>
                                    )}
                                    {challan._webhookRecord.ioStatus && (
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">IO Status</span>
                                        <span className="text-xs font-semibold text-slate-700">{challan._webhookRecord.ioStatus}</span>
                                      </div>
                                    )}
                                    {challan.isSettled !== undefined && (
                                      <div className="mt-2 text-right">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Settled</span>
                                        <span className={`text-xs font-semibold ${challan.isSettled ? 'text-green-600' : 'text-amber-600'}`}>
                                          {challan.isSettled ? 'Yes' : 'No'}
                                        </span>
                                      </div>
                                    )}
                                    {challan._webhookRecord.convenienceFee ? (
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Conv. Fee</span>
                                        <span className="text-xs font-semibold text-slate-700">₹{challan._webhookRecord.convenienceFee}</span>
                                      </div>
                                    ) : null}
                                    {challan._webhookRecord.paymentGatewayFee ? (
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">PG Fee</span>
                                        <span className="text-xs font-semibold text-slate-700">₹{challan._webhookRecord.paymentGatewayFee}</span>
                                      </div>
                                    ) : null}
                                    {(challan._webhookRecord.receiptFile || challan._webhookRecord.receiptLink) && (
                                       <div className="col-span-2">
                                         <span className="text-[10px] text-slate-400 font-bold uppercase block">Receipt Link</span>
                                         <button
                                           onClick={() => handleViewReceipt(challan._webhookRecord._id, challan._webhookRecord.receiptFile || challan._webhookRecord.receiptLink)}
                                           disabled={receiptLoadingId === challan._webhookRecord._id}
                                           className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 disabled:opacity-60 disabled:cursor-wait"
                                         >
                                           {receiptLoadingId === challan._webhookRecord._id ? "Loading..." : <>{"View Receipt"} <FaExternalLinkAlt size={10} /></>}
                                         </button>
                                       </div>
                                     )}
                                    {challan._webhookRecord.receiptNumber && (
                                      <div className="col-span-2">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Receipt Number</span>
                                        <span className="text-xs font-semibold text-slate-700">{challan._webhookRecord.receiptNumber}</span>
                                      </div>
                                    )}
                                    {challan._webhookRecord.refundAmount && (challan._webhookRecord.refundAmount !== "0" && challan._webhookRecord.refundAmount !== 0) && (
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Refund</span>
                                        <span className="text-xs font-semibold text-slate-700">₹{challan._webhookRecord.refundAmount}</span>
                                      </div>
                                    )}
                                    {challan._webhookRecord.comment && (
                                      <div className="col-span-2">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Comment</span>
                                        <span className="text-xs font-semibold text-slate-700">{challan._webhookRecord.comment}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          )}

                          {challan.category === 'PAID' && challan._webhookRecord ? (
                            <div className="mt-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                                {challan._webhookRecord.requestId && (
                                  <div className="col-span-2">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Request ID</span>
                                    <span className="text-xs font-semibold text-slate-700 break-all">{challan._webhookRecord.requestId}</span>
                                  </div>
                                )}
                                {challan._webhookRecord.ioStatus && (
                                  <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">IO Status</span>
                                    <span className="text-xs font-semibold text-slate-700">{challan._webhookRecord.ioStatus}</span>
                                  </div>
                                )}
                                {challan.isSettled !== undefined && (
                                  <div className="mt-2 flex-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Settled</span>
                                    <span className={`text-xs font-semibold ${challan.isSettled ? 'text-green-600' : 'text-amber-600'}`}>
                                      {challan.isSettled ? 'Yes' : 'No'}
                                    </span>
                                  </div>
                                )}
                                {challan._webhookRecord.convenienceFee ? (
                                  <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Conv. Fee</span>
                                    <span className="text-xs font-semibold text-slate-700">₹{challan._webhookRecord.convenienceFee}</span>
                                  </div>
                                ) : null}
                                {challan._webhookRecord.paymentGatewayFee ? (
                                  <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">PG Fee</span>
                                    <span className="text-xs font-semibold text-slate-700">₹{challan._webhookRecord.paymentGatewayFee}</span>
                                  </div>
                                ) : null}
                                {(challan._webhookRecord.receiptFile || challan._webhookRecord.receiptLink) && (
                                  <div className="col-span-2">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Receipt Link</span>
                                    <button
                                      onClick={() => handleViewReceipt(challan._webhookRecord._id, challan._webhookRecord.receiptFile || challan._webhookRecord.receiptLink)}
                                      disabled={receiptLoadingId === challan._webhookRecord._id}
                                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 disabled:opacity-60 disabled:cursor-wait"
                                    >
                                      {receiptLoadingId === challan._webhookRecord._id ? "Loading..." : <>{"View Receipt"} <FaExternalLinkAlt size={10} /></>}
                                    </button>
                                  </div>
                                )}
                                {challan._webhookRecord.receiptNumber && (
                                  <div className="col-span-2">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Receipt Number</span>
                                    <span className="text-xs font-semibold text-slate-700">{challan._webhookRecord.receiptNumber}</span>
                                  </div>
                                )}
                                {challan._webhookRecord.refundAmount && (challan._webhookRecord.refundAmount !== "0" && challan._webhookRecord.refundAmount !== 0) && (
                                  <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Refund</span>
                                    <span className="text-xs font-semibold text-slate-700">₹{challan._webhookRecord.refundAmount}</span>
                                  </div>
                                )}
                                {challan._webhookRecord.comment && (
                                  <div className="col-span-2">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Comment</span>
                                    <span className="text-xs font-semibold text-slate-700">{challan._webhookRecord.comment}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : challan.category === 'PAID' ? (
                            <div className="w-full py-3 bg-green-50 text-green-600 rounded-xl font-black text-xs flex items-center justify-center gap-2 border border-green-100">
                               <FaCheckCircle /> Payment Completed
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-6">{activeTab === "UNPAID" ? "✅" : "📂"}</div>
                    <h3 className="text-slate-900 font-black text-2xl mb-2">No {activeTab.replace('_', ' ').toLowerCase()} challans!</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">
                      {activeTab === "UNPAID" 
                        ? "Great news! No pending challans were found for your vehicle in this category."
                        : "There are no challans in this category right now."}
                    </p>
                    {activeTab === "UNPAID" && (
                      <div className="guarantee-box">
                        <span className="text-2xl">🏅</span>
                        <p className="text-sm text-slate-700">Settlement within <strong className="text-green-600">3 – 4 days</strong>, or get a <strong className="text-green-600">100% refund</strong> – guaranteed</p>
                      </div>
                    )}
                  </div>
                )}
                    </>
                  );
                })()}

                <button onClick={resetAll} className="w-full py-4 text-indigo-600 font-black text-sm hover:underline mt-4">
                  ← Search another vehicle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HISTORY MODAL */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FaHistory className="text-blue-500" /> Your Challan History
              </h3>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-red-500 transition">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
              {loadingHistory ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : historyData.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  No challan history found for this account.
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.values(
                    historyData.reduce((acc, curr) => {
                      if (!acc[curr.rcNumber]) acc[curr.rcNumber] = { rcNumber: curr.rcNumber, records: [] };
                      // Include all records that are NOT a SEARCHED marker — includes 'initiated', 'PAID', etc.
                      if (curr.transactionStatus !== 'SEARCHED') {
                        acc[curr.rcNumber].records.push(curr);
                      }
                      return acc;
                    }, {})
                  ).map((vehicle, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div 
                        className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition"
                        onClick={() => setExpandedRc(expandedRc === vehicle.rcNumber ? null : vehicle.rcNumber)}
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Vehicle No.</span>
                          <span className="font-extrabold text-slate-800 text-lg">{vehicle.rcNumber}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            {vehicle.records.length} Challan{vehicle.records.length !== 1 && 's'}
                          </span>
                          <FaChevronRight className={`text-slate-400 transition-transform ${expandedRc === vehicle.rcNumber ? 'rotate-90' : ''}`} />
                        </div>
                      </div>

                      {expandedRc === vehicle.rcNumber && (
                        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                          {vehicle.records.length === 0 ? (
                            <div className="text-center text-sm text-slate-500 py-4">
                              No payment records found for this vehicle.
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {vehicle.records.map((item, cIdx) => (
                                <div key={cIdx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                  <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                                    <div>
                                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Challan No.</span>
                                      <span className="font-bold text-slate-800">{item.challanNumber || '—'}</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                      item.transactionStatus === 'SUCCESS' || item.transactionStatus === 'PAID' || (item.transactionStatus?.toLowerCase() === 'captured' && item.isSettled) ? 'bg-green-100 text-green-700' :
                                      item.transactionStatus?.toLowerCase() === 'initiated' || item.transactionStatus?.toLowerCase() === 'captured' ? 'bg-blue-100 text-blue-700' :
                                      item.transactionStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-slate-100 text-slate-600'
                                    }`}>
                                      {(item.transactionStatus?.toLowerCase() === 'captured' && item.isSettled) ? 'PAID' : (item.transactionStatus || '')}
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4">
                                    {item.amountSettledAt !== undefined && item.amountSettledAt !== null && (
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Amount</span>
                                        <span className="text-sm font-semibold text-slate-700">₹{item.amountSettledAt}</span>
                                      </div>
                                    )}
                                    {item.createdAt && (
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Date</span>
                                        <span className="text-sm font-semibold text-slate-700">
                                          {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                          })}
                                        </span>
                                      </div>
                                    )}
                                    {item.requestId && (
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Request ID</span>
                                        <span className="text-sm font-semibold text-slate-700 break-all">{item.requestId}</span>
                                      </div>
                                    )}
                                    {item.ioStatus && (
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">IO Status</span>
                                        <span className="text-sm font-semibold text-slate-700">{item.ioStatus}</span>
                                      </div>
                                    )}
                                    {item.receiptNumber && (
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Receipt No</span>
                                        <span className="text-sm font-semibold text-slate-700">{item.receiptNumber}</span>
                                      </div>
                                    )}
                                    {item.isSettled !== undefined && (
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Settled</span>
                                        <span className={`text-sm font-semibold ${item.isSettled ? 'text-green-600' : 'text-amber-600'}`}>
                                          {item.isSettled ? 'Yes' : 'No'}
                                        </span>
                                      </div>
                                    )}
                                    {item.convenienceFee ? (
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Conv. Fee</span>
                                        <span className="text-sm font-semibold text-slate-700">₹{item.convenienceFee}</span>
                                      </div>
                                    ) : null}
                                    {item.paymentGatewayFee ? (
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">PG Fee</span>
                                        <span className="text-sm font-semibold text-slate-700">₹{item.paymentGatewayFee}</span>
                                      </div>
                                    ) : null}
                                    {item.refundAmount && item.refundAmount !== "0" && item.refundAmount !== 0 ? (
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Refund</span>
                                        <span className="text-sm font-semibold text-slate-700">₹{item.refundAmount}</span>
                                      </div>
                                    ) : null}
                                    {(item.receiptFile || item.receiptLink) && (
                                      <div className="col-span-2 md:col-span-1">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Receipt</span>
                                        <button
                                          onClick={() => handleViewReceipt(item._id, item.receiptFile || item.receiptLink)}
                                          disabled={receiptLoadingId === item._id}
                                          className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1 disabled:opacity-60 disabled:cursor-wait"
                                        >
                                          {receiptLoadingId === item._id ? "Loading..." : <>{"View Receipt"} <FaExternalLinkAlt size={10} /></>}
                                        </button>
                                      </div>
                                    )}
                                    {item.comment && (
                                      <div className="col-span-2 md:col-span-3">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Comment</span>
                                        <span className="text-sm font-semibold text-slate-700">{item.comment}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white border-t border-slate-100 text-center">
              <button 
                onClick={() => setShowHistory(false)}
                className="px-6 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewDetailsItem && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4" onClick={() => setViewDetailsItem(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Challan No.</span>
                <span className="font-extrabold text-slate-800 text-lg">{viewDetailsItem.challanNumber || '—'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  viewDetailsItem.transactionStatus === 'SUCCESS' || viewDetailsItem.transactionStatus === 'PAID' || (viewDetailsItem.transactionStatus?.toLowerCase() === 'captured' && viewDetailsItem.isSettled) ? 'bg-green-100 text-green-700' :
                  viewDetailsItem.transactionStatus?.toLowerCase() === 'initiated' || viewDetailsItem.transactionStatus?.toLowerCase() === 'captured' ? 'bg-blue-100 text-blue-700' :
                  viewDetailsItem.transactionStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {(viewDetailsItem.transactionStatus?.toLowerCase() === 'captured' && viewDetailsItem.isSettled) ? 'PAID' : (viewDetailsItem.transactionStatus || 'Processing')}
                </span>
                <button onClick={() => setViewDetailsItem(null)} className="text-slate-400 hover:text-red-500 transition">
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                {viewDetailsItem.rcNumber && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">RC Number</span>
                    <span className="text-sm font-semibold text-slate-700">{viewDetailsItem.rcNumber}</span>
                  </div>
                )}
                {viewDetailsItem.amountSettledAt !== undefined && viewDetailsItem.amountSettledAt !== null && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Amount</span>
                    <span className="text-sm font-semibold text-slate-700">₹{viewDetailsItem.amountSettledAt}</span>
                  </div>
                )}
                {viewDetailsItem.createdAt && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Date</span>
                    <span className="text-sm font-semibold text-slate-700">
                      {new Date(viewDetailsItem.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}
                {viewDetailsItem.requestId && (
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Request ID</span>
                    <span className="text-sm font-semibold text-slate-700 break-all">{viewDetailsItem.requestId}</span>
                  </div>
                )}
                {viewDetailsItem.ioStatus && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">IO Status</span>
                    <span className="text-sm font-semibold text-slate-700">{viewDetailsItem.ioStatus}</span>
                  </div>
                )}
                {viewDetailsItem.isSettled !== undefined && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Settled</span>
                    <span className={`text-sm font-semibold ${viewDetailsItem.isSettled ? 'text-green-600' : 'text-amber-600'}`}>
                      {viewDetailsItem.isSettled ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
                {viewDetailsItem.receiptNumber && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Receipt No.</span>
                    <span className="text-sm font-semibold text-slate-700">{viewDetailsItem.receiptNumber}</span>
                  </div>
                )}
                {viewDetailsItem.convenienceFee ? (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Conv. Fee</span>
                    <span className="text-sm font-semibold text-slate-700">₹{viewDetailsItem.convenienceFee}</span>
                  </div>
                ) : null}
                {viewDetailsItem.paymentGatewayFee ? (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">PG Fee</span>
                    <span className="text-sm font-semibold text-slate-700">₹{viewDetailsItem.paymentGatewayFee}</span>
                  </div>
                ) : null}
                {viewDetailsItem.refundAmount && viewDetailsItem.refundAmount !== "0" && viewDetailsItem.refundAmount !== 0 ? (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Refund</span>
                    <span className="text-sm font-semibold text-slate-700">₹{viewDetailsItem.refundAmount}</span>
                  </div>
                ) : null}
                {(viewDetailsItem.receiptFile || viewDetailsItem.receiptLink) && (
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Receipt Link</span>
                    <button
                      onClick={() => handleViewReceipt(viewDetailsItem._id, viewDetailsItem.receiptFile || viewDetailsItem.receiptLink)}
                      disabled={receiptLoadingId === viewDetailsItem._id}
                      className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1 disabled:opacity-60 disabled:cursor-wait"
                    >
                      {receiptLoadingId === viewDetailsItem._id ? "Loading..." : <>{"View Receipt"} <FaExternalLinkAlt size={10} /></>}
                    </button>
                  </div>
                )}
                {viewDetailsItem.comment && (
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Comment</span>
                    <span className="text-sm font-semibold text-slate-700">{viewDetailsItem.comment}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button
                onClick={() => setViewDetailsItem(null)}
                className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChallanPay;