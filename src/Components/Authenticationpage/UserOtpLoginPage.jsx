import React, { useContext, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { MyContext } from "../../ContextApi/DataProvider";

const UserOtpLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyUserOtp } = useContext(MyContext);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const phone = useMemo(() => {
    const statePhone = location.state?.phone;
    const storedPhone = localStorage.getItem("user_login_phone");
    return statePhone || storedPhone || "";
  }, [location.state]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const text = event.clipboardData.getData("text").replace(/\D/g, "");
    if (text.length === 6) {
      const digits = text.split("");
      setOtp(digits);
      inputsRef.current[5]?.focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const otpCode = otp.join("");

    if (!otpCode.length) {
      toast.error("Enter any OTP to continue");
      return;
    }

    try {
      setLoading(true);
      const result = await verifyUserOtp(otpCode);

      if (result) {
        toast.success("Login successful. Buy and sell features unlocked.");
        navigate("/explore-page", { replace: true });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-blue-50 to-cyan-100 px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-3xl border border-sky-100 bg-white shadow-[0_20px_60px_rgba(14,116,144,.18)] p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 mb-4">
          <FaCheckCircle />
          Marketplace User Verification
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Verify OTP</h1>
        <p className="text-sm text-slate-600 mb-6">
          Enter the 6-digit OTP sent to {phone ? `+91 ${phone}` : "your phone"}.
          This login gives one account access to both buying and selling cars. Dummy mode accepts any OTP.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => handleChange(event.target.value, index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className="h-12 w-12 text-center text-lg font-semibold border-2 border-sky-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-3 text-white text-sm font-semibold transition-all ${
              loading
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-200"
            }`}
          >
            {loading ? "Verifying..." : "Verify and Continue"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => navigate("/user-login", { replace: true })}
            className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800"
          >
            <FaArrowLeft />
            Edit Number
          </button>

          <button
            type="button"
            onClick={() => toast.info("Resend OTP will be enabled with backend integration")}
            className="text-slate-500 hover:text-slate-700"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserOtpLoginPage;
