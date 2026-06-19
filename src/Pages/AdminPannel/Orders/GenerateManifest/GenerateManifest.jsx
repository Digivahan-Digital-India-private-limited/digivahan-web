import React, { useContext, useMemo, useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { MyContext } from "../../../../ContextApi/DataProvider";
import axios from "axios";
import Cookies from "js-cookie";

function GenerateManifest() {
  const navigate = useNavigate();
  const {
    PrintManifest,
    PrintShiprocketLabel,
    PrintDeliveryLabel,
    ScheduleBulkDelhivery,
  } = useContext(MyContext);

  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
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
          
          // Only show orders that don't have a pickup scheduled yet
          const unscheduledOrders = sortedData.filter(
            (o) => !o.partner_details?.pickup_data
          );
          
          setConfirmedOrders(unscheduledOrders);
        }
      } catch (error) {
        console.error("Error fetching Confirmed orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [BASE_URL]);

  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
  };

  const handleScheduleBulkPickup = async () => {
    if (selectedRows.length === 0) return;
    
    // Ensure all selected are delhivery
    const hasNonDelhivery = selectedRows.some(row => row.active_partner !== "delhivery" && row.active_partner !== "delivery");
    if (hasNonDelhivery) {
      alert("Please select only Delhivery orders for scheduling pickup.");
      return;
    }

    const packageCount = selectedRows.length;
    const orderIds = selectedRows.map((r) => r._id);
    const response = await ScheduleBulkDelhivery(orderIds, packageCount);
    if (response) {
      // Re-fetch orders to remove them from this list
      setLoading(true);
      const token = Cookies.get("admin_token");
      const res = await axios.get(
        `${BASE_URL}/api/admin/all-new-order?order_status=CONFIRMED&limit=1000`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res?.data?.status) {
        const sortedData = res.data.data.sort((a, b) => {
          const dateA = new Date(a.canceled_at || a.updatedAt || a.createdAt);
          const dateB = new Date(b.canceled_at || b.updatedAt || b.createdAt);
          return dateB - dateA;
        });
        const unscheduledOrders = sortedData.filter(
          (o) => !o.partner_details?.pickup_data
        );
        setConfirmedOrders(unscheduledOrders);
      }
      setSelectedRows([]);
      setLoading(false);
    }
  };

  const handlePrintLabel = async (order) => {
    if (order.active_partner === "shiprocket") {
      const response = await PrintShiprocketLabel(order._id);
      console.log("Print Label:", response);
    } else if (order.active_partner === "delhivery" || order.active_partner === "delivery") {
      const response = await PrintDeliveryLabel(order._id);
      console.log("Print Label:", response);
    }
  };

  const handlePrintManifest = async (order) => {
    console.log("Print Manifest:", order._id);
    const response = await PrintManifest(order._id);
    console.log(response);
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
        name: "Vehicle",
        selector: (row) => row.order_items?.[0]?.vehicle_id || "N/A",
      },
      {
        name: "Courier Partner",
        selector: (row) => row.active_partner,
        sortable: true,
      },
      {
        name: "Order Date",
        selector: (row) => new Date(row.createdAt).toLocaleString(),
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="flex gap-2">
            {row.active_partner === "shiprocket" && (
              <button
                onClick={() => handlePrintManifest(row)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                Print Manifest
              </button>
            )}

            <button
              onClick={() => handlePrintLabel(row)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Print Label
            </button>
          </div>
        ),
      },
    ],
    [],
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

        <h1 className="text-2xl font-semibold">Generate Manifest</h1>

        <span className="ml-auto flex items-center gap-4">
          {selectedRows.length > 0 && (
            <button
              onClick={handleScheduleBulkPickup}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
            >
              Schedule Pickup ({selectedRows.length})
            </button>
          )}
          <span className="text-sm font-medium text-gray-600">
            Total Orders: {confirmedOrders.length}
          </span>
        </span>
      </div>

      <div className="p-6">
        <DataTable
          columns={columns}
          data={confirmedOrders}
          pagination
          highlightOnHover
          striped
          responsive
          selectableRows
          onSelectedRowsChange={handleRowSelected}
          selectableRowDisabled={(row) => row.active_partner === "shiprocket"}
          progressPending={loading}
        />
      </div>
    </main>
  );
}

export default GenerateManifest;
