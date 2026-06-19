import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

const fetchUserDetails = async (qr_id) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/user-details/${qr_id}`,
    );

    if (!res.data.success) {
      const error = new Error(res.data.message);
      error.type = res.data.error_type;
      throw error;
    }

    const data = res.data.data;
    if (data) {
      data.full_Name = data.full_name || data.full_Name || "";
      data.fullName = data.full_name || data.full_Name || "";
    }
    return data;
  } catch (err) {
    const errorType = err.type || err.response?.data?.error_type;

    // 🛡️ MOCK FALLBACK FOR FRONTEND TESTING (when testing a vehicle without assigned QR)
    if (errorType === "INVALID_QR" || errorType === "NOT_ASSIGNED") {
      try {
        const token = Cookies.get("user_token");
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId || decoded.user_id;

          const userRes = await axios.post(`${BASE_URL}/api/get_user_details`, {
            user_id: userId,
            details_type: "all",
          });

          if (userRes.data?.success) {
            const u = userRes.data.data;
            return {
              user_id: userId,
              phone_number: u.basic_details?.phone_number || "",
              full_name:
                u.public_details?.nick_name ||
                `${u.basic_details?.first_name || ""} ${u.basic_details?.last_name || ""}`.trim() ||
                "Guest",
              profile_pic: u.public_details?.public_pic || "",
              age: u.public_details?.age || "",
              gender: u.public_details?.gender || "",
              address: u.public_details?.address || "",
              product_type: "vehicle",
              vehicle_id: qr_id !== "QR-DV-0000" ? qr_id : null,
              emergency_contacts: u.emergency_contacts || [],
            };
          }
        }
      } catch (mockErr) {
        console.warn("Mock user details fallback failed", mockErr);
      }
    }

    if (err.response?.data?.error_type) {
      const error = new Error(err.response.data.message);
      error.type = err.response.data.error_type;
      throw error;
    }

    throw err;
  }
};

export default fetchUserDetails;
