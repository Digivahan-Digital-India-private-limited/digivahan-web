import { requestWithFallback, unwrapObject } from "../../shared/api/requestWithFallback";
import httpClient from "../../shared/api/httpClient";
import { mockProfile } from "../../shared/mock/userSystemMockData";

const SESSION_REQUEST_TIMEOUT_MS = 3000;

export const getSessionUser = async () => {
  const response = await requestWithFallback(
    [
      () => httpClient.get("/api/users/me", { timeout: SESSION_REQUEST_TIMEOUT_MS }),
      () => httpClient.get("/api/user/profile", { timeout: SESSION_REQUEST_TIMEOUT_MS }),
    ],
    () => ({ data: mockProfile }),
  );

  return unwrapObject(response) || mockProfile;
};
