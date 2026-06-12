import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, ArrowLeft, Trash2, AlertTriangle } from "lucide-react";
import { MyContext } from "../../../ContextApi/DataProvider";

export default function DeleteQr() {
  const navigate = useNavigate();
  const { deleteQrAdmin } = useContext(MyContext);

  const [qrIdInput, setQrIdInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!qrIdInput.trim()) {
      toast.error("Please enter a valid QR ID");
      return;
    }
    
    // Additional confirmation for a destructive action
    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to permanently delete this QR code? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setLoading(true);
    const res = await deleteQrAdmin(qrIdInput.trim());
    if (res?.success) {
      setQrIdInput("");
      navigate("/qr-panel");
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
              Delete QR Code
            </h1>
            <p className="text-gray-500 text-sm">
              Permanently delete a QR code from the system.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">
              <strong>Danger Zone:</strong> Deleting a QR code will completely erase it from the database, including any user or vehicle associations, and remove its generated image. <strong>This cannot be undone.</strong>
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR ID to Delete <span className="text-red-500">*</span>
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
                onClick={handleDelete}
                disabled={loading || !qrIdInput.trim()}
                className={`
                  w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2
                  ${loading || !qrIdInput.trim()
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-lg shadow-md transform hover:scale-[1.01] active:scale-[0.99]"}
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting QR Code...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Permanently Delete QR
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
