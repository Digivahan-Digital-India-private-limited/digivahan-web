import React, { useEffect, useRef, useState } from "react";
import { FaHandshake, FaBuilding, FaCogs, FaTruck, FaChartLine, FaCalendarCheck } from "react-icons/fa";
import { MdBusiness, MdEngineering, MdSupportAgent } from "react-icons/md";
import axios from "axios";
import { createAppointment, getAppointmentByTicketId } from "../features/support/services/appointmentApi";
import { FaSearch, FaUserTie, FaPhoneAlt, FaCalendarDay, FaClock } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

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
  const appointmentRef = useReveal();
  const mapRef    = useReveal();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minAppointmentDate = tomorrow.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    phoneNumber: "",
    businessEmail: "",
    whomToMeet: "",
    role: "",
    reason: "",
    proposalDescription: "",
    requestedDate: "",
  });
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [submittedTicketId, setSubmittedTicketId] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [trackedAppointment, setTrackedAppointment] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const today = new Date().toISOString().split("T")[0];

    if (!formData.requestedDate || formData.requestedDate <= today) {
      setSubmitMessage({
        type: "error",
        text: "Requested date must be from tomorrow onwards.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage({ type: "", text: "" });
      setSuccessMsg("");
      setSubmittedTicketId("");
      setCopyStatus("");

      const response = await createAppointment(formData);

      const success = response?.data?.success;
      if (!success) {
        throw new Error(response?.data?.message || "Failed to submit appointment request.");
      }

      const ticketId = response.data.ticketId || `APT-${Date.now()}`;
      setSubmittedTicketId(ticketId);
      setSuccessMsg(response.data.message || "Appointment request submitted successfully. Our team will contact you shortly.");

      setFormData({
        name: "",
        companyName: "",
        phoneNumber: "",
        businessEmail: "",
        whomToMeet: "",
        role: "",
        reason: "",
        proposalDescription: "",
        requestedDate: "",
      });

      // Auto scroll to success message
      const element = document.getElementById("appointment-section");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }

    } catch (error) {
      setSubmitMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while submitting your appointment request.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTicketId = async () => {
    if (!submittedTicketId) return;
    try {
      await navigator.clipboard.writeText(submittedTicketId);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 3000);
    } catch {
      setCopyStatus("Unable to copy. Please copy manually.");
    }
  };

  const handleTrackStatus = async () => {
    const tid = trackingId.trim();
    if (!tid) {
      setSubmitMessage({ type: "error", text: "Please enter a Ticket ID to track." });
      return;
    }

    try {
      setIsTracking(true);
      setTrackedAppointment(null);
      const response = await getAppointmentByTicketId(tid);
      if (response?.data?.success) {
        setTrackedAppointment(response.data.data);
        setSubmitMessage({ type: "", text: "" });
      } else {
        setSubmitMessage({ type: "error", text: "Appointment not found." });
      }
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: error?.response?.data?.message || "Unable to track appointment."
      });
    } finally {
      setIsTracking(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "text-green-600 bg-green-50 border-green-200";
      case "rejected": return "text-red-600 bg-red-50 border-red-200";
      case "visited": return "text-indigo-600 bg-indigo-50 border-indigo-200";
      default: return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

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

        /* appointment form visuals */
        .vu-form-card {
          background: linear-gradient(135deg, #ffffff 0%, #fff7ed 100%);
          border: 1px solid #fde68a;
          box-shadow: 0 24px 50px rgba(0,0,0,.08);
        }
        .vu-input {
          border: 1px solid #e5e7eb;
          transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
        }
        .vu-input:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 4px rgba(245,158,11,.15);
          transform: translateY(-1px);
        }
        @keyframes vuGlow {
          0%, 100% { opacity: .5; }
          50% { opacity: 1; }
        }
        .vu-glow {
          animation: vuGlow 3s ease-in-out infinite;
        }
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
              Let's build scalable and growth-driven opportunities together. 
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#map-section"
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-yellow-200">
                📍 Find Us
              </a>
              <a href="#appointment-section"
                className="inline-flex items-center gap-2 border border-gray-300 hover:border-yellow-400 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:text-yellow-600">
                Book an Appointment →
              </a>
            </div>
          </div>

          {/* RIGHT — hero image */}
          <div ref={mockRef} className="flex justify-center vu-fade-right">
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl group"
              style={{ boxShadow: "0 25px 60px rgba(0,0,0,.15)" }}>
              <img
                src="/Visit Us Top.webp"
                alt="Partner meeting"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ minHeight: 380 }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
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
          <div ref={whoImgRef} className="vu-zoom w-full">
            <div className="relative w-full rounded-3xl overflow-hidden" style={{ boxShadow: "0 30px 60px rgba(234,179,8,.18)" }}>
              <div className="absolute -inset-3 rounded-3xl border-2 border-dashed border-yellow-300 opacity-60 pointer-events-none" />
              <img
                src="/Who Can Visit Us.webp"
                alt="Who can visit Digivahan"
                className="w-full object-cover rounded-3xl"
                style={{ minHeight: 400 }}
              />
              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl px-4 py-3 flex items-center gap-3 border border-yellow-100">
                <FaCalendarCheck className="text-yellow-500 text-2xl shrink-0" />
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

            <a
              href="#appointment-section"
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-yellow-200"
            >
              Book an Appointment →
            </a>
          </div>

          {/* RIGHT — target image full height */}
          {/* <div className="vu-fade-right relative rounded-2xl overflow-hidden min-h-120"
            style={{ boxShadow: "0 30px 60px rgba(0,0,0,.14)" }}> */}
            {/* glow border */}
            {/* <div className="absolute -inset-3 rounded-2xl opacity-20 pointer-events-none"
              style={{ background: "linear-gradient(135deg,#fbbf24,#f97316)" }} />
            <img
              src="/Whom to Meet.webp"
              alt="Whom to meet"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            /> */}
            {/* Stats badge */}
            {/* <div className="absolute top-4 right-4 bg-yellow-500 text-white rounded-xl px-4 py-3 shadow-xl text-center z-10">
              <p className="text-xl font-extrabold leading-none">3+</p>
              <p className="text-xs font-semibold opacity-90">Expert Teams</p>
            </div>
          </div> */}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Section 4 — Appointment Form
      ══════════════════════════════════════════ */}
      <section id="appointment-section" className="w-full py-20 px-6 bg-linear-to-b from-white to-yellow-50">
        <div ref={appointmentRef} className="max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-10 vu-fade-up">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full vu-glow">
              📅 Appointment Request
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900">Book an Appointment</h2>
            <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-7">
              Share your details for a structured business discussion with the right Digivahan team. Please provide accurate information so we can schedule your meeting smoothly.
            </p>

            {successMsg && (
              <div className="mt-8 max-w-2xl mx-auto rounded-2xl border border-green-200 bg-green-50 p-6 shadow-lg shadow-green-100/50 vu-fade-up">
                <div className="flex items-center gap-3 mb-4 justify-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-green-800">Success!</h3>
                </div>
                <p className="text-sm font-medium text-green-700 mb-4">{successMsg}</p>
                {submittedTicketId && (
                  <div className="space-y-4">
                    <div className="bg-white/60 rounded-xl p-4 border border-green-200 inline-block mx-auto min-w-64">
                      <p className="text-xs text-green-600 font-semibold mb-1">Appointment Ticket ID</p>
                      <p className="text-2xl font-black text-gray-900 tracking-wider">{submittedTicketId}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleCopyTicketId}
                        className="px-4 py-2 rounded-lg border border-green-300 bg-white text-green-700 text-sm font-bold hover:bg-green-100 transition-colors shadow-sm"
                      >
                        Copy Ticket ID
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSuccessMsg(""); setSubmittedTicketId(""); }}
                        className="px-5 py-2 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors shadow-md"
                      >
                        Got it, Thanks!
                      </button>
                    </div>
                    {copyStatus && (
                      <p className="text-xs text-green-600 font-bold animate-bounce">{copyStatus}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="vu-form-card rounded-3xl p-6 md:p-10 space-y-6 vu-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-gray-700">Name</label>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="vu-input w-full rounded-xl px-4 py-3 text-sm bg-white" placeholder="Enter your full name" />
              </div>

              <div className="space-y-2">
                <label htmlFor="companyName" className="text-sm font-semibold text-gray-700">Company Name</label>
                <input id="companyName" name="companyName" type="text" value={formData.companyName} onChange={handleChange} required className="vu-input w-full rounded-xl px-4 py-3 text-sm bg-white" placeholder="Enter your company name" />
              </div>

              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">Phone Number</label>
                <input id="phoneNumber" name="phoneNumber" type="tel" pattern="[0-9]{10}" inputMode="numeric" value={formData.phoneNumber} onChange={handleChange} required className="vu-input w-full rounded-xl px-4 py-3 text-sm bg-white" placeholder="10-digit phone number" />
              </div>

              <div className="space-y-2">
                <label htmlFor="businessEmail" className="text-sm font-semibold text-gray-700">Business Email</label>
                <input id="businessEmail" name="businessEmail" type="email" value={formData.businessEmail} onChange={handleChange} required className="vu-input w-full rounded-xl px-4 py-3 text-sm bg-white" placeholder="name@company.com" />
              </div>

              <div className="space-y-2">
                <label htmlFor="whomToMeet" className="text-sm font-semibold text-gray-700">Whom to Meet</label>
                <select id="whomToMeet" name="whomToMeet" value={formData.whomToMeet} onChange={handleChange} required className="vu-input w-full rounded-xl px-4 py-3 text-sm bg-white">
                  <option value="">Select team</option>
                  <option value="Business Development Team">Business Development Team</option>
                  <option value="Technical Integration Team">Technical Integration Team</option>
                  <option value="Operations Team">Operations Team</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-semibold text-gray-700">Role</label>
                <select id="role" name="role" value={formData.role} onChange={handleChange} required className="vu-input w-full rounded-xl px-4 py-3 text-sm bg-white">
                  <option value="">Select your role</option>
                  <option value="Authorized Vehicle Dealers">Authorized Vehicle Dealers</option>
                  <option value="Logistics & Courier Partners">Logistics & Courier Partners</option>
                  <option value="Technology & API Integration Partners">Technology & API Integration Partners</option>
                  <option value="Fleet Operators">Fleet Operators</option>
                  <option value="Investors & Business Associates">Investors & Business Associates</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="reason" className="text-sm font-semibold text-gray-700">Reason</label>
                <input id="reason" name="reason" type="text" value={formData.reason} onChange={handleChange} required className="vu-input w-full rounded-xl px-4 py-3 text-sm bg-white" placeholder="Type the reason for your appointment" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="proposalDescription" className="text-sm font-semibold text-gray-700">Proposal Description</label>
                <textarea id="proposalDescription" name="proposalDescription" rows={4} value={formData.proposalDescription} onChange={handleChange} required className="vu-input w-full rounded-xl px-4 py-3 text-sm bg-white resize-none" placeholder="Describe your proposal in detail" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="requestedDate" className="text-sm font-semibold text-gray-700">Requested Date</label>
                <input id="requestedDate" name="requestedDate" type="date" min={minAppointmentDate} value={formData.requestedDate} onChange={handleChange} required className="vu-input w-full rounded-xl px-4 py-3 text-sm bg-white" />
                <p className="text-xs text-gray-500">Appointment date can be selected from tomorrow onward only.</p>
              </div>
            </div>

            {submitMessage.text && (
              <p className={`text-sm font-medium ${submitMessage.type === "error" ? "text-red-600" : "text-green-600"}`}>
                {submitMessage.text}
              </p>
            )}

            <div className="pt-2">
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-yellow-200">
                {isSubmitting ? "Submitting..." : "Submit Appointment Request"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Section 5 — Track Status (Matched to Image UI)
      ══════════════════════════════════════════ */}
      <section className="w-full py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl shrink-0">
                🎫
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">Track Appointment Status</h3>
                <p className="text-sm text-gray-500 mt-1">Enter your ticket number to check current appointment progress.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter ticket ID (e.g. DIGI-APT-000001)"
                  className="w-full h-14 rounded-xl border border-gray-200 bg-white px-5 py-3 text-base text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                />
              </div>
              <button
                onClick={handleTrackStatus}
                disabled={isTracking}
                className="h-14 px-10 rounded-xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 disabled:bg-gray-400 disabled:shadow-none"
              >
                {isTracking ? "Checking..." : "Check Status"}
              </button>
            </div>

            {submitMessage.text && submitMessage.type === "error" && (
              <p className="mt-4 text-sm font-medium text-red-500 px-1">{submitMessage.text}</p>
            )}

            {trackedAppointment && (
              <div className="mt-8 pt-8 border-t border-gray-50 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <p className="text-lg font-bold text-gray-900">Details for {trackedAppointment.ticketId}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full border text-xs font-bold capitalize ${getStatusColor(trackedAppointment.status)}`}>
                    {trackedAppointment.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Scheduled Date</p>
                      <p className="text-sm font-bold text-gray-800">
                        {trackedAppointment.appointmentDate ? new Date(trackedAppointment.appointmentDate).toLocaleDateString('en-GB') : "Not yet scheduled"}
                      </p>
                    </div>
                    <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Requested On</p>
                      <p className="text-sm font-bold text-gray-700">
                        {new Date(trackedAppointment.requestedDate).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>

                  {trackedAppointment.status === "approved" && trackedAppointment.agentName && (
                    <div className="bg-blue-50/30 rounded-2xl p-5 border border-blue-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Assigned Executive</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold">Name</p>
                          <p className="text-sm font-bold text-gray-900">{trackedAppointment.agentName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold">Contact</p>
                          <p className="text-sm font-bold text-gray-900">{trackedAppointment.agentPhone}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {trackedAppointment.status === "pending" && (
                  <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 text-orange-700 text-xs font-medium flex items-start gap-3">
                    <span className="text-lg mt-[-2px]">ℹ️</span>
                    <p>Your request is currently being reviewed. Once approved, scheduling and executive details will appear here.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Section 6 — Google Maps
      ══════════════════════════════════════════ */}

      <section id="map-section" className="w-full bg-gray-50 py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              📍 Find Us
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Our Office Location</h2>
            <p className="text-gray-500 text-sm">Unit No. 309, 3rd Floor, Tower-A of SAS Tower, Support Area, Medicity, Sector-38, Gurgaon 122001</p>
          </div>

          {/* Map */}
          <div ref={mapRef} className="vu-zoom rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
            style={{ boxShadow: "0 25px 60px rgba(0,0,0,.12)" }}>
            <iframe
              title="Digivahan Office Location"
              src="https://maps.google.com/maps?q=SAS%20Tower,%20Medicity,%20Sector-38,%20Gurgaon%20122001&t=&z=14&ie=UTF8&iwloc=&output=embed"
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
