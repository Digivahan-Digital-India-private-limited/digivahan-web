import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function MyOrder() {
  const navigate = useNavigate();
  const [orders] = useState([
    {
      id: 1,
      customerName: "Ramesh Kumar",
      vehicleName: "Honda Nexon",
      date: "13 - 03 - 2026",
      image: "https://images.unsplash.com/photo-1552820728-8ac588f1f498?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      customerName: "Shamsher Tiwari",
      vehicleName: "Honda City",
      date: "11 - 03 - 2026",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      customerName: "George Ansari",
      vehicleName: "Suzuki Super",
      date: "11 - 03 - 2026",
      image: "https://images.unsplash.com/photo-1552821554-5fefe8c9ef14?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      customerName: "Suresh Khan",
      vehicleName: "Cruz",
      date: "10 - 03 - 2026",
      image: "https://images.unsplash.com/photo-1555215695-3004221b04d5?w=100&h=100&fit=crop",
    },
    {
      id: 5,
      customerName: "Shiba Ambani",
      vehicleName: "Scorpio",
      date: "10 - 03 - 2026",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=100&h=100&fit=crop",
    },
  ]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleOrderQR = (order) => {
    navigate("/ios/review-order", { state: { order } });
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
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
      </div>

      {/* Orders List */}
      <div className="overflow-y-auto" style={{ height: "calc(100vh - 120px)" }}>
        <div className="px-6 py-6 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
            >
              {/* Vehicle Image */}
              <img
                src={order.image}
                alt={order.vehicleName}
                className="w-14 h-14 rounded-full object-cover flex-shrink-0"
              />

              {/* Order Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm">{order.customerName}</h3>
                <p className="text-xs text-gray-400 mt-1">{order.vehicleName}</p>
              </div>

              {/* Date and Button Container */}
              <div className="flex flex-col items-end gap-2">
                <p className="text-xs text-gray-400">{order.date}</p>
                <button
                  onClick={() => handleOrderQR(order)}
                  className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-full transition"
                >
                  Order QR
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
