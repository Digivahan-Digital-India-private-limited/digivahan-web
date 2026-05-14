import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import { toast } from "react-toastify";
import { MyContext } from "../../../ContextApi/DataProvider";
import logo from "../../../assets/Group 8.png";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { UserSignInwithOtp } = useContext(MyContext);

  const isValid = useMemo(() => /^\d{10,15}$/.test(phone), [phone]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!isValid) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    try {
      setLoading(true);
      const result = await UserSignInwithOtp(phone);
      if (!result) {
        return;
      }

      localStorage.setItem("user_login_phone", phone);
      toast.success("OTP sent successfully");
      navigate("/login/otp", { state: { phone } });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-lime-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-8 shadow-[0_30px_80px_rgba(16,185,129,0.15)]">
        <img src={logo} alt="DigiVahan" className="mb-6 h-14 w-auto" />

        <h1 className="text-2xl font-bold text-slate-900">Login to DigiVahan</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your mobile number to access your dashboard, vehicles, QR codes, and notifications.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Mobile Number
          </label>
          <div className="flex items-center overflow-hidden rounded-xl border-2 border-emerald-200 bg-emerald-50/60 focus-within:border-emerald-500">
            <span className="border-r border-emerald-200 px-3 py-3 text-sm font-semibold text-emerald-700">+91</span>
            <Phone size={16} className="ml-3 text-emerald-600" />
            <input
              type="tel"
              inputMode="numeric"
              maxLength={15}
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 15))}
              placeholder="Enter mobile number"
              className="w-full bg-transparent px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <div className="flex items-center justify-between pt-1 text-xs">
            <Link to="/password-reset" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Forgot password?
            </Link>
            <Link to="/account-created" className="font-semibold text-slate-500 hover:text-slate-700">
              New account created?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
