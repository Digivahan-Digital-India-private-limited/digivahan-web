import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { QrCode, Loader2, ArrowLeft, Car, Bike, Zap } from "lucide-react";
import { MyContext } from "../../../ContextApi/DataProvider";

export default function GenerateQrById() {
  const navigate = useNavigate();
  const { generateQrByIdAdmin } = useContext(MyContext);

  const [qrIdInput, setQrIdInput] = useState("");
  const [vehicleTypeInput, setVehicleTypeInput] = useState("car");
  const [loading, setLoading] = useState(false);

  const handleGenerateById = async () => {
    if (!qrIdInput.trim()) {
      toast.error("Please enter a valid QR ID");
      return;
    }
    
    setLoading(true);
    const res = await generateQrByIdAdmin(qrIdInput.trim(), vehicleTypeInput);
    if (res?.status) {
      setQrIdInput("");
      setVehicleTypeInput("car");
      navigate("/unassigned-qr");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/qr-panel")}
            className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-sm transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Generate QR by Custom ID
            </h1>
            <p className="text-gray-500 text-sm">
              Create a custom QR code with a specific ID
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={qrIdInput}
                onChange={(e) => setQrIdInput(e.target.value)}
                placeholder="e.g. DIGI-2025-001"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-lg font-mono"
              />
              <p className="text-xs text-gray-500 mt-2">
                This exact ID will be encoded into the generated QR code.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center gap-3 py-4 rounded-xl border-2 cursor-pointer transition-all ${vehicleTypeInput === "car" ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm" : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"}`}>
                  <input
                    type="radio"
                    name="vehicle_type"
                    value="car"
                    checked={vehicleTypeInput === "car"}
                    onChange={() => setVehicleTypeInput("car")}
                    className="hidden"
                  />
                  <Car className={`w-6 h-6 ${vehicleTypeInput === "car" ? "text-blue-600" : "text-gray-400"}`} />
                  <span className="font-semibold text-lg">Car</span>
                </label>
                
                <label className={`flex items-center justify-center gap-3 py-4 rounded-xl border-2 cursor-pointer transition-all ${vehicleTypeInput === "bike" ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"}`}>
                  <input
                    type="radio"
                    name="vehicle_type"
                    value="bike"
                    checked={vehicleTypeInput === "bike"}
                    onChange={() => setVehicleTypeInput("bike")}
                    className="hidden"
                  />
                  <Bike className={`w-6 h-6 ${vehicleTypeInput === "bike" ? "text-emerald-600" : "text-gray-400"}`} />
                  <span className="font-semibold text-lg">Bike</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleGenerateById}
                disabled={loading || !qrIdInput.trim()}
                className={`
                  w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2
                  ${loading || !qrIdInput.trim()
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg shadow-md transform hover:scale-[1.01] active:scale-[0.99]"}
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating QR Code...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate Custom QR Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
