import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  CalendarDays,
  CircleCheck,
  FileCheck2,
  IndianRupee,
  MapPin,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
  WalletCards,
} from "lucide-react";
import { marketplaceListings } from "../data/marketplaceMockData";
import { estimateQuote, getSellerFlowDraft, setSellerFlowDraft } from "../services/sellerFlowStorage";

const SELL_STEPS = [
  { id: 1, title: "Get Instant Quote" },
  { id: 2, title: "Book Inspection" },
  { id: 3, title: "Final Offer" },
  { id: 4, title: "Payment & RC Transfer" },
];

const BENEFITS = [
  {
    title: "Free Doorstep Inspection",
    description: "Certified inspectors evaluate your car at home with transparent checks.",
    icon: MapPin,
  },
  {
    title: "Instant Payment",
    description: "Receive payment on the same day after handover and verification.",
    icon: WalletCards,
  },
  {
    title: "Best Price Guarantee",
    description: "AI-assisted pricing and market benchmarking to maximize seller value.",
    icon: IndianRupee,
  },
  {
    title: "RC Transfer Support",
    description: "Dedicated operations team ensures smooth and trackable transfer completion.",
    icon: ShieldCheck,
  },
];

const REQUIRED_DOCUMENTS = [
  "RC",
  "Insurance",
  "PUC certificate",
  "ID proof",
  "Bank NOC",
];

const TIME_SLOTS = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM",
];

const TESTIMONIALS = [
  {
    quote: "Sold my car in just 24 hours. The inspection and payment process was very smooth.",
    name: "Amit Khanna",
    rating: 5,
  },
  {
    quote: "Best price among all platforms. The seller support team handled everything professionally.",
    name: "Priya Nair",
    rating: 5,
  },
  {
    quote: "Quick RC transfer updates gave me confidence throughout the full journey.",
    name: "Rohit Sharma",
    rating: 4,
  },
];

const FAQS = [
  {
    id: "faq-payment-time",
    question: "How long does payment take?",
    answer: "Most payments are processed on the same day once inspection, offer acceptance, and handover are complete.",
  },
  {
    id: "faq-inspection-cost",
    question: "Is inspection free?",
    answer: "Yes. Doorstep and hub inspections are free for eligible locations and slots.",
  },
  {
    id: "faq-price-calc",
    question: "How is the price calculated?",
    answer: "The estimate combines expected price input, model year, km driven, condition, demand trend, and local market rates.",
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const getIndexFromRegistration = (registrationNumber, total) => {
  if (!registrationNumber || !total) {
    return 0;
  }

  const hash = registrationNumber
    .split("")
    .reduce((acc, character) => acc + character.charCodeAt(0), 0);
  return hash % total;
};

const buildQuoteRange = (quoteValue) => {
  const min = Math.round((quoteValue * 0.93) / 1000) * 1000;
  const max = Math.round((quoteValue * 1.04) / 1000) * 1000;
  return { min, max };
};

const cardClass =
  "rounded-3xl border border-[#dce6f0] bg-white p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] md:p-5";

const inputClass =
  "w-full rounded-xl border border-[#cfdbea] bg-white px-3.5 py-2.5 text-[15px] text-slate-900 transition hover:border-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:border-sky-500";

const primaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border border-transparent bg-linear-to-r from-amber-500 to-rose-400 px-4 py-2.5 text-sm font-bold text-white shadow-[0_12px_24px_-18px_rgba(245,158,11,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-18px_rgba(245,158,11,0.95)] disabled:cursor-not-allowed disabled:opacity-75";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#cfdae7] bg-white px-4 py-2.5 text-sm font-bold text-[#183153] transition hover:-translate-y-0.5 hover:border-[#b6c9dd] hover:bg-[#f8fbff]";

const SellCarsPage = () => {
  const navigate = useNavigate();
  const draft = useMemo(() => getSellerFlowDraft(), []);
  const estimateTimeoutRef = useRef(null);
  const bookingTimeoutRef = useRef(null);

  const [registrationNumber, setRegistrationNumber] = useState(draft.regNumber || "");
  const [isEstimating, setIsEstimating] = useState(false);
  const [quoteResult, setQuoteResult] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  const [inspectionDate, setInspectionDate] = useState(draft.inspectionDate || "");
  const [selectedSlot, setSelectedSlot] = useState(draft.inspectionSlot || "");
  const [inspectionLocation, setInspectionLocation] = useState(draft.inspectionType || "home");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("");

  const [documentChecks, setDocumentChecks] = useState(() =>
    REQUIRED_DOCUMENTS.reduce((acc, document) => {
      acc[document] = false;
      return acc;
    }, {}),
  );

  useEffect(() => {
    return () => {
      if (estimateTimeoutRef.current) {
        window.clearTimeout(estimateTimeoutRef.current);
      }
      if (bookingTimeoutRef.current) {
        window.clearTimeout(bookingTimeoutRef.current);
      }
    };
  }, []);

  const handleRegistrationChange = (event) => {
    const value = event.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 12);
    setRegistrationNumber(value);
  };

  const handleGetInstantPrice = (event) => {
    event.preventDefault();

    if (registrationNumber.length < 8) {
      setBookingStatus("Please enter a valid registration number.");
      return;
    }

    setBookingStatus("");
    setIsEstimating(true);

    if (estimateTimeoutRef.current) {
      window.clearTimeout(estimateTimeoutRef.current);
    }

    estimateTimeoutRef.current = window.setTimeout(() => {
      const index = getIndexFromRegistration(registrationNumber, marketplaceListings.length);
      const listing = marketplaceListings[index] || marketplaceListings[0];
      const quoteValue = estimateQuote({
        expectedPrice: listing.price,
        modelYear: listing.year,
        kmsDriven: listing.kms,
      });
      const quoteRange = buildQuoteRange(quoteValue);

      setQuoteResult({
        image: listing.image,
        name: listing.title,
        year: listing.year,
        fuel: listing.fuel,
        transmission: listing.transmission,
        city: listing.city,
        quoteRange,
      });
      setActiveStep(1);
      setIsEstimating(false);

      setSellerFlowDraft({
        regNumber: registrationNumber,
        brand: listing.brand,
        modelYear: String(listing.year),
        kmsDriven: String(listing.kms),
        city: listing.city,
        expectedPrice: String(listing.price),
        quoteValue,
      });
    }, 900);
  };

  const handleContinueAfterQuote = () => {
    setActiveStep(2);
    document.getElementById("sell-inspection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleConfirmBooking = (event) => {
    event.preventDefault();

    if (!inspectionDate || !selectedSlot) {
      setBookingStatus("Select inspection date and time slot to confirm booking.");
      return;
    }

    setBookingStatus("");
    setIsBooking(true);

    if (bookingTimeoutRef.current) {
      window.clearTimeout(bookingTimeoutRef.current);
    }

    bookingTimeoutRef.current = window.setTimeout(() => {
      setIsBooking(false);
      setActiveStep(3);
      setBookingStatus("Inspection booked successfully. Final offer will be shared after inspection.");

      setSellerFlowDraft({
        regNumber: registrationNumber,
        inspectionDate,
        inspectionSlot: selectedSlot,
        inspectionType: inspectionLocation,
      });
    }, 900);
  };

  const markFinalOfferReady = () => {
    setActiveStep(3);
    setBookingStatus("Final offer has been generated. Proceed to payment and RC transfer.");
  };

  const markPaymentStarted = () => {
    setActiveStep(4);
    setBookingStatus("Payment and RC transfer tracking is now active.");
  };

  const handleDocumentToggle = (document) => {
    setDocumentChecks((previous) => ({
      ...previous,
      [document]: !previous[document],
    }));
  };

  const today = new Date().toISOString().split("T")[0];
  const completedDocsCount = Object.values(documentChecks).filter(Boolean).length;

  return (
    <div className="grid gap-4 text-[#10223e] font-[Inter,Poppins,system-ui,-apple-system,'Segoe_UI',sans-serif]">
      <section
        className={`${cardClass} grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:items-start`}
        aria-labelledby="sell-hero-title"
        style={{
          background:
            "radial-gradient(circle at 85% 20%, rgba(62, 193, 255, 0.2), transparent 45%), radial-gradient(circle at 20% 90%, rgba(73, 191, 137, 0.17), transparent 45%), linear-gradient(140deg, #f8fffb 0%, #f4fbff 40%, #f8fffe 100%)",
        }}
      >
        <div className="grid gap-2">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#bce5d0] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0f766e]">
            <Sparkles size={14} />
            Verified Sell Car Journey
          </p>
          <h1 id="sell-hero-title" className="m-0 text-[clamp(1.4rem,2.7vw,2.3rem)] font-extrabold leading-tight text-slate-900">
            Sell Your Car Quickly and Get the Best Price
          </h1>
          <p className="m-0 text-[0.98rem] leading-relaxed text-slate-600">
            Instant quote, free inspection, and secure payment.
          </p>
        </div>

        <form
          className="grid gap-2.5 rounded-[20px] border border-[#ddeaf6] bg-white p-4"
          onSubmit={handleGetInstantPrice}
          aria-label="Instant quote form"
        >
          <label htmlFor="sell-reg" className="text-sm font-bold tracking-[0.01em] text-[#243b5b]">
            Enter Registration Number
          </label>
          <input
            id="sell-reg"
            name="sell-reg"
            type="text"
            value={registrationNumber}
            onChange={handleRegistrationChange}
            placeholder="DL34AC4564"
            className={inputClass}
            aria-describedby="sell-reg-help"
            autoComplete="off"
            required
          />
          <p id="sell-reg-help" className="m-0 text-xs text-slate-500">
            Example: DL34AC4564
          </p>

          <button
            type="submit"
            className={primaryButtonClass}
            aria-label="Get instant price"
            aria-busy={isEstimating}
            disabled={isEstimating}
          >
            {isEstimating ? (
              <>
                <span
                  className="inline-block h-[0.95rem] w-[0.95rem] animate-spin rounded-full border-2 border-white/50 border-t-white"
                  aria-hidden="true"
                />
                Getting Price...
              </>
            ) : (
              "Get Instant Price"
            )}
          </button>

          <ul className="m-0 grid list-none gap-1 p-0 text-sm font-semibold text-slate-800" aria-label="Seller quick benefits">
            <li className="inline-flex items-center gap-1.5 text-[#0f766e]">
              <CircleCheck size={14} />
              Free Inspection
            </li>
            <li className="inline-flex items-center gap-1.5 text-[#0f766e]">
              <CircleCheck size={14} />
              Same Day Payment
            </li>
            <li className="inline-flex items-center gap-1.5 text-[#0f766e]">
              <CircleCheck size={14} />
              RC Transfer Support
            </li>
          </ul>
        </form>
      </section>

      {quoteResult ? (
        <section
          className={`${cardClass} grid gap-4 md:grid-cols-[240px_1fr] md:items-start`}
          aria-live="polite"
          aria-label="Price estimate"
        >
          <img
            src={quoteResult.image}
            alt={quoteResult.name}
            className="h-50 w-full rounded-[18px] border border-[#dbe5ef] bg-[#f4f8fc] object-cover"
          />

          <div className="grid gap-1.5">
            <h2 className="m-0 text-[1.15rem] font-extrabold text-slate-900">Price Estimate</h2>
            <h3 className="m-0 text-[1.35rem] font-extrabold text-slate-900">{quoteResult.name}</h3>
            <p className="m-0 text-[0.92rem] text-[#4a5e78]">
              {quoteResult.year} • {quoteResult.fuel} • {quoteResult.transmission}
            </p>
            <p className="m-0 text-[0.92rem] text-[#4a5e78]">Inspection city: {quoteResult.city}</p>
            <p className="m-0 text-[clamp(1.1rem,2vw,1.6rem)] font-extrabold text-[#0b4f7c]">
              {formatCurrency(quoteResult.quoteRange.min)} - {formatCurrency(quoteResult.quoteRange.max)}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" className={primaryButtonClass} onClick={handleContinueAfterQuote}>
                Continue
              </button>
              <button
                type="button"
                className={secondaryButtonClass}
                onClick={() => navigate(`/marketplace/sell/quote?reg=${registrationNumber}`)}
              >
                Open Full Quote Form
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <section id="sell-stepper" className={`${cardClass} px-4 py-3`} aria-label="Sell car progress">
        <ol className="m-0 grid list-none gap-2 p-0 md:grid-cols-4" role="list">
          {SELL_STEPS.map((step, index) => {
            const status =
              activeStep > step.id ? "completed" : activeStep === step.id ? "current" : "upcoming";

            const stepClass =
              status === "completed"
                ? "border-[#a7f3d0] bg-[#ecfdf5]"
                : status === "current"
                  ? "border-[#7dd3fc] bg-[#f0f9ff]"
                  : "border-[#dce5ef] bg-[#f8fbff]";

            const stepIndexClass =
              status === "completed"
                ? "bg-emerald-500 text-white"
                : status === "current"
                  ? "bg-sky-500 text-white"
                  : "bg-slate-200 text-slate-600";

            return (
              <li
                key={step.id}
                className={`flex items-center gap-2 rounded-[14px] border px-3 py-2 ${stepClass}`}
                aria-current={activeStep === step.id ? "step" : undefined}
              >
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold ${stepIndexClass}`}>
                  {index + 1}
                </span>
                <span className="text-sm font-bold text-[#223b5a]">{step.title}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className={cardClass}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="m-0 text-[1.15rem] font-extrabold text-slate-900">Why Sell With Us</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article
                key={benefit.title}
                className="rounded-2xl border border-[#dbe5ef] bg-linear-to-b from-white to-[#f9fcff] p-4 transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_12px_24px_-20px_rgba(14,165,233,0.8)]"
              >
                <div
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#eff8ff] text-sky-600"
                  aria-hidden="true"
                >
                  <Icon size={18} />
                </div>
                <h3 className="mb-0 mt-3 text-[0.98rem] font-extrabold text-[#132b47]">{benefit.title}</h3>
                <p className="mb-0 mt-1 text-sm leading-relaxed text-[#4a607d]">{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="sell-inspection" className={cardClass}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="m-0 text-[1.15rem] font-extrabold text-slate-900">Book Free Inspection</h2>
        </div>

        <form className="grid gap-3" onSubmit={handleConfirmBooking}>
          <div className="grid gap-2 rounded-2xl border border-[#e3ebf3] bg-[#fbfdff] p-4">
            <label htmlFor="inspection-date" className="text-sm font-bold tracking-[0.01em] text-[#243b5b]">
              Preferred Date
            </label>
            <input
              id="inspection-date"
              type="date"
              min={today}
              value={inspectionDate}
              onChange={(event) => setInspectionDate(event.target.value)}
              className={inputClass}
              required
            />
          </div>

          <fieldset className="grid gap-2 rounded-2xl border border-[#e3ebf3] bg-[#fbfdff] p-4">
            <legend className="px-1 text-sm font-bold tracking-[0.01em] text-[#243b5b]">Choose Time Slot</legend>
            <div className="grid gap-2 md:grid-cols-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-[10px] border px-3 py-2 text-left text-xs font-bold transition ${
                    selectedSlot === slot
                      ? "border-sky-500 bg-sky-50 text-[#0b4f7c]"
                      : "border-[#ced9e7] bg-white text-[#1d3557] hover:border-sky-300"
                  }`}
                  aria-pressed={selectedSlot === slot}
                >
                  {slot}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="grid gap-2 rounded-2xl border border-[#e3ebf3] bg-[#fbfdff] p-4">
            <legend className="px-1 text-sm font-bold tracking-[0.01em] text-[#243b5b]">Inspection Location</legend>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#23415f]">
                <input
                  type="radio"
                  name="inspection-location"
                  value="home"
                  checked={inspectionLocation === "home"}
                  onChange={(event) => setInspectionLocation(event.target.value)}
                  className="accent-sky-500"
                />
                Home pickup
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#23415f]">
                <input
                  type="radio"
                  name="inspection-location"
                  value="hub"
                  checked={inspectionLocation === "hub"}
                  onChange={(event) => setInspectionLocation(event.target.value)}
                  className="accent-sky-500"
                />
                Hub drop
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            className={primaryButtonClass}
            aria-busy={isBooking}
            disabled={isBooking}
          >
            {isBooking ? (
              <>
                <span
                  className="inline-block h-[0.95rem] w-[0.95rem] animate-spin rounded-full border-2 border-white/50 border-t-white"
                  aria-hidden="true"
                />
                Confirming...
              </>
            ) : (
              "Confirm Booking"
            )}
          </button>

          {bookingStatus ? (
            <p className="m-0 text-sm font-bold text-[#0f766e]" role="status">{bookingStatus}</p>
          ) : null}
        </form>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className={cardClass}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="m-0 text-[1.15rem] font-extrabold text-slate-900">Document Checklist</h2>
          </div>

          <ul className="m-0 grid list-none gap-2 p-0" aria-label="Required documents">
            {REQUIRED_DOCUMENTS.map((document) => (
              <li key={document}>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#dce6f0] bg-[#fbfdff] px-3 py-2 text-sm font-semibold text-[#1f3b5b]">
                  <input
                    type="checkbox"
                    checked={documentChecks[document]}
                    onChange={() => handleDocumentToggle(document)}
                    className="accent-sky-500"
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <FileCheck2 size={16} />
                    {document}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          <p className="mb-0 mt-2 text-sm font-bold text-slate-600">
            {completedDocsCount}/{REQUIRED_DOCUMENTS.length} documents ready
          </p>
        </article>

        <article className={cardClass}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="m-0 text-[1.15rem] font-extrabold text-slate-900">Secure Payment Guarantee</h2>
          </div>

          <ul className="m-0 grid list-none gap-2 p-0">
            <li className="inline-flex items-start gap-2 rounded-xl border border-[#e0e8f2] bg-[#f8fbff] p-3 text-sm font-semibold leading-relaxed text-[#294664]">
              <BadgeCheck size={16} className="mt-0.5 text-emerald-500" />
              Same-day payment processing after handover confirmation
            </li>
            <li className="inline-flex items-start gap-2 rounded-xl border border-[#e0e8f2] bg-[#f8fbff] p-3 text-sm font-semibold leading-relaxed text-[#294664]">
              <BadgeCheck size={16} className="mt-0.5 text-emerald-500" />
              Verified buyer allocation with fraud-protection checks
            </li>
            <li className="inline-flex items-start gap-2 rounded-xl border border-[#e0e8f2] bg-[#f8fbff] p-3 text-sm font-semibold leading-relaxed text-[#294664]">
              <BadgeCheck size={16} className="mt-0.5 text-emerald-500" />
              Live RC transfer tracking until completion
            </li>
          </ul>

          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={secondaryButtonClass} onClick={markFinalOfferReady}>
              Mark Final Offer Ready
            </button>
            <button type="button" className={primaryButtonClass} onClick={markPaymentStarted}>
              Start Payment & RC Transfer
            </button>
          </div>
        </article>
      </section>

      <section className={cardClass}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="m-0 text-[1.15rem] font-extrabold text-slate-900">Customer Testimonials</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-2xl border border-[#dce6f0] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_26px_-22px_rgba(15,23,42,0.9)]"
            >
              <div className="inline-flex gap-1 text-amber-500" aria-label={`${testimonial.rating} star rating`}>
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star key={`${testimonial.name}-${index}`} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="mb-0 mt-2 text-sm leading-relaxed text-[#203854]">"{testimonial.quote}"</p>
              <p className="mb-0 mt-2 text-sm font-bold text-slate-600">{testimonial.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={cardClass} id="sell-faq">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="m-0 text-[1.15rem] font-extrabold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="grid gap-2">
          {FAQS.map((faq) => (
            <details key={faq.id} className="rounded-xl border border-[#dde6f0] bg-[#fcfdff] px-3 py-0.5">
              <summary className="cursor-pointer list-none py-2.5 text-sm font-bold text-[#16304e] [&::-webkit-details-marker]:hidden">
                {faq.question}
              </summary>
              <p className="mb-3 mt-0 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={`${cardClass} grid gap-3`} aria-label="Help and support">
        <div>
          <h2 className="m-0 text-[1.15rem] font-extrabold text-slate-900">Need help selling your car?</h2>
          <p className="mb-0 mt-1 text-sm text-slate-600">
            Our support team is available every day for quote, inspection, and payment assistance.
          </p>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          <a className={secondaryButtonClass} href="tel:+919876543210" aria-label="Call support">
            <PhoneCall size={16} />
            Call Support
          </a>
          <button type="button" className={secondaryButtonClass} aria-label="Chat support">
            <MessageCircle size={16} />
            Chat Support
          </button>
          <a
            className={primaryButtonClass}
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp support"
          >
            <MessageCircle size={16} />
            WhatsApp Support
          </a>
        </div>
      </section>
    </div>
  );
};

export default SellCarsPage;
