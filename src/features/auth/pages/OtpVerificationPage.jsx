import React, { useContext, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MyContext } from "../../../ContextApi/DataProvider";

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || localStorage.getItem("user_login_phone") || "**********";
  const { verifyUserOtp } = useContext(MyContext);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < otp.length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Enter complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const result = await verifyUserOtp(code);
      if (!result) {
        return;
      }

      toast.success("Login successful");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-lime-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-8 shadow-[0_30px_80px_rgba(16,185,129,0.15)]">
        <h1 className="text-2xl font-bold text-slate-900">Verify OTP</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter the 6-digit code sent to +91 {phone}. This is a UI-only mock flow for now.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  refs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => handleChange(event.target.value, index)}
                className="h-12 w-12 rounded-xl border-2 border-emerald-200 text-center text-lg font-semibold outline-none focus:border-emerald-500"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Verifying..." : "Verify and Continue"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Change Number
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
