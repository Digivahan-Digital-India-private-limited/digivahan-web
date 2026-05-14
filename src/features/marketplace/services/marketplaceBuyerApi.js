import httpClient from "../../shared/api/httpClient";
import {
  requestWithFallback,
  unwrapCollection,
  unwrapObject,
} from "../../shared/api/requestWithFallback";
import { marketplaceListings } from "../data/marketplaceMockData";
import { upsertLocalOrder } from "../../orders/services/ordersApi";

const LISTING_DETAILS_TIMEOUT_MS = 3000;

const parseYearFromTitle = (title) => {
  const match = String(title || "").match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : new Date().getFullYear();
};

const normalizeListing = (item) => ({
  id: String(item?.id || item?._id || item?.vehicle_id || item?.listing_id || ""),
  title: item?.title || item?.vehicle_name || item?.name || "Used Car",
  year: Number(item?.year || item?.manufacture_year || parseYearFromTitle(item?.title || item?.name)),
  brand: item?.brand || item?.make || item?.manufacturer || "",
  model: item?.model || item?.variant || "",
  city: item?.city || item?.location || "N/A",
  fuel: item?.fuel || item?.fuel_type || "Petrol",
  transmission: item?.transmission || item?.gearbox || "Manual",
  kms: Number(item?.kms || item?.kms_driven || item?.odometer || 0),
  price: Number(item?.price || item?.amount || item?.expected_price || 0),
  ownership: item?.ownership || item?.owner_type || "First Owner",
  inspectionScore: item?.inspectionScore || item?.inspection_score || "8.0/10",
  emiPerMonth: Number(item?.emiPerMonth || item?.emi_per_month || 0),
  highlights: Array.isArray(item?.highlights)
    ? item.highlights
    : Array.isArray(item?.key_highlights)
      ? item.key_highlights
      : [],
  image:
    item?.image ||
    item?.image_url ||
    item?.thumbnail ||
    "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200",
  sellerType: item?.sellerType || item?.seller_type || "Verified Seller",
  postedBy:
    item?.postedBy ||
    item?.posted_by ||
    item?.seller_category ||
    "dealer",
  isInspected: Boolean(item?.isInspected ?? item?.inspected ?? item?.inspection_done ?? false),
  distanceKm: Number(item?.distanceKm || item?.distance_km || item?.distance || 99999),
});

const normalizeOrderFromReserve = (item, listing) => ({
  id: String(item?.id || item?._id || item?.order_id || item?.booking_id || `mk_${Date.now()}`),
  item:
    item?.item ||
    item?.product_name ||
    item?.vehicle_name ||
    item?.title ||
    listing?.title ||
    "Reserved Car",
  status: item?.status || item?.order_status || item?.booking_status || "Reserved",
  date:
    item?.date ||
    item?.created_at ||
    item?.createdAt ||
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  amount: Number(item?.amount || item?.price || item?.total_amount || listing?.price || 0),
});

const getMockListingById = (listingId) =>
  marketplaceListings.find((item) => String(item.id) === String(listingId)) || null;

export const getMarketplaceListingById = async (listingId) => {
  const localListing = getMockListingById(listingId);
  if (localListing) {
    return normalizeListing(localListing);
  }

  const response = await requestWithFallback(
    [
      () => httpClient.get(`/api/marketplace/vehicles/${listingId}`, { timeout: LISTING_DETAILS_TIMEOUT_MS }),
      () => httpClient.get(`/api/marketplace/listings/${listingId}`, { timeout: LISTING_DETAILS_TIMEOUT_MS }),
      () => httpClient.get(`/api/vehicles/${listingId}`, { timeout: LISTING_DETAILS_TIMEOUT_MS }),
    ],
    () => ({ data: getMockListingById(listingId) }),
  );

  return normalizeListing(unwrapObject(response));
};

export const compareMarketplaceListings = async (ids) => {
  const listingIds = Array.isArray(ids)
    ? ids.map((id) => String(id).trim()).filter(Boolean)
    : [];

  if (!listingIds.length) {
    return [];
  }

  const response = await requestWithFallback(
    [
      () => httpClient.post("/api/marketplace/vehicles/compare", { listing_ids: listingIds }),
      () => httpClient.post("/api/marketplace/buy/compare", { ids: listingIds }),
      () => httpClient.get(`/api/marketplace/vehicles/compare?ids=${listingIds.join(",")}`),
    ],
    () => ({
      data: listingIds
        .map((id) => getMockListingById(id))
        .filter(Boolean),
    }),
  );

  const body = unwrapObject(response);
  const collection = Array.isArray(body?.listings)
    ? body.listings
    : Array.isArray(body?.vehicles)
      ? body.vehicles
      : unwrapCollection(response);

  return collection.map(normalizeListing);
};

export const reserveMarketplaceListing = async (listing) => {
  const listingId = String(listing?.id || "");

  if (!listingId) {
    throw new Error("Invalid listing selected for reservation");
  }

  const payload = {
    listing_id: listingId,
    vehicle_id: listingId,
    booking_type: "reservation",
  };

  const response = await requestWithFallback(
    [
      () => httpClient.post("/api/marketplace/bookings", payload),
      () => httpClient.post("/api/marketplace/reservations", payload),
      () => httpClient.post("/api/bookings", payload),
      () => httpClient.post("/api/orders", payload),
    ],
    () => ({
      data: {
        order_id: `mk_${Date.now()}`,
        vehicle_name: listing?.title,
        order_status: "Reserved",
        amount: listing?.price || 0,
        createdAt: new Date().toISOString(),
      },
    }),
  );

  const order = normalizeOrderFromReserve(unwrapObject(response), listing);
  upsertLocalOrder(order);
  return order;
};
