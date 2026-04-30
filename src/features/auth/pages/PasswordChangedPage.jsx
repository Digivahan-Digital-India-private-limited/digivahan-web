import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const PasswordChangedPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-lime-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={30} />
        </div>
        <h1 className="mt-4 text-xl font-bold text-slate-900">Password Updated</h1>
        <p className="mt-2 text-sm text-slate-500">Your password has been changed successfully.</p>
        <Link to="/login" className="mt-5 inline-block rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
          Back to Login
        </Link>
      </section>
    </div>
  );
};

export default PasswordChangedPage;
