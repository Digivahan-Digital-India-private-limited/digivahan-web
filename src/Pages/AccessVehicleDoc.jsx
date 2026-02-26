import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import calculateAgeFromDate from "../utils/dateUtils";
import axios from "axios";

const documents = [
  {
    id: 1,
    title: "Insurance",
    subtitle: "Keep your vehicle secured with valid insurance",
    icon: "📄",
  },
  {
    id: 2,
    title: "Pollution",
    subtitle: "Keep PUC certificate handy",
    icon: "☁️",
  },
  {
    id: 3,
    title: "Registration Certificate",
    subtitle: "Save your vehicle RC for quick access any time",
    icon: "🪪",
  },
  {
    id: 4,
    title: "Other Documents",
    subtitle: "Keep all digital document on your finger tip",
    icon: "📁",
  },
];

const AccessVehicleDoc = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔐 Security states
  const [showSecurityModal, setShowSecurityModal] = useState(true);
  const [securityCode, setSecurityCode] = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isCodeInvalid, setIsCodeInvalid] = useState(false);

  const navigate = useNavigate();
  const { qr_id } = useParams();

  // 🔥 Fetch user
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/user-details/${qr_id}`
        );

        if (!res.data.success) {
          setError(res.data.message);
        } else {
          const userData = res.data.data;
          const ageInYears = calculateAgeFromDate(userData.age);

          setUser({
            ...userData,
            age: ageInYears,
          });
        }
      } catch (error) {
        setError(error?.response?.data?.message || "Something Went Wrong");
      } finally {
        setLoading(false);
      }
    };

    if (qr_id) fetchUserDetails();
  }, [qr_id]);

  // 🔢 Handle code input
  const handleCodeChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...securityCode];
    updated[index] = value;
    setSecurityCode(updated);
    setCodeError("");

    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  // ✅ Verify code (mock for now)
  const handleVerifyCode = async () => {
    const enteredCode = securityCode.join("");

    if (enteredCode.length < 6) {
      setCodeError("Please enter 6-digit security code");
      setIsCodeInvalid(true);
      return;
    }

    // 🔥 MOCK VERIFY (replace with backend API)
    if (enteredCode === "123456") {
      setIsVerified(true);
      setShowSecurityModal(false);
      setIsCodeInvalid(false);
      setCodeError("");
    } else {
      setCodeError(
        "The security code you entered is incorrect. Please ask the owner for the correct code and try again."
      );
      setIsCodeInvalid(true);
    }
  };

  // ❌ Error
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-orange-400 text-white px-6 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ⏳ Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 max-w-md mx-auto relative">
      {/* 🔐 SECURITY MODAL */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-[90%] max-w-sm p-6 relative">
            {/* Icon */}
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto -mt-14 mb-4 text-3xl transition ${
                isCodeInvalid
                  ? "bg-red-100 text-red-500"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {isCodeInvalid ? "❌" : "🛡️"}
            </div>

            <h2 className="text-center font-semibold text-lg mb-3">
              Access the Documents
            </h2>

            {/* Code inputs */}
            <div className="flex justify-center gap-2 mb-3">
              {securityCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(e.target.value, index)}
                  className={`w-10 h-10 border rounded-lg text-center text-lg focus:outline-none ${
                    isCodeInvalid
                      ? "border-red-400 focus:ring-red-400"
                      : "focus:ring-orange-400"
                  }`}
                />
              ))}
            </div>

            {codeError && (
              <p className="text-xs text-red-500 text-center mb-2">
                {codeError}
              </p>
            )}

            <p className="text-xs text-gray-500 text-center mb-4">
              Please enter the security code provided by the owner to access the
              vehicle documents. This session will remain active for 5 minutes.
            </p>

            <button
              onClick={handleVerifyCode}
              className="w-full bg-orange-400 text-white py-2 rounded-lg font-semibold"
            >
              Access
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow">
        <button onClick={() => navigate("/")} className="text-xl">
          ←
        </button>
        <h1 className="font-semibold text-lg">Rajat Details</h1>
        <button className="text-xl">⋮</button>
      </div>

      {/* Profile */}
      <div className="px-4 py-6 flex flex-col items-center">
        <img
          src={user.profile_pic}
          alt="profile"
          className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover mb-3"
        />

        <h2 className="font-semibold text-lg">{user.full_Name}</h2>

        <div className="flex gap-3 mt-4 w-full">
          <button className="flex-1 bg-orange-400 text-white py-2 rounded-lg text-sm font-medium">
            📞 Call to Rajat
          </button>
          <button className="flex-1 bg-orange-400 text-white py-2 rounded-lg text-sm font-medium">
            💬 Chat with Rajat
          </button>
        </div>
      </div>

      {/* 📄 Documents (ONLY after verify) */}
      {isVerified && (
        <div className="p-4 space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl p-4 flex items-center justify-between shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  {doc.icon}
                </div>

                <div>
                  <h3 className="text-sm font-semibold">{doc.title}</h3>
                  <p className="text-xs text-gray-500">{doc.subtitle}</p>
                </div>
              </div>

              <button className="bg-orange-400 text-white text-xs px-4 py-1 rounded-full">
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccessVehicleDoc;
