import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Loader2,
  Scale,
  RefreshCw,
  ArrowLeft,
  Trash2,
  Edit2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/* ─── API helpers ──────────────────────────────────────────────────────────── */
const getAllCars = async () => {
  const res = await axios.get(`${BASE_URL}/api/list/all-car?all=true`);
  return res.data;
};

const addComparisonAPI = async (payload) => {
  const token = localStorage.getItem("token") || "";
  const res = await axios.post(`${BASE_URL}/api/vehicles/compare`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const getAllComparisons = async () => {
  const token = localStorage.getItem("token") || "";
  const res = await axios.get(`${BASE_URL}/api/vehicles/compare/get-all-compare`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const deleteComparisonAPI = async (compareId) => {
  const token = localStorage.getItem("token") || "";
  const res = await axios.delete(`${BASE_URL}/api/vehicles/compare/delete-compare/${compareId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const updateComparisonAPI = async (payload) => {
  const token = localStorage.getItem("token") || "";
  const res = await axios.post(`${BASE_URL}/api/vehicle/compare-update`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const UpdateModal = ({ comp, allCars, onCancel, onConfirm }) => {
  const [carToReplace, setCarToReplace] = useState(comp.car_1?._id);
  const [newCarId, setNewCarId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!newCarId) {
      setErrorMsg("Please select a new car.");
      return;
    }
    if (newCarId === comp.car_1?._id || newCarId === comp.car_2?._id) {
      setErrorMsg("Cannot replace with a car already in this comparison.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      await onConfirm({
        compare_id: comp._id,
        car_id: carToReplace,
        update_car_id: newCarId,
      });
    } catch (err) {
      setErrorMsg(err.message || "Failed to update");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-900">Update Comparison</h3>
        <p className="mt-1 text-sm text-slate-500">Select which car to replace and choose a new one.</p>

        {errorMsg && <p className="mt-2 text-xs font-semibold text-rose-600">{errorMsg}</p>}

        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Car to replace:</label>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="radio" checked={carToReplace === comp.car_1?._id} onChange={() => setCarToReplace(comp.car_1?._id)} />
                {comp.car_1?.model_name}
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="radio" checked={carToReplace === comp.car_2?._id} onChange={() => setCarToReplace(comp.car_2?._id)} />
                {comp.car_2?.model_name}
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Replace with:</label>
            <select
              value={newCarId}
              onChange={(e) => setNewCarId(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            >
              <option value="">-- Choose New Car --</option>
              {allCars.map((car) => (
                <option key={car._id} value={car._id}>
                  {car.brand_name} {car.model_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button onClick={onCancel} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition flex items-center gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ comp, onCancel, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <h3 className="text-lg font-bold text-slate-900">Delete Comparison?</h3>
      <p className="mt-2 text-sm text-slate-600">
        Are you sure you want to delete this comparison between{" "}
        <span className="font-semibold text-slate-800">{comp.car_1?.model_name}</span> and{" "}
        <span className="font-semibold text-slate-800">{comp.car_2?.model_name}</span>?
      </p>
      <p className="mt-1 text-xs text-rose-500 font-medium">This action cannot be undone.</p>
      <div className="mt-5 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════════════════════════ */
const CompareCarsManagement = () => {
  const navigate = useNavigate();

  // Data state
  const [allCars, setAllCars] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [car1Id, setCar1Id] = useState("");
  const [car2Id, setCar2Id] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Update modal state
  const [updateTarget, setUpdateTarget] = useState(null);

  /* ─── Load Data ──────────────────────────────────────────────────────────── */
  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [carsData, compData] = await Promise.all([
        getAllCars(),
        getAllComparisons(),
      ]);
      
      if (carsData.status) setAllCars(carsData.data || []);
      if (compData.success) setComparisons(compData.data || []);
    } catch (err) {
      console.error("Load data error:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ─── Submit Form ────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!car1Id || !car2Id) {
      setSubmitMsg({ type: "error", text: "Please select both cars to compare." });
      return;
    }
    if (car1Id === car2Id) {
      setSubmitMsg({ type: "error", text: "Cannot compare the same car with itself." });
      return;
    }

    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const payload = { car1_id: car1Id, car2_id: car2Id };
      const res = await addComparisonAPI(payload);
      // Assuming res.success or res.status is used, check both
      if (res.success || res.status) {
        setSubmitMsg({ type: "success", text: "Comparison added successfully!" });
        setCar1Id("");
        setCar2Id("");
        setFormOpen(false);
        loadData(); // reload comparisons
      } else {
        setSubmitMsg({ type: "error", text: res.message || "Failed to add comparison." });
      }
    } catch (err) {
      setSubmitMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to add comparison.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Delete Handler ─────────────────────────────────────────────────────── */
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteComparisonAPI(deleteTarget._id);
      setComparisons((prev) => prev.filter((c) => c._id !== deleteTarget._id));
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  /* ─── Update Handler ─────────────────────────────────────────────────────── */
  const handleConfirmUpdate = async (payload) => {
    try {
      const res = await updateComparisonAPI(payload);
      if (res.success || res.status) {
        setUpdateTarget(null);
        loadData();
      } else {
        throw new Error(res.message || "Failed to update");
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to update");
    }
  };

  /* ─── Render ─────────────────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
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
          <h1 className="text-2xl font-extrabold text-slate-900">Compare Cars</h1>
          <p className="text-sm text-slate-500">Create and manage car comparisons</p>
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

      {/* ── Add Comparison Collapsible Form ──────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm mb-8 overflow-hidden">
        <button
          type="button"
          onClick={() => setFormOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-blue-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
              <Scale className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Add Compare Trending Car</p>
              <p className="text-xs text-slate-500">Click to select two cars to compare</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              {/* Car 1 Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Select Car 1</label>
                <select
                  value={car1Id}
                  onChange={(e) => setCar1Id(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                >
                  <option value="">-- Choose First Car --</option>
                  {allCars.map((car) => (
                    <option key={car._id} value={car._id}>
                      {car.brand_name} {car.model_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Car 2 Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Select Car 2</label>
                <select
                  value={car2Id}
                  onChange={(e) => setCar2Id(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                >
                  <option value="">-- Choose Second Car --</option>
                  {allCars.map((car) => (
                    <option key={car._id} value={car._id}>
                      {car.brand_name} {car.model_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setFormOpen(false); setCar1Id(""); setCar2Id(""); setSubmitMsg(null); }}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition inline-flex items-center gap-2"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add Comparison
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Listed Comparisons ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
              <Scale className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                All Compared Cars
                <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  {comparisons.length}
                </span>
              </p>
              <p className="text-xs text-slate-500">Currently active comparisons</p>
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

        {/* Comparisons Grid */}
        {loadingData ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        ) : comparisons.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-500">
            No comparisons added yet.
          </div>
        ) : (
          <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {comparisons.map((comp) => {
              const c1 = comp.car_1 || {};
              const c2 = comp.car_2 || {};
              const d1 = c1.car_details || {};
              const d2 = c2.car_details || {};

              return (
                <div key={comp._id} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm hover:shadow-md transition flex items-center justify-between overflow-hidden">
                  
                  {/* Action buttons overlay */}
                  <div className="absolute top-2 right-2 flex gap-2 z-20">
                    <button
                      type="button"
                      onClick={() => setUpdateTarget(comp)}
                      className="rounded-lg bg-white/90 p-1.5 text-blue-600 shadow hover:bg-blue-50 transition"
                      title="Edit comparison"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(comp)}
                      className="rounded-lg bg-white/90 p-1.5 text-rose-600 shadow hover:bg-rose-50 transition"
                      title="Delete comparison"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Car 1 */}
                  <div className="flex-1 flex flex-col items-center text-center">
                    <div className="h-24 w-full mb-3 flex items-center justify-center">
                      <img 
                        src={d1.image_url || "/placeholder-car.png"} 
                        alt={c1.model_name}
                        className="h-full w-auto object-contain drop-shadow-md"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{c1.brand_name}</span>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{c1.model_name}</h3>
                    <p className="text-xs font-semibold text-slate-600 mt-1">{d1.price_display}</p>
                  </div>

                  {/* VS Badge */}
                  <div className="mx-2 z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-[3px] border-white bg-slate-800 text-sm font-black text-white shadow-lg">
                    VS
                  </div>

                  {/* Car 2 */}
                  <div className="flex-1 flex flex-col items-center text-center">
                    <div className="h-24 w-full mb-3 flex items-center justify-center">
                      <img 
                        src={d2.image_url || "/placeholder-car.png"} 
                        alt={c2.model_name}
                        className="h-full w-auto object-contain drop-shadow-md"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{c2.brand_name}</span>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{c2.model_name}</h3>
                    <p className="text-xs font-semibold text-slate-600 mt-1">{d2.price_display}</p>
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Update modal */}
      {updateTarget && (
        <UpdateModal
          comp={updateTarget}
          allCars={allCars}
          onCancel={() => setUpdateTarget(null)}
          onConfirm={handleConfirmUpdate}
        />
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          comp={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>
      )}
    </main>
  );
};

export default CompareCarsManagement;
