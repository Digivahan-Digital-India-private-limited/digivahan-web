import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Search, Loader2 } from "lucide-react";
import { MyContext } from "../../../../ContextApi/DataProvider";

const AssignedQR = () => {
  const navigate = useNavigate();
  const { filterQrData } = useContext(MyContext);

  const [qrInput, setQrInput] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await filterQrData("assigned", "all");
    setQrData(res?.data || []);
    setLoading(false);
  };

  const handleCheck = () => {
    if (!qrInput.trim()) return;
    setShowQR(true);
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    qrInput
  )}`;

  const columns = [
    { name: "QR ID", selector: (row) => row.qr_id, sortable: true },
    { name: "QR Number", selector: (row) => row.qr_no, sortable: true },
    {
      name: "Assigned At",
      selector: (row) => new Date(row.updatedAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Status",
      cell: () => (
        <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
          Assigned
        </span>
      ),
    },
  ];

  const filteredData = qrData.filter((item) =>
    search.toLowerCase() === ""
      ? item
      : (item.qr_id && item.qr_id.toLowerCase().includes(search.toLowerCase())) ||
        (item.qr_no && String(item.qr_no).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full h-screen overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-1">
            QR Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage and monitor QR code allocation
          </p>
        </div>

        <button
          onClick={() => navigate("/qr-panel")}
          className="text-blue-600 text-sm hover:underline mb-6 inline-block"
        >
          ← Back to Overview
        </button>

        <div className="bg-white rounded-lg shadow-sm border p-5 space-y-4">
          <div>
            <h1 className="text-2xl">Assigned QR Code Management</h1>
            <p className="text-[16px] text-gray-600">
              Check and manage assigned QR codes
            </p>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              placeholder="Enter QR ID"
              className="flex-1 border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCheck}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              🔍 Check QR
            </button>
          </div>
        </div>

        {/* Smooth QR Section */}
        <div
          className={`mt-6 transform transition-all duration-700 ease-out ${
            showQR
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-90 -translate-y-4 hidden"
          }`}
        >
          <div className="bg-blue-50 border rounded-xl p-6 flex gap-6 items-center">
            <img
              src={qrImageUrl}
              alt="QR"
              className="w-32 h-32 rounded shadow"
            />
            <div>
              <h3 className="text-lg font-semibold mb-2">QR Code Details</h3>
              <p className="text-sm text-gray-600">
                QR Number: <b>{qrInput}</b>
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                ✔ Assigned
              </span>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border mt-8 mb-12">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50/50 rounded-t-xl">
            <h3 className="font-semibold text-gray-800">All Assigned QRs</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search QR..."
                className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-64 transition-shadow"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="p-4">
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              progressPending={loading}
              progressComponent={<Loader2 className="w-6 h-6 animate-spin my-4 text-blue-500" />}
              highlightOnHover
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: "#f9fafb",
                    fontWeight: "600",
                    color: "#374151",
                  },
                },
                rows: {
                  style: {
                    minHeight: "60px",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedQR;
