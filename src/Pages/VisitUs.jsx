import React, { useEffect, useRef } from "react";
import HeropageImage from "../assets/visitus.png";
import Qrimage from "../assets/visitus-2.png";
import { FaUserCircle, FaHandshake, FaBuilding, FaCogs, FaTruck, FaChartLine, FaCalendarCheck } from "react-icons/fa";
import { MdBusiness, MdEngineering, MdSupportAgent } from "react-icons/md";

/* ── Scroll-reveal hook ── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("vu-visible"); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const VISITORS = [
  { icon: <FaBuilding className="text-yellow-500 text-xl" />, label: "Authorized Vehicle Dealers" },
  { icon: <FaTruck className="text-yellow-500 text-xl" />, label: "Logistics & Courier Partners" },
  { icon: <FaCogs className="text-yellow-500 text-xl" />, label: "Technology & API Integration Partners" },
  { icon: <FaTruck className="text-yellow-500 text-xl" />, label: "Fleet Operators" },
  { icon: <FaChartLine className="text-yellow-500 text-xl" />, label: "Investors & Business Associates" },
];

const TEAMS = [
  {
    icon: <MdBusiness className="text-2xl text-yellow-500" />,
    title: "Business Development Team",
    desc: "For dealership onboarding, logistics partnerships, and strategic collaborations.",
    delay: "0ms",
  },
  {
    icon: <MdEngineering className="text-2xl text-yellow-500" />,
    title: "Technical Integration Team",
    desc: "For API integration, system connectivity, and technical support discussions.",
    delay: "120ms",
  },
  {
    icon: <MdSupportAgent className="text-2xl text-yellow-500" />,
    title: "Operations Team",
    desc: "For workflow alignment, service processes, and execution planning.",
    delay: "240ms",
  },
];

const VisitUs = () => {
  const heroRef   = useReveal();
  const mockRef   = useReveal();
  const whoRef    = useReveal();
  const whoImgRef = useReveal();
  const meetRef   = useReveal();
  const mapRef    = useReveal();

  return (
    <main className="w-full font-sans overflow-x-hidden">
      <style>{`
        /* ── base reveal states ── */
        .vu-fade-up   { opacity:0; transform:translateY(40px);  transition: opacity .7s ease, transform .7s ease; }
        .vu-fade-left { opacity:0; transform:translateX(-40px); transition: opacity .7s ease, transform .7s ease; }
        .vu-fade-right{ opacity:0; transform:translateX(40px);  transition: opacity .7s ease, transform .7s ease; }
        .vu-zoom      { opacity:0; transform:scale(.93);        transition: opacity .7s ease, transform .7s ease; }
        .vu-visible .vu-fade-up,
        .vu-visible.vu-fade-up   { opacity:1; transform:translateY(0); }
        .vu-visible .vu-fade-left,
        .vu-visible.vu-fade-left { opacity:1; transform:translateX(0); }
        .vu-visible .vu-fade-right,
        .vu-visible.vu-fade-right{ opacity:1; transform:translateX(0); }
        .vu-visible .vu-zoom,
        .vu-visible.vu-zoom      { opacity:1; transform:scale(1); }

        /* staggered children */
        .vu-visible [data-delay="0"]  { transition-delay:0ms; }
        .vu-visible [data-delay="1"]  { transition-delay:80ms; }
        .vu-visible [data-delay="2"]  { transition-delay:160ms; }
        .vu-visible [data-delay="3"]  { transition-delay:240ms; }
        .vu-visible [data-delay="4"]  { transition-delay:320ms; }

        /* floating dots background */
        @keyframes vuFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .vu-dot { animation: vuFloat 4s ease-in-out infinite; }

        /* pulsing play button */
        @keyframes vuPulse { 0%,100%{box-shadow:0 0 0 0 rgba(234,179,8,.45)} 60%{box-shadow:0 0 0 14px rgba(234,179,8,0)} }
        .vu-play { animation: vuPulse 2.2s ease-in-out infinite; }

        /* shimmer underline */
        @keyframes vuShimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        .vu-underline {
          display:inline-block;
          background: linear-gradient(90deg,#f59e0b,#ef4444,#f59e0b);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          animation: vuShimmer 3s linear infinite;
        }

        /* card hover lift */
        .vu-card { transition: transform .25s ease, box-shadow .25s ease; }
        .vu-card:hover { transform:translateY(-5px); box-shadow:0 20px 40px rgba(0,0,0,.10); }

        /* team card accent line grow */
        .vu-team-card::before {
          content:''; position:absolute; left:0; top:0; bottom:0; width:4px;
          background:linear-gradient(180deg,#f59e0b,#ef4444);
          border-radius:4px 0 0 4px;
          transform:scaleY(0); transform-origin:top;
          transition:transform .35s ease;
        }
        .vu-team-card:hover::before { transform:scaleY(1); }

        /* map reveal */
        .vu-map-wrap { clip-path: inset(100% 0 0 0); transition: clip-path .9s cubic-bezier(.4,0,.2,1); }
        .vu-visible .vu-map-wrap,
        .vu-visible.vu-map-wrap { clip-path: inset(0% 0 0 0); }
      `}</style>

      {/* ══════════════════════════════════════════
          Section 1 — Hero / Partner With Us
      ══════════════════════════════════════════ */}
      <section className="relative w-full bg-white py-20 px-6 overflow-hidden">

        {/* Gradient blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)" }} />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />

        {/* Decorative + crosses */}
        {[
          { top:"6%",  left:"30%" }, { top:"6%",  left:"52%" }, { top:"6%",  left:"74%" }, { top:"6%",  right:"3%" },
          { top:"35%", left:"30%" }, { top:"60%", left:"30%" }, { top:"85%", left:"30%" },
          { top:"35%", right:"3%" }, { top:"60%", right:"3%" }, { top:"85%", right:"3%" },
          { top:"94%", left:"38%" }, { top:"94%", left:"55%" }, { top:"94%", left:"72%" },
        ].map((pos, i) => (
          <span key={i} className="absolute text-yellow-200 text-xl select-none pointer-events-none font-light vu-dot"
            style={{ ...pos, animationDelay: `${i * 0.3}s` }}>+</span>
        ))}

        <div ref={heroRef} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-16">

          {/* LEFT */}
          <div className="space-y-5 vu-fade-left">
            <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
              ✦ Welcome to Digivahan HQ
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Visit <span className="vu-underline">Us</span>
            </h1>
            <p className="flex items-center gap-2 text-gray-800 font-semibold text-base">
              <FaHandshake className="text-yellow-500 text-xl" /> Partner With Us
            </p>
            <p className="text-gray-500 text-sm leading-7">
              At Digivahan, we collaborate with forward-thinking businesses that want to
              grow in the automotive and vehicle services ecosystem.
            </p>
            <p className="text-gray-500 text-sm leading-7">
              If you are interested in dealership onboarding, logistics partnerships, API
              integrations, bulk service requirements, or long-term strategic collaboration —
              we welcome you to visit our office for a detailed business discussion.
            </p>
            <p className="text-gray-500 text-sm leading-7">
              We believe strong partnerships are built on transparency, operational clarity, and
              mutual growth. A face-to-face meeting allows us to better understand your
              business model, discuss workflows, evaluate integration possibilities, and align
              on long-term objectives.
            </p>
            <p className="text-gray-500 text-sm leading-7">
              Our team ensures structured discussions, clear communication, and a
              professional onboarding process for all our partners.
              Let's build scalable and growth-driven opportunities together. 🚀
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#map-section"
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-yellow-200">
                📍 Find Us
              </a>
              <a href="#who-section"
                className="inline-flex items-center gap-2 border border-gray-300 hover:border-yellow-400 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:text-yellow-600">
                Learn More →
              </a>
            </div>
          </div>

          {/* RIGHT — browser mockup */}
          <div ref={mockRef} className="flex justify-center vu-fade-right">
            <div className="vu-card rounded-2xl overflow-hidden shadow-2xl border border-gray-100 w-full max-w-lg"
              style={{ boxShadow: "0 25px 60px rgba(0,0,0,.12)" }}>
              {/* Mock browser bar */}
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 border-b border-gray-200">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 ml-3 bg-white rounded-md text-xs text-gray-400 px-3 py-1.5 text-center border border-gray-200">
                  app.digivahan.com
                </div>
                <div className="flex gap-2 text-gray-400 text-sm ml-2">
                  <span>‹</span><span>›</span>
                </div>
              </div>
              {/* Screenshot with play overlay */}
              <div className="relative group">
                <img src={HeropageImage} alt="Partner meeting" className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="vu-play w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                    <span className="text-yellow-500 text-2xl ml-1">▶</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Section 2 — Who Can Visit Us?
      ══════════════════════════════════════════ */}
      <section id="who-section" className="w-full py-20 px-6" style={{ background: "linear-gradient(135deg,#fffbeb 0%,#fff7ed 100%)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-16">

          {/* LEFT */}
          <div ref={whoRef} className="space-y-7 vu-fade-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
                🏢 Open Doors
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900">Who Can Visit Us?</h2>
              <p className="text-gray-500 text-sm">We welcome partners who drive the future of vehicle services.</p>
            </div>

            <ul className="space-y-3">
              {VISITORS.map((v, i) => (
                <li key={i}
                  data-delay={String(i)}
                  className="vu-fade-up flex items-center gap-4 bg-white rounded-xl px-5 py-4 shadow-sm border border-yellow-100 vu-card cursor-default">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                    {v.icon}
                  </div>
                  <span className="text-gray-800 font-medium text-sm">{v.label}</span>
                  <span className="ml-auto text-yellow-400 text-lg">→</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — person image */}
          <div ref={whoImgRef} className="flex justify-center vu-zoom">
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-2xl border-2 border-dashed border-yellow-300 opacity-60" />
              <img
                src={Qrimage}
                alt="Digivahan representative"
                className="relative w-full max-w-lg rounded-2xl object-cover shadow-2xl"
                style={{ boxShadow: "0 30px 60px rgba(234,179,8,.18)" }}
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white shadow-xl rounded-xl px-4 py-3 flex items-center gap-3 border border-yellow-100">
                <FaCalendarCheck className="text-yellow-500 text-2xl" />
                <div>
                  <p className="text-xs font-bold text-gray-800">Book a Visit</p>
                  <p className="text-xs text-gray-500">Mon – Sat, 10am – 6pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Section 3 — Whom to Meet
      ══════════════════════════════════════════ */}
      <section className="w-full bg-white py-20 px-6">
        <div ref={meetRef} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-stretch gap-16">

          {/* LEFT */}
          <div className="space-y-6 vu-fade-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                👤 Our Teams
              </div>
              <h2 className="flex items-center gap-3 text-4xl font-extrabold text-gray-900">
                Whom to Meet
              </h2>
              <p className="text-gray-500 text-sm leading-6">
                For business discussions and partnership opportunities, connect with the right team for your needs.
              </p>
            </div>

            <div className="space-y-4">
              {TEAMS.map((t, i) => (
                <div key={i}
                  data-delay={String(i)}
                  style={{ transitionDelay: t.delay }}
                  className="vu-fade-up vu-team-card relative bg-gray-50 hover:bg-white rounded-xl p-5 border border-gray-100 vu-card cursor-default overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0 mt-0.5">
                      {t.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm mb-1">{t.title}</p>
                      <p className="text-gray-500 text-sm leading-6">{t.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <FaCalendarCheck className="text-yellow-500 text-xl shrink-0 mt-0.5" />
              <p className="text-gray-600 text-sm leading-6">
                To ensure availability and proper scheduling, we recommend <strong className="text-gray-800">booking an appointment</strong> prior to your visit.
              </p>
            </div>
          </div>

          {/* RIGHT — target image full height */}
          <div className="vu-fade-right relative rounded-2xl overflow-hidden min-h-120"
            style={{ boxShadow: "0 30px 60px rgba(0,0,0,.14)" }}>
            {/* glow border */}
            <div className="absolute -inset-3 rounded-2xl opacity-20 pointer-events-none"
              style={{ background: "linear-gradient(135deg,#fbbf24,#f97316)" }} />
            <img
              src="https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?w=800&q=80"
              alt="Target goal"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            />
            {/* Stats badge */}
            <div className="absolute top-4 right-4 bg-yellow-500 text-white rounded-xl px-4 py-3 shadow-xl text-center z-10">
              <p className="text-xl font-extrabold leading-none">3+</p>
              <p className="text-xs font-semibold opacity-90">Expert Teams</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Section 4 — Google Maps
      ══════════════════════════════════════════ */}
      <section id="map-section" className="w-full bg-gray-50 py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              📍 Find Us
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Our Office Location</h2>
            <p className="text-gray-500 text-sm">J3C4+MF9, Prem Nagar, Block E, Param Puri, Uttam Nagar, Delhi – 110059</p>
          </div>

          {/* Map */}
          <div ref={mapRef} className="vu-zoom rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
            style={{ boxShadow: "0 25px 60px rgba(0,0,0,.12)" }}>
            <iframe
              title="Digivahan Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.05!3d28.63!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d053a83b0b3b3%3A0x1234567890abcdef!2sJ3C4%2BMF9%2C%20Prem%20Nagar%2C%20Block%20E%2C%20Param%20Puri%2C%20Uttam%20Nagar%2C%20Delhi%2C%20110059!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="460"
              style={{ border: 0, display: "block" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

    </main>
  );
};

export default VisitUs;
