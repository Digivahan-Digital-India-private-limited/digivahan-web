import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCarSide, FaShoppingCart, FaTag, FaUserShield } from "react-icons/fa";
import { MyContext } from "../../ContextApi/DataProvider";
import logo from "../../assets/Group 8.png";

const featureCards = [
  {
    title: "Buy Cars",
    text: "Explore verified listings and reserve your next car with confidence.",
    icon: <FaShoppingCart className="text-sky-600" />,
  },
  {
    title: "Sell Cars",
    text: "Create listings, manage offers, and complete sales in one workflow.",
    icon: <FaTag className="text-sky-600" />,
  },
  {
    title: "One Account",
    text: "A single profile lets you both buy and sell cars.",
    icon: <FaUserShield className="text-sky-600" />,
  },
];

const UserLoginPage = () => {
  const navigate = useNavigate();
  const { UserSignInwithOtp } = useContext(MyContext);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidPhone = useMemo(() => /^\d{1,15}$/.test(phone), [phone]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidPhone) {
      toast.error("Enter any phone number to continue");
      return;
    }

    try {
      setLoading(true);
      const result = await UserSignInwithOtp(phone);

      if (result) {
        localStorage.setItem("user_login_phone", phone);
        toast.success("OTP sent. Continue to login for buy and sell access.");
        navigate("/user-login-otp", { state: { phone } });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-blue-100 px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(14,116,144,.2)] overflow-hidden border border-sky-100">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <section className="p-8 md:p-10 bg-linear-to-br from-cyan-100 via-sky-100 to-blue-200 relative">
            <div className="absolute -top-16 -left-8 h-40 w-40 bg-white/30 blur-2xl rounded-full" />
            <div className="absolute -bottom-16 right-0 h-44 w-44 bg-sky-300/30 blur-2xl rounded-full" />

            <img src={logo} alt="DigiVahan logo" className="h-12 w-auto mb-6 relative z-10" />

            <h1 className="text-3xl font-bold text-sky-900 mb-3 relative z-10">
              Marketplace User Login
            </h1>
            <p className="text-sky-800/80 text-sm mb-8 relative z-10">
              Sign in once and manage both journeys: buy cars and sell cars from the same DigiVahan account.
            </p>

            <div className="space-y-4 relative z-10">
              {featureCards.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 p-3 rounded-xl bg-white/75 border border-sky-100"
                >
                  <div className="h-9 w-9 rounded-lg bg-sky-50 flex items-center justify-center text-lg">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sky-900 font-semibold text-sm">{item.title}</p>
                    <p className="text-sky-700 text-xs">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="p-8 md:p-10 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold w-fit mb-4">
              <FaCarSide />
              Buy + Sell Account Access
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-sm text-slate-500 mb-6">
              Enter your mobile number to receive a one-time password. Dummy mode is enabled for now.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">
                  Phone Number
                </label>

                <div className="flex items-center rounded-xl border-2 border-sky-200 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100 transition-all overflow-hidden">
                  <span className="px-3 py-2.5 bg-sky-50 text-sky-700 font-semibold text-sm border-r border-sky-200">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={15}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
                    placeholder="Any mobile number"
                    className="w-full px-3 py-2.5 outline-none text-slate-700 placeholder:text-slate-300"
                    required
                  />
                </div>
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
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>

            <div className="mt-5 text-xs text-slate-500">
              Admin login is available at
              <button
                type="button"
                onClick={() => navigate("/login-page")}
                className="ml-1 text-sky-700 font-semibold hover:text-sky-800"
              >
                /login-page
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
