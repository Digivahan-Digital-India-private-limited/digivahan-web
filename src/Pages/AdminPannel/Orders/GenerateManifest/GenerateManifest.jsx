import React, { useContext, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { MyContext } from "../../../../ContextApi/DataProvider";

function GenerateManifest() {
  const navigate = useNavigate();
  const {
    ConfirmedOrders,
    PrintManifest,
    PrintShiprocketLabel,
    PrintDeliveryLabel,
  } = useContext(MyContext);

  const confirmedOrders =
    ConfirmedOrders?.filter((order) => order.order_status === "CONFIRMED") ||
    [];

  const handlePrintLabel = async (order) => {
    if (order.active_partner === "shiprocket") {
      const response = await PrintShiprocketLabel(order._id);
      console.log("Print Label:", response);
    } else if (order.active_partner === "delivery") {
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

        <span className="ml-auto text-sm font-medium text-gray-600">
          Total Orders: {confirmedOrders.length}
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
        />
      </div>
    </main>
  );
}

export default GenerateManifest;
