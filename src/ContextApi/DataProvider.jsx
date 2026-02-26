import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const MyContext = createContext();

const DataProvider = ({ children }) => {
  const [DeliveryOrders, setDeliveryOrders] = useState([]);
  const [ShiprocketOrders, setShiprocketOrders] = useState([]);
  const [ConfirmedOrders, setConfirmedOrders] = useState([]);

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

  const OrderCancelByAdmin = async (orderId) => {
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

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <MyContext.Provider
      value={{
        AdminSignInwithOtp,
        verifyAdminOtp,
        LogoutAdmin,
        AddDeliveryPartners,
        DeliveryOrders,
        ShiprocketOrders,
        OrderConfirms,
        ConfirmedOrders,
        PrintManifest,
        PrintShiprocketLabel,
        PrintDeliveryLabel,
        getOrderDetailsByAdmin,
        OrderCancelByAdmin,
        TrackOrderByAdmin,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default DataProvider;
