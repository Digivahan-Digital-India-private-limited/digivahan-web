import React, { useContext, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logimg from "../../assets/Frame 1.png";
import { MyContext } from "../../ContextApi/DataProvider";

const MasterAdminOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyMasterAdminOtp } = useContext(MyContext);
  const [Loading, setLoading] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const phone = useMemo(() => {
    const statePhone = location.state?.phone;
    const storedPhone = localStorage.getItem("master_login_phone");
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

      const result = await verifyMasterAdminOtp(otpValue);

      if (result) {
        toast.success("Master Login successful 💛");

        navigate("/page/admin/master/dashboard", { replace: true });
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
            Master Admin Verification
          </h1>

          <p className="text-sm text-gray-600 mb-6">
            Enter the OTP sent to +91 {phone}
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="flex justify-between mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-10 h-12 sm:w-12 sm:h-14 border border-gray-300 rounded-lg text-center text-xl font-semibold text-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all duration-300"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={Loading}
              className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition-all duration-300 ${
                Loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              }`}
            >
              {Loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Didn't receive the code?{" "}
            <button
              className="text-yellow-500 font-semibold hover:underline"
              onClick={() => {
                // Handle resend OTP logic if needed
                toast.info("Resend functionality to be implemented");
              }}
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterAdminOtpPage;
