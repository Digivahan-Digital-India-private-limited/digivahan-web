import React, { useEffect, useRef, useState } from "react";

const Explorepage = () => {
  const [visible, setVisible] = useState({});
  const refs = useRef({});

  useEffect(() => {
    const observers = {};
    Object.entries(refs.current).forEach(([key, el]) => {
      if (!el) return;
      observers[key] = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({ ...prev, [key]: true }));
            observers[key].disconnect();
          }
        },
        { threshold: 0.12 }
      );
      observers[key].observe(el);
    });
    return () => Object.values(observers).forEach((o) => o.disconnect());
  }, []);

  const setRef = (key) => (el) => {
    refs.current[key] = el;
  };

  const isV = (key) => visible[key];

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes badgeSlide {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes videoPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(234,179,8,0.35); }
          50%       { box-shadow: 0 0 0 14px rgba(234,179,8,0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes iconBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(234,179,8,0.3); box-shadow: 0 0 20px rgba(234,179,8,0.1); }
          50% { border-color: rgba(234,179,8,0.8); box-shadow: 0 0 30px rgba(234,179,8,0.3); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px) rotate(-2deg); }
          to { opacity: 1; transform: translateX(0) rotate(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px) rotate(2deg); }
          to { opacity: 1; transform: translateX(0) rotate(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .exp-fade-up   { opacity: 0; }
        .exp-fade-left { opacity: 0; }
        .exp-fade-right{ opacity: 0; }
        .exp-pop       { opacity: 0; }
        .exp-slide-left { opacity: 0; }
        .exp-slide-right { opacity: 0; }
        .exp-fade-up.visible   { animation: fadeUp   0.65s ease forwards; }
        .exp-fade-left.visible { animation: fadeLeft 0.65s ease forwards; }
        .exp-fade-right.visible{ animation: fadeRight 0.65s ease forwards; }
        .exp-pop.visible       { animation: popIn   0.55s ease forwards; }
        .exp-slide-left.visible { animation: slideInLeft 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .exp-slide-right.visible { animation: slideInRight 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.18s; }
        .d3 { animation-delay: 0.31s; }
        .d4 { animation-delay: 0.44s; }
        .d5 { animation-delay: 0.57s; }
        .d6 { animation-delay: 0.70s; }

        .feature-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.5s ease;
        }
        .feature-card:hover::before {
          left: 100%;
        }
        .feature-card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(234,179,8,0.2);
        }
        .feature-card:hover .feature-icon {
          animation: iconBounce 0.6s ease;
        }
        .feature-icon {
          transition: all 0.3s ease;
        }
        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
        }
        .perm-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }
        .perm-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b);
          background-size: 200% 100%;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }
        .perm-card:hover::after {
          transform: scaleX(1);
          animation: gradientMove 2s linear infinite;
        }
        .perm-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
        .perm-card:hover .perm-icon {
          animation: float 2s ease-in-out infinite;
        }
        .perm-icon {
          transition: all 0.3s ease;
        }
        .video-box {
          animation: videoPulse 2.5s infinite;
        }
        .badge-anim {
          animation: badgeSlide 0.5s ease forwards;
        }
        .underline-anim {
          position: relative;
        }
        .underline-anim::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
          border-radius: 2px;
          animation: shimmer 2s linear infinite;
          background-size: 200% 100%;
        }
      `}</style>

      <div className="w-full bg-gray-50 min-h-screen">

        {/* ─────────────── VIDEO PLACEHOLDER ─────────────── */}
        <section className="w-full bg-white py-10 px-4">
          <div
            ref={setRef("video")}
            className={`exp-fade-up ${isV("video") ? "visible" : ""} max-w-4xl mx-auto`}
          >
            <div className="video-box relative rounded-2xl overflow-hidden aspect-video flex flex-col items-center justify-center cursor-pointer group shadow-xl">
              {/* Background dummy image */}
              <img 
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=675&fit=crop" 
                alt="Digivahan App Preview" 
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-br from-gray-900/60 via-gray-800/50 to-gray-900/70" />
              
              {/* Animated play button */}
              <div className="relative z-10 w-24 h-24 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-yellow-500/90 flex items-center justify-center transition-all duration-500 mb-4 group-hover:scale-110 shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" style={{animationDuration: '2s'}} />
                <svg className="w-10 h-10 text-white translate-x-1 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
                </svg>
              </div>
              <p className="relative z-10 text-white font-bold text-xl tracking-wide drop-shadow-lg">Video Here</p>
              <p className="relative z-10 text-gray-200 text-sm mt-2 font-medium">Digivahan — App Introduction</p>
              
              {/* Corner decorations with animation */}
              <span className="absolute top-4 left-4 w-10 h-10 border-t-3 border-l-3 border-yellow-400 rounded-tl-xl transition-all duration-300 group-hover:w-14 group-hover:h-14" style={{borderWidth: '3px'}} />
              <span className="absolute top-4 right-4 w-10 h-10 border-t-3 border-r-3 border-yellow-400 rounded-tr-xl transition-all duration-300 group-hover:w-14 group-hover:h-14" style={{borderWidth: '3px'}} />
              <span className="absolute bottom-4 left-4 w-10 h-10 border-b-3 border-l-3 border-yellow-400 rounded-bl-xl transition-all duration-300 group-hover:w-14 group-hover:h-14" style={{borderWidth: '3px'}} />
              <span className="absolute bottom-4 right-4 w-10 h-10 border-b-3 border-r-3 border-yellow-400 rounded-br-xl transition-all duration-300 group-hover:w-14 group-hover:h-14" style={{borderWidth: '3px'}} />
            </div>
          </div>
        </section>

        {/* ─────────────── HERO SECTION ─────────────── */}
        <section className="w-full bg-white py-12 px-4 border-t border-gray-100">
          <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">

            {/* Left — text */}
            <div
              ref={setRef("heroText")}
              className={`exp-fade-left ${isV("heroText") ? "visible" : ""} flex-1`}
            >
              {/* Logo */}
              <img
                src="/Tranparent Logo In Black 1.svg"
                alt="Digivahan"
                className="h-12 mb-5"
                onError={(e) => { e.target.src = "/logo.png"; }}
              />

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug mb-4">
                Your Smart Vehicle Companion —{" "}
                <span className="text-yellow-500">Everything About Vehicles in One App</span>
              </h1>
              <p className="text-gray-600 leading-relaxed mb-3">
                Digivahan brings all your vehicle needs into one powerful and easy-to-use platform. From scanning QR codes to instantly accessing vehicle details, managing documents, and staying updated with the latest automotive information — everything is just a tap away.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you want to connect with a vehicle owner, check registration details, explore garage services, or track important updates, Digivahan makes the entire process smooth, secure, and efficient.
              </p>
              <p className="text-gray-600 leading-relaxed mt-3">
                With modern technology and a user-friendly interface, Digivahan ensures that managing your vehicle is no longer complicated — it's smart, fast, and reliable.<br />
                <span className="font-semibold text-gray-800">One App. Complete Vehicle Control.</span>
              </p>

              {/* Store badges */}
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="badge-anim flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.36c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 4.03ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z"/></svg>
                  App Store
                </span>
                <a href="https://play.google.com/store/apps/details?id=com.digivahan" target="_blank" rel="noopener noreferrer" className="badge-anim flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-700 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="m3.18 23.76 10.64-10.64-2.22-2.22L3.18 23.76Zm14.73-12.7L15.4 9.49l-4.5 2.59 2.22 2.22 4.79-2.24Zm-14.73-9.82 8.42 8.42-2.22 2.22L3.18 1.24Zm12.22 7.29L12.9 6.12l2.5-1.44 3.73 2.11-3.73 2.74Z"/></svg>
                  Google Play
                </a>
              </div>
            </div>

            {/* Right — phone image */}
            <div
              ref={setRef("heroImg")}
              className={`exp-fade-right ${isV("heroImg") ? "visible" : ""} flex-1 flex justify-center`}
            >
              <div className="relative">
                {/* Glow blob */}
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-3xl scale-110" />
                <img
                  src="/Explore page.png"
                  alt="Digivahan App in use"
                  className="relative z-10 w-full max-w-xs md:max-w-sm rounded-3xl drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── OUR TOP FEATURES ─────────────── */}
        <section className="w-full py-16 px-4 bg-linear-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div
              ref={setRef("featuresTitle")}
              className={`exp-fade-up ${isV("featuresTitle") ? "visible" : ""} text-center mb-14`}
            >
              <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full mb-4">What We Offer</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 underline-anim inline-block">Our Top Features</h2>
              <p className="text-gray-500 max-w-2xl mx-auto mt-6">Experience the power of Digivahan with features designed to make vehicle management effortless and secure.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 — Smart QR */}
              <div
                ref={setRef("feat1")}
                className={`exp-pop d1 ${isV("feat1") ? "visible" : ""} feature-card bg-white rounded-3xl p-8 shadow-lg border border-gray-100/80 backdrop-blur-sm`}
              >
                <div className="feature-icon w-16 h-16 rounded-2xl bg-linear-to-br from-green-50 to-green-100 flex items-center justify-center mb-5 shadow-md">
                  <img src="/DigiVahan Updated QR.png" alt="Smart QR" className="w-10 h-10 object-contain" onError={(e) => { e.target.style.display='none'; }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart QR</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Attach a Smart QR to your vehicle and make it instantly identifiable. Anyone can scan the code through Digivahan to access essential vehicle details or contact the owner securely. In case of emergency, lost vehicle, or parking issues, Smart QR helps connect quickly without sharing personal numbers publicly.
                </p>
                <div className="mt-5 flex items-center text-yellow-600 font-medium text-sm group cursor-pointer">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>

              {/* Feature 2 — Virtual Garage */}
              <div
                ref={setRef("feat2")}
                className={`exp-pop d2 ${isV("feat2") ? "visible" : ""} feature-card bg-white rounded-3xl p-8 shadow-lg border border-gray-100/80 backdrop-blur-sm`}
              >
                <div className="feature-icon w-16 h-16 rounded-2xl bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-5 shadow-md">
                  <svg className="w-9 h-9 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 0 1-.75.75H3.75A.75.75 0 0 1 3 21V9.75Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Virtual Garage</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Add and manage all your vehicles in one secure place. Store important details like registration number, insurance, service history, and documents digitally. With Virtual Garage, you can track vehicle information anytime, get timely reminders for insurance or servicing, and avoid last-minute stress.
                </p>
                <div className="mt-5 flex items-center text-yellow-600 font-medium text-sm group cursor-pointer">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>

              {/* Feature 3 — RTO & Traffic Updates */}
              <div
                ref={setRef("feat3")}
                className={`exp-pop d3 ${isV("feat3") ? "visible" : ""} feature-card bg-white rounded-3xl p-8 shadow-lg border border-gray-100/80 backdrop-blur-sm`}
              >
                <div className="feature-icon w-16 h-16 rounded-2xl bg-linear-to-br from-orange-50 to-orange-100 flex items-center justify-center mb-5 shadow-md">
                  <svg className="w-9 h-9 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-10.498 4.875 2.437c.381.19.622.58.622 1.006v4.218c0 .76-.827 1.244-1.503.864l-4.872-2.795a1.125 1.125 0 0 0-1.125 0l-4.872 2.795c-.676.38-1.503-.104-1.503-.864V9.695c0-.425.24-.816.622-1.006l4.875-2.437a1.125 1.125 0 0 1 1.003 0Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">RTO &amp; Traffic Updates</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Know new traffic rules, challan updates and RTO-related information in one place. Stay informed about the latest regulations and avoid penalties.
                </p>
                <div className="mt-5 flex items-center text-yellow-600 font-medium text-sm group cursor-pointer">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── APP PERMISSIONS ─────────────── */}
        <section className="w-full py-16 px-4 bg-linear-to-br from-white via-gray-50 to-white border-t border-gray-100 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-20 right-0 w-80 h-80 bg-yellow-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
          
          <div className="max-w-5xl mx-auto relative z-10">
            {/* Header */}
            <div
              ref={setRef("permTitle")}
              className={`exp-fade-up ${isV("permTitle") ? "visible" : ""} mb-12`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-2xl shadow-lg shadow-yellow-200">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">App Permissions</h2>
                  <p className="text-gray-400 text-sm">Secure & Transparent</p>
                </div>
              </div>
              <p className="text-gray-500 leading-relaxed max-w-3xl text-base">
                To provide you with the best and most seamless experience, Digivahan may request certain permissions. Each permission is used only to enhance app functionality and improve your overall experience. We value your privacy and ensure that your data is handled securely.
              </p>
            </div>

            {/* Permission cards */}
            <div className="space-y-8">
              {/* Camera */}
              <div
                ref={setRef("perm1")}
                className={`exp-slide-left d1 ${isV("perm1") ? "visible" : ""} perm-card bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-lg`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="perm-icon w-14 h-14 rounded-2xl bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-md">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Camera Permission</h3>
                    <span className="text-xs text-blue-500 font-medium bg-blue-50 px-2 py-0.5 rounded-full">Essential</span>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-yellow-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-xs">❓</div>
                      <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Why We Need It</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">Camera access is required to scan Smart QR codes and upload vehicle-related documents directly through the app.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-yellow-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">⚙️</div>
                      <p className="text-xs font-bold text-green-600 uppercase tracking-wider">How to Enable</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">Go to Settings → Apps → Digivahan → Permissions → Allow Camera Access.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-yellow-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs">✨</div>
                      <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Your Experience</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">Instantly scan QR codes, upload documents easily, and complete actions faster. <span className="font-semibold text-green-600">Result:</span> Smooth interaction.</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div
                ref={setRef("perm2")}
                className={`exp-slide-right d2 ${isV("perm2") ? "visible" : ""} perm-card bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-lg`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="perm-icon w-14 h-14 rounded-2xl bg-linear-to-br from-red-100 to-red-200 flex items-center justify-center shadow-md">
                    <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Location Permission</h3>
                    <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-full">Recommended</span>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-yellow-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-xs">❓</div>
                      <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Why We Need It</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">Location access helps show accurate fuel prices, nearby services, and region-specific updates.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-yellow-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">⚙️</div>
                      <p className="text-xs font-bold text-green-600 uppercase tracking-wider">How to Enable</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">Go to Settings → Apps → Digivahan → Permissions → Allow Location Access.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-yellow-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs">✨</div>
                      <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Your Experience</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">Real-time info based on your city for personalized updates. <span className="font-semibold text-green-600">Result:</span> Smarter decisions.</p>
                  </div>
                </div>
              </div>

              {/* Notification */}
              <div
                ref={setRef("perm3")}
                className={`exp-slide-left d3 ${isV("perm3") ? "visible" : ""} perm-card bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-lg`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="perm-icon w-14 h-14 rounded-2xl bg-linear-to-br from-yellow-100 to-yellow-200 flex items-center justify-center shadow-md">
                    <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Notification Permission</h3>
                    <span className="text-xs text-yellow-600 font-medium bg-yellow-50 px-2 py-0.5 rounded-full">Important</span>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-yellow-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-xs">❓</div>
                      <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Why We Need It</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">To send reminders for insurance renewal, service schedules, and important traffic updates.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-yellow-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">⚙️</div>
                      <p className="text-xs font-bold text-green-600 uppercase tracking-wider">How to Enable</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">Go to Settings → Apps → Digivahan → Notifications → Enable Notifications.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-yellow-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs">✨</div>
                      <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Your Experience</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">Never miss important vehicle updates. <span className="font-semibold text-green-600">Result:</span> Stay informed. Stay prepared.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── BOTTOM CTA ─────────────── */}
        <section
          ref={setRef("cta")}
          className={`exp-fade-up ${isV("cta") ? "visible" : ""} w-full bg-linear-to-br from-yellow-400 to-yellow-500 py-14 px-4 text-center`}
        >
          <div className="max-w-2xl mx-auto">
            <img
              src="/Tranparent Logo In Black 1.svg"
              alt="Digivahan"
              className="h-10 mx-auto mb-5 brightness-0 invert"
              onError={(e) => { e.target.src = "/logo.png"; }}
            />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Take Control of Your Vehicle?</h2>
            <p className="text-yellow-100 mb-7 text-base">Download Digivahan now and experience the smartest way to manage your vehicle — anytime, anywhere.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#"
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.36c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 4.03ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z"/></svg>
                Download on App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.digivahan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="m3.18 23.76 10.64-10.64-2.22-2.22L3.18 23.76Zm14.73-12.7L15.4 9.49l-4.5 2.59 2.22 2.22 4.79-2.24Zm-14.73-9.82 8.42 8.42-2.22 2.22L3.18 1.24Zm12.22 7.29L12.9 6.12l2.5-1.44 3.73 2.11-3.73 2.74Z"/></svg>
                Get it on Google Play
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Explorepage;
