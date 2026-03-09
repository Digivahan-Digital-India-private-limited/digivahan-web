import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";

const VEHICLES = [
  {
    id: 1,
    name: "i20 Magna (O)",
    type: "CAR",
    year: "2013",
    fuel: "Petrol / CNG",
    plate: "DL1CS3305",
    image: "/Car Image.png",
  },
  {
    id: 2,
    name: "Suzuki GSX1300R Hayabusa",
    type: "BIKE",
    year: "2021",
    fuel: "Petrol",
    plate: "DL12CG305",
    image: "/Bike Image.png",
    pucExpired: true,
    insuranceExpired: true,
  },
];

export default function MyGarage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState(VEHICLES);
  const [editMode, setEditMode] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [rcNumber, setRcNumber] = useState("");

  const removeVehicle = (id) =>
    setVehicles((prev) => prev.filter((v) => v.id !== id));

  const handleAddToGarage = () => {
    if (!rcNumber.trim()) return;
    // TODO: fetch vehicle by RC and add to list
    setRcNumber("");
    setShowAddSheet(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Status Bar ────────────────────────────────────── */}
      <div className="bg-white px-5 pt-3 pb-1 flex justify-between items-center text-[11px] font-semibold text-gray-800">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <rect x="0" y="4" width="2.5" height="6" rx="0.5" fill="#111" />
            <rect x="3.5" y="2.5" width="2.5" height="7.5" rx="0.5" fill="#111" />
            <rect x="7" y="1" width="2.5" height="9" rx="0.5" fill="#111" />
            <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="#111" />
          </svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
            <path d="M7.5 2.5C9.5 2.5 11.3 3.3 12.6 4.6L14 3.2C12.3 1.5 10 0.5 7.5 0.5C5 0.5 2.7 1.5 1 3.2L2.4 4.6C3.7 3.3 5.5 2.5 7.5 2.5Z" fill="#111" />
            <path d="M7.5 5.5C8.8 5.5 10 6 10.9 6.9L12.3 5.5C11 4.2 9.4 3.5 7.5 3.5C5.6 3.5 4 4.2 2.7 5.5L4.1 6.9C5 6 6.2 5.5 7.5 5.5Z" fill="#111" />
            <circle cx="7.5" cy="9.5" r="1.5" fill="#111" />
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#111" strokeOpacity="0.35" />
            <rect x="2" y="2" width="17" height="8" rx="2" fill="#111" />
            <path d="M23 4v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4" />
          </svg>
        </div>
      </div>

      {/* ── Top Nav ───────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>

        <h1 className="text-[17px] font-bold text-gray-900">My Garage</h1>

        <button
          onClick={() => setEditMode((e) => !e)}
          className={`flex items-center gap-1 text-[13px] font-medium px-2 py-1 rounded-lg transition ${
            editMode
              ? "text-red-500 bg-red-50"
              : "text-green-600 hover:bg-green-50"
          }`}
        >
          <Pencil className="w-3.5 h-3.5" />
          {editMode ? "Done" : "Edit"}
        </button>
      </div>

      {/* ── Vehicle List ──────────────────────────────────── */}
      <div className="flex-1 px-4 py-5 space-y-4 overflow-y-auto">
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <svg viewBox="0 0 64 64" className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="8" y="28" width="48" height="22" rx="4" />
                <path d="M16 28l6-12h20l6 12" />
                <circle cx="20" cy="50" r="4" />
                <circle cx="44" cy="50" r="4" />
              </svg>
            </div>
            <h2 className="text-[17px] font-bold text-gray-800 mb-1">No vehicles yet</h2>
            <p className="text-[13px] text-gray-400 max-w-xs leading-relaxed">
              Add your vehicle to the garage and experience the luxury of Digivahan.
            </p>
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative"
            >
              {/* Remove button (edit mode) */}
              {editMode && (
                <button
                  onClick={() => removeVehicle(vehicle.id)}
                  className="absolute top-2.5 right-2.5 z-10 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow"
                >
                  <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="none">
                    <path d="M5 5l10 10M15 5L5 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}

              {/* Card body */}
              <div className="flex items-center px-4 pt-4 pb-3 gap-3">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-gray-900 leading-tight">
                    {vehicle.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {vehicle.type} • {vehicle.year} • {vehicle.fuel}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5 font-medium tracking-wide">
                    {vehicle.plate}
                  </p>
                </div>

                {/* Vehicle Image */}
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-28 object-contain shrink-0"
                  style={{ height: "4.5rem" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* Action buttons */}
              <div className="flex">
                <button
                  onClick={() => navigate('/ios/vehicle-info', { state: { vehicle } })}
                  className="flex-1 py-3 text-[12.5px] font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition text-center border-r border-gray-100"
                >
                  View full details
                </button>
                <button className="flex-1 py-3 text-[12.5px] font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition text-center">
                  View Important dates
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Add New Vehicle ────────────────────────────────── */}
      <div className="px-4 pb-8 pt-3 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() => setShowAddSheet(true)}
          className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-[15px] font-semibold py-4 rounded-full shadow-md transition-all"
        >
          + Add new vehicle
        </button>
      </div>

      {/* ── Add Vehicle Bottom Sheet ──────────────────────── */}
      {showAddSheet && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowAddSheet(false)}
          />

          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl px-5 pt-6 pb-10 shadow-2xl">
            <h2 className="text-[16px] font-bold text-gray-900 mb-5">Add your vehicle</h2>

            <label className="block text-[13px] font-medium text-gray-700 mb-2">
              Enter RC&nbsp; Number
            </label>
            <input
              type="text"
              value={rcNumber}
              onChange={(e) => setRcNumber(e.target.value)}
              placeholder="Enter RC Number Here"
              className="w-full bg-gray-100 rounded-full px-5 py-3.5 text-[14px] text-gray-700 placeholder-gray-400 outline-none mb-5 focus:ring-2 focus:ring-green-400"
            />

            <button
              onClick={handleAddToGarage}
              className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-[15px] font-semibold py-4 rounded-xl shadow-md transition-all"
            >
              Add to Garage
            </button>
          </div>
        </>
      )}
    </div>
  );
}
