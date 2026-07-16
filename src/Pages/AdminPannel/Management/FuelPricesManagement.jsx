import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Droplet,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  ArrowLeft,
  Edit2,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/* ─── API helpers ──────────────────────────────────────────────────────────── */
const getFuelStatesAPI = async () => {
  const token = localStorage.getItem("token") || "";
  const res = await axios.get(`${BASE_URL}/api/v1/fuel/states`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const updateFuelPriceAPI = async (payload) => {
  const token = localStorage.getItem("token") || "";
  const res = await axios.post(`${BASE_URL}/api/v1/fuel/prices`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/* ═══════════════════════════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════════════════════════ */
const FuelPricesManagement = () => {
  const navigate = useNavigate();

  // Data state
  const [fuelData, setFuelData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [stateName, setStateName] = useState("");
  const [petrol, setPetrol] = useState("");
  const [diesel, setDiesel] = useState("");
  const [cng, setCng] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  /* ─── Load Data ──────────────────────────────────────────────────────────── */
  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await getFuelStatesAPI();
      if (res.success && res.data && res.data.states) {
        setFuelData(res.data.states);
      }
    } catch (err) {
      console.error("Load data error:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ─── Handle Edit ────────────────────────────────────────────────────────── */
  const handleEditClick = (item) => {
    setStateName(item.state || "");
    setPetrol(item.petrol !== null && item.petrol !== undefined ? item.petrol : "");
    setDiesel(item.diesel !== null && item.diesel !== undefined ? item.diesel : "");
    setCng(item.cng !== null && item.cng !== undefined ? item.cng : "");
    setFormOpen(true);
    setSubmitMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ─── Submit Form ────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stateName.trim()) {
      setSubmitMsg({ type: "error", text: "State name is required." });
      return;
    }

    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const payload = {
        states: {
          [stateName.trim()]: {
            petrol: petrol ? parseFloat(petrol) : null,
            diesel: diesel ? parseFloat(diesel) : null,
            cng: cng ? parseFloat(cng) : null,
          }
        }
      };

      const res = await updateFuelPriceAPI(payload);
      if (res.success) {
        setSubmitMsg({ type: "success", text: "Fuel prices updated successfully!" });
        // Reset form completely if they were adding a new one, else keep it for quick re-edits
        setStateName("");
        setPetrol("");
        setDiesel("");
        setCng("");
        setFormOpen(false);
        loadData();
      } else {
        setSubmitMsg({ type: "error", text: res.message || "Failed to update." });
      }
    } catch (err) {
      setSubmitMsg({
        type: "error",
        text: err.response?.data?.message || err.message || "Failed to update.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Render ─────────────────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-slate-50 to-amber-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/management")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Fuel Prices</h1>
          <p className="text-sm text-slate-500">Manage state-wise fuel prices</p>
        </div>
      </div>

      {/* Submit message */}
      {submitMsg && (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold ${
            submitMsg.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {submitMsg.text}
        </div>
      )}

      {/* ── Add/Update Form Collapsible ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm mb-8 overflow-hidden">
        <button
          type="button"
          onClick={() => setFormOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-orange-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
              <Droplet className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Add or Update State Fuel Price</p>
              <p className="text-xs text-slate-500">Click to expand form and add new state details</p>
            </div>
          </div>
          {formOpen ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </button>

        {formOpen && (
          <form onSubmit={handleSubmit} className="px-5 pb-6 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              {/* State Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">State Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharashtra"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>

              {/* Petrol */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Petrol Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={petrol}
                  onChange={(e) => setPetrol(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>

              {/* Diesel */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Diesel Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={diesel}
                  onChange={(e) => setDiesel(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>

              {/* CNG */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">CNG Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={cng}
                  onChange={(e) => setCng(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setStateName("");
                  setPetrol("");
                  setDiesel("");
                  setCng("");
                  setSubmitMsg(null);
                }}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60 transition inline-flex items-center gap-2"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Fuel Prices List ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
              <Droplet className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                All States Pricing
                <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                  {fuelData.length}
                </span>
              </p>
              <p className="text-xs text-slate-500">List of all configured fuel prices</p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadData}
            disabled={loadingData}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-semibold">State Name</th>
                <th className="px-5 py-3 font-semibold text-center">Petrol (₹)</th>
                <th className="px-5 py-3 font-semibold text-center">Diesel (₹)</th>
                <th className="px-5 py-3 font-semibold text-center">CNG (₹)</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingData ? (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-orange-400" />
                  </td>
                </tr>
              ) : fuelData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-slate-500">
                    No records found. Add a state above.
                  </td>
                </tr>
              ) : (
                fuelData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {item.state}
                    </td>
                    <td className="px-5 py-4 text-center font-medium">
                      {item.petrol ? item.petrol.toFixed(2) : "-"}
                    </td>
                    <td className="px-5 py-4 text-center font-medium">
                      {item.diesel ? item.diesel.toFixed(2) : "-"}
                    </td>
                    <td className="px-5 py-4 text-center font-medium">
                      {item.cng ? item.cng.toFixed(2) : "-"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default FuelPricesManagement;
