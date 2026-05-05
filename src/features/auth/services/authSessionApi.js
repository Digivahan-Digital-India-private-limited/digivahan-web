import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import httpClient from "../../shared/api/httpClient";
import { requestWithFallback } from "../../shared/api/requestWithFallback";
import { mockProfile } from "../../shared/mock/userSystemMockData";

const SESSION_REQUEST_TIMEOUT_MS = 10000;

export const getSessionUser = async () => {
  const token = Cookies.get("user_token");
  let userId = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || decoded.user_id;
    } catch (e) {
      console.error("Token decode error", e);
    }
  }

  const response = await requestWithFallback(
    [
      () => userId ? httpClient.post("/api/get_user_details", { user_id: userId, details_type: "all" }) : Promise.reject("No User ID"),
      () => httpClient.get("/api/users/me", { timeout: SESSION_REQUEST_TIMEOUT_MS }),
    ],
    () => ({ data: mockProfile }),
  );

  return response.data?.data || response.data || mockProfile;
};
