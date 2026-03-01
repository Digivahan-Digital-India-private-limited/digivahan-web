import React, { useEffect, useState } from "react";
import reportHeroImage from "../assets/visitus-2.png";

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
      `}</style>

      <main className="w-full min-h-screen bg-linear-to-br from-gray-50 via-white to-yellow-50 px-4 md:px-8 py-10 md:py-14">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="bg-white/90 border border-gray-200 rounded-xl shadow-sm p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
              <div className="rep-fade-left">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 underline underline-offset-8 decoration-2 mb-6">
                  Report
                </h1>

                <div className="space-y-3 text-gray-700 leading-7">
                  <p>
                    At Digivahan, your security, privacy, and trust are our
                    highest priorities. We are fully committed to maintaining a
                    safe and secure digital environment for all our users and
                    partners.
                  </p>
                  <p>
                    If you ever encounter any suspicious activity related to
                    Digivahan â€” such as spam notifications, fraudulent
                    messages, fake emails, unauthorized phone calls, phishing
                    attempts, or any communication claiming to represent
                    Digivahan â€” we strongly advise you to report it immediately
                    through this page.
                  </p>
                  <p>
                    Please do not ignore such incidents. Reporting them helps
                    us take swift action and protect not only you but also
                    other users from potential misuse or fraud.
                  </p>
                  <p>
                    Once your report is submitted, our security and support
                    team will carefully review the details, investigate the
                    matter thoroughly, and take appropriate corrective or legal
                    action wherever necessary.
                  </p>
                  <p>
                    For your safety, please note that Digivahan never asks for
                    OTPs, passwords, banking details, or any confidential
                    information via phone calls, SMS, or unofficial emails.
                    If you receive such requests, treat them as suspicious and
                    report them immediately.
                  </p>
                  <p>
                    We sincerely appreciate your cooperation in helping us
                    maintain a secure, transparent, and trustworthy platform for
                    everyone.
                  </p>
                </div>

                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="mt-7 bg-yellow-500 text-white px-7 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  Report Now
                </button>
              </div>

              <div className="rep-fade-right rep-delay-1">
                <div className="relative rounded-2xl border border-gray-200 bg-white shadow-lg p-3">
                  <img
                    src={reportHeroImage}
                    alt="Report Support Team"
                    className="rounded-xl w-full h-auto object-cover"
                  />
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How to Report</h2>
                <p className="text-gray-500 text-sm mt-1">Follow these simple steps to submit your report</p>
              </div>
            </div>

            {/* Step cards */}
            <div className="relative pl-0 md:pl-4 space-y-4">
              {/* Vertical timeline line — desktop only */}
              <div className="hidden md:block absolute left-10 top-5 bottom-5 w-0.5 bg-linear-to-b from-yellow-400 via-blue-300 to-green-400 rounded-full" />

              {/* Step 1 */}
              <div className="step-card group relative flex gap-5 bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm cursor-default overflow-hidden">
                <div className="absolute inset-0 bg-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="step-badge relative z-10 shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500 text-white font-bold text-xl shadow-md shadow-yellow-200">1</div>
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">🔍</span>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-yellow-600 transition-colors duration-300">Select the Issue</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">Choose the category that best matches your concern. If you are unsure, select the closest option available.</p>
                </div>
                <span className="absolute right-0 top-0 h-full w-1 bg-yellow-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-r-2xl" />
              </div>

              {/* Step 2 */}
              <div className="step-card group relative flex gap-5 bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm cursor-default overflow-hidden">
                <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="step-badge relative z-10 shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500 text-white font-bold text-xl shadow-md shadow-orange-200">2</div>
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">🖱️</span>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors duration-300">Click on "Report Now"</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">After selecting the issue type, click the "Report Now" button to proceed.</p>
                </div>
                <span className="absolute right-0 top-0 h-full w-1 bg-orange-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-r-2xl" />
              </div>

              {/* Step 3 */}
              <div className="step-card group relative flex gap-5 bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm cursor-default overflow-hidden">
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="step-badge relative z-10 shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500 text-white font-bold text-xl shadow-md shadow-blue-200">3</div>
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">📋</span>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300">Fill in the Form</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">Provide accurate details about the issue, including a clear description of what happened. The more details you share, the faster we can assist you.</p>
                </div>
                <span className="absolute right-0 top-0 h-full w-1 bg-blue-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-r-2xl" />
              </div>

              {/* Step 4 */}
              <div className="step-card group relative flex gap-5 bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm cursor-default overflow-hidden">
                <div className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="step-badge relative z-10 shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500 text-white font-bold text-xl shadow-md shadow-purple-200">4</div>
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">📎</span>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors duration-300">Attach Supporting Proof</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">Upload screenshots, documents, call logs, or any other relevant proof that supports your report. This helps our team investigate effectively.</p>
                </div>
                <span className="absolute right-0 top-0 h-full w-1 bg-purple-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-r-2xl" />
              </div>

              {/* Step 5 */}
              <div className="step-card group relative flex gap-5 bg-white border border-green-100 rounded-2xl p-5 md:p-6 shadow-sm cursor-default overflow-hidden">
                <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="step-badge relative z-10 shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-green-500 text-white font-bold text-xl shadow-md shadow-green-200">5</div>
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">✅</span>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-600 transition-colors duration-300">Submit &amp; Wait for Our Response</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">Once submitted, our team will review your case carefully. You will receive a response after evaluation, and appropriate action will be taken if required.</p>
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
