import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Gauge,
  MapPin,
  Phone,
  Settings2,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { getBuyCompareIds, setBuyCompareIds } from "../services/buyerCompareStorage";
import {
  getMarketplaceListingById,
  reserveMarketplaceListing,
} from "../services/marketplaceBuyerApi";
import { marketplaceListings } from "../data/marketplaceMockData";

const FALLBACK_OWNER_AVATAR =
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300";

const FALLBACK_GALLERY_IMAGES = [
  "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/3972755/pexels-photo-3972755.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1400",
];

const CITY_LOCATION_HINTS = {
  delhi: "Greater Kailash, Delhi",
  gurugram: "Cyber City, Gurugram",
  noida: "Sector 62, Noida",
  bangalore: "Indiranagar, Bengaluru",
  mumbai: "Bandra West, Mumbai",
  pune: "Baner, Pune",
  jaipur: "Malviya Nagar, Jaipur",
  lucknow: "Gomti Nagar, Lucknow",
};

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDateLabel = (input) => {
  if (!input) {
    return new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    return String(input);
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const buildGallery = (listing) => {
  const sourceGallery = Array.isArray(listing?.gallery) ? listing.gallery : [];
  const candidates = [
    ...sourceGallery,
    listing?.image,
    ...FALLBACK_GALLERY_IMAGES,
  ];

  const unique = [];
  for (const image of candidates) {
    if (typeof image !== "string" || !image.trim()) {
      continue;
    }

    if (!unique.includes(image)) {
      unique.push(image);
    }
  }

  return unique.slice(0, 8);
};

const buildOwnerDetails = (listing) => {
  const owner = listing?.owner && typeof listing.owner === "object" ? listing.owner : {};
  const postedBy = String(listing?.postedBy || "dealer").toLowerCase();

  return {
    name: owner.name || (postedBy === "owner" ? "Vehicle Owner" : "Verified Dealer"),
    memberSince: owner.memberSince || "Since 2019",
    avatar: owner.avatar || FALLBACK_OWNER_AVATAR,
    phone: owner.phone || "+91 98765 43210",
    listedCount:
      Number.isFinite(Number(owner.listedCount))
        ? Number(owner.listedCount)
        : postedBy === "owner"
          ? 1
          : 12,
  };
};

const buildDescription = (listing) => {
  if (listing?.description) {
    return listing.description;
  }

  const title = listing?.title || "Used Car";
  const city = listing?.city || "your city";
  const highlights = Array.isArray(listing?.highlights) ? listing.highlights : [];

  const lines = [
    `${title} in excellent running condition, listed in ${city}.`,
    `Fuel: ${listing?.fuel || "Petrol"} | Transmission: ${listing?.transmission || "Manual"} | ${Number(listing?.kms || 0).toLocaleString()} km driven.`,
    "",
    "Top highlights:",
    ...highlights.map((item) => `- ${item}`),
    "",
    "Contact seller for complete inspection report and a test drive slot.",
  ];

  return lines.join("\n");
};

const BuyCarDetailsPage = () => {
  const { listingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [compareIds, setCompareIds] = useState(getBuyCompareIds());
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  const listingFromState = location.state?.listing;

  const { data: listing, isLoading } = useQuery({
    queryKey: ["marketplace-listing", listingId],
    queryFn: () => getMarketplaceListingById(listingId),
    enabled: Boolean(listingId),
    initialData: () =>
      listingFromState ||
      queryClient.getQueryData(["marketplace-listing", listingId]) ||
      null,
    staleTime: 2 * 60 * 1000,
    placeholderData: (previous) => previous,
  });

  const reserveMutation = useMutation({
    mutationFn: () => reserveMarketplaceListing(listing),
    onSuccess: (order) => {
      queryClient.setQueryData(["user-orders"], (previous = []) => {
        const current = Array.isArray(previous) ? previous : [];
        return [
          order,
          ...current.filter((item) => String(item.id) !== String(order.id)),
        ];
      });
      toast.success("Car reserved successfully");
      navigate(`/orders/${order.id}/review`);
    },
  });

  useEffect(() => {
    setActiveImageIndex(0);
  }, [listing?.id]);

  const galleryImages = useMemo(() => buildGallery(listing), [listing]);

  const ownerDetails = useMemo(() => buildOwnerDetails(listing), [listing]);

  const description = useMemo(() => buildDescription(listing), [listing]);

  const postedOn = formatDateLabel(listing?.postedOn || listing?.createdAt);

  const cityKey = String(listing?.city || "").trim().toLowerCase();
  const locationLabel =
    listing?.locationLabel ||
    CITY_LOCATION_HINTS[cityKey] ||
    `${listing?.city || "India"}`;

  const mapQuery = `${locationLabel}, India`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  const mapOpenUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  const relatedListings = useMemo(() => {
    if (!listing) {
      return [];
    }

    const currentId = String(listing.id);
    const currentBrand = String(listing.brand || "").toLowerCase();
    const currentCity = String(listing.city || "").toLowerCase();

    const score = (item) => {
      let value = 0;
      if (String(item.brand || "").toLowerCase() === currentBrand) {
        value += 3;
      }
      if (String(item.city || "").toLowerCase() === currentCity) {
        value += 2;
      }

      return value;
    };

    return marketplaceListings
      .filter((item) => String(item.id) !== currentId)
      .sort((a, b) => score(b) - score(a))
      .slice(0, 4);
  }, [listing]);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Loading listing details...
      </section>
    );
  }

  if (!listing) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Listing not found.
        <button
          type="button"
          onClick={() => navigate("/marketplace/buy")}
          className="ml-3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to Buy Cars
        </button>
      </section>
    );
  }

  const isCompared = compareIds.includes(listing.id);

  const handleToggleCompare = () => {
    const current = compareIds;

    if (current.includes(listing.id)) {
      const next = setBuyCompareIds(current.filter((id) => id !== listing.id));
      setCompareIds(next);
      toast.info("Removed from compare");
      return;
    }

    if (current.length >= 3) {
      toast.error("You can compare up to 3 cars");
      return;
    }

    const next = setBuyCompareIds([...current, listing.id]);
    setCompareIds(next);
    toast.success("Added to compare");
  };

  const reserveNow = async () => {
    try {
      await reserveMutation.mutateAsync();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reserve this car");
    }
  };

  const showPreviousImage = () => {
    setActiveImageIndex((previous) =>
      previous === 0 ? galleryImages.length - 1 : previous - 1,
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((previous) =>
      previous === galleryImages.length - 1 ? 0 : previous + 1,
    );
  };

  return (
    <div className="space-y-4 pb-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
          <img
            src={galleryImages[activeImageIndex]}
            alt={`${listing.title} preview ${activeImageIndex + 1}`}
            className="h-65 w-full object-contain sm:h-107.5"
          />

          {galleryImages.length > 1 ? (
            <>
              <button
                type="button"
                onClick={showPreviousImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/45 p-2 text-white transition hover:bg-black/65"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={showNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/45 p-2 text-white transition hover:bg-black/65"
              >
                <ChevronRight size={18} />
              </button>
            </>
          ) : null}

          <p className="absolute bottom-3 right-3 rounded-full border border-white/25 bg-black/50 px-2.5 py-1 text-xs font-semibold text-white">
            {activeImageIndex + 1}/{galleryImages.length}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              className={`overflow-hidden rounded-lg border transition ${
                index === activeImageIndex
                  ? "border-sky-500 ring-2 ring-sky-100"
                  : "border-slate-200"
              }`}
            >
              <img src={image} alt={`${listing.title} thumbnail ${index + 1}`} className="h-16 w-full bg-slate-100 object-cover" />
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px] xl:items-start">
        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h1 className="text-2xl font-bold text-slate-900">{listing.title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {listing.city} • {listing.fuel} • {listing.transmission}
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">
                Score {listing.inspectionScore}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">
                {Number(listing.kms || 0).toLocaleString()} km
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">
                EMI {formatPrice(listing.emiPerMonth)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <UserRound size={16} className="text-sky-700" />
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-500">Owner</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{listing.ownership || "First Owner"}</p>
              </article>

              <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <MapPin size={16} className="text-sky-700" />
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-500">Location</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{locationLabel}</p>
              </article>

              <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <CalendarDays size={16} className="text-sky-700" />
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-500">Posting Date</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{postedOn}</p>
              </article>

              <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <ShieldCheck size={16} className="text-sky-700" />
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-500">Inspection</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {listing.isInspected ? "Verified" : "Pending"}
                </p>
              </article>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={reserveNow}
                disabled={reserveMutation.isPending}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {reserveMutation.isPending ? "Reserving..." : "Reserve Now"}
              </button>
              <button
                type="button"
                onClick={handleToggleCompare}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {isCompared ? "Remove from Compare" : "Add to Compare"}
              </button>
              <Link
                to="/marketplace/buy"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Listings
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-lg font-bold text-slate-900">Description</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">{description}</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-lg font-bold text-slate-900">Related Ads</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {relatedListings.map((item) => (
                <Link
                  key={item.id}
                  to={`/marketplace/buy/${item.id}`}
                  state={{ listing: item }}
                  className="rounded-xl border border-slate-200 bg-white p-2 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <img src={item.image} alt={item.title} className="h-24 w-full rounded-lg object-cover" />
                  <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.city}</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{formatPrice(item.price)}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-3xl font-bold text-slate-900">{formatPrice(listing.price)}</p>
            <button
              type="button"
              onClick={() => toast.info("Offer flow will be enabled in next update")}
              className="mt-3 w-full rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
            >
              Make Offer
            </button>
            <button
              type="button"
              onClick={reserveNow}
              disabled={reserveMutation.isPending}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {reserveMutation.isPending ? "Reserving..." : "Reserve Instantly"}
            </button>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3">
              <img
                src={ownerDetails.avatar}
                alt={ownerDetails.name}
                className="h-12 w-12 rounded-full border border-slate-200 object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">{ownerDetails.name}</p>
                <p className="text-xs text-slate-500">Member {ownerDetails.memberSince}</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">{ownerDetails.listedCount} active listing(s)</p>

            <button
              type="button"
              onClick={() => toast.info("Chat integration coming soon")}
              className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Chat with Seller
            </button>
            <button
              type="button"
              onClick={() => setShowPhone((previous) => !previous)}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Phone size={15} />
              {showPhone ? ownerDetails.phone : "Show Number"}
            </button>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900">Seller Location</h3>
              <MapPin size={16} className="text-sky-700" />
            </div>
            <iframe
              title="Seller location map"
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="mt-3 h-52 w-full rounded-xl border border-slate-200"
            />
            <a
              href={mapOpenUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-sky-700 hover:text-sky-800"
            >
              Open in Google Maps
            </a>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <article className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                <Gauge size={14} className="text-sky-700" />
                <p className="mt-1 text-xs text-slate-500">KMs Driven</p>
                <p className="text-sm font-semibold text-slate-900">{Number(listing.kms || 0).toLocaleString()} km</p>
              </article>
              <article className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                <Settings2 size={14} className="text-sky-700" />
                <p className="mt-1 text-xs text-slate-500">Transmission</p>
                <p className="text-sm font-semibold text-slate-900">{listing.transmission}</p>
              </article>
              <article className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                <WalletCards size={14} className="text-sky-700" />
                <p className="mt-1 text-xs text-slate-500">Ownership</p>
                <p className="text-sm font-semibold text-slate-900">{listing.ownership || "First Owner"}</p>
              </article>
              <article className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                <ShieldCheck size={14} className="text-sky-700" />
                <p className="mt-1 text-xs text-slate-500">Inspection</p>
                <p className="text-sm font-semibold text-slate-900">{listing.inspectionScore}</p>
              </article>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
};

export default BuyCarDetailsPage;
