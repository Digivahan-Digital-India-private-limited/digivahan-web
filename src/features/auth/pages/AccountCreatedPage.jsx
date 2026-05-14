import React from "react";
import { Link } from "react-router-dom";

const AccountCreatedPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-lime-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Account Created</h1>
        <p className="mt-2 text-sm text-slate-500">Your DigiVahan user account has been created successfully.</p>
        <Link to="/login" className="mt-5 inline-block rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
          Go to Login
        </Link>
      </section>
    </div>
  );
};

export default AccountCreatedPage;
