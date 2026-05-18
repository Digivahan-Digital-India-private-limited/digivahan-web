import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Loader2, ArrowLeft, KeyRound, ShieldAlert } from "lucide-react";
import { 
  changePassword, 
  getProfile, 
  requestPasswordReset, 
  verifyPasswordResetOtp 
} from "../services/profileApi";

const ChangePasswordPage = () => {
  // Mode: 'change' (default) | 'forgot_pwd' | 'forgot_otp'
  const [mode, setMode] = useState("change");
  
  // Change Password form state
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Forgot Password flow state
  const [forgotPassword, setForgotPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // Fetch profile to get the user's registered phone number
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile
  });

  // Mutation 1: Change Password (Normal authenticated flow)
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      toast.success(data?.message || "Password changed successfully");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to change password. Please check your credentials."
      );
    },
  });

  // Mutation 2: Request Password Reset (Sends OTP to mobile)
  const requestResetMutation = useMutation({
    mutationFn: (phone) => requestPasswordReset(phone),
    onSuccess: (data) => {
      toast.success(data?.message || "Verification code sent to your registered mobile number!");
      setMode("forgot_otp");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send verification code. Please try again."
      );
    },
  });

  // Mutation 3: Verify OTP & Reset Password
  const verifyResetMutation = useMutation({
    mutationFn: (payload) => verifyPasswordResetOtp(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Your new password has been verified and saved successfully!");
      setMode("change");
      setForgotPassword("");
      setOtpCode("");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Verification failed. Please check the OTP and try again."
      );
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNormalSubmit = (event) => {
    event.preventDefault();

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password should match");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error("New password cannot be same as old password");
      return;
    }

    changePasswordMutation.mutate(formData);
  };

  // Step 1 of Forgot Password: Confirm Password -> Sends OTP to phone number
  const handleForgotConfirmPasswordSubmit = (event) => {
    event.preventDefault();

    if (forgotPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    const phone = profile?.phone || profile?.phone_number;
    if (!phone) {
      toast.error("Registered mobile number not found. Please contact support.");
      return;
    }

    requestResetMutation.mutate(phone);
  };

  // Step 2 of Forgot Password: Enter OTP -> Verifies & Saves New Password
  const handleForgotOtpSubmit = (event) => {
    event.preventDefault();

    const phone = profile?.phone || profile?.phone_number;
    if (!phone) {
      toast.error("Registered mobile number not found.");
      return;
    }

    if (otpCode.length !== 4) {
      toast.error("Verification code must be exactly 4 digits");
      return;
    }

    verifyResetMutation.mutate({
      phone,
      otp: otpCode,
      newPassword: forgotPassword
    });
  };

  // Loading indicator for background operations
  const isPending = 
    changePasswordMutation.isPending || 
    requestResetMutation.isPending || 
    verifyResetMutation.isPending;

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* 1. CHANGE PASSWORD MODE (NORMAL FLOW) */}
      {mode === "change" && (
        <form onSubmit={handleNormalSubmit} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <KeyRound size={20} className="text-emerald-600" />
              Change Password
            </h2>
            <p className="text-sm text-slate-500">Ensure your account is using a long, random password to stay secure.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Current Password</label>
              <input
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Current Password"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-50"
                required
                disabled={isPending}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">New Password</label>
              <input
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-50"
                required
                disabled={isPending}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Confirm New Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm New Password"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-50"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-600/70 transition w-full sm:w-auto"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setForgotPassword("");
                setMode("forgot_pwd");
              }}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 text-center transition"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      )}

      {/* 2. FORGOT PASSWORD MODE - STEP 1: ENTER NEW PASSWORD */}
      {mode === "forgot_pwd" && (
        <form onSubmit={handleForgotConfirmPasswordSubmit} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <ShieldAlert size={20} className="text-emerald-600" />
              Reset Password via OTP
            </h2>
            <p className="text-sm text-slate-500">
              Enter your desired new password. We will send a verification code to your registered mobile number:{" "}
              <span className="font-semibold text-slate-800">
                {isProfileLoading ? "Loading..." : profile?.phone || profile?.phone_number || "N/A"}
              </span>
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Enter your new password</label>
              <input
                type="password"
                value={forgotPassword}
                onChange={(e) => setForgotPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-50"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending || isProfileLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-600/70 transition w-full sm:w-auto"
            >
              {requestResetMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Confirm Password"
              )}
            </button>

            <button
              type="button"
              onClick={() => setMode("change")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition self-center"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
        </form>
      )}

      {/* 3. FORGOT PASSWORD MODE - STEP 2: VERIFY OTP */}
      {mode === "forgot_otp" && (
        <form onSubmit={handleForgotOtpSubmit} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <ShieldAlert size={20} className="text-emerald-600" />
              Verify Mobile OTP
            </h2>
            <p className="text-sm text-slate-500">
              Please enter the 4-digit verification code sent to your registered mobile number:{" "}
              <span className="font-semibold font-mono text-emerald-700">
                {profile?.phone || profile?.phone_number}
              </span>
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Enter 4-Digit OTP</label>
              <input
                type="text"
                maxLength={4}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="----"
                className="w-full text-center tracking-[1em] text-lg font-bold rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-emerald-500 disabled:bg-slate-50"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-600/70 transition w-full sm:w-auto"
            >
              {verifyResetMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving Password...
                </>
              ) : (
                "Verify & Save Password"
              )}
            </button>

            <button
              type="button"
              onClick={() => setMode("forgot_pwd")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition self-center"
            >
              <ArrowLeft size={16} />
              Change Password Input
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChangePasswordPage;
