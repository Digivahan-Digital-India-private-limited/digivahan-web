import React, { useContext, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logimg from "../../assets/Frame 1.png";
import { MyContext } from "../../ContextApi/DataProvider";

const OtpLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyAdminOtp } = useContext(MyContext);
  const [Loading, setLoading] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const phone = useMemo(() => {
    const statePhone = location.state?.phone;
    const storedPhone = localStorage.getItem("login_phone");
    return statePhone || storedPhone || "";
  }, [location.state]);

  // Handle change
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto focus next
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasteData.length === 6) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      inputsRef.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      setLoading(true);

      const result = await verifyAdminOtp(otpValue);

      if (result) {
        toast.success("Login successful 💛");

        navigate("/admin-panel", { replace: true });
      } else {
        toast.error("No response received");
      }
    } catch (error) {
      console.log("Component error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl flex flex-col md:flex-row w-full max-w-3xl overflow-hidden">
        {/* Image */}
        <div className="w-full md:w-[45%] flex justify-center items-center p-4 md:p-3 bg-red-500">
          <img
            src={logimg}
            alt="Login Illustration"
            className="w-full h-64 sm:h-80 object-contain rounded-lg"
          />
        </div>

        {/* Form */}
        <div className="w-full md:w-[55%] p-6 sm:p-8 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-2">
            Verify your number
          </h1>

          <p className="text-sm text-gray-600 mb-6">
            We sent an OTP to {phone ? `+91 ${phone}` : "your phone"}.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* OTP BOXES */}
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Verify & Login
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <button
              type="button"
              className="text-yellow-600 hover:text-yellow-700"
            >
              Resend OTP
            </button>

            <button
              type="button"
              onClick={() => navigate("/login-page", { replace: true })}
              className="text-gray-500 hover:text-gray-700"
            >
              Edit number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpLoginPage;
