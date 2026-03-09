import React, { useState, useEffect, useRef } from "react";
import { Bell, LogOut, QrCode, Car, FileText, CreditCard, Download, Home as HomeIcon, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QR_SCAN_STYLES = `
@keyframes qr-scanline {
  0%   { top: 8px;  opacity: 1; }
  45%  { top: calc(100% - 10px); opacity: 1; }
  50%  { top: calc(100% - 10px); opacity: 0; }
  55%  { top: 8px; opacity: 0; }
  60%  { top: 8px; opacity: 1; }
  100% { top: 8px; opacity: 1; }
}
@keyframes qr-corner-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
.qr-scanline-anim { animation: qr-scanline 2s linear infinite; }
.qr-corner-anim   { animation: qr-corner-pulse 2s ease-in-out infinite; }
`;

const QR_SLIDES = [
  {
    id: 1,
    image: "/elementor-placeholder-image 1.png",
    label: "Scan QR on any vehicle",
    sublabel: "Point your camera at the QR sticker",
  },
  {
    id: 2,
    image: "/elementor-placeholder-image 1.png",
    label: "Accident? Scan QR to find owner",
    sublabel: "Instantly get vehicle owner details",
  },
  {
    id: 3,
    image: "/elementor-placeholder-image 1.png",
    label: "Contact owner instantly",
    sublabel: "Call or message the owner directly",
  },
];

const MyGarage = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveSlide((p) => (p + 1) % QR_SLIDES.length);
    }, 2800);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!sliderRef.current) return;
    const el = sliderRef.current;
    const child = el.firstElementChild;
    if (!child) return;
    el.scrollTo({ left: activeSlide * (child.offsetWidth + 12), behavior: "smooth" });
  }, [activeSlide]);

  const onScroll = () => {
    if (!sliderRef.current) return;
    const el = sliderRef.current;
    const child = el.firstElementChild;
    if (!child) return;
    const idx = Math.round(el.scrollLeft / (child.offsetWidth + 12));
    if (idx !== activeSlide) { setActiveSlide(idx); startTimer(); }
  };

  const features = [
    { id: 1, name: "Scan QR Code",  icon: <QrCode       className="w-6 h-6" />, route: null },
    { id: 2, name: "check Vehicle", icon: <Car           className="w-6 h-6" />, route: null },
    { id: 3, name: "Check challan", icon: <FileText      className="w-6 h-6" />, route: null },
    { id: 4, name: "Fast Tag",      icon: <CreditCard    className="w-6 h-6" />, route: null },
    { id: 5, name: "Activate QR",   icon: <QrCode        className="w-6 h-6" />, route: null },
    { id: 6, name: "My Garage",     icon: <HomeIcon      className="w-6 h-6" />, route: "/ios/my-garage" },
    { id: 7, name: "Download QR",   icon: <Download      className="w-6 h-6" />, route: null },
    { id: 8, name: "Order QR",      icon: <ShoppingCart  className="w-6 h-6" />, route: null },
  ];

  return (
    <>
      <style>{QR_SCAN_STYLES}</style>
      <div className="min-h-screen bg-white">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="sticky top-0 z-10 bg-white px-4 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/ios/profile")} className="relative">
                <img
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-green-500"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
              </button>
              <h1 className="font-semibold text-gray-900 text-base">Home</h1>
            </div>
            <button onClick={() => navigate("/ios/notifications")} className="p-1">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* ── Main Content ─────────────────────────────────────── */}
        <div className="px-4 pt-5 pb-8">

          {/* ── QR Banner Image ───────────────────────────────── */}
          <div className="mb-6 rounded-2xl overflow-hidden shadow-sm">
            <img
              src="/Smart QR Feature/Group 513287.png"
              alt="Scan QR Code"
              className="w-full object-cover"
            />
          </div>

          {/* ── Feature Grid 4×2 — circular icons + bg blobs ─── */}
          <div className="relative mb-7 overflow-hidden">
            {/* Decorative green blobs */}
            <div className="absolute top-1/4 right-0 w-24 h-24 bg-green-100 rounded-full translate-x-8 pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-20 h-20 bg-green-100 rounded-full -translate-x-6 pointer-events-none" />

            <div className="relative grid grid-cols-4 gap-y-5 gap-x-2">
              {features.map((f) => (
                <button
                  key={f.id}
                  onClick={() => f.route ? navigate(f.route) : console.log(f.name)}
                  className="flex flex-col items-center active:scale-95 transition-transform"
                >
                  <div className="w-14 h-14 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center mb-1.5 text-green-700">
                    {f.icon}
                  </div>
                  <span className="text-[9.5px] text-gray-700 text-center font-medium leading-tight">
                    {f.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── How to use QR — peek carousel ─────────────────── */}
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-3">How to use QR</h3>

            <div
              ref={sliderRef}
              onScroll={onScroll}
              className="flex overflow-x-auto snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none", gap: 12, paddingRight: 32 }}
            >
              {QR_SLIDES.map((slide) => (
                <div
                  key={slide.id}
                  className="relative snap-start flex-shrink-0 rounded-2xl overflow-hidden shadow-sm"
                  style={{ width: "calc(100% - 44px)" }}
                >
                  <img
                    src={slide.image}
                    alt={slide.label}
                    className="w-full h-48 object-cover object-center"
                    onError={(e) => {
                      e.target.src = `/Smart QR Feature/Group 513287.png`;
                    }}
                  />
                  {/* caption overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                    <p className="text-white text-[13px] font-semibold leading-tight">{slide.label}</p>
                    {slide.sublabel && <p className="text-white/80 text-[11px] mt-0.5">{slide.sublabel}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-3">
              {QR_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveSlide(i); startTimer(); }}
                  className={`rounded-full transition-all duration-300 ${i === activeSlide ? "w-5 h-[7px] bg-green-600" : "w-[7px] h-[7px] bg-gray-300"}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default MyGarage;
