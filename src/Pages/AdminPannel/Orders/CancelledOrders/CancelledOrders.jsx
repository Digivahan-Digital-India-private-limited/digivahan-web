import React, { useMemo, useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
import Cookies from "js-cookie";

function CancelledOrders() {
  const navigate = useNavigate();

  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
    ],
    []
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
    </main>
  );
}

export default CancelledOrders;
