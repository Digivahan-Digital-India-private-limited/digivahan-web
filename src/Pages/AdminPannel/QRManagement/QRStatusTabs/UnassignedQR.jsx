import React, { useContext, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Car, Bike, Search, RefreshCw, QrCode, Download, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { MyContext } from "../../../../ContextApi/DataProvider";

const TABS = [
  {
    key: "car",
    label: "Car",
    icon: Car,
    activeTab: "border-blue-500 text-blue-600 bg-blue-50",
    activeBadge: "bg-blue-100 text-blue-600",
    pill: "bg-blue-50 border-blue-200",
    pillText: "text-blue-700",
    pillIcon: "text-blue-500",
  },
  {
    key: "bike",
    label: "Bike",
    icon: Bike,
    activeTab: "border-violet-500 text-violet-600 bg-violet-50",
    activeBadge: "bg-violet-100 text-violet-600",
    pill: "bg-violet-50 border-violet-200",
    pillText: "text-violet-700",
    pillIcon: "text-violet-500",
  },
];

const UnassignedQR = () => {
  const navigate = useNavigate();
  const { filterQrData, generateQrtemplateInBulk } = useContext(MyContext);

  const [activeTab, setActiveTab] = useState("car");
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [carData, setCarData] = useState([]);
  const [bikeData, setBikeData] = useState([]);
  const [loadingCar, setLoadingCar] = useState(true);
  const [loadingBike, setLoadingBike] = useState(true);

  const fetchCars = async () => {
    setLoadingCar(true);
    const res = await filterQrData("unassigned", "car");
    setCarData(res?.data || []);
    setLoadingCar(false);
  };

  const fetchBikes = async () => {
    setLoadingBike(true);
    const res = await filterQrData("unassigned", "bike");
    setBikeData(res?.data || []);
    setLoadingBike(false);
  };

  useEffect(() => {
    fetchCars();
    fetchBikes();
  }, []);

  const activeData = activeTab === "car" ? carData : bikeData;
  const isLoading = activeTab === "car" ? loadingCar : loadingBike;

  const filteredData = useMemo(() => {
    if (!search.trim()) return activeData;
    const q = search.toLowerCase();
    return activeData.filter(
      (item) =>
        (item.qr_id || "").toLowerCase().includes(q) ||
        (item.vehicle_id || "").toLowerCase().includes(q)
    );
  }, [activeData, search]);

  const columns = useMemo(
    () => [
      {
        name: "QR ID",
        selector: (row) => row.qr_id,
        sortable: true,
        cell: (row) => (
          <span className="font-mono text-xs text-slate-700">{row.qr_id}</span>
        ),
      },
      {
        name: "QR No.",
        selector: (row) => row.qr_no,
        sortable: true,
        width: "90px",
      },
      {
        name: "Vehicle Type",
        cell: (row) => (
          <span
            className={`capitalize text-xs px-2.5 py-1 rounded-full font-semibold ${
              row.vehicle_type === "bike"
                ? "bg-violet-100 text-violet-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {row.vehicle_type || "car"}
          </span>
        ),
        width: "110px",
      },
      {
        name: "Status",
        cell: () => (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
            Unassigned
          </span>
        ),
        width: "110px",
      },
      {
        name: "Created At",
        selector: (row) =>
          row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-IN")
            : "—",
        sortable: true,
        width: "120px",
      },
    ],
    []
  );

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        fontWeight: "600",
        fontSize: "12px",
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      },
    },
    rows: {
      style: {
        fontSize: "13px",
        "&:hover": { backgroundColor: "#f1f5f9" },
      },
    },
  };

  const handleRefresh = () => {
    if (activeTab === "car") fetchCars();
    else fetchBikes();
  };

  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDownloadSelected = async () => {
    if (selectedRows.length === 0) return;
    
    setIsDownloading(true);
    try {
      const qrIds = selectedRows.map(row => row.qr_id);
      const res = await generateQrtemplateInBulk(activeTab, qrIds);
      
      if (res?.success && res?.download_zip) {
        const link = document.createElement("a");
        link.href = res.download_zip;
        link.setAttribute("download", "");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success(`Successfully downloaded ${selectedRows.length} QR code(s)`);
        
        // Refresh the list after downloading
        handleRefresh();
        setSelectedRows([]);
        setToggleClearRows(!toggledClearRows);
      } else {
        toast.error("Download failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error downloading QR codes.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="w-full h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-amber-50 p-6">
      <style>{`
        @keyframes tabSlide {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tab-content { animation: tabSlide 0.3s ease-out; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* ─── Header ─── */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/qr-panel")}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Unassigned QR Codes
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Browse unassigned QR codes by vehicle type
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {selectedRows.length > 0 && (
              <button
                onClick={handleDownloadSelected}
                disabled={isDownloading}
                className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg shadow-sm transition
                  ${isDownloading 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download Selected ({selectedRows.length})
              </button>
            )}

            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 text-sm bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* ─── Summary Badges ─── */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm text-sm">
            <QrCode className="w-4 h-4 text-amber-500" />
            <span className="text-slate-600">Total:</span>
            <span className="font-bold text-slate-800">
              {loadingCar || loadingBike ? "…" : carData.length + bikeData.length}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full shadow-sm text-sm">
            <Car className="w-4 h-4 text-blue-500" />
            <span className="text-slate-600">Cars:</span>
            <span className="font-bold text-blue-700">
              {loadingCar ? "…" : carData.length}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 px-4 py-2 rounded-full shadow-sm text-sm">
            <Bike className="w-4 h-4 text-violet-500" />
            <span className="text-slate-600">Bikes:</span>
            <span className="font-bold text-violet-700">
              {loadingBike ? "…" : bikeData.length}
            </span>
          </div>
        </div>

        {/* ─── Main Card ─── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {TABS.map(({ key, label, icon: Icon, activeTab: activeStyle, activeBadge }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setSearch("");
                  setSelectedRows([]);
                  setToggleClearRows(!toggledClearRows);
                }}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all duration-200 border-b-2 ${
                  activeTab === key
                    ? activeStyle
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                <span
                  className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                    activeTab === key
                      ? activeBadge
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {key === "car"
                    ? loadingCar
                      ? "…"
                      : carData.length
                    : loadingBike
                    ? "…"
                    : bikeData.length}
                </span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by QR ID…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50"
              />
            </div>
          </div>

          {/* Table */}
          <div className="tab-content" key={activeTab}>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4" />
                <p className="text-sm">
                  Loading {activeTab} QR codes…
                </p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                {activeTab === "car" ? (
                  <Car className="w-12 h-12 mb-3 opacity-25" />
                ) : (
                  <Bike className="w-12 h-12 mb-3 opacity-25" />
                )}
                <p className="text-sm font-medium">
                  No unassigned {activeTab} QRs found
                </p>
                <p className="text-xs mt-1 text-slate-400">
                  {search
                    ? "Try a different search term"
                    : `Generate ${activeTab} QRs from the Generate QR page`}
                </p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                paginationPerPage={10}
                highlightOnHover
                striped
                responsive
                customStyles={customStyles}
                selectableRows
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggledClearRows}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UnassignedQR;
