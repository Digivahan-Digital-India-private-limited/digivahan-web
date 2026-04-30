const SELLER_FLOW_KEY = "dv_marketplace_seller_flow";

const defaultDraft = {
  regNumber: "",
  brand: "",
  modelYear: "",
  kmsDriven: "",
  city: "",
  expectedPrice: "",
  quoteValue: 0,
  inspectionType: "doorstep",
  inspectionDate: "",
  inspectionSlot: "",
  notes: "",
  offerId: "",
  acceptedAt: "",
};

export const getSellerFlowDraft = () => {
  try {
    const raw = localStorage.getItem(SELLER_FLOW_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return { ...defaultDraft, ...(parsed || {}) };
  } catch {
    return { ...defaultDraft };
  }
};

export const setSellerFlowDraft = (payload) => {
  const current = getSellerFlowDraft();
  const next = { ...current, ...(payload || {}) };
  localStorage.setItem(SELLER_FLOW_KEY, JSON.stringify(next));
  return next;
};

export const clearSellerFlowDraft = () => {
  localStorage.removeItem(SELLER_FLOW_KEY);
};

export const estimateQuote = ({ expectedPrice, modelYear, kmsDriven }) => {
  const expected = Number(expectedPrice || 0);
  const year = Number(modelYear || 2018);
  const kms = Number(kmsDriven || 0);

  const agePenalty = Math.max(0, (new Date().getFullYear() - year) * 0.035);
  const usagePenalty = Math.min(0.18, (kms / 100000) * 0.14);
  const multiplier = Math.max(0.62, 1 - agePenalty - usagePenalty);

  if (expected > 0) {
    return Math.round(expected * multiplier);
  }

  return Math.max(150000, Math.round(800000 * multiplier));
};
