import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, ChevronUp, User } from "lucide-react";

export default function Payment() {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [showAllOptions, setShowAllOptions] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = () => {
    navigate("/ios/order-successful");
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header with Blue Background */}
      <div className="bg-gradient-to-b from-blue-500 to-blue-600">
        {/* Status Bar */}
        <div className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-white">
          <span>2:40</span>
          <div className="flex gap-2 items-center">
            <span>🔌</span>
            <span>📶</span>
            <span>📶</span>
            <span>🔋 24%</span>
          </div>
        </div>

        {/* Title Bar */}
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="w-8 h-8 flex items-center justify-center text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold text-xl flex items-center justify-center">
              D
            </div>
            <span className="text-white font-bold text-lg">DigiVahan</span>
          </div>

          <button className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Price Summary */}
        <div className="px-5 pb-4">
          <div className="bg-white rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Price Summary</h3>
            <p className="text-3xl font-bold text-gray-900">₹1</p>
          </div>
        </div>

        {/* Phone Number */}
        <div className="px-5 pb-5">
          <div className="bg-white rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-700">Using as +91 82798 61949</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content - White Background */}
      <div className="flex-1 bg-white overflow-y-auto pb-32">
        <div className="px-5 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Options</h2>
          
          {/* Recommended */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-3">Recommended</p>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 transition">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600"></div>
                  <span className="font-medium text-gray-900 text-sm">UPI - PhonePe</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 transition">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-[9px] font-bold">PAY</span>
                  </div>
                  <span className="font-medium text-gray-900 text-sm">UPI - Amazon Pay UPI</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* All Payment Options */}
          <div>
            <p className="text-sm text-gray-700 font-semibold mb-3">All Payment Options</p>
            
            <button
              onClick={() => setShowAllOptions(!showAllOptions)}
              className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7V11C2 16.55 6.84 21.74 12 23C17.16 21.74 22 16.55 22 11V7L12 2Z" fill="#5f6368"/>
                </svg>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 text-sm">UPI</span>
                  <div className="flex gap-1">
                    <span className="text-base">🟣</span>
                    <span className="text-base">🟠</span>
                    <span className="text-base">⚫</span>
                    <span className="text-base">🔵</span>
                  </div>
                </div>
              </div>
              <ChevronUp className={`w-5 h-5 text-gray-400 transition-transform ${showAllOptions ? '' : 'rotate-180'}`} />
            </button>

            {showAllOptions && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 transition flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-600"></div>
                  <span className="font-medium text-gray-900 text-sm">PhonePe</span>
                </button>

                <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 transition flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">PAY</span>
                  </div>
                  <span className="font-medium text-gray-900 text-sm">Amazon P...</span>
                </button>

                <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 transition flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-500"></div>
                  <span className="font-medium text-gray-900 text-sm">PayZapp</span>
                </button>

                <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 transition flex items-center gap-2">
                  <span className="text-gray-400 text-xl">•••</span>
                  <span className="font-medium text-gray-900 text-sm">Apps & U...</span>
                </button>
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <p className="text-xs text-gray-500 mt-6 text-center">
            By proceeding, I agree to Razorpay's <span className="text-blue-600 underline">Privacy Notice</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-gray-900">₹1</p>
            <button className="text-xs text-gray-500 flex items-center gap-1">
              View Details
              <ChevronUp className="w-3 h-3" />
            </button>
          </div>
          <button
            onClick={handleContinue}
            className="px-20 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition"
          >
            Continue
          </button>
        </div>
        
        {/* Bottom indicator */}
        <div className="flex justify-center">
          <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
