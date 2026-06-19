import React, { useContext, useMemo, useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { MyContext } from "../../../../ContextApi/DataProvider";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function ConfirmedOrders() {
  const navigate = useNavigate();
  const { OrderCancelByAdmin } = useContext(MyContext);

  const [processedOrders, setProcessedOrders] = useState({});
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("admin_token");
      const res = await axios.get(
        `${BASE_URL}/api/admin/all-new-order?order_status=CONFIRMED&limit=1000`,
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
        
        // Filter: Show Shiprocket orders OR Delhivery orders that HAVE been scheduled
        const scheduledOrders = sortedData.filter((o) => {
          if (o.active_partner === "shiprocket") return true;
          return !!o.partner_details?.pickup_data;
        });

        setConfirmedOrders(scheduledOrders);
      }
    } catch (error) {
      console.error("Error fetching Confirmed orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [BASE_URL]);

  const handleCancelOrder = (orderId) => {
    navigate("/orders-panel/manage", {
      state: { action: "cancel", orderId: orderId },
    });
  };

  const columns = useMemo(
    () => [
      {
        name: "Order ID",
        selector: (row) => row.order_id,
        sortable: true,
      },
      {
        name: "Order Name",
        selector: (row) => row.order_items?.[0]?.name || "N/A",
      },
      {
        name: "User Name",
        selector: (row) =>
          `${row.shipping?.first_name || ""} ${row.shipping?.last_name || ""}`,
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
        name: "Pickup Info",
        cell: (row) => {
          if (row.active_partner === "shiprocket") return <span className="text-gray-500">N/A</span>;
          const pickupData = row.partner_details?.pickup_data?.payload;
          if (pickupData) {
            return (
              <div className="flex flex-col text-xs">
                <span className="font-semibold text-gray-700">{pickupData.pickup_date} {pickupData.pickup_time}</span>
                <span className="text-gray-500">{pickupData.pickup_location}</span>
              </div>
            );
          }
          return <span className="text-red-500">Not Scheduled</span>;
        },
      },
      {
        name: "Action",
        cell: (row) =>
          processedOrders[row.order_id] ? (
            <button disabled className="bg-gray-400 text-white px-4 py-2 rounded-lg font-medium cursor-not-allowed">
              Processing...
            </button>
          ) : (
            <button
              onClick={() => handleCancelOrder(row.order_id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Cancel Order
            </button>
          ),
      },
    ],
    [processedOrders]
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

        <h1 className="text-2xl font-semibold">Confirmed Orders</h1>

        <span className="ml-auto text-sm font-medium text-gray-600">
          Total Orders: {confirmedOrders?.length || 0}
        </span>
      </div>

      <div className="p-6">
        <DataTable
          columns={columns}
          data={confirmedOrders || []}
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

export default ConfirmedOrders;
