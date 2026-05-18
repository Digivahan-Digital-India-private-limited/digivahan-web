import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { 
  ChevronLeft, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Info, 
  Calendar, 
  User, 
  FileText,
  Car,
  Search
} from "lucide-react";
import { fetchVehicleRtoDetails, addVehicleToGarage } from "../services/vehiclesApi";

const AddVehiclePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Step state: 'input' | 'details'
  const [step, setStep] = useState("input");
  const [rcNumber, setRcNumber] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ownerVerificationInput, setOwnerVerificationInput] = useState("");

  // Expandable sections state
  const [expandedSections, setExpandedSections] = useState({
    ownership: false,
    vehicle: false,
    dates: false,
    other: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Step 1: Fetch Vehicle RTO Details Mutation
  const fetchDetailsMutation = useMutation({
    mutationFn: fetchVehicleRtoDetails,
    onSuccess: (data) => {
      setVehicleDetails(data);
      setStep("details");
      toast.success("Vehicle details fetched successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Vehicle details not found in RTO registry");
    },
  });

  // Step 2: Add to Garage Mutation
  const addGarageMutation = useMutation({
    mutationFn: ({ rc, owner }) => addVehicleToGarage(rc, owner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-vehicles"] });
      toast.success("Vehicle verified and added to garage successfully!");
      setIsModalOpen(false);
      navigate("/vehicles");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Verification failed. Please check owner name.");
    },
  });

  const handleRcSubmit = (e) => {
    e.preventDefault();
    if (!rcNumber.trim()) {
      toast.error("Please enter a valid RC Number");
      return;
    }
    fetchDetailsMutation.mutate(rcNumber);
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (!ownerVerificationInput.trim()) {
      toast.error("Please enter the owner name");
      return;
    }
    addGarageMutation.mutate({
      rc: rcNumber,
      owner: ownerVerificationInput.trim(),
    });
  };

  // UI Helper to match vehicle images based on type
  const getVehicleImage = (type) => {
    const lower = String(type || "").toLowerCase();
    if (lower.includes("scooter") || lower.includes("bike") || lower.includes("two wheeler")) {
      return "/Scooter Image.png"; // Fallback to premium scooter graphic
    }
    return "/Car Image.png"; // Fallback to premium car graphic
  };

  return (
    <div className="mx-auto max-w-lg space-y-4 pb-12">
      {/* Header bar */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <button
          type="button"
          onClick={() => {
            if (step === "details") {
              setStep("input");
              setVehicleDetails(null);
            } else {
              navigate("/vehicles");
            }
          }}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 transition"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {step === "input" ? "Add New Vehicle" : "Vehicle Info"}
          </h2>
          <p className="text-xs text-slate-500">
            {step === "input" ? "Enter your vehicle registration number" : "Verify RTO details"}
          </p>
        </div>
      </div>

      {/* STEP 1: RC Number Input */}
      {step === "input" && (
        <form onSubmit={handleRcSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Vehicle RC Number
            </label>
            <input
              type="text"
              value={rcNumber}
              onChange={(e) => setRcNumber(e.target.value.toUpperCase())}
              placeholder="e.g. DL1CS3305"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase font-semibold tracking-wider outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={fetchDetailsMutation.isPending}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70 transition cursor-pointer"
          >
            {fetchDetailsMutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Searching RTO Registry...
              </>
            ) : (
              <>
                <Search size={16} />
                Search Vehicle
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 2: Vehicle Info Details (Matches image1.jpeg) */}
      {step === "details" && vehicleDetails && (
        <div className="space-y-4">
          {/* Main Info Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between p-5">
              <div className="space-y-1">
                {/* Masked Owner Name */}
                <h3 className="text-lg font-bold text-slate-900 tracking-wide">
                  {vehicleDetails?.custom_vehicle_info?.owner_name || "N/A"}
                </h3>
                {/* Plate and Owner Type */}
                <p className="text-xs font-semibold text-slate-500">
                  {rcNumber} • {vehicleDetails?.custom_vehicle_info?.ownership_details || "First Owner"}
                </p>
                {/* Make & Model */}
                <p className="text-sm font-medium text-slate-700">
                  {vehicleDetails?.custom_vehicle_info?.vehicle_name || "TVS Jupiter"}
                </p>
              </div>

              {/* Vehicle Avatar */}
              <img
                src={getVehicleImage(vehicleDetails?.custom_vehicle_info?.vehicle_class)}
                alt="Vehicle Graphic"
                className="h-16 w-24 object-contain bg-slate-50 border border-slate-100 rounded-xl"
              />
            </div>

            {/* Verification Action Button */}
            <div className="bg-emerald-50 border-t border-emerald-100 p-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition cursor-pointer shadow-sm"
              >
                <Car size={18} />
                Add It In MyGarage
              </button>
            </div>
          </div>

          {/* Expandable Accordion List */}
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {/* Accordion 1: Ownership Details */}
            <div className="border-b border-slate-100 pb-2">
              <button
                type="button"
                onClick={() => toggleSection("ownership")}
                className="flex w-full items-center justify-between py-2 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <User size={16} />
                  </span>
                  <span className="text-sm font-semibold text-emerald-800">Ownership details</span>
                </div>
                {expandedSections.ownership ? <ChevronUp size={18} className="text-emerald-600" /> : <ChevronDown size={18} className="text-emerald-600" />}
              </button>
              {expandedSections.ownership && (
                <div className="mt-2 space-y-2 pl-11 pr-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Owner Name:</span>
                    <span className="font-semibold">{vehicleDetails?.custom_vehicle_info?.owner_name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Owner Count:</span>
                    <span className="font-semibold">{vehicleDetails?.custom_vehicle_info?.ownership_details || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Registered RTO:</span>
                    <span className="font-semibold">{vehicleDetails?.custom_vehicle_info?.registered_rto || "N/A"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Vehicle Details */}
            <div className="border-b border-slate-100 py-2">
              <button
                type="button"
                onClick={() => toggleSection("vehicle")}
                className="flex w-full items-center justify-between py-2 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Car size={16} />
                  </span>
                  <span className="text-sm font-semibold text-emerald-800">Vehicle details</span>
                </div>
                {expandedSections.vehicle ? <ChevronUp size={18} className="text-emerald-600" /> : <ChevronDown size={18} className="text-emerald-600" />}
              </button>
              {expandedSections.vehicle && (
                <div className="mt-2 space-y-2 pl-11 pr-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Maker Model:</span>
                    <span className="font-semibold">{vehicleDetails?.custom_vehicle_info?.makers_model || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Vehicle Class:</span>
                    <span className="font-semibold">{vehicleDetails?.custom_vehicle_info?.vehicle_class || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Fuel Type:</span>
                    <span className="font-semibold">{vehicleDetails?.custom_vehicle_info?.fuel_type || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Engine No:</span>
                    <span className="font-semibold">{vehicleDetails?.custom_vehicle_info?.engine || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Chassis No:</span>
                    <span className="font-semibold">{vehicleDetails?.custom_vehicle_info?.chassis || "N/A"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Important Dates */}
            <div className="border-b border-slate-100 py-2">
              <button
                type="button"
                onClick={() => toggleSection("dates")}
                className="flex w-full items-center justify-between py-2 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Calendar size={16} />
                  </span>
                  <span className="text-sm font-semibold text-emerald-800">Important dates</span>
                </div>
                {expandedSections.dates ? <ChevronUp size={18} className="text-emerald-600" /> : <ChevronDown size={18} className="text-emerald-600" />}
              </button>
              {expandedSections.dates && (
                <div className="mt-2 space-y-2 pl-11 pr-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Registration Date:</span>
                    <span className="font-semibold">
                      {vehicleDetails?.custom_vehicle_info?.registration_date ? new Date(vehicleDetails.custom_vehicle_info.registration_date).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Insurance Expiry:</span>
                    <span className="font-semibold">
                      {vehicleDetails?.custom_vehicle_info?.insurance_expiry ? new Date(vehicleDetails.custom_vehicle_info.insurance_expiry).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Pollution Expiry:</span>
                    <span className="font-semibold">
                      {vehicleDetails?.custom_vehicle_info?.pollution_expiry ? new Date(vehicleDetails.custom_vehicle_info.pollution_expiry).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 4: Other Info */}
            <div className="py-2">
              <button
                type="button"
                onClick={() => toggleSection("other")}
                className="flex w-full items-center justify-between py-2 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Info size={16} />
                  </span>
                  <span className="text-sm font-semibold text-emerald-800">Other info</span>
                </div>
                {expandedSections.other ? <ChevronUp size={18} className="text-emerald-600" /> : <ChevronDown size={18} className="text-emerald-600" />}
              </button>
              {expandedSections.other && (
                <div className="mt-2 space-y-2 pl-11 pr-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Vehicle Age:</span>
                    <span className="font-semibold">{vehicleDetails?.custom_vehicle_info?.vehicle_age ? `${vehicleDetails.custom_vehicle_info.vehicle_age} Years` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">RC Status:</span>
                    <span className="font-semibold text-emerald-600">{vehicleDetails?.custom_vehicle_info?.rc_status || "Active"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Unladen Weight:</span>
                    <span className="font-semibold">{vehicleDetails?.custom_vehicle_info?.unloaded_weight ? `${vehicleDetails.custom_vehicle_info.unloaded_weight} kg` : "N/A"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Verify Owner Popup Modal (Matches image2.jpeg) */}
      {isModalOpen && vehicleDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          {/* Modal Card */}
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl transition-all duration-300 transform scale-100">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-full text-emerald-600 hover:bg-slate-100 p-1.5 transition"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-emerald-600 text-emerald-600 font-bold text-sm">
                X
              </div>
            </button>

            <form onSubmit={handleVerifySubmit} className="flex flex-col items-center text-center space-y-5 pt-3">
              {/* Digivahan Logo Badge */}
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-400 bg-white p-2 shadow-sm">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-emerald-500 text-white p-1">
                  <span className="text-[10px] font-bold tracking-tight text-white/90">DIGIVAHAN</span>
                  <span className="text-[8px] font-semibold text-amber-200">DIGITAL INDIA</span>
                </div>
              </div>

              {/* Form Headers */}
              <div className="space-y-2">
                <h4 className="text-base font-extrabold text-slate-900">Verify Owner</h4>
                <p className="text-xs text-slate-500 leading-relaxed px-2">
                  Please verify <span className="font-bold text-slate-700">{vehicleDetails?.custom_vehicle_info?.owner_name}</span> vehicle owner, to add vehicle in garage.
                </p>
              </div>

              {/* Owner Input */}
              <div className="w-full">
                <input
                  type="text"
                  value={ownerVerificationInput}
                  onChange={(e) => setOwnerVerificationInput(e.target.value)}
                  placeholder="Enter owner name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={addGarageMutation.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-70 transition cursor-pointer"
              >
                {addGarageMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddVehiclePage;
