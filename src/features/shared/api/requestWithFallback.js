export const requestWithFallback = async (requestFactories, fallbackFactory) => {
  let lastError = null;

  for (const createRequest of requestFactories) {
    try {
      return await createRequest();
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        throw error;
      }

      lastError = error;
    }
  }

  if (typeof fallbackFactory === "function") {
    return fallbackFactory(lastError);
  }

  throw lastError || new Error("No endpoint available");
};

export const unwrapCollection = (response) => {
  const body = response?.data ?? response;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.items)) return body.items;
  if (Array.isArray(body?.result)) return body.result;
  return [];
};

export const unwrapObject = (response) => {
  const body = response?.data ?? response;
  if (body?.data && typeof body.data === "object" && !Array.isArray(body.data)) {
    return body.data;
  }

  if (body?.result && typeof body.result === "object" && !Array.isArray(body.result)) {
    return body.result;
  }

  return body;
};
