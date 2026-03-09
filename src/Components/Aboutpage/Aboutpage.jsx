import React, { useEffect, useRef, useState } from "react";
import ringimg from "../../assets/Right.png";
import conimg from "../../assets/Container.png";
const OfficeImg = "/Digivahan Building.webp";
import About1Img from "../../assets/About us 3.webp";
import VisionImg from "../../assets/Vision.png";
import ProfileCard from "./ProfileCard";
import SandeepRathore from "../../assets/Sandeep_ji_profile_pic.webp";
import ParvezAnsari from "../../assets/Parvez Ansari.webp";

/* ── animation styles ── */
const animStyles = `
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(40px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes fadeLeft {
    from { opacity:0; transform:translateX(-40px); }
    to   { opacity:1; transform:translateX(0);     }
  }
  @keyframes fadeRight {
    from { opacity:0; transform:translateX(40px); }
    to   { opacity:1; transform:translateX(0);    }
  }
  @keyframes popIn {
    from { opacity:0; transform:scale(0.88); }
    to   { opacity:1; transform:scale(1);    }
  }
  @keyframes gradBG {
    0%   { background-position:0% 50%;   }
    50%  { background-position:100% 50%; }
    100% { background-position:0% 50%;   }
  }
  @keyframes floatY {
    0%,100% { transform:translateY(0);    }
    50%      { transform:translateY(-10px);}
  }
  @keyframes shimmerBar {
    from { transform:translateX(-100%); }
    to   { transform:translateX(100%);  }
  }
  @keyframes rotateSlow {
    from { transform:rotate(0deg);   }
    to   { transform:rotate(360deg); }
  }
  @keyframes pulseDot {
    0%,100% { transform:scale(1);   opacity:1;   }
    50%      { transform:scale(1.5); opacity:.5;  }
  }
  @keyframes slideUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0);    }
  }

  .ab-fade-up    { opacity:0; }
  .ab-fade-left  { opacity:0; }
  .ab-fade-right { opacity:0; }
  .ab-pop        { opacity:0; }
  .ab-fade-up.vis    { animation:fadeUp   0.65s cubic-bezier(.22,1,.36,1) forwards; }
  .ab-fade-left.vis  { animation:fadeLeft 0.65s cubic-bezier(.22,1,.36,1) forwards; }
  .ab-fade-right.vis { animation:fadeRight 0.65s cubic-bezier(.22,1,.36,1) forwards; }
  .ab-pop.vis        { animation:popIn    0.55s cubic-bezier(.22,1,.36,1) forwards; }

  .float-img { animation:floatY 5s ease-in-out infinite; }
  .float-img2{ animation:floatY 6s ease-in-out infinite .8s; }
  .grad-hero {
    background:linear-gradient(135deg,#fef9ee,#fff,#f0fdf4);
    background-size:300% 300%;
    animation:gradBG 10s ease infinite;
  }
  .card-hover {
    transition: transform .3s ease, box-shadow .3s ease;
  }
  .card-hover:hover {
    transform:translateY(-5px);
    box-shadow:0 16px 40px rgba(234,179,8,.18);
  }
  .shimmer-line {
    position:relative;
    overflow:hidden;
  }
  .shimmer-line::after {
    content:'';
    position:absolute;
    inset:0;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);
    animation:shimmerBar 2.2s linear infinite;
  }
  .icon-spin { animation:rotateSlow 8s linear infinite; }
  .dot-pulse { animation:pulseDot 1.5s ease-in-out infinite; }

  /* ── USP Orbit ── */
  @keyframes uspCW  { from{transform:rotate(0deg)}   to{transform:rotate(360deg)}  }
  @keyframes uspCCW { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
  @keyframes uspGlow {
    0%,100%{opacity:.4;transform:scale(1)}
    50%    {opacity:.8;transform:scale(1.12)}
  }
  .usp-arm-cw  { position:absolute;inset:0;animation:uspCW  22s linear infinite; }
  .usp-arm-ccw { position:absolute;inset:0;animation:uspCCW 14s linear infinite; }
  .usp-ico-cw  { animation:uspCCW 22s linear infinite; }
  .usp-ico-ccw { animation:uspCW  14s linear infinite; }
  .usp-ring-o  { border:2px dashed rgba(234,179,8,.5);  animation:uspCW  40s linear infinite; }
  .usp-ring-i  { border:1.5px dashed rgba(96,165,250,.4); animation:uspCCW 26s linear infinite; }
`;

/* ── hook: trigger class "vis" when element enters viewport ── */
const useScrollAnim = () => {
  const refs  = useRef({});
  const [vis, setVis] = useState({});

  useEffect(() => {
    const obs = {};
    Object.entries(refs.current).forEach(([k, el]) => {
      if (!el) return;
      obs[k] = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          setVis(p => ({ ...p, [k]: true }));
          obs[k].disconnect();
        }
      }, { threshold: 0.1 });
      obs[k].observe(el);
    });
    return () => Object.values(obs).forEach(o => o.disconnect());
  }, []);

  const ref = k => el => { refs.current[k] = el; };
  const v   = k => vis[k] ? "vis" : "";
  return { ref, v };
};

const Aboutpage = () => {
  const { ref, v } = useScrollAnim();

  return (
    <>
      <style>{animStyles}</style>
      <main className="w-full overflow-hidden">

        {/* ══════════════════════════════════════════
            SECTION 1 — HERO / ABOUT US
        ══════════════════════════════════════════ */}
        <section className="grad-hero w-full py-14 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center">

            {/* Left */}
            <div ref={ref("s1l")} className={`ab-fade-left ${v("s1l")} lg:w-1/2 flex flex-col gap-4`}>

              {/* Badge */}
              <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest w-fit">
                <span className="dot-pulse w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                Since 2023
              </span>

              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                About <span className="text-yellow-500">Us</span>
              </h2>
              <h3 className="text-xl font-semibold text-gray-700">Digivahan Digital India Pvt. Ltd.</h3>

              {/* Animated yellow underline */}
              <div className="shimmer-line h-1 w-20 rounded-full bg-yellow-400" />

              <h4 className="text-base font-semibold text-yellow-600">Empowering India with Smart Vehicle Solutions</h4>

              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Digivahan is India's trusted digital platform for all your vehicle-related services. From RC, insurance, and PUC status to challan checks and safety QR stickers — we bring everything to your fingertips. With a mission to make transportation smarter, safer, and more accessible, we are revolutionizing the way India moves.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Established in 2023, Digivahan Digital India Pvt. Ltd. is a technology-driven company focused on transforming vehicle management and public safety through digital innovation. Our mission is to create a smart, mobile-first ecosystem where vehicle-related services are seamless, secure, and easily accessible for every Indian citizen.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                We specialize in offering QR-based vehicle identification and real-time verification services that not only assist vehicle owners but also empower the public to report lost or misplaced vehicles using our unique QR code system.
              </p>
            </div>

            {/* Right */}
            <div ref={ref("s1r")} className={`ab-fade-right ${v("s1r")} lg:w-1/2 w-full flex justify-center`}>
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-300/20 rounded-3xl blur-3xl scale-110" />
                <img
                  src={About1Img}
                  alt="About Digivahan"
                  className="float-img relative rounded-3xl shadow-xl w-full object-cover"
                  style={{ maxHeight: 420 }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 2 — TEAM
        ══════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto py-14 px-4">

          {/* Section heading */}
          <div ref={ref("teamH")} className={`ab-fade-up ${v("teamH")} text-center mb-10`}>
            <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">Our People</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Meet the <span className="text-yellow-500">Team</span></h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              A group of dedicated professionals driven by a shared passion for innovation, transparency, and excellence.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Profile cards */}
            <div
              ref={ref("cards")}
              className={`ab-fade-left ${v("cards")} lg:w-1/2 space-y-6`}
              style={{ animationDelay: "0.1s" }}
            >
              <ProfileCard
                align="right"
                name="Sandeep Rathor"
                role="CEO (Founder)"
                quote="Building vision, leading with purpose"
                image={SandeepRathore}
                points={["Visionary Entrepreneur","Business & Growth Strategist","Founder-led Leadership"]}
              />
              <ProfileCard
                align="left"
                name="Rehan Ansari"
                role="Director"
                quote="Committed to vision, driven by excellence."
                image={ParvezAnsari}
                points={["10+ Years Experience","Startup & Product Specialist","Business Leadership"]}
              />
            </div>

            {/* Team text */}
            <div
              ref={ref("teamTxt")}
              className={`ab-fade-right ${v("teamTxt")} lg:w-1/2 flex flex-col justify-center gap-4`}
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">About Our Team</h2>
              <div className="h-1 w-16 rounded-full bg-yellow-400 shimmer-line" />
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our team is a group of dedicated and skilled professionals driven by a shared passion for innovation and excellence. Each member brings unique expertise and experience, working collaboratively to deliver reliable, high-quality solutions. We believe in transparency, teamwork, and continuous improvement, ensuring that every project is handled with precision, responsibility, and a commitment to long-term value.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                We work in a collaborative and transparent environment where ideas are encouraged, accountability is valued, and continuous learning is a priority. By combining strong technical knowledge with a deep understanding of client needs, we ensure that every solution we deliver is reliable, scalable, and aligned with long-term business goals.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mt-2">
                {[["2023","Founded"],["50K+","Users"],["99%","Uptime"]].map(([val, label]) => (
                  <div key={label} className="card-hover bg-yellow-50 border border-yellow-100 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-extrabold text-yellow-500">{val}</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 3 — FOUNDER'S MESSAGE (UNCHANGED)
        ══════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto my-8 px-3">
          <div className="relative bg-gradient-to-br from-yellow-50 via-white to-green-50 border border-yellow-200 rounded-3xl overflow-hidden shadow-lg flex flex-col md:flex-row animate-fade-in" style={{ minHeight: 480 }}>

            <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-400 opacity-10 rounded-full translate-x-24 translate-y-24 pointer-events-none" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400 opacity-10 rounded-full translate-x-16 -translate-y-16 pointer-events-none" />

            <div className="relative flex-shrink-0 md:w-2/5 w-full bg-yellow-50 flex items-center justify-center" style={{ clipPath:"ellipse(92% 50% at 0% 50%)" }}>
              <img
                src="/Sandeep Sir.jpeg"
                alt="Sandeep Rathor – Founder & CEO"
                className="w-full h-full object-contain object-bottom"
                style={{ minHeight:420, maxHeight:600 }}
                loading="lazy"
              />
              <div className="absolute bottom-6 left-4 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow">
                <p className="font-bold text-gray-900 text-sm leading-tight">Sandeep Rathor</p>
                <p className="text-xs text-yellow-600 font-medium">Founder &amp; CEO</p>
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center gap-4 px-7 py-10 md:px-10 md:py-12 pr-6 md:pr-10 z-10 overflow-hidden">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow-600 mb-1">🌟 Founder's Message</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">Leading Innovation with Purpose</h2>
              </div>
              <span className="block text-6xl leading-none text-yellow-300 font-serif select-none">&ldquo;</span>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed -mt-4">
                At Digivahan Digital India Pvt. Ltd., our journey began with a simple yet powerful vision — to make vehicle-related services smarter, more transparent, and easily accessible for every Indian citizen.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                As the Founder, I strongly believe that technology should simplify lives, not complicate them. With the rapid growth of digital transformation in India, there was a clear need for a reliable and secure platform dedicated to vehicle management and verification services. Digivahan was created to bridge that gap.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Our mission is to build a seamless ecosystem where vehicle owners, authorities, and citizens can connect through trust-driven digital solutions. From QR-based vehicle identification to real-time verification services, we are committed to delivering innovation with integrity.
              </p>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium">
                We are not just building a platform — we are building a movement toward safer roads, smarter documentation, and a digitally empowered India.
              </p>
              <p className="text-gray-500 text-sm italic">Thank you for being part of our journey.</p>
              <div className="flex items-center gap-3 pt-1">
                <div className="h-px flex-1 bg-yellow-200" />
                <span className="text-yellow-600 font-semibold text-sm">— Sandeep Rathor</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 4 — VISION / MISSION / SERVICES / AUDIENCE
        ══════════════════════════════════════════ */}
        <section className="bg-gray-50 py-14 px-4">
          <div className="max-w-6xl mx-auto">

            {/* heading */}
            <div ref={ref("vmH")} className={`ab-fade-up ${v("vmH")} text-center mb-12`}>
              <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">What We Stand For</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Our <span className="text-yellow-500">Purpose</span></h2>
            </div>

            {/* Top row — Vision & Mission side by side */}
            <div className="grid sm:grid-cols-2 gap-6 mb-6">

              {/* Vision */}
              <div
                ref={ref("vision")}
                style={{ animationDelay:"0s", background:"linear-gradient(135deg,#fef3c7 0%,#fffbeb 60%,#fef9ee 100%)", border:"2px solid #fde68a" }}
                className={`ab-fade-left ${v("vision")} relative overflow-hidden rounded-3xl p-7 flex flex-col gap-4`}
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-yellow-300/20 rounded-full translate-x-10 -translate-y-10 pointer-events-none" />
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-md flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 010 18"/><path d="M3 12h18"/></svg>
                  </div>
                  <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Our Vision</h2>
                </div>
                <div className="h-0.5 w-10 rounded-full bg-yellow-400" />
                <p className="text-gray-700 text-sm leading-relaxed">
                  To make every Indian vehicle <strong>digitally verifiable and connected</strong> — enabling a safer and more transparent transport ecosystem for every citizen.
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full px-3 py-1 w-fit">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 dot-pulse inline-block" /> Long-term Goal
                </span>
              </div>

              {/* Mission */}
              <div
                ref={ref("mission")}
                style={{ animationDelay:"0.15s", background:"linear-gradient(135deg,#1e293b 0%,#0f172a 100%)", border:"2px solid #334155" }}
                className={`ab-fade-right ${v("mission")} relative overflow-hidden rounded-3xl p-7 flex flex-col gap-4`}
              >
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/10 rounded-full -translate-x-10 translate-y-10 pointer-events-none" />
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-md flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  </div>
                  <h2 className="text-lg font-extrabold text-white tracking-tight">Our Mission</h2>
                </div>
                <div className="h-0.5 w-10 rounded-full bg-yellow-400" />
                <p className="text-gray-300 text-sm leading-relaxed">
                  We simplify vehicle documentation, safety, and verification through an <strong className="text-yellow-300">all-in-one digital platform</strong> — offering trusted, secure, and real-time services to every citizen.
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-300 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-3 py-1 w-fit">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 dot-pulse inline-block" /> Day-to-day Commitment
                </span>
              </div>
            </div>

            {/* Bottom row — Core Services, Target Audience, Illustration */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">

              {/* Core Services */}
              <div
                ref={ref("cs")}
                style={{ animationDelay:"0.25s", border:"2px solid #f3f4f6" }}
                className={`ab-fade-up ${v("cs")} relative bg-white rounded-3xl p-6 flex flex-col shadow-sm`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Core Services</h2>
                </div>
                <div className="h-0.5 w-10 rounded-full bg-blue-200 mb-4" />
                <ul className="flex flex-col gap-2.5">
                  {[
                    "RC, Insurance, Challan & PUC Verification",
                    "QR-Based Digital Identity for Vehicles",
                    "Public Alert & Lost Vehicle Reporting",
                    "Secure Document Upload & Instant Validation",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 bg-blue-50/50 rounded-xl px-3 py-2.5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      </span>
                      <span className="text-gray-600 text-xs leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-medium">4 core features</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 rounded-full px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 dot-pulse inline-block" /> Active
                  </span>
                </div>
              </div>

              {/* Target Audience */}
              <div
                ref={ref("ta")}
                style={{ animationDelay:"0.35s", border:"2px solid #f3f4f6" }}
                className={`ab-fade-up ${v("ta")} relative bg-white rounded-3xl p-6 flex flex-col shadow-sm`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Target Audience</h2>
                </div>
                <div className="h-0.5 w-10 rounded-full bg-green-200 mb-4" />
                <ul className="flex flex-col gap-3">
                  {[
                    { icon: "🚗", label: "Private & Commercial", sub: "Vehicle Owners" },
                    { icon: "📢", label: "Citizens reporting", sub: "found or lost vehicles" },
                    { icon: "🏛️", label: "Transport professionals", sub: "& RTO partners" },
                  ].map(({ icon, label, sub }) => (
                    <li key={label} className="flex items-center gap-3 bg-green-50/60 rounded-xl px-3 py-3">
                      <span className="text-xl leading-none">{icon}</span>
                      <span className="text-xs text-gray-700 leading-tight"><strong>{label}</strong> {sub}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-medium">3 key segments</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 rounded-full px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 dot-pulse inline-block" /> Growing
                  </span>
                </div>
              </div>

              {/* Illustration card */}
              <div
                ref={ref("visionImg")}
                style={{ animationDelay:"0.45s", background:"linear-gradient(145deg,#1e293b 0%,#0f172a 100%)", border:"2px solid #334155", height: 340 }}
                className={`ab-fade-right ${v("visionImg")} flex flex-col rounded-3xl overflow-hidden shadow-xl relative`}
              >
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full translate-x-10 -translate-y-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 rounded-full -translate-x-8 translate-y-8 pointer-events-none" />

                {/* Image frame */}
                <div className="relative flex-1 m-4 rounded-2xl overflow-hidden group">
                  {/* Animated ring border */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                    style={{ boxShadow:"inset 0 0 0 2px rgba(234,179,8,0.35)", animation:"uspGlow 3s ease-in-out infinite" }} />
                  <img
                    src={VisionImg}
                    alt="Vision Illustration"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {/* Floating label over image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                    <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2">
                      <p className="text-white text-xs font-bold leading-tight">Driven by Vision</p>
                      <p className="text-gray-300 text-[10px] leading-tight mt-0.5">Building a smarter India</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/30 shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                  </div>
                </div>

                {/* Bottom stat strip */}
                <div className="flex items-center justify-around px-4 pb-4 pt-1 gap-2">
                  {[["2023","Founded"],["India","Serving"],["Digital","Future"]].map(([val, lbl]) => (
                    <div key={lbl} className="text-center">
                      <p className="text-yellow-400 text-sm font-extrabold">{val}</p>
                      <p className="text-gray-400 text-[10px] font-medium">{lbl}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 5 — USP
        ══════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto py-14 px-4">
          <div className="flex flex-col md:flex-row gap-10 items-center">

            <div ref={ref("uspL")} className={`ab-fade-left ${v("uspL")} md:w-1/2 space-y-5`}>
              <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">Why Digivahan</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">What Makes Us <span className="text-yellow-500">Unique</span> (USP)</h1>
              <div className="h-1 w-16 rounded-full bg-yellow-400 shimmer-line" />
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                We offer a wide range of services designed to make your vehicle ownership experience smarter, safer, and more convenient. Among our many features, some stand out as true gems:
              </p>
              <ul className="space-y-3">
                {[
                  "First-of-its-kind QR-based public alert system for vehicles.",
                  "Mobile-first, secure and lightweight application.",
                  "Real-time updates on vehicle document validity and compliance.",
                ].map((item, i) => (
                  <li
                    key={i}
                    ref={ref("usp"+i)}
                    className={`ab-fade-up ${v("usp"+i)} flex items-start gap-3 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 text-sm text-gray-700`}
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    <span className="text-yellow-500 font-bold text-base mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div ref={ref("uspR")} className={`ab-fade-right ${v("uspR")} md:w-1/2 flex justify-center items-center`}>
              <div className="relative mx-auto" style={{ width: 360, height: 360 }}>

                {/* Ambient glow */}
                <div className="absolute inset-4 rounded-full pointer-events-none"
                  style={{ background:'radial-gradient(circle,rgba(234,179,8,.18) 0%,transparent 70%)', animation:'uspGlow 3.5s ease-in-out infinite' }} />

                {/* Outer dashed ring */}
                <div className="absolute rounded-full usp-ring-o"
                  style={{ width:296, height:296, top:32, left:32 }} />

                {/* Inner dashed ring */}
                <div className="absolute rounded-full usp-ring-i"
                  style={{ width:192, height:192, top:84, left:84 }} />

                {/* ── Outer orbit (6 icons, CW, 22s) ── */}
                {[
                  { emoji:'🛡️', label:'Security' },
                  { emoji:'📱', label:'Mobile'   },
                  { emoji:'🚗', label:'Vehicle'  },
                  { emoji:'📄', label:'Docs'     },
                  { emoji:'⚡', label:'Fast'     },
                  { emoji:'🔔', label:'Alerts'   },
                ].map(({ emoji, label }, i) => (
                  <div key={i} className="usp-arm-cw"
                    style={{ animationDelay:`${-(22/6)*i}s` }}>
                    <div style={{ position:'absolute', top:'calc(50% - 170px)', left:'calc(50% - 22px)' }}>
                      <div className="usp-ico-cw" style={{ animationDelay:`${-(22/6)*i}s` }}>
                        <div className="w-11 h-11 rounded-2xl bg-white shadow-lg border border-yellow-100 flex items-center justify-center text-xl select-none">
                          {emoji}
                        </div>
                        <p className="text-[9px] text-gray-500 text-center mt-0.5 font-semibold leading-none">{label}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* ── Inner orbit (4 icons, CCW, 14s) ── */}
                {[
                  { emoji:'🔍' },
                  { emoji:'🗺️' },
                  { emoji:'🔒' },
                  { emoji:'✅' },
                ].map(({ emoji }, i) => (
                  <div key={i} className="usp-arm-ccw"
                    style={{ animationDelay:`${-(14/4)*i}s` }}>
                    <div style={{ position:'absolute', top:'calc(50% - 115px)', left:'calc(50% - 19px)' }}>
                      <div className="usp-ico-ccw" style={{ animationDelay:`${-(14/4)*i}s` }}>
                        <div className="w-[38px] h-[38px] rounded-xl bg-white shadow-md border border-blue-100 flex items-center justify-center text-lg select-none">
                          {emoji}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Center image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -inset-5 rounded-full pointer-events-none"
                      style={{ background:'radial-gradient(circle,rgba(234,179,8,.25) 0%,transparent 70%)', animation:'uspGlow 2.6s ease-in-out infinite .4s' }} />
                    <img src={ringimg} alt="USP Illustration"
                      className="float-img relative w-48 h-48 object-contain drop-shadow-2xl" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CONTAINER IMAGE
        ══════════════════════════════════════════ */}
        <div ref={ref("conImg")} className={`ab-fade-up ${v("conImg")} max-w-6xl mx-auto px-4 py-2`}>
          <img src={conimg} alt="Core Value" className="w-full rounded-2xl shadow object-cover md:h-full h-40" />
        </div>

        {/* ══════════════════════════════════════════
            SECTION 6 — LEGAL & CONTACT
        ══════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto py-14 px-4">

          <div ref={ref("legalH")} className={`ab-fade-up ${v("legalH")} text-center mb-10`}>
            <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">Company Info</span>
            <h2 className="text-3xl font-extrabold text-gray-900">Legal Entity &amp; <span className="text-yellow-500">Contact Info</span></h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            {/* Info card */}
            <div ref={ref("legalL")} className={`ab-fade-left ${v("legalL")} md:w-1/2 flex flex-col`}>
              <div className="bg-white border-2 border-yellow-100 rounded-3xl overflow-hidden shadow-sm flex-1 flex flex-col">
                {/* Top accent bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-100" />
                <div className="p-7 flex flex-col divide-y divide-gray-100">
                {[
                  { icon: <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>, label:"Company Name", val:"Digivahan Digital India Pvt Ltd" },
                  { icon: <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>, label:"Established", val:"2023" },
                  { icon: <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>, label:"CIN", val:"U62099DL2023PTC420571" },
                  { icon: <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>, label:"Registered Address", val:"Plot No, 2-A, Third Floor, Block-R, Uttam Nagar, New Delhi - 110059, India" },
                  { icon: <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>, label:"Email", val:"info@digivahan.in" },
                ].map(({ icon, label, val }) => (
                  <div key={label} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center mt-0.5">
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                      <p className="text-gray-800 text-sm font-medium leading-snug">{val}</p>
                    </div>
                  </div>
                ))}
                </div>{/* end p-7 */}
              </div>{/* end card */}
            </div>{/* end md:w-1/2 */}

            {/* Office image */}
            <div ref={ref("legalR")} className={`ab-fade-right ${v("legalR")} md:w-1/2 self-stretch`}>
              <div className="relative group w-full h-full min-h-[380px] rounded-3xl overflow-hidden shadow-xl">
                <img src={OfficeImg} alt="Digivahan Office" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ display:"block" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-3">
                  <span className="text-yellow-500 text-xl">🏢</span>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Our Office</p>
                    <p className="text-xs text-gray-500">Gurugram, Haryana</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            MAP
        ══════════════════════════════════════════ */}
        <div ref={ref("map")} className={`ab-fade-up ${v("map")} max-w-6xl mx-auto px-4 pb-10`}>
          <div className="w-full h-80 md:h-96 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d89879.39895896293!2d76.9286923357915!3d28.57726296237831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d050021878051%3A0xd9da7e82a08b4777!2sDIGIVAHAN!5e0!3m2!1sen!2sin!4v1768393071255!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border:0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </main>
    </>
  );
};

export default Aboutpage;
