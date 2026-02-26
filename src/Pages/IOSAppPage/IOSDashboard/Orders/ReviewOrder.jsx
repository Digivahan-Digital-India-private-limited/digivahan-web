import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronUp, ChevronDown, ChevronDown as SelectIcon } from "lucide-react";

export default function ReviewOrder() {
  const navigate = useNavigate();
  const [priceDetailsOpen, setPriceDetailsOpen] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("Small");

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddAddress = () => {
    navigate("/ios/edit-delivery-address");
  };

  const handleContinue = () => {
    navigate("/ios/payment");
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
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
          <h1 className="text-xl font-bold text-gray-900">Review your order</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-12">
        {/* Digiyahan Header */}
        <div className="relative mb-6">
          {/* Light green content area */}
          <div className="bg-[#e8f5e9] px-6 pt-5 pb-6 text-center rounded-t-xl">
            {/* Digivahan Logo */}
            <div className="flex justify-center mb-6">
              <img src="/Tranparent Logo In Black 1@2x.png" alt="Digivahan" className="h-10 object-contain" />
            </div>
            
            {/* Steps Indicator */}
            <div className="flex justify-center items-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-green-500 text-green-600 text-sm font-semibold flex items-center justify-center shadow-sm">1</div>
                <p className="text-xs text-green-600 font-medium mt-1.5">Review</p>
              </div>
              <div className="w-14 h-[2px] bg-gray-300 -mt-5"></div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 text-gray-400 text-sm font-semibold flex items-center justify-center shadow-sm">2</div>
                <p className="text-xs text-amber-600 font-medium mt-1.5">Payment</p>
              </div>
            </div>
          </div>
          
          {/* Scalloped/wavy bottom edge */}
          <div className="w-full">
            <svg className="w-full h-3" viewBox="0 0 360 12" preserveAspectRatio="none">
              <path d="M0,0 Q9,12 18,0 Q27,12 36,0 Q45,12 54,0 Q63,12 72,0 Q81,12 90,0 Q99,12 108,0 Q117,12 126,0 Q135,12 144,0 Q153,12 162,0 Q171,12 180,0 Q189,12 198,0 Q207,12 216,0 Q225,12 234,0 Q243,12 252,0 Q261,12 270,0 Q279,12 288,0 Q297,12 306,0 Q315,12 324,0 Q333,12 342,0 Q351,12 360,0 L360,0 L0,0 Z" fill="#e8f5e9"/>
            </svg>
          </div>
        </div>

        {/* Product Card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
          {/* QR Code Section */}
          <div className="flex gap-4 p-4">
            {/* QR Code with Order Me on top */}
            <div className="flex flex-col items-center">
              {/* Order Me Badge on top */}
              <span className="mb-2 px-4 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full">
                Order Me
              </span>
              <div className="relative p-2 border-4 border-green-500 rounded-lg bg-white">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=DIGIVAHAN-HR07RS0" 
                  alt="QR Code"
                  className="w-28 h-28"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-base mb-2">Honda City 5th, HR07RS0......</h3>
              
              {/* Price */}
              <div className="mb-2">
                <span className="text-lg font-bold text-gray-900">₹250 </span>
                <span className="text-sm line-through text-gray-400">₹1000 </span>
                <span className="text-sm font-bold text-green-600">85% Off</span>
              </div>

              {/* Cancelable */}
              <div className="flex items-center gap-1 mb-3">
                <span className="text-sm text-gray-700">Cancelable</span>
                <span className="w-5 h-5 rounded-full border-2 border-yellow-500 text-yellow-500 text-xs flex items-center justify-center font-bold">!</span>
              </div>

              {/* Size */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-700 font-medium">Size:</span>
                <div className="relative">
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="appearance-none px-3 py-1 pr-8 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white"
                  >
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                  <SelectIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 font-medium">Qty</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 text-gray-600 flex items-center justify-center hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 text-gray-600 flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="border-t border-gray-200 px-4 py-3 flex justify-between items-center text-sm">
            <span className="text-gray-500">Sold by : DIGIVAHAN</span>
            <span className="text-gray-500">₹250 Delivery</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-green-50 border border-gray-200 rounded-xl px-4 py-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🚚</span>
            <p className="font-bold text-sm text-gray-900">Estimated Delivery by Wednesday, 30th Jul</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900">Add Address</span>
            <button
              onClick={handleAddAddress}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-full transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Price Details */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
          <button
            onClick={() => setPriceDetailsOpen(!priceDetailsOpen)}
            className="w-full px-4 py-4 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <h3 className="font-bold text-gray-900">Price Details</h3>
            {priceDetailsOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {priceDetailsOpen && (
            <div className="px-4 py-4 border-t border-gray-200 space-y-3">
              {/* Total Product Price */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Product Price</span>
                <span className="text-sm text-gray-500">+ ₹0</span>
              </div>

              {/* Delivery Charge */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-500">Delivery charge</span>
                <span className="text-sm text-gray-500">+ ₹ 250</span>
              </div>

              {/* Order Total */}
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-gray-900">Order Total</span>
                <span className="font-bold text-gray-900">₹250</span>
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <button 
          onClick={handleContinue}
          className="w-full mt-4 px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-xl transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
