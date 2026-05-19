import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import httpClient from "../../shared/api/httpClient";

/**
 * Creates a Razorpay order via the backend.
 * @param {number} amount - Amount in paise (e.g., 19900 for Rs 199)
 * @param {string} purpose - e.g., "QR Order"
 * @returns Razorpay order object + key_id
 */
export const createRazorpayOrder = async (amount, purpose = "QR Order") => {
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

  if (!userId) throw new Error("User not authenticated");

  const response = await httpClient.post("/api/v1/razorpay/order", {
    amount,
    user_id: userId,
    purpose,
    status: "live", // use "test" for test mode
  });

  return response.data;
};

/**
 * Opens the Razorpay checkout modal and returns payment details on success.
 * @param {object} razorpayOrder - Order from createRazorpayOrder
 * @param {object} userDetails - { name, email, phone }
 * @returns Promise<{ razorpay_payment_id, razorpay_order_id, razorpay_signature }>
 */
export const openRazorpayCheckout = (razorpayOrder, userDetails = {}) => {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error("Razorpay SDK not loaded. Please refresh and try again."));
      return;
    }

    const options = {
      key: razorpayOrder.razorpay_key_id,
      amount: razorpayOrder.order.amount,
      currency: "INR",
      name: "DigiVahan",
      description: "Smart QR Sticker Order",
      image: "/favicon.ico",
      order_id: razorpayOrder.order.id,
      prefill: {
        name: userDetails.name || "",
        email: userDetails.email || "",
        contact: userDetails.phone || "",
      },
      theme: {
        color: "#059669",
      },
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled by user")),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  });
};

/**
 * Dynamically loads the Razorpay checkout script.
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
};
