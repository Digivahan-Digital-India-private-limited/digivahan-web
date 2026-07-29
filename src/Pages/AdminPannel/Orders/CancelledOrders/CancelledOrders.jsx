import React, { useMemo, useState, useEffect, useContext } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
import Cookies from "js-cookie";
import { MyContext } from "../../../../ContextApi/DataProvider";

function CancelledOrders() {
  const navigate = useNavigate();
  const { ResendToDelhivery } = useContext(MyContext);

  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resendingOrderId, setResendingOrderId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, order: null });

  const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("admin_token");
      const res = await axios.get(
        `${BASE_URL}/api/admin/all-new-order?order_status=CANCELED&limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res?.data?.status) {
        const sortedData = res.data.data.sort((a, b) => {
          const dateA = new Date(a.canceled_at || a.updatedAt || a.createdAt);
          const dateB = new Date(b.canceled_at || b.updatedAt || b.createdAt);
          return dateB - dateA;
        });
        setCancelledOrders(sortedData);
      }
    } catch (error) {
      console.error("Error fetching Cancelled orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [BASE_URL]);

  const handleResendClick = (order) => {
    setConfirmModal({ open: true, order });
  };

  const handleConfirmResend = async () => {
    const order = confirmModal.order;
    setConfirmModal({ open: false, order: null });
    setResendingOrderId(order.order_id);
    try {
      const result = await ResendToDelhivery(order.order_id);
      if (result?.status) {
        // Remove from cancelled list on success
        setCancelledOrders((prev) =>
          prev.filter((o) => o.order_id !== order.order_id)
        );
      }
    } finally {
      setResendingOrderId(null);
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "Order ID",
        selector: (row) => row.order_id,
        sortable: true,
      },
      {
        name: "User Name",
        selector: (row) =>
          `${row.shipping?.first_name || ""} ${row.shipping?.last_name || ""}`,
      },
      {
        name: "Cancel Reason",
        selector: (row) => row.cancellation_reason || "N/A",
      },
      {
        name: "Cancel Notes",
        selector: (row) => row.cancellation_notes || "N/A",
      },
      {
        name: "Active Partner",
        selector: (row) => row.active_partner || "N/A",
        sortable: true,
        cell: (row) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              row.active_partner === "shiprocket"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {row.active_partner}
          </span>
        ),
      },
      {
        name: "Vehicle ID",
        selector: (row) => row.order_items?.[0]?.vehicle_id || "N/A",
      },
      {
        name: "Order Date",
        selector: (row) => new Date(row.createdAt).toLocaleString(),
        sortable: true,
      },
      {
        name: "Status",
        cell: () => (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
            Cancelled
          </span>
        ),
      },
      {
        name: "Action",
        cell: (row) => {
          const isDelhivery =
            row.active_partner === "delhivery" ||
            row.active_partner === "delivery";
          const isResending = resendingOrderId === row.order_id;

          if (!isDelhivery) return null;

          return (
            <button
              onClick={() => handleResendClick(row)}
              disabled={isResending}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isResending
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-md"
              }`}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`}
              />
              {isResending ? "Sending..." : "Resend to Delhivery"}
            </button>
          );
        },
        width: "180px",
      },
    ],
    [resendingOrderId]
  );

  return (
    <main className="w-full h-screen flex flex-col bg-white">
      <div className="flex items-center gap-4 p-6 border-b border-gray-200 bg-white">
        <button
          onClick={() => navigate("/orders-panel")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-2xl font-semibold">Cancelled Orders</h1>

        <span className="ml-auto text-sm font-medium text-gray-600">
          Total Orders: {cancelledOrders?.length || 0}
        </span>
      </div>

      <div className="p-6">
        <DataTable
          columns={columns}
          data={cancelledOrders || []}
          pagination
          progressPending={loading}
          highlightOnHover
          striped
          responsive
        />
      </div>

      {/* Confirm Resend Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Resend to Delhivery?
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Order{" "}
              <strong className="text-gray-900">
                {confirmModal.order?.order_id}
              </strong>{" "}
              will be re-submitted to Delhivery.
            </p>
            <p className="text-gray-500 text-xs mb-6">
              The old cancelled record will be deleted and a new waybill will be generated. Order status will be set to{" "}
              <span className="font-semibold text-emerald-600">CONFIRMED</span>.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal({ open: false, order: null })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResend}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm shadow-md transition-all"
              >
                Yes, Resend Order
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default CancelledOrders;

