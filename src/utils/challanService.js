import axios from "axios";
import Cookies from "js-cookie";

/**
 * Challan Flow Service
 * Centralized API calls for the Pay Challan feature
 */

const BASE_URL = (import.meta.env.VITE_BASE_URL || "https://api.digivahan.in") + "/api";

/**
 * Initialize the challan payment flow (sends OTP)
 * @param {string} phone - 10-digit mobile number
 * @param {string} rcNumber - Vehicle RC number
 * @returns {Promise<Object>}
 */
export const initChallanFlow = async (phone, rcNumber) => {
  try {
    const response = await axios.post(`${BASE_URL}/challan-flow/init`, {
      phone,
      rcNumber: rcNumber ? rcNumber.toUpperCase() : "",
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to initialize challan flow";
  }
};

/**
 * Verify the OTP and finalize authentication
 * @param {string} flowId - The flow ID from init step
 * @param {string} otp - 6-digit OTP
 * @returns {Promise<Object>}
 */
export const verifyChallanOtp = async (flowId, otp) => {
  try {
    const response = await axios.post(`${BASE_URL}/challan-flow/verify`, {
      flow_id: flowId,
      otp,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Verification failed";
  }
};

/**
 * Fetch Challan History for the logged-in user
 * @returns {Promise<Object>}
 */
export const getChallanHistory = async () => {
  try {
    const token = Cookies.get("token") || Cookies.get("user_token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(`${BASE_URL}/challan-flow/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch challan history";
  }
};

/**
 * Get Payment URL for Challan
 * @param {string} vehicleNumber - Vehicle number
 * @param {Array<string>} challanNumbers - List of challan numbers
 * @returns {Promise<Object>}
 */
export const getChallanPaymentUrl = async (vehicleNumber, challanNumbers) => {
  try {
    const response = await axios.post(`${BASE_URL}/challan-flow/payment-url`, {
      vehicleNumber,
      challanNumbers,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to generate payment URL";
  }
};

export const refreshChallanData = async (rcNumber) => {
  try {
    const token = Cookies.get("token") || Cookies.get("user_token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.post(
      `${BASE_URL}/challan-flow/refresh`,
      { rcNumber },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to refresh challans";
  }
};

export const directSearchChallanData = async (rcNumber) => {
  try {
    const token = Cookies.get("token") || Cookies.get("user_token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.post(
      `${BASE_URL}/challan-flow/direct-search`,
      { rcNumber },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to search challans";
  }
};

const challanService = {
  initChallanFlow,
  verifyChallanOtp,
  getChallanHistory,
  getChallanPaymentUrl,
  refreshChallanData,
  directSearchChallanData,
};

export default challanService;
