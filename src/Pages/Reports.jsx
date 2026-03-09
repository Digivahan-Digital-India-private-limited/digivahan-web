import React, { useEffect, useState } from "react";
const reportHeroImage = "/Report.webp";

const Reports = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [reportFormData, setReportFormData] = useState({
    issueType: "",
    reportTitle: "",
    reportDetails: "",
    email: "",
    phone: "",
    supportingProof: "",
  });

  useEffect(() => {
    if (isDialogOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDialogOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "supportingProof") {
      setReportFormData((prev) => ({
        ...prev,
        supportingProof: files?.[0]?.name || "",
      }));
      return;
    }

    setReportFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    setTimeout(() => {
      setLoading(false);
      setSuccess("Your report has been submitted successfully.");
      setReportFormData({
        issueType: "",
        reportTitle: "",
        reportDetails: "",
        email: "",
        phone: "",
        supportingProof: "",
      });

      setTimeout(() => {
        setIsDialogOpen(false);
        setSuccess("");
      }, 1200);
    }, 900);
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.94);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .rep-fade-up {
          animation: fadeInUp 0.7s ease-out forwards;
        }

        .rep-fade-left {
          animation: fadeInLeft 0.7s ease-out forwards;
        }

        .rep-fade-right {
          animation: fadeInRight 0.7s ease-out forwards;
        }

        .rep-delay-1 {
          animation-delay: 0.12s;
          opacity: 0;
        }

        .rep-delay-2 {
          animation-delay: 0.22s;
          opacity: 0;
        }

        .rep-delay-3 {
          animation-delay: 0.32s;
          opacity: 0;
        }

        .rep-modal {
          animation: popIn 0.28s ease-out forwards;
        }

        @keyframes slideInStep {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes badgePop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1);   opacity: 1; }
        }

        .step-card {
          opacity: 0;
          animation: slideInStep 0.55s ease-out forwards;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .step-card:nth-child(1) { animation-delay: 0.05s; }
        .step-card:nth-child(2) { animation-delay: 0.18s; }
        .step-card:nth-child(3) { animation-delay: 0.31s; }
        .step-card:nth-child(4) { animation-delay: 0.44s; }
        .step-card:nth-child(5) { animation-delay: 0.57s; }

        .step-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 16px 32px -8px rgba(234,179,8,0.18), 0 4px 12px -4px rgba(0,0,0,0.08);
        }

        .step-badge {
          animation: badgePop 0.45s ease-out forwards;
          opacity: 0;
        }
        .step-card:nth-child(1) .step-badge { animation-delay: 0.20s; }
        .step-card:nth-child(2) .step-badge { animation-delay: 0.33s; }
        .step-card:nth-child(3) .step-badge { animation-delay: 0.46s; }
        .step-card:nth-child(4) .step-badge { animation-delay: 0.59s; }
        .step-card:nth-child(5) .step-badge { animation-delay: 0.72s; }

        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes glowDot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(234,179,8,0); }
          50%       { box-shadow: 0 0 0 5px rgba(234,179,8,0.35); }
        }
        @keyframes shimmerLine {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .rep-float   { animation: floatY 4s ease-in-out infinite; }
        .rep-float-2 { animation: floatY 5s ease-in-out infinite 0.7s; }
        .glow-dot    { animation: glowDot 2s ease-in-out infinite; }
        .stat-card {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .stat-card:nth-child(1) { animation-delay: 0.4s; }
        .stat-card:nth-child(2) { animation-delay: 0.55s; }
        .stat-card:nth-child(3) { animation-delay: 0.7s; }
        .report-btn-shine {
          position: relative;
          overflow: hidden;
        }
        .report-btn-shine::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%);
          background-size: 200% 100%;
          animation: shimmerLine 2.4s linear infinite;
        }
      `}</style>

      <main className="w-full min-h-screen bg-linear-to-br from-gray-50 via-white to-yellow-50 px-4 md:px-8 py-10 md:py-14">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* ══════════════════════════════════════════
              HERO — Report
          ══════════════════════════════════════════ */}
          <section className="relative overflow-hidden rounded-2xl border border-yellow-100 shadow-xl `bg-linear-to-br from-yellow-50 via-white to-amber-50">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300/20 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-300/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
              {/* LEFT — content */}
              <div className="flex flex-col justify-center p-8 md:p-12">
                <div className="rep-fade-left">
                  {/* Badge */}
                  <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 text-xs font-bold px-3.5 py-1.5 rounded-full mb-5 border border-yellow-200">
                    <span className="glow-dot w-2 h-2 bg-yellow-500 rounded-full inline-block" />
                    Security &amp; Trust
                  </span>

                  <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                    Report an
                  </h1>
                  <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-500 leading-tight mb-6 underline underline-offset-4 decoration-yellow-300">
                    Issue
                  </h1>

                  <div className="space-y-3 text-gray-600 leading-7 text-sm md:text-base mb-8">
                    <p>
                      At Digivahan, your security, privacy, and trust are our
                      highest priorities. We are fully committed to maintaining
                      a safe and secure digital environment for all our users
                      and partners.
                    </p>
                    <p>
                      If you ever encounter any suspicious activity such as spam
                      notifications, fraudulent messages, fake emails,
                      unauthorized phone calls, or phishing attempts, we
                      strongly advise you to report it immediately through this
                      page.
                    </p>
                    <p>
                      For your safety, Digivahan never asks for OTPs, passwords,
                      or banking details via phone calls, SMS, or unofficial
                      emails. Treat such requests as suspicious and report them
                      immediately.
                    </p>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="stat-card bg-white rounded-2xl p-4 text-center shadow-sm border border-yellow-100">
                      <p className="text-2xl font-extrabold text-yellow-600">
                        24h
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">
                        Response Time
                      </p>
                    </div>
                    <div className="stat-card bg-white rounded-2xl p-4 text-center shadow-sm border border-yellow-100">
                      <p className="text-2xl font-extrabold text-yellow-600">
                        100%
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">
                        Confidential
                      </p>
                    </div>
                    <div className="stat-card bg-white rounded-2xl p-4 text-center shadow-sm border border-yellow-100">
                      <p className="text-2xl font-extrabold text-yellow-600">
                        Free
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">
                        No Charges
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="report-btn-shine inline-flex items-center gap-2 bg-yellow-500 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-yellow-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                  >
                    <span>🚩</span> Report Now
                  </button>
                </div>
              </div>

              {/* RIGHT — full-height image */}
              <div className="rep-fade-right rep-delay-1 relative min-h-100 lg:min-h-140">
                <img
                  src={reportHeroImage}
                  alt="Report Support Team"
                  className="absolute inset-0 w-full h-full object-cover lg:rounded-r-2xl"
                />
                {/* Overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent lg:rounded-r-2xl" />
                <div className="absolute inset-0 bg-linear-to-t from-yellow-50/50 via-transparent to-transparent hidden lg:block" />

                {/* Floating badge — top left */}
                <div className="rep-float absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 border border-yellow-100">
                  <div className="w-9 h-9 rounded-xl bg-yellow-500 flex items-center justify-center shadow-md shadow-yellow-300 shrink-0 text-base">
                    🛡️
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      Secure Reporting
                    </p>
                    <p className="text-xs text-gray-500">
                      End-to-end protected
                    </p>
                  </div>
                </div>

                {/* Floating badge — bottom right */}
                <div className="rep-float-2 absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 border border-green-100">
                  <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center shadow-md shadow-green-300 shrink-0 text-base">
                    ✅
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      100% Confidential
                    </p>
                    <p className="text-xs text-gray-500">
                      Your identity is safe
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rep-fade-up rep-delay-2">
            {/* Section header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-500 shadow-lg shadow-yellow-200 shrink-0">
                <span className="text-3xl">📝</span>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  How to Report
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Follow these simple steps to submit your report
                </p>
              </div>
            </div>

            {/* Step cards */}
            <div className="relative pl-0 md:pl-4 space-y-4">
              {/* Vertical timeline line — desktop only */}
              <div className="hidden md:block absolute left-10 top-5 bottom-5 w-0.5 bg-linear-to-b from-yellow-400 via-blue-300 to-green-400 rounded-full" />

              {/* Step 1 */}
              <div className="step-card group relative flex gap-5 bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm cursor-default overflow-hidden">
                <div className="absolute inset-0 bg-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="step-badge relative z-10 shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500 text-white font-bold text-xl shadow-md shadow-yellow-200">
                  1
                </div>
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">🔍</span>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-yellow-600 transition-colors duration-300">
                      Select the Issue
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    Choose the category that best matches your concern. If you
                    are unsure, select the closest option available.
                  </p>
                </div>
                <span className="absolute right-0 top-0 h-full w-1 bg-yellow-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-r-2xl" />
              </div>

              {/* Step 2 */}
              <div className="step-card group relative flex gap-5 bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm cursor-default overflow-hidden">
                <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="step-badge relative z-10 shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500 text-white font-bold text-xl shadow-md shadow-orange-200">
                  2
                </div>
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">🖱️</span>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors duration-300">
                      Click on "Report Now"
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    After selecting the issue type, click the "Report Now"
                    button to proceed.
                  </p>
                </div>
                <span className="absolute right-0 top-0 h-full w-1 bg-orange-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-r-2xl" />
              </div>

              {/* Step 3 */}
              <div className="step-card group relative flex gap-5 bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm cursor-default overflow-hidden">
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="step-badge relative z-10 shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500 text-white font-bold text-xl shadow-md shadow-blue-200">
                  3
                </div>
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">📋</span>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300">
                      Fill in the Form
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    Provide accurate details about the issue, including a clear
                    description of what happened. The more details you share,
                    the faster we can assist you.
                  </p>
                </div>
                <span className="absolute right-0 top-0 h-full w-1 bg-blue-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-r-2xl" />
              </div>

              {/* Step 4 */}
              <div className="step-card group relative flex gap-5 bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm cursor-default overflow-hidden">
                <div className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="step-badge relative z-10 shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500 text-white font-bold text-xl shadow-md shadow-purple-200">
                  4
                </div>
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">📎</span>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors duration-300">
                      Attach Supporting Proof
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    Upload screenshots, documents, call logs, or any other
                    relevant proof that supports your report. This helps our
                    team investigate effectively.
                  </p>
                </div>
                <span className="absolute right-0 top-0 h-full w-1 bg-purple-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-r-2xl" />
              </div>

              {/* Step 5 */}
              <div className="step-card group relative flex gap-5 bg-white border border-green-100 rounded-2xl p-5 md:p-6 shadow-sm cursor-default overflow-hidden">
                <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="step-badge relative z-10 shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-green-500 text-white font-bold text-xl shadow-md shadow-green-200">
                  5
                </div>
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">✅</span>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-600 transition-colors duration-300">
                      Submit &amp; Wait for Our Response
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    Once submitted, our team will review your case carefully.
                    You will receive a response after evaluation, and
                    appropriate action will be taken if required.
                  </p>
                </div>
                <span className="absolute right-0 top-0 h-full w-1 bg-green-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-r-2xl" />
              </div>
            </div>
          </section>
        </div>
      </main>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            aria-label="Close report dialog"
            onClick={() => setIsDialogOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="relative rep-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Report Form
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Share details and supporting proof for quick action.
                </p>
              </div>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full h-9 w-9 transition"
              >
                âœ•
              </button>
            </div>

            {success && (
              <p className="mb-4 rounded-lg border border-green-200 bg-green-50 text-green-700 px-4 py-2 text-sm font-medium">
                {success}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Issue Type *
                  </label>
                  <select
                    name="issueType"
                    value={reportFormData.issueType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Select issue type</option>
                    <option value="phishing">Phishing Attempt</option>
                    <option value="fake-calls">Fake Call / Fraud Call</option>
                    <option value="fake-email">Fake Email / Message</option>
                    <option value="spam">Spam Notification</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Report Title *
                  </label>
                  <input
                    type="text"
                    name="reportTitle"
                    value={reportFormData.reportTitle}
                    onChange={handleChange}
                    placeholder="Short issue title"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={reportFormData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={reportFormData.phone}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Report Details *
                </label>
                <textarea
                  rows="5"
                  name="reportDetails"
                  value={reportFormData.reportDetails}
                  onChange={handleChange}
                  placeholder="Explain what happened, where, and when."
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Attach Supporting Proof
                </label>
                <input
                  type="file"
                  name="supportingProof"
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 file:mr-4 file:py-1.5 file:px-3 file:border-0 file:rounded file:bg-yellow-100 file:text-yellow-700"
                />
                {reportFormData.supportingProof && (
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {reportFormData.supportingProof}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Reports;
