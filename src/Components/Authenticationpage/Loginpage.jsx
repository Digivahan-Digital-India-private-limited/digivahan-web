import React, { useContext, useState, useEffect } from "react";
import logo from "../../assets/Group 8.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../ContextApi/DataProvider";
import { FaShieldAlt, FaChartBar, FaUsers, FaCog, FaLock } from "react-icons/fa";

const features = [
  { icon: <FaChartBar />,  label: "Dashboard & Analytics",    delay: "0.35s" },
  { icon: <FaUsers />,     label: "User & Order Management",  delay: "0.5s"  },
  { icon: <FaShieldAlt />, label: "Secure Access Control",    delay: "0.65s" },
  { icon: <FaCog />,       label: "System Configuration",     delay: "0.8s"  },
];

/* ── keyframe styles injected once ── */
const animStyles = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes fadeSlideRight {
    from { opacity: 0; transform: translateX(-28px); }
    to   { opacity: 1; transform: translateX(0);     }
  }
  @keyframes fadeSlideLeft {
    from { opacity: 0; transform: translateX(28px); }
    to   { opacity: 1; transform: translateX(0);    }
  }
  @keyframes blobFloat {
    0%, 100% { transform: translateY(0px)   scale(1);    }
    50%       { transform: translateY(-18px) scale(1.06); }
  }
  @keyframes blobFloat2 {
    0%, 100% { transform: translateY(0px)  scale(1);    }
    50%       { transform: translateY(14px) scale(1.04); }
  }
  @keyframes rotateSlow {
    from { transform: rotate(0deg);   }
    to   { transform: rotate(360deg); }
  }
  @keyframes pulseRing {
    0%   { box-shadow: 0 0 0 0   rgba(255,200,0,.55); }
    70%  { box-shadow: 0 0 0 12px rgba(255,200,0,0);  }
    100% { box-shadow: 0 0 0 0   rgba(255,200,0,0);  }
  }
  @keyframes shimmerBtn {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes gradBG {
    0%   { background-position: 0%   50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0%   50%; }
  }
  @keyframes lockBounce {
    0%, 100% { transform: translateY(0);   }
    40%       { transform: translateY(-8px); }
    60%       { transform: translateY(-4px); }
  }
  @keyframes dotBlink {
    0%, 80%, 100% { opacity: 0; transform: scale(0.8); }
    40%           { opacity: 1; transform: scale(1);   }
  }
  .anim-fade-up   { animation: fadeSlideUp   0.55s cubic-bezier(.22,1,.36,1) both; }
  .anim-fade-right{ animation: fadeSlideRight 0.55s cubic-bezier(.22,1,.36,1) both; }
  .anim-fade-left { animation: fadeSlideLeft  0.55s cubic-bezier(.22,1,.36,1) both; }
  .blob1 { animation: blobFloat  5s ease-in-out infinite; }
  .blob2 { animation: blobFloat2 6s ease-in-out infinite; }
  .blob3 { animation: blobFloat  7s ease-in-out infinite 1s; }
  .gear-spin { animation: rotateSlow 8s linear infinite; }
  .pulse-ring { animation: pulseRing 2s ease-out infinite; }
  .lock-bounce { animation: lockBounce 2.4s ease-in-out infinite; }
  .shimmer-btn {
    background: linear-gradient(90deg,#f59e0b 0%,#fbbf24 40%,#fff8 50%,#fbbf24 60%,#f59e0b 100%);
    background-size: 200% auto;
    animation: shimmerBtn 2.2s linear infinite;
  }
  .grad-bg {
    background: linear-gradient(135deg,#f59e0b,#fbbf24,#f97316,#f59e0b);
    background-size: 300% 300%;
    animation: gradBG 6s ease infinite;
  }
  .dot1 { animation: dotBlink 1.2s infinite 0s;    }
  .dot2 { animation: dotBlink 1.2s infinite 0.2s;  }
  .dot3 { animation: dotBlink 1.2s infinite 0.4s;  }
`;

const Loginpage = () => {
  const navigate = useNavigate();
  const { AdminSignInwithOtp } = useContext(MyContext);

  const [phone, setPhone]     = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    try {
      setLoading(true);
      const result = await AdminSignInwithOtp(phone);
      if (result) {
        localStorage.setItem("login_phone", phone);
        toast.success("OTP sent successfully 💛");
        setTimeout(() => navigate("/login-otp", { state: { phone } }), 300);
      }
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{animStyles}</style>

      {/* Animated page background */}
      <div className="flex justify-center items-center min-h-screen p-4 relative overflow-hidden"
           style={{ background: "linear-gradient(135deg,#fef9ee 0%,#f3f4f6 60%,#fef3c7 100%)" }}>

        {/* Subtle floating bg shapes */}
        <div className="blob1 absolute top-10 left-10 w-56 h-56 rounded-full opacity-20"
             style={{ background: "radial-gradient(circle,#fbbf24,transparent)", filter: "blur(40px)" }} />
        <div className="blob2 absolute bottom-16 right-16 w-72 h-72 rounded-full opacity-15"
             style={{ background: "radial-gradient(circle,#f97316,transparent)", filter: "blur(50px)" }} />
        <div className="blob3 absolute top-1/2 left-1/3 w-40 h-40 rounded-full opacity-10"
             style={{ background: "radial-gradient(circle,#facc15,transparent)", filter: "blur(35px)" }} />

        {/* Card */}
        <div
          className={`bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row w-full max-w-3xl overflow-hidden relative z-10 transition-all duration-700 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          style={{ boxShadow: "0 30px 80px -10px rgba(245,158,11,.25), 0 8px 24px rgba(0,0,0,.08)" }}
        >

          {/* ── LEFT PANEL ── */}
          <div className="grad-bg w-full md:w-1/2 p-8 flex flex-col justify-between relative overflow-hidden">

            {/* Decorative circles */}
            <div className="blob1 absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10" />
            <div className="blob2 absolute -bottom-8 -left-8  w-36 h-36 rounded-full bg-white/10" />
            <div className="absolute top-1/2 right-4 w-20 h-20 rounded-full border-4 border-white/10 blob3" />

            <div className={`relative z-10 anim-fade-right ${mounted ? "" : "opacity-0"}`}
                 style={{ animationDelay: "0.1s" }}>
              <img src={logo} alt="DigiVahan Logo" className="h-10 mb-6 brightness-0 invert" />
              <h2 className="text-white text-2xl font-bold mb-2 drop-shadow">Admin Control Panel</h2>
              <p className="text-yellow-100 text-sm mb-8">
                Manage your entire DigiVahan platform from one secure place.
              </p>

              <ul className="space-y-4">
                {features.map(({ icon, label, delay }) => (
                  <li
                    key={label}
                    className={`flex items-center gap-3 text-white text-sm font-medium anim-fade-right ${mounted ? "" : "opacity-0"}`}
                    style={{ animationDelay: delay }}
                  >
                    <span
                      className="bg-white/20 rounded-full p-2 text-white text-base hover:bg-white/35 transition-all duration-300 hover:scale-110 cursor-default pulse-ring"
                      style={{ display: "inline-flex" }}
                    >
                      {label === "System Configuration"
                        ? <span className="gear-spin inline-block">{icon}</span>
                        : icon}
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <p className={`text-yellow-100 text-xs mt-8 relative z-10 anim-fade-right ${mounted ? "" : "opacity-0"}`}
               style={{ animationDelay: "1s" }}>
              © {new Date().getFullYear()} DigiVahan. Authorised personnel only.
            </p>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white">

            {/* Lock icon */}
            <div className={`flex justify-center mb-4 anim-fade-up ${mounted ? "" : "opacity-0"}`}
                 style={{ animationDelay: "0.2s" }}>
              <span className="lock-bounce inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-50 text-yellow-500 text-2xl shadow-md">
                <FaLock />
              </span>
            </div>

            <div className={`mb-6 text-center anim-fade-up ${mounted ? "" : "opacity-0"}`}
                 style={{ animationDelay: "0.3s" }}>
              <span className="inline-block bg-yellow-100 text-yellow-600 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
                Admin Login
              </span>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h1>
              <p className="text-sm text-gray-500">
                Enter your registered phone number. We'll send a one-time password to verify your identity.
              </p>
            </div>

            <form
              className={`space-y-4 anim-fade-up ${mounted ? "" : "opacity-0"}`}
              style={{ animationDelay: "0.45s" }}
              onSubmit={handleSubmit}
            >
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Phone Number
                </label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-yellow-400 focus-within:shadow-[0_0_0_3px_rgba(251,191,36,.25)] transition-all duration-300">
                  <span className="px-3 py-2.5 bg-yellow-50 text-yellow-600 font-semibold text-sm border-r-2 border-gray-200 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => {
                      const d = e.target.value.replace(/\D/g, "");
                      setPhone(d.slice(0, 10));
                    }}
                    required
                    className="flex-1 px-3 py-2.5 text-sm outline-none bg-white placeholder-gray-300"
                  />
                  {phone.length === 10 && (
                    <span className="pr-3 text-green-500 text-base animate-bounce" title="Valid">✓</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-300 relative overflow-hidden
                  ${loading ? "bg-gray-300 cursor-not-allowed" : "shimmer-btn hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-200"}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    Sending OTP
                    <span className="flex gap-1 items-center">
                      <span className="dot1 inline-block w-1.5 h-1.5 rounded-full bg-white" />
                      <span className="dot2 inline-block w-1.5 h-1.5 rounded-full bg-white" />
                      <span className="dot3 inline-block w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                  </span>
                ) : "Send OTP →"}
              </button>
            </form>

            <p className={`text-xs text-gray-400 mt-6 text-center anim-fade-up ${mounted ? "" : "opacity-0"}`}
               style={{ animationDelay: "0.6s" }}>
              Restricted to authorised DigiVahan administrators only.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Loginpage;
