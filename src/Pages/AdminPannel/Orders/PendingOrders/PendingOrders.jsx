import React, { useContext, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { MyContext } from "../../../../ContextApi/DataProvider";

function PendingOrders() {
  const navigate = useNavigate();

  const { PendingOrders, OrderConfirms, loadingOrders } = useContext(MyContext);

  const [processedOrders, setProcessedOrders] = useState({});

  const handleProcessOrder = async (orderId) => {
    try {
      setProcessedOrders((prev) => ({
        ...prev,
        [orderId]: true,
      }));

      const response = await OrderConfirms(orderId);
      console.log(response);
    } catch (error) {
      console.log(error);
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
        name: "Action",
        cell: (row) =>
          processedOrders[row._id] ? (
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium cursor-default">
              Processed
            </button>
          ) : (
            <button
              onClick={() => handleProcessOrder(row._id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Process
            </button>
          ),
      },
    ],
    [processedOrders],
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

        <h1 className="text-2xl font-semibold">Pending Orders</h1>

        <span className="ml-auto text-sm font-medium text-gray-600">
          Total Orders: {PendingOrders?.length || 0}
        </span>
      </div>

      <div className="p-6">
        <DataTable
          columns={columns}
          data={PendingOrders || []}
          pagination
          progressPending={loadingOrders}
          highlightOnHover
          striped
          responsive
        />
      </div>
    </main>
  );
}

export default PendingOrders;
