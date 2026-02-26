import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function OrderSuccessful() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleTrack = () => {
    navigate("/ios/track-order");
  };

  return (
    <div className="fixed inset-0 bg-gray-200 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        {/* Status Bar */}
        <div className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-gray-700">
          <span>9:41</span>
          <div className="flex gap-1">
            <span>📡</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Title Bar */}
        <div className="px-6 py-4 flex items-center gap-4">
          <button
            onClick={handleBack}
            className="w-6 h-6 flex items-center justify-center text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">My Order</h1>
        </div>

        {/* Tabs */}
        <div className="px-6 pb-3 flex gap-2 overflow-x-auto">
          <button className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-full whitespace-nowrap">
            Pending
          </button>
          <button className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-semibold rounded-full whitespace-nowrap">
            Progress
          </button>
          <button className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-semibold rounded-full whitespace-nowrap">
            Shipped
          </button>
          <button className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-semibold rounded-full whitespace-nowrap">
            Shipped
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 relative">
        {/* Order Card */}
        <div className="bg-white rounded-xl border-2 border-gray-300 p-4 mb-4 relative">
          {/* QR Code and Details */}
          <div className="flex gap-4 mb-4">
            <div className="w-20 h-20 border-2 border-green-500 rounded-lg p-1 shrink-0">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=DIGI-QR-C-25" 
                alt="QR Code"
                className="w-full h-full"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Physical QR Code</h3>
              <p className="text-xs text-gray-500 mb-2">For Luggage Trolly bag</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>10 Jun 2025 05 : 04 pm</span>
                <span>📅</span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-700">Order ID: <span className="text-gray-900 font-semibold">DIGI - QR - C - 25</span></p>
              <p className="text-xs text-gray-700">Status: <span className="text-green-600 font-semibold">Pending</span></p>
            </div>
            <button className="px-4 py-1.5 bg-green-500 text-white text-xs font-bold rounded-md">
              view more
            </button>
          </div>
        </div>

        {/* Another Order Card */}
        <div className="bg-white rounded-xl border-2 border-gray-300 p-4">
          <div className="flex gap-4">
            <div className="w-20 h-20 border-2 border-green-500 rounded-lg p-1 shrink-0">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=PHYSICAL-QR-CODE" 
                alt="QR Code"
                className="w-full h-full"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Physical QR Code</h3>
              <p className="text-xs text-gray-500 mb-2">For Luggage Trolly bag</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>08 Jun 2025 05 : 04 pm</span>
                <span>📅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal Overlay - Centered on screen */}
        <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm mx-4 p-8 pointer-events-auto">
            {/* Success Badge */}
            <div className="flex justify-center mb-6">
              <img 
                src="/success 1.png" 
                alt="Success" 
                className="w-32 h-32 object-contain"
              />
            </div>

            {/* Text */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Order Successful</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed text-center">
              Your QR order is successfully placed.<br />
              And profile has been created with verified<br />
              number or email. Login for complete tracking.
            </p>

            {/* Track Button */}
            <div className="flex justify-center">
              <button
                onClick={handleTrack}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition shadow-md"
              >
                Track
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
