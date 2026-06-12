import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { QrCode, Loader2, ArrowLeft, Unlock, AlertCircle } from "lucide-react";
import { MyContext } from "../../../ContextApi/DataProvider";

export default function UnassignQr() {
  const navigate = useNavigate();
  const { unassignQrAdmin } = useContext(MyContext);

  const [qrIdInput, setQrIdInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUnassign = async () => {
    if (!qrIdInput.trim()) {
      toast.error("Please enter a valid QR ID");
      return;
    }
    
    setLoading(true);
    const res = await unassignQrAdmin(qrIdInput.trim());
    if (res?.success) {
      setQrIdInput("");
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
              Unassign QR Code
            </h1>
            <p className="text-gray-500 text-sm">
              Remove a QR code from a user and return it to the unassigned pool.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Warning:</strong> Unassigning a QR code will permanently remove its association with the current user and vehicle. This action cannot be easily undone without physically re-scanning and assigning the QR again.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR ID to Unassign <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={qrIdInput}
                onChange={(e) => setQrIdInput(e.target.value)}
                placeholder="e.g. DIGI-2025-001"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-lg font-mono"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleUnassign}
                disabled={loading || !qrIdInput.trim()}
                className={`
                  w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2
                  ${loading || !qrIdInput.trim()
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg shadow-md transform hover:scale-[1.01] active:scale-[0.99]"}
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Unassigning QR Code...
                  </>
                ) : (
                  <>
                    <Unlock className="w-5 h-5" />
                    Unassign QR Code
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
