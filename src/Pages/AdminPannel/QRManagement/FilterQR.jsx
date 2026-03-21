import React, { useContext, useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { MyContext } from "../../../ContextApi/DataProvider";

const FILTER_OPTIONS = ["all", "unassigned", "assigned", "blocked"];

const formatStatus = (status) => {
  if (!status) return "-";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusBadgeClass = (status) => {
  if (status === "assigned") return "bg-blue-100 text-blue-700";
  if (status === "unassigned") return "bg-amber-100 text-amber-700";
  if (status === "blocked") return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-700";
};

const FilterQR = () => {
  const navigate = useNavigate();

  const [selectedFilter, setSelectedFilter] = useState("all");

  const { filterQrData, filterQrlist } = useContext(MyContext);

  console.log();
  

  // 🔥 API call on filter change
  useEffect(() => {
    filterQrData(selectedFilter);
  }, [selectedFilter]);

  // 🔥 map backend data to UI format
  const formattedData = useMemo(() => {
    return (filterQrlist || []).map((item) => ({
      id: item.qr_id,
      status: item.qr_status,
      assignedTo: item.assigned_to || "-",
      productType: item.product_type || "-",
      vehicleId: item.vehicle_id || "-",
    }));
  }, [filterQrlist]);

  const columns = useMemo(
    () => [
      {
        name: "QR ID",
        selector: (row) => row.id,
        sortable: true,
      },
      {
        name: "QR Status",
        cell: (row) => (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(
              row.status
            )}`}
          >
            {formatStatus(row.status)}
          </span>
        ),
      },
      {
        name: "Assigned To",
        selector: (row) => row.assignedTo,
      },
      {
        name: "Product Type",
        selector: (row) => row.productType,
      },
      {
        name: "Vehicle ID",
        selector: (row) => row.vehicleId,
      },
    ],
    []
  );

  return (
    <main className="w-full h-screen overflow-y-auto bg-linear-to-br from-slate-50 via-white to-indigo-50 p-6">
      <div className="max-w-350 mx-auto">
        <div className="flex items-center gap-4 px-1 pb-5">
          <button
            onClick={() => navigate("/qr-panel")}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Filter QR
            </h1>
            <p className="text-sm text-slate-500">
              Browse and filter QR code details by status
            </p>
          </div>

          <div className="ml-auto">
            <span className="text-sm font-medium text-slate-600 bg-white border px-3 py-2 rounded-lg shadow-sm">
              Total: {formattedData.length}
            </span>
          </div>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-5">
          {/* 🔥 Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedFilter(option)}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedFilter === option
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {formatStatus(option)}
              </button>
            ))}
          </div>

          {/* 🔥 Table */}
          <DataTable
            columns={columns}
            data={formattedData}
            pagination
            highlightOnHover
            striped
            responsive
          />
        </div>
      </div>
    </main>
  );
};

export default FilterQR;