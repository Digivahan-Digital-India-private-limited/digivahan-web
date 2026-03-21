import React, { useState, useRef, useContext } from "react";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";
import {
  QrCode,
  Download,
  Printer,
  Car,
  Bike,
  CheckCircle2,
  Loader2,
  Zap,
  ArrowRight,
  Plus,
} from "lucide-react";
import { MyContext } from "../../../ContextApi/DataProvider";

/* ─── helpers ────────────────────────────────────────────────── */
const QR_TYPES = [
  {
    value: "CAR",
    label: "Car",
    icon: Car,
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
  },
  {
    value: "BIKE",
    label: "Bike",
    icon: Bike,
    gradient: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
  },
];

const buildQRValue = (type, index) =>
  `DIGIVAHAN-${type}-${String(Date.now()).slice(-6)}-${String(index + 1).padStart(4, "0")}`;

/* ─── component ─────────────────────────────────────────────── */
export default function GenerateQR() {
  const { generateQrByAdmin, generateQrtemplateInBulk } = useContext(MyContext);
  const [qrType, setQrType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const canvasRefs = useRef([]);

  const handleGenerate = async () => {
    if (!qrType || quantity < 1) return;

    try {
      setLoading(true);
      setDone(false);
      setGenerated([]);
      canvasRefs.current = [];

      const res = await generateQrByAdmin(quantity);
      console.log(res);

      if (res) {
        toast.success("QR Generate Successfully");

        setGenerated(
          Array.from({ length: quantity }, (_, i) => buildQRValue(qrType, i)),
        );

        setDone(true);
      }
    } catch (error) {
      toast.error("Failed to generate QR");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!qrType) {
      toast.error("Please select vehicle type");
      return;
    }

    try {
      const res = await generateQrtemplateInBulk(qrType.toLowerCase());

      if (res?.success && res?.download_zip) {
        const link = document.createElement("a");
        link.href = res.download_zip;
        link.setAttribute("download", "");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("QR Download Successfully");
      } else {
        toast.error("Download failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error downloading QR");
    }
  };

  const isReady = done && generated.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        
        .slide-up { animation: slideUp 0.5s ease-out both; }
        .fade-in { animation: fadeIn 0.4s ease-out both; }
        .scale-in { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .bounce-hover:hover { animation: bounce 0.6s ease-in-out; }
        
        .gradient-border {
          background: linear-gradient(white, white) padding-box,
          linear-gradient(135deg, #3b82f6, #10b981) border-box;
          border: 2px solid transparent;
        }
        
        .card-shadow {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
        
        .card-hover {
          transition: all 0.2s ease-in-out;
        }
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="slide-up mb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                QR Code Generator
              </h1>
              <p className="text-gray-500">
                Generate QR codes for vehicle management
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-2">
            <div
              className="bg-white rounded-xl card-shadow p-6 slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              {/* Step 1: Vehicle Type */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Select Vehicle Type
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {QR_TYPES.map((type) => {
                    const VehicleIcon = type.icon;
                    const active = qrType === type.value;
                    return (
                      <button
                        key={type.value}
                        onClick={() => {
                          setQrType(type.value);
                          setDone(false);
                          setGenerated([]);
                        }}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200 card-hover
                          ${
                            active
                              ? `bg-linear-to-r ${type.gradient} text-white border-transparent shadow-lg`
                              : `${type.bg} ${type.text} ${type.border} hover:border-gray-300`
                          }
                        `}
                      >
                        <div className="text-center">
                          <div
                            className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center
                            ${active ? "bg-white/20" : "bg-white"}
                          `}
                          >
                            <VehicleIcon
                              className={`w-6 h-6 ${active ? "text-white" : type.text}`}
                            />
                          </div>
                          <div className="font-medium">{type.label}</div>
                          {active && (
                            <div className="mt-2 flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-xs">Selected</span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Quantity */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Enter Quantity
                  </h3>
                  <span className="ml-auto text-sm text-gray-500">Max 100</span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={quantity}
                    onChange={(e) => {
                      const v = Math.max(
                        1,
                        Math.min(100, Number(e.target.value)),
                      );
                      setQuantity(v);
                      setDone(false);
                      setGenerated([]);
                    }}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter quantity..."
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                    {qrType ? `${quantity} × ${qrType}` : "codes"}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!qrType || loading}
                className={`
                  w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2
                  ${
                    !qrType || loading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                  }
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating {quantity} QR Code{quantity > 1 ? "s" : ""}...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate {quantity} {qrType || "QR"} Code
                    {quantity > 1 ? "s" : ""}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              {/* Success Message */}
              {isReady && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">
                        {generated.length} {qrType} QR Code
                        {generated.length > 1 ? "s" : ""} Generated!
                      </h4>
                      <p className="text-sm text-green-600">
                        Ready for download
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={!isReady}
                className={`
    mt-3 w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 border-2
    ${
      isReady
        ? "border-blue-500 text-blue-600 hover:bg-blue-50"
        : "border-gray-200 text-gray-400 cursor-not-allowed"
    }
  `}
              >
                <Download className="w-4 h-4" />
                Download {isReady ? generated.length : ""} QR Code
                {quantity > 1 ? "s" : ""} (PNG)
              </button>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            <div
              className="bg-white rounded-xl card-shadow p-6 slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Selected Type</span>
                  <span className="font-medium text-gray-900">
                    {qrType || "None"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium text-gray-900">{quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Generated</span>
                  <span className="font-medium text-green-600">
                    {generated.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div
              className="bg-white rounded-xl card-shadow p-6 slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Features
              </h3>
              <div className="space-y-3">
                {[
                  { icon: "🚗", label: "Car & Bike Support" },
                  { icon: "⚡", label: "Instant Generation" },
                  { icon: "📱", label: "High Quality PNG" },
                  { icon: "🔢", label: "Batch Processing" },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg">{feature.icon}</span>
                    <span className="text-sm text-gray-600">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* QR Grid */}
        {isReady && (
          <div className="mt-8 slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="bg-white rounded-xl card-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-gray-500" />
                  Generated QR Codes
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {generated.length}
                  </span>
                </h3>
                <button
                  onClick={handleDownload}
                  disabled={!isReady}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
    ${
      isReady
        ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
        : "bg-gray-200 text-gray-400 cursor-not-allowed"
    }
  `}
                >
                  <Download className="w-4 h-4" />
                  Download All
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {generated.map((value, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-lg p-3 scale-in card-hover"
                    style={{ animationDelay: `${Math.min(i * 0.05, 0.8)}s` }}
                  >
                    <div className="bg-white p-2 rounded-lg mb-2 mx-auto w-fit">
                      <QRCodeCanvas
                        value={value}
                        size={80}
                        bgColor="#ffffff"
                        fgColor="#111827"
                        level="M"
                        ref={(el) => (canvasRefs.current[i] = el)}
                      />
                    </div>

                    <div className="text-center">
                      <div
                        className={`inline-block px-2 py-1 rounded text-xs font-medium mb-1 ${
                          qrType === "CAR"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {qrType} #{String(i + 1).padStart(3, "0")}
                      </div>
                      <p className="text-xs text-gray-500 break-all font-mono">
                        {value.slice(-12)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
