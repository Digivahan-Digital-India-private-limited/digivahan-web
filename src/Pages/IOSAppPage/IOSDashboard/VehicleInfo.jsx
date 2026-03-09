import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";

export default function VehicleInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const vehicle = location.state?.vehicle || {
    name: "SUZUKI SUPER Bike",
    plate: "DL8SCJ2416",
    type: "BIKE",
    ownership: "First Owner",
    image: "/Bike Image.png",
    pucExpired: true,
    insuranceExpired: true,
  };

  const [activeTab, setActiveTab] = useState("Details");
  const tabs = ["Details", "Documents", "My Virtual RC"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Status Bar ─────────────────────────────────── */}
      <div className="bg-white px-5 pt-3 pb-1 flex justify-between items-center text-[11px] font-semibold text-gray-800">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <rect x="0" y="4" width="2.5" height="6" rx="0.5" fill="#111" />
            <rect x="3.5" y="2.5" width="2.5" height="7.5" rx="0.5" fill="#111" />
            <rect x="7" y="1" width="2.5" height="9" rx="0.5" fill="#111" />
            <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="#111" />
          </svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
            <path d="M7.5 2.5C9.5 2.5 11.3 3.3 12.6 4.6L14 3.2C12.3 1.5 10 0.5 7.5 0.5C5 0.5 2.7 1.5 1 3.2L2.4 4.6C3.7 3.3 5.5 2.5 7.5 2.5Z" fill="#111" />
            <path d="M7.5 5.5C8.8 5.5 10 6 10.9 6.9L12.3 5.5C11 4.2 9.4 3.5 7.5 3.5C5.6 3.5 4 4.2 2.7 5.5L4.1 6.9C5 6 6.2 5.5 7.5 5.5Z" fill="#111" />
            <circle cx="7.5" cy="9.5" r="1.5" fill="#111" />
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#111" strokeOpacity="0.35" />
            <rect x="2" y="2" width="17" height="8" rx="2" fill="#111" />
            <path d="M23 4v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4" />
          </svg>
        </div>
      </div>

      {/* ── Top Nav ─────────────────────────────────────── */}
      <div className="bg-white px-4 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <h1 className="text-[17px] font-bold text-gray-900 mx-auto pr-8">My Garage</h1>
      </div>

      {/* ── Red Hero Section ─────────────────────────────── */}
      <div className="bg-linear-to-b from-red-500 to-red-400 px-4 pt-3 pb-6">
        <div className="bg-white rounded-2xl shadow-md px-4 pt-4 pb-3">
          {/* Vehicle info row */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-gray-900">User Name</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {vehicle.plate}&nbsp;&nbsp;
                <span className="text-gray-400">{vehicle.ownership || "First Owner"}</span>
              </p>
              <p className="text-[13px] font-semibold text-gray-700 mt-1">{vehicle.name}</p>
              {/* Expired badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                {vehicle.pucExpired && (
                  <span className="bg-red-100 text-red-500 text-[10px] font-bold px-2.5 py-1 rounded-md">
                    PUC EXPIRED
                  </span>
                )}
                {vehicle.insuranceExpired && (
                  <span className="bg-red-100 text-red-500 text-[10px] font-bold px-2.5 py-1 rounded-md border border-red-200">
                    Insurance EXPIRED
                  </span>
                )}
              </div>
            </div>
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-28 h-20 object-contain shrink-0"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 my-3" />

          {/* Action buttons */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white text-[11px] font-semibold py-2.5 rounded-full active:scale-95 transition">
              <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="10" cy="8" r="5" />
                <path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" strokeLinecap="round" />
              </svg>
              Check challan
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white text-[11px] font-semibold py-2.5 rounded-full active:scale-95 transition">
              <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="14" height="10" rx="2" />
                <path d="M7 5V4a1 1 0 011-1h4a1 1 0 011 1v1M10 9v3M8 11l2 2 2-2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Refresh Data
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────── */}
      <div className="flex border-b border-gray-200 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[13px] font-semibold transition ${
              activeTab === tab
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab Content ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10">

        {/* ── Details Tab ──────────────────────────────── */}
        {activeTab === "Details" && (
          <div className="space-y-4">
            {/* Insurance Details – Expired */}
            <div className="bg-red-50 border border-red-100 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-gray-900">Insurance Details</span>
                  <span className="text-[10px] font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-md">Expired</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth="2">
                    <path d="M3 8l4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div className="px-4 pb-4 space-y-2">
                <div>
                  <p className="text-[11px] text-gray-400">Insurer name</p>
                  <p className="text-[13px] font-medium text-gray-800">Acko General insurance limited</p>
                </div>
                <div className="bg-red-100 rounded-xl px-3 py-2">
                  <p className="text-[11px] text-gray-500">Insurance expire ( 179 days ago )</p>
                  <p className="text-[13px] font-semibold text-red-500">28 – Aug – 2024</p>
                </div>
                <button className="mt-1 w-full bg-gray-700 hover:bg-gray-800 text-white text-[12px] font-semibold py-2.5 rounded-full active:scale-95 transition">
                  Renew Now
                </button>
              </div>
            </div>

            {/* Pollution Details – Expired */}
            <div className="bg-red-50 border border-red-100 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-gray-900">Pollution Details</span>
                  <span className="text-[10px] font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-md">Expired</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth="2">
                    <path d="M3 8l4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div className="px-4 pb-4 space-y-2">
                <div>
                  <p className="text-[11px] text-gray-400">PUC expiring</p>
                  <p className="text-[13px] font-semibold text-red-500">28 – Aug – 2024</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">Pollution up to</p>
                  <p className="text-[13px] font-semibold text-red-500">-1 year &amp; - 6 month</p>
                </div>
                <button className="mt-1 w-full bg-gray-700 hover:bg-gray-800 text-white text-[12px] font-semibold py-2.5 rounded-full active:scale-95 transition">
                  Find nearest PUC center
                </button>
              </div>
            </div>

            {/* Registration Details – Normal */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <span className="text-[14px] font-bold text-gray-900">Registration details</span>
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth="2">
                    <path d="M3 8l4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <p className="text-[11px] text-gray-400">Registration date</p>
                  <p className="text-[13px] font-medium text-gray-800">19 – Feb – 2010</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">Registered RTO</p>
                  <p className="text-[13px] font-medium text-gray-800">HARIDRAR ARTO, UTTARAKHAND</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Documents Tab ────────────────────────────── */}
        {activeTab === "Documents" && (
          <div className="space-y-4 pt-2">
            {[
              {
                icon: (
                  <svg viewBox="0 0 40 40" className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="8" y="4" width="20" height="26" rx="2" />
                    <path d="M12 10h12M12 14h12M12 18h8" strokeLinecap="round" />
                    <circle cx="26" cy="28" r="6" strokeWidth="1.8" />
                    <path d="M23 28l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: "Insurance",
                desc: "Keep your vehicle secured with valid insurance",
              },
              {
                icon: (
                  <svg viewBox="0 0 40 40" className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 8c-6 0-10 5-10 10 0 4 2 7 5 9l1 5h8l1-5c3-2 5-5 5-9 0-5-4-10-10-10z" />
                    <path d="M16 34h8" strokeLinecap="round" />
                    <path d="M20 14v6M17 17l6 0" strokeLinecap="round" />
                  </svg>
                ),
                title: "Pollution",
                desc: "Keep PUC certificate handy",
              },
              {
                icon: (
                  <svg viewBox="0 0 40 40" className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="5" y="10" width="30" height="20" rx="3" />
                    <path d="M5 16h30M10 22h6M10 26h4" strokeLinecap="round" />
                    <rect x="22" y="20" width="8" height="6" rx="1" />
                  </svg>
                ),
                title: "Registration Certificate",
                desc: "Save your vehicle RC for Quick access any time",
              },
              {
                icon: (
                  <svg viewBox="0 0 40 40" className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="8" y="4" width="24" height="32" rx="2" />
                    <path d="M13 12h14M13 17h14M13 22h10" strokeLinecap="round" />
                    <path d="M24 28l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: "Other Documents",
                desc: "Keep your all digital document on your finger tip",
              },
            ].map((doc) => (
              <div
                key={doc.title}
                className="bg-white rounded-2xl border border-gray-200 px-4 py-4 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  {doc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-gray-900">{doc.title}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5 leading-snug">{doc.desc}</p>
                  <button className="mt-2.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white text-[12px] font-semibold px-5 py-1.5 rounded-full transition">
                    Upload
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── My Virtual RC Tab ────────────────────────── */}
        {activeTab === "My Virtual RC" && (
          <div className="flex flex-col items-center justify-center pt-8 pb-6 text-center px-2">
            {/* Illustration */}
            <svg viewBox="0 0 280 220" className="w-64 h-auto mb-6" fill="none">
              {/* Background trees */}
              <ellipse cx="60" cy="130" rx="30" ry="22" fill="#d1fae5" />
              <rect x="56" y="130" width="8" height="20" rx="2" fill="#6ee7b7" />
              <ellipse cx="220" cy="120" rx="25" ry="18" fill="#d1fae5" />
              <rect x="216" y="120" width="8" height="18" rx="2" fill="#6ee7b7" />
              {/* Small clouds */}
              <ellipse cx="50" cy="60" rx="20" ry="12" fill="#f0fdf4" opacity="0.7" />
              <ellipse cx="230" cy="70" rx="18" ry="10" fill="#f0fdf4" opacity="0.7" />
              {/* Main green platform/cloud */}
              <ellipse cx="140" cy="160" rx="70" ry="28" fill="#22c55e" />
              <ellipse cx="140" cy="152" rx="55" ry="22" fill="#16a34a" />
              {/* Person body */}
              <circle cx="140" cy="100" r="14" fill="#fde68a" />
              {/* Hair */}
              <path d="M128 96 Q130 84 140 84 Q150 84 152 96" fill="#1f2937" />
              {/* Body */}
              <rect x="128" y="114" width="24" height="22" rx="6" fill="#6ee7b7" />
              {/* Crossed legs */}
              <ellipse cx="132" cy="142" rx="10" ry="6" fill="#1f2937" />
              <ellipse cx="148" cy="142" rx="10" ry="6" fill="#1f2937" />
              {/* Phone in hand */}
              <rect x="152" y="118" width="12" height="16" rx="2" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
              <rect x="154" y="120" width="8" height="10" rx="1" fill="#bbf7d0" />
              {/* Download arrows */}
              <g stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M100 40 L100 58 M94 52 L100 58 L106 52" />
              </g>
              <g stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M140 20 L140 38 M134 32 L140 38 L146 32" />
              </g>
              <g stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M180 40 L180 58 M174 52 L180 58 L186 52" />
              </g>
              {/* Small document icon near phone */}
              <rect x="88" y="78" width="18" height="22" rx="2" fill="white" stroke="#d1d5db" strokeWidth="1" />
              <path d="M92 84h10M92 88h10M92 92h6" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" />
              {/* Ground shadow */}
              <ellipse cx="140" cy="186" rx="65" ry="8" fill="#bbf7d0" opacity="0.5" />
            </svg>

            <h2 className="text-[18px] font-bold text-gray-900 mb-2">Download Virtual RC</h2>
            <p className="text-[13px] text-gray-400 leading-relaxed max-w-xs">
              Download your virtual RC in the form of PDF in your devoice in just one click.
            </p>

            <button className="mt-8 w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-[15px] font-semibold py-4 rounded-full shadow-md transition-all">
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
