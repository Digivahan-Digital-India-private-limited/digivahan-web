import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { Search, Loader2 } from "lucide-react";
import { MyContext } from "../../../../ContextApi/DataProvider";

const BlockedQR = () => {
  const { BlockedQrByAdmin, filterQrData } = useContext(MyContext);
  const navigate = useNavigate();
  const [qrInput, setQrInput] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [blockedReason, setBlockedReason] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const [qrData, setQrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await filterQrData("blocked", "all");
    setQrData(res?.data || []);
    setLoading(false);
  };

  const today = new Date();
  const presentDate = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${today.getFullYear()}`;

  const handleCheck = () => {
    if (!qrInput.trim()) return;
    setShowDetails(true);
    setIsBlocked(false);
  };

  const handleBlockQr = () => {
    setShowConfirmPopup(true);
  };

  const handleConfirmBlock = async () => {
    try {
      if (!qrInput.trim()) {
        toast.error("QR ID is required");
        return;
      }

      if (!blockedReason.trim()) {
        toast.error("Please enter reason");
        return;
      }

      const payload = {
        qr_id: qrInput,
        reason: blockedReason,
      };

      const res = await BlockedQrByAdmin(payload);

      if (res?.success) {
        toast.success("QR Blocked Successfully 🎉");

        setIsBlocked(true);
        setShowConfirmPopup(false);
        setBlockedReason("");
        fetchData(); // Refresh the table
      } else {
        toast.error("Failed to block QR");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error blocking QR");
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    qrInput,
  )}`;

  const columns = [
    { name: "QR ID", selector: (row) => row.qr_id, sortable: true },
    { name: "QR Number", selector: (row) => row.qr_no, sortable: true },
    { name: "Vehicle", selector: (row) => row.vehicle_type || "N/A", sortable: true },
    {
      name: "Blocked Date",
      selector: (row) => new Date(row.updatedAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Reason",
      selector: (row) => row.blocked_reason || "N/A",
      sortable: true,
      grow: 2,
    },
    {
      name: "Status",
      cell: () => (
        <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
          Blocked
        </span>
      ),
    },
  ];

  const filteredData = qrData.filter((item) =>
    search.toLowerCase() === ""
      ? item
      : (item.qr_id && item.qr_id.toLowerCase().includes(search.toLowerCase())) ||
        (item.qr_no && String(item.qr_no).toLowerCase().includes(search.toLowerCase())) ||
        (item.blocked_reason && item.blocked_reason.toLowerCase().includes(search.toLowerCase()))
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

        {/* Search Card */}
        <div className="bg-white rounded-lg shadow-sm border p-5 space-y-4">
          <div>
            <h1 className="text-2xl">Blocked QR Code Management</h1>
            <p className="text-[16px] text-gray-600">
              Check and manage blocked QR codes
            </p>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              placeholder="Enter QR ID (e.g., QR-2025-001)"
              className="flex-1 border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleCheck}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              🔍 Check QR
            </button>
          </div>
        </div>

        {/* Result Section */}
        <div
          className={`mt-6 transition-all duration-700 ${
            showDetails
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 hidden"
          }`}
        >
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex items-start gap-8">
            {/* QR */}
            <div className="bg-white p-4 rounded-xl shadow">
              <img src={qrImageUrl} alt="QR" className="w-40 h-40" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm text-gray-500">QR ID</p>
                <p className="font-semibold">{qrInput}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Blocked Date</p>
                <input
                  type="text"
                  value={presentDate}
                  readOnly
                  className="border rounded-lg px-4 py-2 w-48 bg-white"
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">Blocked Reason</p>
                <textarea
                  rows="3"
                  className="w-full border rounded-lg p-4 bg-white"
                  placeholder="Enter the valid Reason for blocked qr"
                  value={blockedReason}
                  onChange={(e) => setBlockedReason(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleBlockQr}
                  disabled={isBlocked}
                  className={`px-6 py-3 rounded-lg transition ${
                    isBlocked
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  Block QR
                </button>

                {isBlocked && (
                  <p className="text-sm text-green-600 mt-3 font-medium">
                    QR has been marked as blocked.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border mt-8 mb-12">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50/50 rounded-t-xl">
            <h3 className="font-semibold text-gray-800">All Blocked QRs</h3>
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
              progressComponent={<Loader2 className="w-6 h-6 animate-spin my-4 text-red-500" />}
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

      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm QR Blocking
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to block this QR code? Users will not be
              able to use this QR until it is manually restored.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBlock}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockedQR;
