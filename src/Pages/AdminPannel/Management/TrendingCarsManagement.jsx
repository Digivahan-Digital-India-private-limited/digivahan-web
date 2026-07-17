import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Car,
  RefreshCw,
  ImageOff,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/* ─── API helpers ──────────────────────────────────────────────────────────── */
const getAllCars = async () => {
  const res = await axios.get(`${BASE_URL}/api/list/all-car`);
  return res.data;
};

const addCarAPI = async (payload) => {
  const token = localStorage.getItem("token") || "";
  const isFormData = payload instanceof FormData;
  const res = await axios.post(`${BASE_URL}/api/add/tranding/car`, payload, {
    headers: { 
      Authorization: `Bearer ${token}`,
      ...(isFormData ? { "Content-Type": "multipart/form-data" } : {})
    },
  });
  return res.data;
};

const deleteCarAPI = async (carId) => {
  const token = localStorage.getItem("token") || "";
  const res = await axios.delete(`${BASE_URL}/api/user/delete-car/${carId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/* ─── Initial form state ──────────────────────────────────────────────────── */
const EMPTY_FORM = {
  brand_name: "",
  model_name: "",
  type: "",
  price: "",
  price_display: "",
  mileage: "",
  top_speed: "",
  image_url: "",
  // specifications
  engine_capacity: "",
  transmission: "",
  fuel_tank_capacity: "",
  seat_height: "",
  kerb_weight: "",
  // detailed_specifications
  max_power: "",
  max_torque: "",
  riding_mode: "",
  gear_shifting_pattern: "",
  // dimensions
  bootspace: "",
  ground_clearance: "",
  length: "",
  width: "",
  height: "",
  // features
  air_conditioner: true,
  central_locking: "",
  power_windows: "",
  headrest: "",
  parking_assist: "",
  cruise_control: false,
  music_system_count: 1,
  apple_carplay: "",
  android_auto: "",
  abs: true,
  sunroof: false,
  third_row_ac: false,
  airbags: "",
};

/* ─── Helper: build nested payload ────────────────────────────────────────── */
const buildPayload = (f) => ({
  brand_name: f.brand_name,
  model_name: f.model_name,
  type: f.type,
  price: Number(f.price),
  price_display: f.price_display,
  mileage: f.mileage,
  top_speed: f.top_speed,
  image_url: f.image_url,
  specifications: {
    engine_capacity: f.engine_capacity,
    transmission: f.transmission,
    fuel_tank_capacity: f.fuel_tank_capacity,
    seat_height: f.seat_height || "Not Available",
    kerb_weight: f.kerb_weight,
  },
  detailed_specifications: {
    max_power: f.max_power,
    max_torque: f.max_torque,
    riding_mode: f.riding_mode,
    gear_shifting_pattern: f.gear_shifting_pattern,
  },
  dimensions: {
    bootspace: f.bootspace,
    ground_clearance: f.ground_clearance,
    length: f.length,
    width: f.width,
    height: f.height,
  },
  features: {
    air_conditioner: f.air_conditioner,
    central_locking: f.central_locking,
    power_windows: f.power_windows,
    headrest: f.headrest,
    parking_assist: f.parking_assist,
    cruise_control: f.cruise_control,
    music_system_count: Number(f.music_system_count) || 1,
    apple_carplay: f.apple_carplay,
    android_auto: f.android_auto,
    abs: f.abs,
    sunroof: f.sunroof,
    third_row_ac: f.third_row_ac,
    airbags: f.airbags
      ? f.airbags.split(",").map((a) => a.trim()).filter(Boolean)
      : [],
  },
});

/* ─── Section wrapper ─────────────────────────────────────────────────────── */
const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3 border-b pb-1">
      {title}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
  </div>
);

/* ─── Input field ─────────────────────────────────────────────────────────── */
const Field = ({ label, name, value, onChange, type = "text", placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-slate-600">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
    />
  </div>
);

/* ─── Toggle field ────────────────────────────────────────────────────────── */
const Toggle = ({ label, name, checked, onChange }) => (
  <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2.5">
    <span className="text-sm text-slate-700">{label}</span>
    <button
      type="button"
      onClick={() => onChange({ target: { name, value: !checked, type: "toggle" } })}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-violet-500" : "bg-slate-300"
        }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : ""
          }`}
      />
    </button>
  </div>
);

/* ─── Delete Confirm Modal ────────────────────────────────────────────────── */
const DeleteModal = ({ car, onCancel, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <h3 className="text-lg font-bold text-slate-900">Delete Car?</h3>
      <p className="mt-2 text-sm text-slate-600">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-slate-800">
          {car.brand_name} {car.model_name}
        </span>
        ?
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
const TrendingCarsManagement = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);

  // Add form
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null); // {type: 'success'|'error', text}

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ─── Load cars ──────────────────────────────────────────────────────────── */
  const loadCars = useCallback(async () => {
    setLoadingCars(true);
    try {
      const data = await getAllCars();
      if (data.status) setCars(data.data || []);
    } catch (err) {
      console.error("Load cars error:", err);
    } finally {
      setLoadingCars(false);
    }
  }, []);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  /* ─── Form handlers ──────────────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "toggle" ? value : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brand_name || !form.model_name) {
      setSubmitMsg({ type: "error", text: "Brand name and model name are required." });
      return;
    }
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const payloadJson = buildPayload(form);
      const formData = new FormData();
      
      formData.append("brand_name", payloadJson.brand_name);
      formData.append("model_name", payloadJson.model_name);
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (payloadJson.image_url) {
        formData.append("image_url", payloadJson.image_url);
      }
      
      delete payloadJson.brand_name;
      delete payloadJson.model_name;
      delete payloadJson.image_url;
      
      formData.append("car_details", JSON.stringify(payloadJson));

      const res = await addCarAPI(formData);
      if (res.status) {
        setSubmitMsg({ type: "success", text: "Car added successfully!" });
        setForm(EMPTY_FORM);
        setImageFile(null);
        setFormOpen(false);
        loadCars();
      } else {
        setSubmitMsg({ type: "error", text: res.message || "Failed to add car." });
      }
    } catch (err) {
      setSubmitMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to add car.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Delete handler ─────────────────────────────────────────────────────── */
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCarAPI(deleteTarget._id);
      setCars((prev) => prev.filter((c) => c._id !== deleteTarget._id));
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  /* ─── Render ─────────────────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 via-slate-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
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
          <h1 className="text-2xl font-extrabold text-slate-900">Trending Cars</h1>
          <p className="text-sm text-slate-500">Add, view & delete trending cars on the platform</p>
        </div>
      </div>

      {/* Submit message (outside form) */}
      {submitMsg && (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold ${submitMsg.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
        >
          {submitMsg.text}
        </div>
      )}

      {/* ── Add Car Collapsible Form ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm mb-8 overflow-hidden">
        {/* Toggle header */}
        <button
          type="button"
          onClick={() => setFormOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-violet-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">
              <Plus className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Add Trending Car</p>
              <p className="text-xs text-slate-500">Click to expand the form</p>
            </div>
          </div>
          {formOpen ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </button>

        {/* Form body */}
        {formOpen && (
          <form onSubmit={handleSubmit} className="px-5 pb-6 pt-2 border-t border-slate-100">
            <Section title="Basic Information">
              <Field label="Brand Name *" name="brand_name" value={form.brand_name} onChange={handleChange} />
              <Field label="Model Name *" name="model_name" value={form.model_name} onChange={handleChange} />
              <Field label="Type (e.g. Compact Sedan)" name="type" value={form.type} onChange={handleChange} />
              <Field label="Price (numeric)" name="price" value={form.price} onChange={handleChange} type="number" />
              <Field label="Price Display (e.g. ₹6.70 Lakh onwards)" name="price_display" value={form.price_display} onChange={handleChange} />
              <Field label="Mileage" name="mileage" value={form.mileage} onChange={handleChange} />
              <Field label="Top Speed" name="top_speed" value={form.top_speed} onChange={handleChange} />
              <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">Image URL or Upload File</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    name="image_url"
                    value={form.image_url}
                    onChange={(e) => { handleChange(e); setImageFile(null); }}
                    placeholder="https://..."
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                  />
                  <div className="flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-400">OR</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                        setForm(prev => ({...prev, image_url: ""}));
                      }
                    }}
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 transition cursor-pointer"
                  />
                </div>
                {(form.image_url || imageFile) && (
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : form.image_url}
                    alt="preview"
                    className="mt-2 h-32 w-auto rounded-lg object-contain border border-slate-100"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                )}
              </div>
            </Section>

            <Section title="Specifications">
              <Field label="Engine Capacity" name="engine_capacity" value={form.engine_capacity} onChange={handleChange} />
              <Field label="Transmission" name="transmission" value={form.transmission} onChange={handleChange} />
              <Field label="Fuel Tank Capacity" name="fuel_tank_capacity" value={form.fuel_tank_capacity} onChange={handleChange} />
              <Field label="Seat Height" name="seat_height" value={form.seat_height} onChange={handleChange} />
              <Field label="Kerb Weight" name="kerb_weight" value={form.kerb_weight} onChange={handleChange} />
            </Section>

            <Section title="Detailed Specifications">
              <Field label="Max Power" name="max_power" value={form.max_power} onChange={handleChange} />
              <Field label="Max Torque" name="max_torque" value={form.max_torque} onChange={handleChange} />
              <Field label="Riding Mode" name="riding_mode" value={form.riding_mode} onChange={handleChange} />
              <Field label="Gear Shifting Pattern" name="gear_shifting_pattern" value={form.gear_shifting_pattern} onChange={handleChange} />
            </Section>

            <Section title="Dimensions">
              <Field label="Bootspace" name="bootspace" value={form.bootspace} onChange={handleChange} />
              <Field label="Ground Clearance" name="ground_clearance" value={form.ground_clearance} onChange={handleChange} />
              <Field label="Length" name="length" value={form.length} onChange={handleChange} />
              <Field label="Width" name="width" value={form.width} onChange={handleChange} />
              <Field label="Height" name="height" value={form.height} onChange={handleChange} />
            </Section>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3 border-b pb-1">
                Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Toggle label="Air Conditioner" name="air_conditioner" checked={form.air_conditioner} onChange={handleChange} />
                <Toggle label="ABS" name="abs" checked={form.abs} onChange={handleChange} />
                <Toggle label="Cruise Control" name="cruise_control" checked={form.cruise_control} onChange={handleChange} />
                <Toggle label="Sunroof" name="sunroof" checked={form.sunroof} onChange={handleChange} />
                <Toggle label="Third Row AC" name="third_row_ac" checked={form.third_row_ac} onChange={handleChange} />
                <Field label="Central Locking" name="central_locking" value={form.central_locking} onChange={handleChange} />
                <Field label="Power Windows" name="power_windows" value={form.power_windows} onChange={handleChange} />
                <Field label="Headrest" name="headrest" value={form.headrest} onChange={handleChange} />
                <Field label="Parking Assist" name="parking_assist" value={form.parking_assist} onChange={handleChange} />
                <Field label="Apple CarPlay" name="apple_carplay" value={form.apple_carplay} onChange={handleChange} />
                <Field label="Android Auto" name="android_auto" value={form.android_auto} onChange={handleChange} />
                <Field label="Music Systems Count" name="music_system_count" value={form.music_system_count} onChange={handleChange} type="number" />
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">Airbags (comma-separated)</label>
                  <input
                    type="text"
                    name="airbags"
                    value={form.airbags}
                    onChange={handleChange}
                    placeholder="Driver, Front Passenger, Side, Curtain"
                    className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setFormOpen(false); setForm(EMPTY_FORM); setImageFile(null); setSubmitMsg(null); }}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 transition inline-flex items-center gap-2"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add Car
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Listed Cars ──────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* List header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">
              <Car className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                All Trending Cars
                <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
                  {cars.length}
                </span>
              </p>
              <p className="text-xs text-slate-500">Currently listed on the platform</p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadCars}
            disabled={loadingCars}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingCars ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Cars grid */}
        {loadingCars ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
          </div>
        ) : cars.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-500">
            No trending cars added yet.
          </div>
        ) : (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cars.map((car) => {
              const d = car.car_details || {};
              return (
                <div
                  key={car._id}
                  className="rounded-xl border border-slate-100 bg-slate-50 overflow-hidden hover:shadow-md transition"
                >
                  {/* Car image */}
                  <div className="relative h-44 bg-slate-100 flex items-center justify-center overflow-hidden">
                    {d.image_url ? (
                      <img
                        src={d.image_url}
                        alt={`${car.brand_name} ${car.model_name}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="absolute inset-0 flex-col items-center justify-center text-slate-400 hidden"
                    >
                      <ImageOff className="h-10 w-10 mb-1" />
                      <span className="text-xs">No image</span>
                    </div>
                    {/* Delete button overlay */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(car)}
                      className="absolute top-2 right-2 rounded-lg bg-white/90 p-1.5 text-rose-600 shadow hover:bg-rose-50 transition"
                      title="Delete car"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Car details */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide">
                      {car.brand_name}
                    </p>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{car.model_name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{d.type}</p>

                    <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-600">
                      <span className="font-medium text-slate-800">{d.price_display || "—"}</span>
                      <span>{d.mileage || "—"}</span>
                      <span>Top speed: {d.top_speed || "—"}</span>
                      <span>Engine: {d.specifications?.engine_capacity || "—"}</span>
                      <span>Fuel tank: {d.specifications?.fuel_tank_capacity || "—"}</span>
                      <span>Transmission: {d.specifications?.transmission || "—"}</span>
                    </div>

                    {/* Feature badges */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {d.features?.abs && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">ABS</span>
                      )}
                      {d.features?.sunroof && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">Sunroof</span>
                      )}
                      {d.features?.cruise_control && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Cruise</span>
                      )}
                      {d.features?.apple_carplay && (
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
                          CarPlay {d.features.apple_carplay}
                        </span>
                      )}
                      {d.features?.airbags?.length > 0 && (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                          {d.features.airbags.length} Airbags
                        </span>
                      )}
                    </div>

                    {/* Added date */}
                    <p className="mt-3 text-xs text-slate-400">
                      Added: {new Date(car.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          car={deleteTarget}
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

export default TrendingCarsManagement;
