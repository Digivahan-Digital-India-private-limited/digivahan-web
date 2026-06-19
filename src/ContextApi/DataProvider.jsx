import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";
const ENABLE_DUMMY_USER_AUTH = false;
export const MyContext = createContext();

const DataProvider = ({ children }) => {
  const [DeliveryOrders, setDeliveryOrders] = useState([]);
  const [ShiprocketOrders, setShiprocketOrders] = useState([]);
  const [ConfirmedOrders, setConfirmedOrders] = useState([]);
  const [PendingOrders, setPendingOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [filterQrlist, setfilterQrlist] = useState([]);

  const postWithFallback = async (endpointList, payload, config = {}) => {
    let lastError = null;

    for (const endpoint of endpointList) {
      try {
        return await axios.post(`${BASE_URL}${endpoint}`, payload, config);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  };
  const AdminSignInwithOtp = async (phone) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/admin/send-otp`, {
        phone,
      });

      if (response.data) {
        return response.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP send failed");

      return null;
    }
  };

  const verifyAdminOtp = async (userOtp) => {
    try {
      const phone = localStorage.getItem("login_phone");

      const response = await axios.post(
        `${BASE_URL}/api/auth/admin/verify-admin`,
        {
          phone,
          OtpCode: userOtp,
        },
      );

      if (response && response.data) {
        const token = response.data.token;

        Cookies.set("admin_token", token, {
          expires: 7,
          secure: false,
          sameSite: "Strict",
        });

        localStorage.removeItem("login_phone");

        return response.data; // ✅ always return
      }

      return null; // ✅ explicit fallback
    } catch (error) {
      console.log("Context error:", error);

      toast.error(error.response?.data?.message || "Verification failed");

      return null;
    }
  };

  const UserSignInwithOtp = async (phone) => {
    if (ENABLE_DUMMY_USER_AUTH) {
      return {
        success: true,
        message: "Dummy OTP sent successfully",
        phone,
      };
    }

    try {
      const response = await postWithFallback(
        [
          "/api/auth/otp-based-login",
          "/api/auth/user/send-otp",
          "/api/auth/send-otp",
        ],
        {
          login_via: "phone",
          value: phone,
        },
      );

      if (response.data) {
        return response.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "User OTP send failed");
      return null;
    }
  };

  const verifyUserOtp = async (userOtp) => {
    if (ENABLE_DUMMY_USER_AUTH) {
      const phone = localStorage.getItem("user_login_phone") || "dummy";
      const token = `dummy_user_${phone}_${userOtp || "otp"}`;

      Cookies.set("user_token", token, {
        expires: 7,
        secure: false,
        sameSite: "Strict",
      });

      localStorage.setItem(
        "marketplace_capabilities",
        JSON.stringify({ canBuy: true, canSell: true }),
      );
      localStorage.removeItem("user_login_phone");

      return {
        success: true,
        token,
        mode: "buy_sell",
        message: "Dummy login successful",
      };
    }

    try {
      const phone = localStorage.getItem("user_login_phone");

      const response = await postWithFallback(
        [
          "/api/auth/verify-login-otp",
          "/api/auth/user/verify-otp",
          "/api/auth/user/verify-user",
        ],
        {
          login_via: "phone",
          value: phone,
          otp: userOtp,
        },
      );

      if (response?.data) {
        const token =
          response.data.user?.token ||
          response.data.token ||
          response.data.accessToken ||
          response.data?.data?.token ||
          response.data?.data?.accessToken;

        if (token) {
          Cookies.set("user_token", token, {
            expires: 7,
            secure: false,
            sameSite: "Strict",
          });
        }

        localStorage.setItem(
          "marketplace_capabilities",
          JSON.stringify({ canBuy: true, canSell: true }),
        );
        localStorage.removeItem("user_login_phone");

        return response.data;
      }

      return null;
    } catch (error) {
      toast.error(error.response?.data?.message || "User OTP verification failed");
      return null;
    }
  };
  const LogoutAdmin = async () => {
    try {
      // ✅ get token from cookies
      const token = Cookies.get("admin_token");
      console.log(token);

      if (!token) {
        toast.error("No active session found");
        return null;
      }

      // ✅ call logout API
      const response = await axios.post(
        `${BASE_URL}/api/auth/admin/logout-admin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data);

      // ✅ if logout successful
      if (response.data) {
        // remove cookie
        Cookies.remove("admin_token");
        toast.success("Logged out successfully");
        return response.data;
      }

      return null;
    } catch (error) {
      console.log("Logout error:", error);

      toast.error(error.response?.data?.message || "Logout failed");

      return null;
    }
  };

  const LogoutUser = async () => {
    try {
      const token = Cookies.get("user_token");

      if (!token) {
        toast.error("No active session found");
        return null;
      }

      const response = await axios.post(
        `${BASE_URL}/api/auth/logout-user`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data) {
        Cookies.remove("user_token");
        toast.success("Logged out successfully");
        return response.data;
      }

      return null;
    } catch (error) {
      console.log("User logout error:", error);
      // Even if API fails, remove cookie for better UX
      Cookies.remove("user_token");
      toast.success("Logged out");
      return null;
    }
  };

  const AddDeliveryPartners = async (partnername) => {
    try {
      const token = Cookies.get("admin_token");

      if (!token) {
        console.error("Token not found");
        return;
      }

      const decoded = jwtDecode(token);
      const admin_id = decoded?.userId; // check id or _id

      if (!admin_id) {
        console.error("Admin ID not found in token");
        return;
      }

      // 4️⃣ Call API
      const response = await axios.post(
        `${BASE_URL}/api/admin/add-active-partner`,
        {
          admin_id: admin_id,
          partner_name: partnername,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      // console.log("Partner Activated:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error adding delivery partner:",
        error.response?.data || error.message,
      );
    }
  };

  const OrderConfirms = async (orderid) => {
    try {
      const token = Cookies.get("admin_token");

      if (!token) {
        toast.error("Session expired");
        return null;
      }

      const response = await axios.post(
        `${BASE_URL}/api/admin/order-confirm`,
        {
          order_id: orderid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.status) {
        toast.success(response.data.message || "Order Confirmed");
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Order confirm error:", error);
      toast.error(error.response?.data?.message || "Failed to confirm order");
      return null;
    }
  };

  const ScheduleBulkDelhivery = async (orderIds, packageCount) => {
    try {
      const token = Cookies.get("admin_token");

      if (!token) {
        toast.error("Session expired");
        return null;
      }

      const response = await axios.post(
        `${BASE_URL}/api/admin/schedule-delhivery-pickup`,
        {
          order_ids: orderIds,
          package_count: packageCount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.status) {
        toast.success(response.data.message || "Pickup Scheduled Successfully");
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Pickup schedule error:", error);
      toast.error(error.response?.data?.message || "Failed to schedule pickup");
      return null;
    }
  };

  const fetchPendingOrders = async () => {
    try {
      setLoadingOrders(true);

      const token = Cookies.get("admin_token");
      const res = await axios.get(
        `${BASE_URL}/api/admin/all-new-order`,
        {
          params: {
            page: 1,
            limit: 10,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res?.data?.status) {
        setPendingOrders(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const PrintManifest = async (orderId) => {
    try {
      const token = Cookies.get("admin_token");

      if (!token) {
        toast.error("Session expired");
        return null;
      }

      const response = await axios.get(
        `${BASE_URL}/api/admin/generate-manifests/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const manifestUrl = response.data?.data?.manifest_url;

      if (manifestUrl) {
        // 🔥 Direct open (better for S3)
        window.open(manifestUrl, "_blank");

        toast.success("Manifest ready");

        return manifestUrl;
      }

      return null;
    } catch (error) {
      console.error("Manifest error:", error);
      toast.error(
        error.response?.data?.message || "Failed to generate manifest",
      );
      return null;
    }
  };

  const PrintShiprocketLabel = async (orderId) => {
    try {
      const token = Cookies.get("admin_token");

      if (!token) {
        toast.error("Session expired");
        return null;
      }

      const response = await axios.get(
        `${BASE_URL}/api/admin/generate-shiprocket-label/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const labelUrl = response.data?.data?.label_url;

      if (labelUrl) {
        // ✅ Best way for S3 PDF
        window.open(labelUrl, "_blank");

        toast.success("Label ready");
        return labelUrl;
      }

      return null;
    } catch (error) {
      console.error("Label error:", error);
      toast.error(error.response?.data?.message || "Failed to generate label");
      return null;
    }
  };

  const PrintDeliveryLabel = async (orderId) => {
    try {
      const token = Cookies.get("admin_token");

      if (!token) {
        toast.error("Session expired");
        return null;
      }

      const response = await axios.get(
        `${BASE_URL}/api/admin/generate-delivery-label/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const labelUrl = response.data?.data?.label_url;

      console.log("Delivery Label URL:", labelUrl);

      if (labelUrl) {
        // ✅ Safest way for presigned S3 URL
        window.open(labelUrl, "_blank");

        toast.success("Delivery label ready");
        return labelUrl;
      }

      return null;
    } catch (error) {
      console.error("Delivery label error:", error);
      toast.error(
        error.response?.data?.message || "Failed to generate delivery label",
      );
      return null;
    }
  };

  const OrderCancelByAdmin = async (orderId, reason, notes) => {
    try {
      const token = Cookies.get("admin_token");

      if (!token) {
        toast.error("Session expired");
        return null;
      }

      const response = await axios.post(
        `${BASE_URL}/api/orders/admin-cancel`,
        {
          order_id: orderId, // business order_id (MY_QR_xxx)
          cancellation_reason: reason,
          cancellation_notes: notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log(response.data);

      if (response.data?.status) {
        toast.success(response.data.message || "Order canceled successfully");
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
      return null;
    }
  };

  const getOrderDetailsByAdmin = async (orderId) => {
    try {
      const token = Cookies.get("admin_token");

      if (!token) {
        toast.error("Session expired");
        return null;
      }

      const response = await axios.post(
        `${BASE_URL}/api/admin/fetch/order-id`,
        {
          order_id: orderId, // business order_id (MY_QR_xxx)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.status) {
        toast.success(response.data.message || "Order fetch Sucessfully");
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error(
        error.response?.data?.message || "Failed to get order details",
      );
      return null;
    }
  };

  const TrackOrderByAdmin = async (orderId) => {
    try {
      const token = Cookies.get("admin_token");

      if (!token) {
        toast.error("Session expired");
        return null;
      }

      const response = await axios.post(
        `${BASE_URL}/api/track-order-status`,
        {
          order_id: orderId, // Business Order ID
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.status) {
        toast.success("Order tracked successfully");
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Tracking error:", error);
      toast.error(error.response?.data?.message || "Failed to track order");
      return null;
    }
  };

  const generateQrByAdmin = async (units, vehicle_type = "car") => {
    try {
      const token = Cookies.get("admin_token");
      const response = await axios.post(`${BASE_URL}/api/generate-qr`, {
        unit: units,
        vehicle_type,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error generating QR:", error);
      throw error;
    }
  };

  const generateQrByIdAdmin = async (qr_id, vehicle_type = "car") => {
    try {
      const token = Cookies.get("admin_token");
      if (!token) {
        toast.error("Session expired");
        return null;
      }
      const response = await axios.post(
        `${BASE_URL}/api/generate-qr-id`,
        {
          qr_id,
          vehicle_type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.data?.status) {
        toast.success(response.data.message || "QR generated successfully");
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("QR Generation by ID error:", error);
      toast.error(error.response?.data?.message || "Failed to generate QR");
      return null;
    }
  };

  const generateQrtemplateInBulk = async (templatetype, qr_ids = null) => {
    try {
      const token = Cookies.get("admin_token");
      const payload = {
        template_type: templatetype,
      };
      if (qr_ids && Array.isArray(qr_ids) && qr_ids.length > 0) {
        payload.qr_ids = qr_ids;
      }
      const response = await axios.post(
        `${BASE_URL}/api/create/qr-template-in-bluk`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.download_zip) {
        try {
          const urlObj = new URL(response.data.download_zip, BASE_URL);
          response.data.download_zip = `${BASE_URL}${urlObj.pathname}${urlObj.search}`;
        } catch (e) {
          if (response.data.download_zip.startsWith("/")) {
            response.data.download_zip = `${BASE_URL}${response.data.download_zip}`;
          }
        }
      }

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const BlockedQrByAdmin = async (qrinfo) => {
    try {
      const token = Cookies.get("admin_token");
      const res = await axios.post(`${BASE_URL}/api/admin/qr-blocked`, {
        qr_id: qrinfo.qr_id,
        reason: qrinfo.reason,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      console.error("Error blocking QR:", error);
      toast.error("Failed to block QR");
      throw error;
    }
  };

  const filterQrData = async (qrstatus, vehicle_type) => {
    try {
      const token = Cookies.get("admin_token");
      const params = {};
      if (vehicle_type && vehicle_type !== "all") {
        params.vehicle_type = vehicle_type;
      }
      const res = await axios.get(
        `${BASE_URL}/api/admin/filter-qr-list/${qrstatus}`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res?.data?.success) {
        setfilterQrlist(res.data.data);
      }

      return res.data;
    } catch (error) {
      console.error("Error fetching QR data:", error);
    }
  };

  const getQrStats = async () => {
    try {
      const token = Cookies.get("admin_token");
      const res = await axios.get(`${BASE_URL}/api/admin/qr-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.data?.success) {
        return res.data.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching QR stats:", error);
      return null;
    }
  };

  const getOrderStats = async () => {
    try {
      const token = Cookies.get("admin_token");
      const res = await axios.get(`${BASE_URL}/api/admin/order-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.data?.status) {
        return res.data.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching Order stats:", error);
      return null;
    }
  };

  const unassignQrAdmin = async (qrId) => {
    try {
      const token = Cookies.get("admin_token");
      const res = await axios.post(
        `${BASE_URL}/api/admin/unassign-qr`,
        { qr_id: qrId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res?.data?.success) {
        toast.success(res.data.message);
        return res.data;
      }
      return null;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unassign QR");
      return null;
    }
  };

  const deleteQrAdmin = async (qrId) => {
    try {
      const token = Cookies.get("admin_token");
      const res = await axios.post(
        `${BASE_URL}/api/admin/delete-qr`,
        { qr_id: qrId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res?.data?.success) {
        toast.success(res.data.message);
        return res.data;
      }
      return null;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete QR");
      return null;
    }
  };

  useEffect(() => {
    const token = Cookies.get("admin_token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const socket = io(`${BASE_URL}`);

    socket.emit("join_admin_room", { adminId: decoded.userId });

    /* ---------------- NEW ORDER ---------------- */
    socket.on("new_order_created", (order) => {
      if (order.active_partner === "shiprocket") {
        setShiprocketOrders((prev) => [order, ...prev]);
      } else if (order.active_partner === "delivery") {
        setDeliveryOrders((prev) => [order, ...prev]);
      }
    });

    /* ---------------- ORDER CONFIRMED ---------------- */
    socket.on("order_confirmed", (updatedOrder) => {
      console.log("✅ Order Confirmed:", updatedOrder);

      // Remove from NEW list
      if (updatedOrder.active_partner === "shiprocket") {
        setShiprocketOrders((prev) =>
          prev.filter((o) => o._id !== updatedOrder._id),
        );
      } else if (updatedOrder.active_partner === "delivery") {
        setDeliveryOrders((prev) =>
          prev.filter((o) => o._id !== updatedOrder._id),
        );
      }

      // Add to Confirmed list
      setConfirmedOrders((prev) => [updatedOrder, ...prev]);
    });

    fetchPendingOrders();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <MyContext.Provider
      value={{
        AdminSignInwithOtp,
        verifyAdminOtp,
        UserSignInwithOtp,
        verifyUserOtp,
        LogoutAdmin,
        LogoutUser,
        AddDeliveryPartners,
        DeliveryOrders,
        ShiprocketOrders,
        OrderConfirms,
        ScheduleBulkDelhivery,
        ConfirmedOrders,
        PrintManifest,
        PrintShiprocketLabel,
        PrintDeliveryLabel,
        getOrderDetailsByAdmin,
        OrderCancelByAdmin,
        TrackOrderByAdmin,
        generateQrByAdmin,
        generateQrByIdAdmin,
        generateQrtemplateInBulk,
        unassignQrAdmin,
        deleteQrAdmin,
        PendingOrders,
        loadingOrders,
        BlockedQrByAdmin,
        filterQrData,
        filterQrlist,
        getQrStats,
        getOrderStats,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default DataProvider;
