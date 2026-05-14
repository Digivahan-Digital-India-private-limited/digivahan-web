import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Fuel,
  Gauge,
  MapPin,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  WalletCards,
} from "lucide-react";
import { marketplaceFaqs, marketplaceListings } from "../data/marketplaceMockData";
import { getBuyCompareIds, setBuyCompareIds, toggleBuyCompareId } from "../services/buyerCompareStorage";

const PAGE_SIZE = 20;
const CURRENT_YEAR = new Date().getFullYear();
const MAX_PRICE = 2500000;
const MAX_KM = 200000;

const BUDGET_OPTIONS = [
  { value: "all", label: "Any budget", min: 0, max: Number.POSITIVE_INFINITY },
  { value: "under6", label: "Under Rs 6 Lakh", min: 0, max: 600000 },
  { value: "6to10", label: "Rs 6 - 10 Lakh", min: 600000, max: 1000000 },
  { value: "10to15", label: "Rs 10 - 15 Lakh", min: 1000000, max: 1500000 },
  { value: "above15", label: "Above Rs 15 Lakh", min: 1500000, max: Number.POSITIVE_INFINITY },
];

const FUEL_OPTIONS = ["Petrol", "Diesel", "CNG", "Electric"];
const TRANSMISSION_OPTIONS = ["Manual", "Automatic"];
const BODY_TYPE_OPTIONS = ["SUV", "Sedan", "Hatchback"];

const VIEW_MODES = [
  { value: "grid", label: "Grid View" },
  { value: "list", label: "List View" },
  { value: "map", label: "Map View" },
];

const SORT_OPTIONS = [
  { value: "bestMatch", label: "Best Match" },
  { value: "priceLow", label: "Price Low to High" },
  { value: "priceHigh", label: "Price High to Low" },
  { value: "newest", label: "Newest" },
  { value: "lowestKm", label: "Lowest KM" },
];

const INSURANCE_OPTIONS = ["all", "Comprehensive", "Third Party", "Expired"];

const TESTIMONIALS = [
  {
    id: "t1",
    quote: "Buying my car was fast and easy. Inspection report was transparent and exactly as promised.",
    name: "Rohit S.",
    rating: 5,
  },
  {
    id: "t2",
    quote: "The compare tool helped me decide between two SUVs in minutes. Super clean buying experience.",
    name: "Neha A.",
    rating: 5,
  },
  {
    id: "t3",
    quote: "From search to booking, everything felt premium and trustworthy. Support team was quick and helpful.",
    name: "Karan M.",
    rating: 4,
  },
];

const TRUST_FEATURES = [
  {
    id: "warranty",
    title: "6 Months Warranty",
    description: "Eligible cars include engine and gearbox warranty for peace of mind.",
    Icon: ShieldCheck,
  },
  {
    id: "trial",
    title: "7 Day Trial",
    description: "Short test period to ensure the car fits your driving comfort and daily needs.",
    Icon: CalendarDays,
  },
  {
    id: "inspection",
    title: "Free Inspection",
    description: "Every listing comes with a professional inspection checklist and score.",
    Icon: CircleCheckBig,
  },
  {
    id: "payment",
    title: "Secure Payment",
    description: "Protected transaction flow with documentation support and RC transfer guidance.",
    Icon: WalletCards,
  },
];

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatCompactPrice = (value) => {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(1)} Cr`;
  }
  if (value >= 100000) {
    return `${(value / 100000).toFixed(1)} L`;
  }
  return `${Math.round(value)}`;
};

const getListingYear = (listing) => {
  if (Number.isFinite(Number(listing.year))) {
    return Number(listing.year);
  }

  const match = String(listing.title || "").match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : CURRENT_YEAR - 5;
};

const inferBodyType = (listing) => {
  const source = `${listing.title || ""} ${listing.model || ""}`.toLowerCase();
  if (/(creta|nexon|thar|seltos|hector|brezza|xuv|sonet|suv|kiger|punch|zs ev)/.test(source)) {
    return "SUV";
  }
  if (/(city|slavia|dzire|sedan|verna|virtus)/.test(source)) {
    return "Sedan";
  }
  return "Hatchback";
};

const inferInsuranceStatus = (listing) => {
  if (listing.isInspected && Number(listing.kms) <= 60000) {
    return "Comprehensive";
  }

  if (Number(listing.kms) > 75000) {
    return "Third Party";
  }

  return "Comprehensive";
};

const getOwnershipBucket = (ownership) => {
  const normalized = String(ownership || "").toLowerCase();
  if (normalized.includes("first")) return "1st Owner";
  if (normalized.includes("second")) return "2nd Owner";
  return "2nd Owner";
};

const parseInspectionScore = (scoreText) => {
  const match = String(scoreText || "").match(/[\d.]+/);
  return match ? Number(match[0]) : 8;
};

const buildBadges = (listing) => {
  const badges = [];
  if (parseInspectionScore(listing.inspectionScore) >= 9) {
    badges.push("Best Deal");
  }
  if (Number(listing.kms) <= 25000) {
    badges.push("Low KM");
  }
  if (getListingYear(listing) >= CURRENT_YEAR - 1) {
    badges.push("New Arrival");
  }
  if (Number(String(listing.id).replace(/\D/g, "")) % 3 === 0) {
    badges.push("Price Drop");
  }
  return badges.slice(0, 3);
};

const createDefaultFilters = () => ({
  brand: "all",
  model: "",
  city: "all",
  budget: "all",
  heroFuel: "all",
  heroTransmission: "all",
  heroBodyType: "all",
  heroYear: "all",
  priceMin: 0,
  priceMax: MAX_PRICE,
  fuelTypes: [],
  transmissionTypes: [],
  bodyType: "all",
  ownership: "all",
  yearMin: 2014,
  yearMax: CURRENT_YEAR,
  kmMax: MAX_KM,
  location: "all",
  insurance: "all",
  searchTerm: "",
});

const sectionCardClass =
  "rounded-[1.25rem] border border-[#dbe5f1] bg-white shadow-[0_16px_38px_-26px_rgba(15,23,42,0.35)]";

const controlClass =
  "w-full rounded-[0.78rem] border border-[#dbe5f1] bg-white px-[0.65rem] py-[0.55rem] text-[0.86rem] text-slate-900 transition hover:border-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:border-[#1d4ed8]";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-[0.8rem] border border-transparent bg-linear-to-r from-[#1d4ed8] to-sky-500 px-4 py-2.5 text-[0.85rem] font-bold text-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_24px_-20px_rgba(29,78,216,0.85)]";

const ghostButtonClass =
  "inline-flex items-center justify-center rounded-[0.8rem] border border-[#dbe5f1] bg-white px-4 py-2.5 text-[0.85rem] font-bold text-slate-900 transition hover:bg-slate-100";

const BuyCarsPage = () => {
  const [draftFilters, setDraftFilters] = useState(createDefaultFilters);
  const [activeFilters, setActiveFilters] = useState(createDefaultFilters);
  const [sortBy, setSortBy] = useState("bestMatch");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [compareIds, setCompareIds] = useState(getBuyCompareIds());
  const [wishlistIds, setWishlistIds] = useState([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const normalizedListings = useMemo(
    () =>
      marketplaceListings.map((listing) => ({
        ...listing,
        year: getListingYear(listing),
        bodyType: inferBodyType(listing),
        insuranceStatus: inferInsuranceStatus(listing),
        ownershipBucket: getOwnershipBucket(listing.ownership),
        isVerified: Boolean(listing.isInspected),
      })),
    [],
  );

  const brands = useMemo(
    () => [...new Set(normalizedListings.map((item) => item.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [normalizedListings],
  );

  const cities = useMemo(
    () => [...new Set(normalizedListings.map((item) => item.city).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [normalizedListings],
  );

  const yearChoices = useMemo(() => {
    const years = [];
    for (let year = CURRENT_YEAR; year >= 2010; year -= 1) {
      years.push(year);
    }
    return years;
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTestimonialIndex((previous) => (previous + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const filteredListings = useMemo(() => {
    const budgetOption = BUDGET_OPTIONS.find((option) => option.value === activeFilters.budget) || BUDGET_OPTIONS[0];
    const searchTerm = activeFilters.searchTerm.trim().toLowerCase();
    const modelTerm = activeFilters.model.trim().toLowerCase();

    return normalizedListings.filter((listing) => {
      const searchable = `${listing.brand} ${listing.model || ""} ${listing.title} ${listing.city}`.toLowerCase();
      const searchMatch = !searchTerm || searchable.includes(searchTerm);
      const brandMatch = activeFilters.brand === "all" || String(listing.brand).toLowerCase() === activeFilters.brand;
      const modelMatch = !modelTerm || searchable.includes(modelTerm);
      const cityMatch = activeFilters.city === "all" || String(listing.city).toLowerCase() === activeFilters.city;

      const budgetMatch = Number(listing.price) >= budgetOption.min && Number(listing.price) <= budgetOption.max;
      const heroFuelMatch = activeFilters.heroFuel === "all" || String(listing.fuel).toLowerCase() === activeFilters.heroFuel;
      const heroTransmissionMatch =
        activeFilters.heroTransmission === "all" ||
        String(listing.transmission).toLowerCase() === activeFilters.heroTransmission;
      const heroBodyTypeMatch =
        activeFilters.heroBodyType === "all" ||
        String(listing.bodyType).toLowerCase() === activeFilters.heroBodyType;
      const heroYearMatch = activeFilters.heroYear === "all" || Number(listing.year) >= Number(activeFilters.heroYear);

      const rangePriceMatch = Number(listing.price) >= activeFilters.priceMin && Number(listing.price) <= activeFilters.priceMax;

      const sideFuelMatch =
        activeFilters.fuelTypes.length === 0 ||
        activeFilters.fuelTypes.some((item) => item.toLowerCase() === String(listing.fuel).toLowerCase());

      const sideTransmissionMatch =
        activeFilters.transmissionTypes.length === 0 ||
        activeFilters.transmissionTypes.some(
          (item) => item.toLowerCase() === String(listing.transmission).toLowerCase(),
        );

      const bodyTypeMatch =
        activeFilters.bodyType === "all" || String(listing.bodyType).toLowerCase() === activeFilters.bodyType;

      const ownershipMatch =
        activeFilters.ownership === "all" ||
        String(listing.ownershipBucket).toLowerCase() === activeFilters.ownership;

      const yearRangeMatch = Number(listing.year) >= activeFilters.yearMin && Number(listing.year) <= activeFilters.yearMax;
      const kmMatch = Number(listing.kms) <= activeFilters.kmMax;

      const locationMatch = activeFilters.location === "all" || String(listing.city).toLowerCase() === activeFilters.location;
      const insuranceMatch =
        activeFilters.insurance === "all" ||
        String(listing.insuranceStatus).toLowerCase() === activeFilters.insurance;

      return (
        searchMatch &&
        brandMatch &&
        modelMatch &&
        cityMatch &&
        budgetMatch &&
        heroFuelMatch &&
        heroTransmissionMatch &&
        heroBodyTypeMatch &&
        heroYearMatch &&
        rangePriceMatch &&
        sideFuelMatch &&
        sideTransmissionMatch &&
        bodyTypeMatch &&
        ownershipMatch &&
        yearRangeMatch &&
        kmMatch &&
        locationMatch &&
        insuranceMatch
      );
    });
  }, [activeFilters, normalizedListings]);

  const sortedListings = useMemo(() => {
    const next = [...filteredListings];

    if (sortBy === "priceLow") {
      next.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "priceHigh") {
      next.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "newest") {
      next.sort((a, b) => Number(b.year) - Number(a.year));
    } else if (sortBy === "lowestKm") {
      next.sort((a, b) => Number(a.kms) - Number(b.kms));
    } else {
      next.sort((a, b) => {
        const scoreA = parseInspectionScore(a.inspectionScore) * 4 - Number(a.kms) / 20000;
        const scoreB = parseInspectionScore(b.inspectionScore) * 4 - Number(b.kms) / 20000;
        return scoreB - scoreA;
      });
    }

    return next;
  }, [filteredListings, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedListings.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedListings = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedListings.slice(start, start + PAGE_SIZE);
  }, [currentPage, sortedListings]);

  const compareLink = `/marketplace/buy/compare?ids=${compareIds.join(",")}`;

  const compareCars = useMemo(
    () => normalizedListings.filter((item) => compareIds.includes(String(item.id))),
    [compareIds, normalizedListings],
  );

  const showingStart = sortedListings.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingEnd = Math.min(currentPage * PAGE_SIZE, sortedListings.length);

  const mapQuery =
    activeFilters.location !== "all"
      ? `${activeFilters.location}, India`
      : `${sortedListings
          .slice(0, 4)
          .map((item) => item.city)
          .join(", ") || "India"}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  const applyFilters = () => {
    setActiveFilters({ ...draftFilters });
    setCurrentPage(1);
    toast.success("Filters applied");
  };

  const resetFilters = () => {
    const reset = createDefaultFilters();
    setDraftFilters(reset);
    setActiveFilters(reset);
    setCurrentPage(1);
  };

  const toggleArrayFilter = (field, value) => {
    setDraftFilters((previous) => {
      const current = previous[field];
      const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
      return { ...previous, [field]: next };
    });
  };

  const toggleCompare = (listingId) => {
    const previous = compareIds;
    const next = toggleBuyCompareId(listingId);

    if (previous.length === next.length && !previous.includes(String(listingId))) {
      toast.error("You can compare up to 3 cars");
      return;
    }

    setCompareIds(next);
  };

  const removeCompare = (listingId) => {
    const next = setBuyCompareIds(compareIds.filter((id) => String(id) !== String(listingId)));
    setCompareIds(next);
  };

  const clearCompare = () => {
    setCompareIds(setBuyCompareIds([]));
  };

  const toggleWishlist = (listingId) => {
    setWishlistIds((previous) =>
      previous.includes(listingId)
        ? previous.filter((id) => id !== listingId)
        : [...previous, listingId],
    );
  };

  const nextTestimonial = () => {
    setTestimonialIndex((previous) => (previous + 1) % TESTIMONIALS.length);
  };

  const previousTestimonial = () => {
    setTestimonialIndex((previous) => (previous === 0 ? TESTIMONIALS.length - 1 : previous - 1));
  };

  const renderListingCard = (listing, listLayout = false) => {
    const isCompared = compareIds.includes(String(listing.id));
    const isWishlisted = wishlistIds.includes(listing.id);

    return (
      <article
        key={listing.id}
        className={`overflow-hidden rounded-2xl border border-[#dbe5f1] bg-white shadow-[0_10px_28px_-22px_rgba(15,23,42,0.58)] transition hover:-translate-y-0.75 hover:border-sky-300 hover:shadow-[0_18px_34px_-23px_rgba(30,64,175,0.36)] ${
          listLayout ? "md:grid md:grid-cols-[220px_1fr]" : ""
        }`}
      >
        <img
          src={listing.image}
          alt={listing.title}
          className={`w-full bg-slate-50 object-cover ${
            listLayout ? "h-[12.2rem] md:h-full md:min-h-55" : "h-[12.2rem]"
          }`}
        />

        <div className="p-3">
          <div className="flex items-center justify-between gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[0.69rem] font-bold text-emerald-700">
              <ShieldCheck size={13} /> Verified
            </span>
            <button
              type="button"
              className={`min-w-[2.1rem] rounded-[0.62rem] border px-2 py-1 text-base leading-none transition ${
                isWishlisted
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-[#dbe5f1] bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
              }`}
              onClick={() => toggleWishlist(listing.id)}
              aria-label="Toggle wishlist"
            >
              {isWishlisted ? "♥" : "♡"}
            </button>
          </div>

          <h3 className="mt-2.5 text-[1.02rem] font-bold leading-[1.35] text-slate-900">{listing.title}</h3>

          <div className="mt-2.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            <span className="inline-flex items-center gap-1 text-[0.78rem] font-semibold text-slate-700">
              <MapPin size={13} /> {listing.city}
            </span>
            <span className="inline-flex items-center gap-1 text-[0.78rem] font-semibold text-slate-700">
              <Fuel size={13} /> {listing.fuel}
            </span>
            <span className="inline-flex items-center gap-1 text-[0.78rem] font-semibold text-slate-700">
              <Settings2 size={13} /> {listing.transmission}
            </span>
            <span className="inline-flex items-center gap-1 text-[0.78rem] font-semibold text-slate-700">
              <Gauge size={13} /> {Number(listing.kms).toLocaleString()} km
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {buildBadges(listing).map((badge) => (
              <span
                key={`${listing.id}-${badge}`}
                className="rounded-full border border-sky-100 bg-blue-50 px-2 py-1 text-[0.67rem] font-extrabold tracking-[0.03em] text-blue-700"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-2.5 flex flex-col items-start gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="m-0 text-[1.05rem] font-extrabold text-slate-900">{formatPrice(listing.price)}</p>
            <p className="m-0 text-[0.76rem] font-semibold text-slate-600">
              EMI: {formatPrice(listing.emiPerMonth)} / month
            </p>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Link to={`/marketplace/buy/${listing.id}`} state={{ listing }} className={`${primaryButtonClass} text-center`}>
              View Details
            </Link>
            <button type="button" className={ghostButtonClass} onClick={() => toggleCompare(listing.id)}>
              {isCompared ? "Compared" : "Compare"}
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-4 pb-33 text-slate-900 font-[Inter,Poppins,system-ui,-apple-system,'Segoe_UI',sans-serif]">
      <section
        className="relative overflow-hidden rounded-[1.6rem] border border-sky-200 p-4 shadow-[0_16px_38px_-26px_rgba(15,23,42,0.35)]"
        aria-labelledby="buy-hero-title"
        style={{
          background:
            "radial-gradient(circle at 14% 10%, rgba(186, 230, 253, 0.6), transparent 43%), radial-gradient(circle at 88% 16%, rgba(224, 242, 254, 0.6), transparent 50%), linear-gradient(130deg, #eff6ff, #f8fafc 60%, #dbeafe)",
        }}
      >
        <div>
          <h1 id="buy-hero-title" className="m-0 text-[clamp(1.55rem,2.8vw,2.25rem)] font-extrabold leading-tight text-slate-900">
            Find Your Perfect Used Car
          </h1>
          <p className="mb-0 mt-2 max-w-[58ch] text-sm text-slate-600 sm:text-base">
            Verified sellers, transparent pricing, and hassle-free buying experience.
          </p>
        </div>

        <div className="mt-4 rounded-[1.15rem] border border-sky-100 bg-white/95 p-3" role="search" aria-label="Search cars">
          <div className="grid gap-2">
            <label htmlFor="hero-search-term" className="text-[0.8rem] font-bold tracking-[0.01em] text-slate-600">
              Search
            </label>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="hero-search-term"
                type="text"
                value={draftFilters.searchTerm}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, searchTerm: event.target.value }))}
                placeholder="Search by brand, model, city"
                className="w-full rounded-[0.8rem] border border-[#dbe5f1] bg-white py-[0.62rem] pl-8 pr-3 text-[0.86rem] text-slate-900 transition hover:border-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:border-[#1d4ed8]"
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-[0.55rem] sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-[0.76rem] font-bold text-slate-600">Brand</span>
              <select
                value={draftFilters.brand}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, brand: event.target.value }))}
                className={controlClass}
              >
                <option value="all">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand.toLowerCase()}>
                    {brand}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-[0.76rem] font-bold text-slate-600">Model</span>
              <input
                type="text"
                value={draftFilters.model}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, model: event.target.value }))}
                placeholder="Ex: Creta"
                className={controlClass}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-[0.76rem] font-bold text-slate-600">City</span>
              <select
                value={draftFilters.city}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, city: event.target.value }))}
                className={controlClass}
              >
                <option value="all">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city.toLowerCase()}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-[0.76rem] font-bold text-slate-600">Budget</span>
              <select
                value={draftFilters.budget}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, budget: event.target.value }))}
                className={controlClass}
              >
                {BUDGET_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-[0.76rem] font-bold text-slate-600">Fuel Type</span>
              <select
                value={draftFilters.heroFuel}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, heroFuel: event.target.value }))}
                className={controlClass}
              >
                <option value="all">Any</option>
                {FUEL_OPTIONS.map((item) => (
                  <option key={item} value={item.toLowerCase()}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-[0.76rem] font-bold text-slate-600">Transmission</span>
              <select
                value={draftFilters.heroTransmission}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, heroTransmission: event.target.value }))}
                className={controlClass}
              >
                <option value="all">Any</option>
                {TRANSMISSION_OPTIONS.map((item) => (
                  <option key={item} value={item.toLowerCase()}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-[0.76rem] font-bold text-slate-600">Body Type</span>
              <select
                value={draftFilters.heroBodyType}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, heroBodyType: event.target.value }))}
                className={controlClass}
              >
                <option value="all">Any</option>
                {BODY_TYPE_OPTIONS.map((item) => (
                  <option key={item} value={item.toLowerCase()}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-[0.76rem] font-bold text-slate-600">Year</span>
              <select
                value={draftFilters.heroYear}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, heroYear: event.target.value }))}
                className={controlClass}
              >
                <option value="all">Any year</option>
                <option value={CURRENT_YEAR - 1}>From {CURRENT_YEAR - 1}</option>
                <option value={CURRENT_YEAR - 3}>From {CURRENT_YEAR - 3}</option>
                <option value={CURRENT_YEAR - 5}>From {CURRENT_YEAR - 5}</option>
              </select>
            </label>
          </div>

          <div className="mt-3 flex justify-start">
            <button type="button" className={primaryButtonClass} onClick={applyFilters}>
              Search Cars
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label="Trust badges">
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[0.75rem] font-bold text-emerald-700">
              <CircleCheckBig size={14} /> Verified Sellers
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[0.75rem] font-bold text-emerald-700">
              <CircleCheckBig size={14} /> Free Inspection
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[0.75rem] font-bold text-emerald-700">
              <CircleCheckBig size={14} /> Easy EMI
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[0.75rem] font-bold text-emerald-700">
              <CircleCheckBig size={14} /> RC Transfer Support
            </span>
          </div>
        </div>
      </section>

      <main className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr] xl:items-start" aria-label="Buy cars content">
        <aside className={`${sectionCardClass} grid content-start gap-3 p-3`} aria-label="Advanced filters">
          <div>
            <h2 className="m-0 inline-flex items-center gap-1.5 text-[0.98rem] font-extrabold text-slate-900">
              <SlidersHorizontal size={16} /> Advanced Filters
            </h2>
          </div>

          <section className="rounded-[0.95rem] border border-[#dbe5f1] bg-[#f8fbff] p-3">
            <h3 className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.06em] text-slate-600">Price Range</h3>
            <div className="grid gap-1.5">
              <input
                type="range"
                min="0"
                max={MAX_PRICE}
                step="50000"
                value={draftFilters.priceMax}
                onChange={(event) => {
                  const nextMax = Number(event.target.value);
                  setDraftFilters((prev) => ({
                    ...prev,
                    priceMin: 0,
                    priceMax: nextMax,
                  }));
                }}
                className="w-full accent-[#1d4ed8]"
                aria-label="Maximum price"
              />
            </div>
            <p className="mb-0 mt-1.5 text-[0.78rem] font-bold text-slate-700">
              Up to {formatCompactPrice(draftFilters.priceMax)}
            </p>
          </section>

          <section className="rounded-[0.95rem] border border-[#dbe5f1] bg-[#f8fbff] p-3">
            <h3 className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.06em] text-slate-600">Fuel Type</h3>
            <fieldset className="grid gap-1.5">
              <legend className="sr-only">Fuel type</legend>
              {FUEL_OPTIONS.map((item) => (
                <label key={item} className="inline-flex items-center gap-1.5 text-[0.84rem] text-slate-800">
                  <input
                    type="checkbox"
                    checked={draftFilters.fuelTypes.includes(item)}
                    onChange={() => toggleArrayFilter("fuelTypes", item)}
                    className="accent-[#1d4ed8]"
                  />
                  {item}
                </label>
              ))}
            </fieldset>
          </section>

          <section className="rounded-[0.95rem] border border-[#dbe5f1] bg-[#f8fbff] p-3">
            <h3 className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.06em] text-slate-600">Transmission</h3>
            <fieldset className="grid gap-1.5">
              <legend className="sr-only">Transmission</legend>
              {TRANSMISSION_OPTIONS.map((item) => (
                <label key={item} className="inline-flex items-center gap-1.5 text-[0.84rem] text-slate-800">
                  <input
                    type="checkbox"
                    checked={draftFilters.transmissionTypes.includes(item)}
                    onChange={() => toggleArrayFilter("transmissionTypes", item)}
                    className="accent-[#1d4ed8]"
                  />
                  {item}
                </label>
              ))}
            </fieldset>
          </section>

          <section className="rounded-[0.95rem] border border-[#dbe5f1] bg-[#f8fbff] p-3">
            <h3 className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.06em] text-slate-600">Body Type</h3>
            <select
              value={draftFilters.bodyType}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, bodyType: event.target.value }))}
              className={controlClass}
            >
              <option value="all">All</option>
              {BODY_TYPE_OPTIONS.map((item) => (
                <option key={item} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </select>
          </section>

          <section className="rounded-[0.95rem] border border-[#dbe5f1] bg-[#f8fbff] p-3">
            <h3 className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.06em] text-slate-600">Ownership</h3>
            <select
              value={draftFilters.ownership}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, ownership: event.target.value }))}
              className={controlClass}
            >
              <option value="all">Any</option>
              <option value="1st owner">1st Owner</option>
              <option value="2nd owner">2nd Owner</option>
            </select>
          </section>

          <section className="rounded-[0.95rem] border border-[#dbe5f1] bg-[#f8fbff] p-3">
            <h3 className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.06em] text-slate-600">Year Range</h3>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={draftFilters.yearMin}
                onChange={(event) => {
                  const nextMin = Number(event.target.value);
                  setDraftFilters((prev) => ({
                    ...prev,
                    yearMin: nextMin,
                    yearMax: Math.max(nextMin, prev.yearMax),
                  }));
                }}
                className={controlClass}
              >
                {[...yearChoices].reverse().map((year) => (
                  <option key={`year-min-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                value={draftFilters.yearMax}
                onChange={(event) => {
                  const nextMax = Number(event.target.value);
                  setDraftFilters((prev) => ({
                    ...prev,
                    yearMax: nextMax,
                    yearMin: Math.min(prev.yearMin, nextMax),
                  }));
                }}
                className={controlClass}
              >
                {yearChoices.map((year) => (
                  <option key={`year-max-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="rounded-[0.95rem] border border-[#dbe5f1] bg-[#f8fbff] p-3">
            <h3 className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.06em] text-slate-600">KM Driven</h3>
            <input
              type="range"
              min="10000"
              max={MAX_KM}
              step="5000"
              value={draftFilters.kmMax}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, kmMax: Number(event.target.value) }))}
              className="w-full accent-[#1d4ed8]"
              aria-label="Maximum kilometers"
            />
            <p className="mb-0 mt-1.5 text-[0.78rem] font-bold text-slate-700">
              Up to {draftFilters.kmMax.toLocaleString()} km
            </p>
          </section>

          <section className="rounded-[0.95rem] border border-[#dbe5f1] bg-[#f8fbff] p-3">
            <h3 className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.06em] text-slate-600">Location</h3>
            <select
              value={draftFilters.location}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, location: event.target.value }))}
              className={controlClass}
            >
              <option value="all">All Locations</option>
              {cities.map((city) => (
                <option key={city} value={city.toLowerCase()}>
                  {city}
                </option>
              ))}
            </select>
          </section>

          <section className="rounded-[0.95rem] border border-[#dbe5f1] bg-[#f8fbff] p-3">
            <h3 className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.06em] text-slate-600">Insurance Status</h3>
            <select
              value={draftFilters.insurance}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, insurance: event.target.value }))}
              className={controlClass}
            >
              {INSURANCE_OPTIONS.map((option) => (
                <option key={option} value={option.toLowerCase()}>
                  {option}
                </option>
              ))}
            </select>
          </section>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button type="button" className={ghostButtonClass} onClick={resetFilters}>
              Reset Filters
            </button>
            <button type="button" className={primaryButtonClass} onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        </aside>

        <section className={`${sectionCardClass} p-3`} aria-label="Car listings">
          <div className="grid gap-3 border-b border-slate-200 pb-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <div className="flex items-center gap-2">
              <label htmlFor="sort-by" className="text-[0.82rem] font-bold text-slate-600">
                Sort by
              </label>
              <select id="sort-by" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={controlClass}>
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <p className="m-0 text-[0.84rem] font-semibold text-slate-700 lg:justify-self-center" aria-live="polite">
              Showing {showingStart}-{showingEnd} of {sortedListings.length} cars
            </p>

            <div className="inline-flex flex-wrap gap-1.5" role="tablist" aria-label="View toggles">
              {VIEW_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  role="tab"
                  aria-selected={viewMode === mode.value}
                  className={`rounded-full border px-3 py-1.5 text-[0.76rem] font-bold transition ${
                    viewMode === mode.value
                      ? "border-sky-300 bg-blue-50 text-blue-800"
                      : "border-[#dbe5f1] bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => setViewMode(mode.value)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {compareIds.length > 0 ? (
            <div
              className="mt-3 rounded-2xl border border-sky-200 bg-linear-to-r from-sky-50 to-blue-50 p-3"
              role="status"
              aria-live="polite"
              aria-label="Compare summary"
            >
              <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="m-0 text-sm font-bold text-slate-900">
                    {compareIds.length} car{compareIds.length > 1 ? "s" : ""} selected for comparison
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {compareCars.map((car) => (
                      <span
                        key={car.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white px-2.5 py-1 text-[0.72rem] font-semibold text-slate-700"
                      >
                        {car.brand} {car.model || ""}
                        <button
                          type="button"
                          onClick={() => removeCompare(car.id)}
                          aria-label={`Remove ${car.title} from compare`}
                          className="rounded-full bg-transparent px-1 text-sm leading-none text-slate-500 transition hover:text-slate-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:min-w-65">
                  <Link to={compareLink} className={`${primaryButtonClass} text-center`}>
                    Compare
                  </Link>
                  <button type="button" className={ghostButtonClass} onClick={clearCompare}>
                    Clear
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {pagedListings.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-sky-300 bg-sky-50 px-4 py-6 text-center" role="status" aria-live="polite">
              <svg width="120" height="90" viewBox="0 0 120 90" fill="none" aria-hidden="true" className="mx-auto">
                <rect x="10" y="42" width="100" height="24" rx="8" fill="#dbeafe" />
                <circle cx="34" cy="70" r="8" fill="#93c5fd" />
                <circle cx="86" cy="70" r="8" fill="#93c5fd" />
                <path d="M20 42L35 24H82L100 42" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <h3 className="mb-0 mt-3 text-base font-bold text-slate-900">No cars found matching your filters</h3>
              <p className="mb-0 mt-1 text-sm text-slate-600">Try broadening your price, city, or body type selection.</p>
              <button type="button" className={`${primaryButtonClass} mt-4`} onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {viewMode === "map" ? (
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <iframe
                    title="Car listings map"
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="min-h-70 w-full rounded-[0.95rem] border border-[#dbe5f1]"
                  />
                  <div className="grid gap-3 lg:max-h-136 lg:overflow-auto lg:pr-1">
                    {pagedListings.slice(0, 8).map((listing) => renderListingCard(listing, true))}
                  </div>
                </div>
              ) : (
                <div
                  className={`mt-4 grid gap-3 ${
                    viewMode === "list" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  }`}
                >
                  {pagedListings.map((listing) => renderListingCard(listing, viewMode === "list"))}
                </div>
              )}

              <nav className="mt-4 flex flex-wrap justify-center gap-1.5 border-t border-slate-200 pt-3" aria-label="Pagination">
                <button
                  type="button"
                  onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
                  disabled={currentPage === 1}
                  className="min-w-9 rounded-[0.6rem] border border-[#dbe5f1] bg-white px-2.5 py-1.5 text-[0.78rem] font-bold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`min-w-9 rounded-[0.6rem] border px-2.5 py-1.5 text-[0.78rem] font-bold transition ${
                      page === currentPage
                        ? "border-[#1d4ed8] bg-[#1d4ed8] text-white"
                        : "border-[#dbe5f1] bg-white text-slate-800 hover:bg-slate-100"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
                  disabled={currentPage === totalPages}
                  className="min-w-9 rounded-[0.6rem] border border-[#dbe5f1] bg-white px-2.5 py-1.5 text-[0.78rem] font-bold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Next
                </button>
              </nav>
            </>
          )}
        </section>
      </main>

      <section className={`${sectionCardClass} p-4`} aria-labelledby="buy-trust-title">
        <h2 id="buy-trust-title" className="m-0 text-[clamp(1.2rem,2vw,1.5rem)] font-extrabold text-slate-900">
          Why Buy From Us
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {TRUST_FEATURES.map(({ id, title, description, Icon }) => (
            <article key={id} className="rounded-2xl border border-[#dbe5f1] bg-[#f8fbff] p-3">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Icon size={20} />
              </div>
              <h3 className="mb-0 mt-2.5 text-[0.94rem] font-bold text-slate-900">{title}</h3>
              <p className="mb-0 mt-1 text-[0.84rem] leading-relaxed text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${sectionCardClass} p-4`} aria-labelledby="buy-testimonials-title">
        <div className="flex items-center justify-between gap-3">
          <h2 id="buy-testimonials-title" className="m-0 text-[clamp(1.2rem,2vw,1.5rem)] font-extrabold text-slate-900">
            What Customers Say
          </h2>
          <div className="inline-flex gap-1.5">
            <button
              type="button"
              onClick={previousTestimonial}
              aria-label="Previous review"
              className="inline-flex h-8 w-8 items-center justify-center rounded-[0.68rem] border border-[#dbe5f1] bg-white text-slate-800 transition hover:bg-slate-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={nextTestimonial}
              aria-label="Next review"
              className="inline-flex h-8 w-8 items-center justify-center rounded-[0.68rem] border border-[#dbe5f1] bg-white text-slate-800 transition hover:bg-slate-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <article className="mt-3 rounded-2xl border border-[#dbe5f1] bg-linear-to-br from-[#f8fbff] to-blue-50 p-4">
          <p className="m-0 text-[0.95rem] leading-relaxed text-slate-800">"{TESTIMONIALS[testimonialIndex].quote}"</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="m-0 font-bold text-slate-900">{TESTIMONIALS[testimonialIndex].name}</p>
            <div className="inline-flex gap-0.5 text-amber-500" aria-label={`${TESTIMONIALS[testimonialIndex].rating} star rating`}>
              {Array.from({ length: TESTIMONIALS[testimonialIndex].rating }).map((_, index) => (
                <Star key={`star-${index}`} size={14} fill="currentColor" />
              ))}
            </div>
          </div>
        </article>
      </section>

      <section id="faq" className={`${sectionCardClass} p-4`} aria-labelledby="buy-faq-title">
        <h2 id="buy-faq-title" className="m-0 text-[clamp(1.2rem,2vw,1.5rem)] font-extrabold text-slate-900">
          Frequently Asked Questions
        </h2>
        <div className="mt-3 grid gap-2">
          {marketplaceFaqs.map((faq) => (
            <details key={faq.id} className="rounded-[0.9rem] border border-[#dbe5f1] bg-slate-50 px-3 py-2">
              <summary className="cursor-pointer list-none text-[0.88rem] font-bold text-slate-900 [&::-webkit-details-marker]:hidden">
                {faq.question}
              </summary>
              <p className="mb-0 mt-2 text-[0.84rem] leading-relaxed text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BuyCarsPage;
