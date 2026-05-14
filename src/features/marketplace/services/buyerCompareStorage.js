const BUY_COMPARE_KEY = "dv_marketplace_buy_compare_ids";

const normalizeIds = (ids) => {
  if (!Array.isArray(ids)) {
    return [];
  }

  return ids
    .map((id) => String(id).trim())
    .filter(Boolean)
    .slice(0, 3);
};

export const getBuyCompareIds = () => {
  try {
    const raw = localStorage.getItem(BUY_COMPARE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return normalizeIds(parsed);
  } catch {
    return [];
  }
};

export const setBuyCompareIds = (ids) => {
  const next = normalizeIds(ids);
  localStorage.setItem(BUY_COMPARE_KEY, JSON.stringify(next));
  return next;
};

export const toggleBuyCompareId = (id) => {
  const current = getBuyCompareIds();
  const key = String(id);

  if (current.includes(key)) {
    return setBuyCompareIds(current.filter((item) => item !== key));
  }

  if (current.length >= 3) {
    return current;
  }

  return setBuyCompareIds([...current, key]);
};

export const clearBuyCompareIds = () => {
  localStorage.removeItem(BUY_COMPARE_KEY);
};
