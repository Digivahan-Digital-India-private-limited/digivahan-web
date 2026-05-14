import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CircleHelp, Funnel, Search, SlidersHorizontal } from "lucide-react";
import MarketplaceListingCard from "../components/MarketplaceListingCard";
import { marketplaceFaqs, marketplaceListings } from "../data/marketplaceMockData";

const PRICE_MAX_LIMIT = 5000000;
const YEAR_MIN_LIMIT = 2005;
const YEAR_MAX_LIMIT = new Date().getFullYear();
const KM_MAX_LIMIT = 200000;
const PAGE_SIZE = 12;

const DISTANCE_OPTIONS = [
  { value: "all", label: "Any distance" },
  { value: "5", label: "Within 5 km" },
  { value: "10", label: "Within 10 km" },
  { value: "20", label: "Within 20 km" },
  { value: "30", label: "Within 30 km" },
  { value: "50", label: "Within 50 km" },
  { value: "100", label: "Within 100 km" },
  { value: "250", label: "Within 250 km" },
  { value: "500", label: "Within 500 km" },
  { value: "1000", label: "Within 1000 km" },
  { value: "2000", label: "Within 2000 km" },
];

const BUDGET_PRESETS = [
  { id: "under2", label: "Below Rs 2 Lakh", min: 0, max: 200000 },
  { id: "2to4", label: "Rs 2 - 4 Lakh", min: 200000, max: 400000 },
  { id: "4to6", label: "Rs 4 - 6 Lakh", min: 400000, max: 600000 },
  { id: "6to8", label: "Rs 6 - 8 Lakh", min: 600000, max: 800000 },
  { id: "8to12", label: "Rs 8 - 12 Lakh", min: 800000, max: 1200000 },
  { id: "above12", label: "Above Rs 12 Lakh", min: 1200000, max: null },
];

const YEAR_PRESETS = [
  { id: "past1", label: "Past 1 year" },
  { id: "past3", label: "Past 3 years" },
  { id: "past5", label: "Past 5 years" },
  { id: "past8", label: "Past 8 years" },
  { id: "older8", label: "Older than 8 years" },
];

const OWNER_OPTIONS = [
  { id: "1", label: "1st owner" },
  { id: "2", label: "2nd owner" },
  { id: "3", label: "3rd owner" },
  { id: "4", label: "4th or more" },
];

const POSTED_BY_OPTIONS = [
  { id: "owner", label: "Owner" },
  { id: "dealer", label: "Dealer" },
];

const KM_PRESETS = [
  { id: "under30000", label: "Below 30,000 km", min: 0, max: 30000 },
  { id: "30000to50000", label: "30,000 - 50,000 km", min: 30000, max: 50000 },
  { id: "50000to70000", label: "50,000 - 70,000 km", min: 50000, max: 70000 },
  { id: "70000to100000", label: "70,000 - 1,00,000 km", min: 70000, max: 100000 },
  { id: "above100000", label: "Above 1,00,000 km", min: 100000, max: null },
];

const FUEL_OPTIONS = ["Petrol", "Diesel", "CNG", "Electric", "LPG", "Hybrid"];
const TRANSMISSION_OPTIONS = ["Manual", "Automatic"];
const PRICE_SELECT_OPTIONS = [0, 200000, 400000, 600000, 800000, 1000000, 1200000, 1500000, 2000000, 3000000, PRICE_MAX_LIMIT];

const FilterSection = ({ title, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-3">
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</h3>
    <div className="mt-2 space-y-2">{children}</div>
  </section>
);

const formatPriceLabel = (value) => {
  if (value === 0) {
    return "No Min";
  }

  if (value === PRICE_MAX_LIMIT) {
    return "No Max";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const getOwnerCount = (ownershipText) => {
  const normalized = String(ownershipText || "").toLowerCase();
  if (normalized.includes("first")) return "1";
  if (normalized.includes("second")) return "2";
  if (normalized.includes("third")) return "3";
  return "4";
};

const getPostedBy = (listing) => {
  const explicit = String(listing?.postedBy || "").toLowerCase();
  if (explicit === "owner" || explicit === "dealer") {
    return explicit;
  }

  return String(listing?.sellerType || "").toLowerCase().includes("owner") ? "owner" : "dealer";
};

const getListingYear = (listing) => {
  if (listing?.year) {
    return Number(listing.year);
  }

  const match = String(listing?.title || "").match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : YEAR_MIN_LIMIT;
};

const matchesYearPreset = (year, presetId) => {
  if (presetId === "past1") return year >= YEAR_MAX_LIMIT - 1;
  if (presetId === "past3") return year >= YEAR_MAX_LIMIT - 3;
  if (presetId === "past5") return year >= YEAR_MAX_LIMIT - 5;
  if (presetId === "past8") return year >= YEAR_MAX_LIMIT - 8;
  if (presetId === "older8") return year < YEAR_MAX_LIMIT - 8;
  return false;
};

const toggleSelection = (value, setter) => {
  setter((previous) =>
    previous.includes(value)
      ? previous.filter((item) => item !== value)
      : [...previous, value],
  );
};

const MarketplaceHomePage = () => {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);

  const [category, setCategory] = useState("cars");
  const [location, setLocation] = useState("all");
  const [distance, setDistance] = useState("all");

  const [brandModelQuery, setBrandModelQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);

  const [selectedBudgetPresets, setSelectedBudgetPresets] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX_LIMIT);

  const [selectedYearPresets, setSelectedYearPresets] = useState([]);
  const [minYear, setMinYear] = useState(YEAR_MIN_LIMIT);
  const [maxYear, setMaxYear] = useState(YEAR_MAX_LIMIT);

  const [selectedOwners, setSelectedOwners] = useState([]);
  const [selectedPostedBy, setSelectedPostedBy] = useState([]);
  const [inspectedOnly, setInspectedOnly] = useState(false);

  const [selectedKmPresets, setSelectedKmPresets] = useState([]);
  const [maxKms, setMaxKms] = useState(KM_MAX_LIMIT);

  const [selectedFuels, setSelectedFuels] = useState([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState([]);

  const cityOptions = useMemo(
    () => ["all", ...new Set(marketplaceListings.map((item) => item.city).filter(Boolean))],
    [],
  );

  const allBrands = useMemo(
    () => [...new Set(marketplaceListings.map((item) => item.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [],
  );

  const filteredBrandOptions = useMemo(() => {
    const normalized = brandModelQuery.trim().toLowerCase();
    if (!normalized) {
      return allBrands;
    }

    return allBrands.filter((brand) => brand.toLowerCase().includes(normalized));
  }, [allBrands, brandModelQuery]);

  const yearOptions = useMemo(() => {
    const years = [];
    for (let year = YEAR_MAX_LIMIT; year >= YEAR_MIN_LIMIT; year -= 1) {
      years.push(year);
    }
    return years;
  }, []);

  const clearAllFilters = () => {
    setCategory("cars");
    setLocation("all");
    setDistance("all");
    setBrandModelQuery("");
    setSelectedBrands([]);
    setSelectedBudgetPresets([]);
    setMinPrice(0);
    setMaxPrice(PRICE_MAX_LIMIT);
    setSelectedYearPresets([]);
    setMinYear(YEAR_MIN_LIMIT);
    setMaxYear(YEAR_MAX_LIMIT);
    setSelectedOwners([]);
    setSelectedPostedBy([]);
    setInspectedOnly(false);
    setSelectedKmPresets([]);
    setMaxKms(KM_MAX_LIMIT);
    setSelectedFuels([]);
    setSelectedTransmissions([]);
  };

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedBrandModelQuery = brandModelQuery.trim().toLowerCase();

    return marketplaceListings.filter((listing) => {
      const searchableText = `${listing.title || ""} ${listing.brand || ""} ${listing.model || ""} ${listing.city || ""}`.toLowerCase();
      const topSearchMatch = !normalizedQuery || searchableText.includes(normalizedQuery);

      const categoryMatch = category === "all" || category === "cars";

      const locationMatch = location === "all" || listing.city === location;
      const distanceValue = Number.isFinite(Number(listing.distanceKm)) ? Number(listing.distanceKm) : Number.POSITIVE_INFINITY;
      const distanceMatch = distance === "all" || distanceValue <= Number(distance);

      const brandModelSearchMatch =
        !normalizedBrandModelQuery ||
        `${listing.brand || ""} ${listing.model || listing.title || ""}`
          .toLowerCase()
          .includes(normalizedBrandModelQuery);

      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(listing.brand);

      const price = Number(listing.price || 0);
      const dropdownBudgetMatch = price >= minPrice && price <= maxPrice;
      const budgetPresetMatch =
        selectedBudgetPresets.length === 0 ||
        selectedBudgetPresets.some((presetId) => {
          const preset = BUDGET_PRESETS.find((item) => item.id === presetId);
          if (!preset) {
            return false;
          }

          const presetMax = preset.max ?? Number.POSITIVE_INFINITY;
          return price >= preset.min && price <= presetMax;
        });

      const year = getListingYear(listing);
      const dropdownYearMatch = year >= minYear && year <= maxYear;
      const yearPresetMatch =
        selectedYearPresets.length === 0 ||
        selectedYearPresets.some((presetId) => matchesYearPreset(year, presetId));

      const ownerMatch =
        selectedOwners.length === 0 || selectedOwners.includes(getOwnerCount(listing.ownership));

      const postedByMatch =
        selectedPostedBy.length === 0 || selectedPostedBy.includes(getPostedBy(listing));

      const inspectionMatch = !inspectedOnly || Boolean(listing.isInspected);

      const kms = Number(listing.kms || 0);
      const kmSliderMatch = kms <= maxKms;
      const kmPresetMatch =
        selectedKmPresets.length === 0 ||
        selectedKmPresets.some((presetId) => {
          const preset = KM_PRESETS.find((item) => item.id === presetId);
          if (!preset) {
            return false;
          }

          const presetMax = preset.max ?? Number.POSITIVE_INFINITY;
          return kms >= preset.min && kms <= presetMax;
        });

      const fuelMatch =
        selectedFuels.length === 0 ||
        selectedFuels.some((fuel) => fuel.toLowerCase() === String(listing.fuel || "").toLowerCase());

      const transmissionMatch =
        selectedTransmissions.length === 0 ||
        selectedTransmissions.some(
          (transmission) => transmission.toLowerCase() === String(listing.transmission || "").toLowerCase(),
        );

      return (
        topSearchMatch &&
        categoryMatch &&
        locationMatch &&
        distanceMatch &&
        brandModelSearchMatch &&
        brandMatch &&
        dropdownBudgetMatch &&
        budgetPresetMatch &&
        dropdownYearMatch &&
        yearPresetMatch &&
        ownerMatch &&
        postedByMatch &&
        inspectionMatch &&
        kmSliderMatch &&
        kmPresetMatch &&
        fuelMatch &&
        transmissionMatch
      );
    });
  }, [
    brandModelQuery,
    category,
    distance,
    inspectedOnly,
    location,
    maxKms,
    maxPrice,
    maxYear,
    minPrice,
    minYear,
    query,
    selectedBrands,
    selectedBudgetPresets,
    selectedFuels,
    selectedKmPresets,
    selectedOwners,
    selectedPostedBy,
    selectedTransmissions,
    selectedYearPresets,
  ]);

  const sortedListings = useMemo(() => {
    const next = [...filteredListings];

    if (sortBy === "priceLow") {
      next.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === "priceHigh") {
      next.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === "kmsLow") {
      next.sort((a, b) => Number(a.kms || 0) - Number(b.kms || 0));
    } else if (sortBy === "newest") {
      next.sort((a, b) => getListingYear(b) - getListingYear(a));
    } else if (sortBy === "distance") {
      next.sort((a, b) => Number(a.distanceKm || 99999) - Number(b.distanceKm || 99999));
    }

    return next;
  }, [filteredListings, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedListings.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    category,
    location,
    distance,
    brandModelQuery,
    selectedBrands,
    selectedBudgetPresets,
    minPrice,
    maxPrice,
    selectedYearPresets,
    minYear,
    maxYear,
    selectedOwners,
    selectedPostedBy,
    inspectedOnly,
    selectedKmPresets,
    maxKms,
    selectedFuels,
    selectedTransmissions,
    query,
    sortBy,
  ]);

  const pagedListings = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedListings.slice(start, start + PAGE_SIZE);
  }, [currentPage, sortedListings]);

  const pageWindow = useMemo(() => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  }, [currentPage, totalPages]);

  const activeFilterCount =
    (category !== "cars" ? 1 : 0) +
    (location !== "all" ? 1 : 0) +
    (distance !== "all" ? 1 : 0) +
    (brandModelQuery.trim() ? 1 : 0) +
    (selectedBrands.length ? 1 : 0) +
    (selectedBudgetPresets.length ? 1 : 0) +
    (minPrice !== 0 || maxPrice !== PRICE_MAX_LIMIT ? 1 : 0) +
    (selectedYearPresets.length ? 1 : 0) +
    (minYear !== YEAR_MIN_LIMIT || maxYear !== YEAR_MAX_LIMIT ? 1 : 0) +
    (selectedOwners.length ? 1 : 0) +
    (selectedPostedBy.length ? 1 : 0) +
    (inspectedOnly ? 1 : 0) +
    (selectedKmPresets.length ? 1 : 0) +
    (maxKms !== KM_MAX_LIMIT ? 1 : 0) +
    (selectedFuels.length ? 1 : 0) +
    (selectedTransmissions.length ? 1 : 0);

  return (
    <div className="space-y-5 pb-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
              <SlidersHorizontal size={13} />
              DigiVahan Marketplace
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Find second-hand cars faster with advanced filters
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-600 sm:text-base">
              Use location, distance, budget, ownership, fuel, transmission, and inspection filters to narrow inventory in seconds.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/marketplace/buy"
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
            >
              Buying Page
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/marketplace/sell"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              Selling Page
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 lg:grid-cols-[1fr_270px]">
          <label className="relative block">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search cars by model, city, or brand"
              className="w-full rounded-xl border border-slate-200 px-9 py-2.5 text-sm outline-none focus:border-sky-500"
            />
          </label>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
          >
            <option value="relevance">Sort by: Relevance</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="newest">Model year: Newest</option>
            <option value="kmsLow">Kms: Low to High</option>
            <option value="distance">Distance: Nearest first</option>
          </select>
        </div>
      </section>

      <section className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[320px_1fr]">
        <aside className="h-fit space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-sm xl:sticky xl:top-22">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2">
            <h2 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
              <Funnel size={15} className="text-sky-700" />
              Filters
            </h2>
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-semibold text-slate-500 transition hover:text-slate-700"
            >
              Clear all
            </button>
          </div>

          <FilterSection title="Categories">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
            >
              <option value="all">All categories</option>
              <option value="cars">Cars</option>
            </select>
            <p className="rounded-lg bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-600">
              Cars ({marketplaceListings.length})
            </p>
          </FilterSection>

          <FilterSection title="Locations">
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
            >
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city === "all" ? "All India" : city}
                </option>
              ))}
            </select>

            <select
              value={distance}
              onChange={(event) => setDistance(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
            >
              {DISTANCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FilterSection>

          <FilterSection title="Brand and Model">
            <input
              value={brandModelQuery}
              onChange={(event) => setBrandModelQuery(event.target.value)}
              placeholder="Search brand or model"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
            />

            <div className="max-h-48 space-y-2 overflow-auto rounded-lg border border-slate-200 bg-white p-2">
              {filteredBrandOptions.length ? (
                filteredBrandOptions.map((brand) => (
                  <label key={brand} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleSelection(brand, setSelectedBrands)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    {brand}
                  </label>
                ))
              ) : (
                <p className="text-xs text-slate-500">No brands found.</p>
              )}
            </div>
          </FilterSection>

          <FilterSection title="Budget">
            <div className="space-y-1.5">
              {BUDGET_PRESETS.map((preset) => (
                <label key={preset.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedBudgetPresets.includes(preset.id)}
                    onChange={() => toggleSelection(preset.id, setSelectedBudgetPresets)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {preset.label}
                </label>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={minPrice}
                onChange={(event) => {
                  const nextMin = Number(event.target.value);
                  setMinPrice(nextMin);
                  if (nextMin > maxPrice) {
                    setMaxPrice(nextMin);
                  }
                }}
                className="rounded-lg border border-slate-200 px-2 py-2 text-xs outline-none focus:border-sky-500"
              >
                {PRICE_SELECT_OPTIONS.map((value) => (
                  <option key={`min-${value}`} value={value}>
                    {value === 0 ? "No Min" : formatPriceLabel(value)}
                  </option>
                ))}
              </select>

              <select
                value={maxPrice}
                onChange={(event) => {
                  const nextMax = Number(event.target.value);
                  setMaxPrice(nextMax);
                  if (nextMax < minPrice) {
                    setMinPrice(nextMax);
                  }
                }}
                className="rounded-lg border border-slate-200 px-2 py-2 text-xs outline-none focus:border-sky-500"
              >
                {PRICE_SELECT_OPTIONS.map((value) => (
                  <option key={`max-${value}`} value={value}>
                    {value === PRICE_MAX_LIMIT ? "No Max" : formatPriceLabel(value)}
                  </option>
                ))}
              </select>
            </div>
          </FilterSection>

          <FilterSection title="Year">
            <div className="space-y-1.5">
              {YEAR_PRESETS.map((preset) => (
                <label key={preset.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedYearPresets.includes(preset.id)}
                    onChange={() => toggleSelection(preset.id, setSelectedYearPresets)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {preset.label}
                </label>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={minYear}
                onChange={(event) => {
                  const nextMin = Number(event.target.value);
                  setMinYear(nextMin);
                  if (nextMin > maxYear) {
                    setMaxYear(nextMin);
                  }
                }}
                className="rounded-lg border border-slate-200 px-2 py-2 text-xs outline-none focus:border-sky-500"
              >
                {[...yearOptions].reverse().map((year) => (
                  <option key={`year-min-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={maxYear}
                onChange={(event) => {
                  const nextMax = Number(event.target.value);
                  setMaxYear(nextMax);
                  if (nextMax < minYear) {
                    setMinYear(nextMax);
                  }
                }}
                className="rounded-lg border border-slate-200 px-2 py-2 text-xs outline-none focus:border-sky-500"
              >
                {yearOptions.map((year) => (
                  <option key={`year-max-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </FilterSection>

          <FilterSection title="No. of Owners">
            <div className="space-y-1.5">
              {OWNER_OPTIONS.map((option) => (
                <label key={option.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedOwners.includes(option.id)}
                    onChange={() => toggleSelection(option.id, setSelectedOwners)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Posted By">
            <div className="space-y-1.5">
              {POSTED_BY_OPTIONS.map((option) => (
                <label key={option.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedPostedBy.includes(option.id)}
                    onChange={() => toggleSelection(option.id, setSelectedPostedBy)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Inspection Status">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={inspectedOnly}
                onChange={(event) => setInspectedOnly(event.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              Inspected Cars Only
            </label>
          </FilterSection>

          <FilterSection title="KM Driven">
            <div className="space-y-1.5">
              {KM_PRESETS.map((preset) => (
                <label key={preset.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedKmPresets.includes(preset.id)}
                    onChange={() => toggleSelection(preset.id, setSelectedKmPresets)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {preset.label}
                </label>
              ))}
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2">
              <input
                type="range"
                min="10000"
                max={KM_MAX_LIMIT}
                step="5000"
                value={maxKms}
                onChange={(event) => setMaxKms(Number(event.target.value))}
                className="w-full accent-sky-600"
              />
              <p className="mt-1 text-xs font-semibold text-slate-700">Up to {maxKms.toLocaleString()} km</p>
            </div>
          </FilterSection>

          <FilterSection title="Fuel">
            <div className="grid grid-cols-1 gap-1.5">
              {FUEL_OPTIONS.map((fuel) => (
                <label key={fuel} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedFuels.includes(fuel)}
                    onChange={() => toggleSelection(fuel, setSelectedFuels)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {fuel}
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Transmission">
            <div className="space-y-1.5">
              {TRANSMISSION_OPTIONS.map((type) => (
                <label key={type} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedTransmissions.includes(type)}
                    onChange={() => toggleSelection(type, setSelectedTransmissions)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {type}
                </label>
              ))}
            </div>
          </FilterSection>
        </aside>

        <div className="self-start rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Used cars for sale</h2>
              <p className="text-sm text-slate-500">
                {sortedListings.length} listing{sortedListings.length === 1 ? "" : "s"} available
              </p>
            </div>

            {activeFilterCount ? (
              <p className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                {activeFilterCount} active filter{activeFilterCount === 1 ? "" : "s"}
              </p>
            ) : null}
          </div>

          {pagedListings.length ? (
            <>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {pagedListings.map((listing) => (
                  <MarketplaceListingCard
                    key={listing.id}
                    listing={listing}
                    detailsPath={`/marketplace/buy/${listing.id}`}
                  />
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>

                {pageWindow.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                      page === currentPage
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-sm font-semibold text-slate-700">No cars match these filters.</p>
              <p className="mt-1 text-sm text-slate-500">
                Try clearing a few filters or expanding distance and budget range.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="faq" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <CircleHelp size={16} className="text-sky-700" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">FAQ Section</h3>
        </div>
        <div className="mt-3 space-y-2">
          {marketplaceFaqs.map((faq) => (
            <details key={faq.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MarketplaceHomePage;
