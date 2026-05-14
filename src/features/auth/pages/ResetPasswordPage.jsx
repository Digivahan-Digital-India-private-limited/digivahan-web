import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/password-reset/changed", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-lime-50 px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Reset Password</h1>
        <p className="text-sm text-slate-500">Enter your registered email or mobile to reset your password.</p>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email or Mobile"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          required
        />
        <button type="submit" className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
          Send Reset Link
        </button>
        <Link to="/login" className="block text-center text-sm font-semibold text-emerald-700 hover:text-emerald-800">
          Back to Login
        </Link>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
