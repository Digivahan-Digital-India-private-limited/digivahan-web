import React, { useContext, useState } from "react";
import logimg from "../../assets/Frame 1.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../ContextApi/DataProvider";

const Loginpage = () => {
  const navigate = useNavigate();
  const { AdminSignInwithOtp } = useContext(MyContext);

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {

      setLoading(true); // ✅ disable button

      const result = await AdminSignInwithOtp(phone);

      if (result) {

        localStorage.setItem("login_phone", phone);

        toast.success("OTP sent successfully 💛");

        // small delay optional
        setTimeout(() => {
          navigate("/login-otp", { state: { phone } });
        }, 300);

      }

    } catch (error) {

      toast.error("Failed to send OTP");

    } finally {

      setLoading(false); // ✅ enable button if error

    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">

      <div className="bg-white shadow-lg rounded-2xl flex flex-col md:flex-row w-full max-w-3xl overflow-hidden">

        <div className="w-full md:w-1/2 flex justify-center items-center p-4 md:p-6 bg-yellow-50">
          <img
            src={logimg}
            alt="Logo"
            className="w-full h-64 sm:h-80 object-contain rounded-lg"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">

          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-2">
            Welcome to DigiVahan!
          </h1>

          <p className="text-sm text-gray-600 mb-6">
            Login with your phone number to get a quick OTP.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>

            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                setPhone(digitsOnly.slice(0, 10));
              }}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            <button
              type="submit"
              disabled={loading} // ✅ disable button
              className={`w-full px-4 py-2 rounded text-white transition
                ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
                }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

          </form>

        </div>
      </div>

    </div>
  );
};

export default Loginpage;
