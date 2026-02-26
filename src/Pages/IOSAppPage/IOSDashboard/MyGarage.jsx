import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

export default function MyGarage() {
  const navigate = useNavigate();
  const [vehicles] = useState([
    {
      id: 1,
      customerName: "Ramesh Kumar",
      vehicleName: "Honda Nexon",
      qrCode: "UP09R5423",
      image: "https://images.unsplash.com/photo-1552821728-8ac588f1f498?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      customerName: "Shamsher Tiwari",
      vehicleName: "Honda City",
      qrCode: "UP09R5423",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      customerName: "George Ansari",
      vehicleName: "Suzuki Super",
      qrCode: "UP09R5423",
      image: "https://images.unsplash.com/photo-1552821554-5fefe8c9ef14?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      customerName: "Suresh Khan",
      vehicleName: "Cruz",
      qrCode: "UK07A0001",
      image: "https://images.unsplash.com/photo-1555215695-3004221b04d5?w=100&h=100&fit=crop",
    },
    {
      id: 5,
      customerName: "Shiba Ambani",
      vehicleName: "Scorpio",
      qrCode: "HR09K2109",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=100&h=100&fit=crop",
    },
  ]);

  const handleOrderQR = (vehicle) => {
    navigate("/ios/review-order", { state: { vehicle } });
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

        {/* Top Navigation Bar */}
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Profile Picture */}
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
          />

          {/* Title */}
          <h1 className="text-xl font-bold text-gray-900">My Garage</h1>

          {/* Notification Bell */}
          <button className="w-6 h-6 flex items-center justify-center">
            <Bell className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="overflow-y-auto bg-white"
        style={{ height: "calc(100vh - 105px)" }}
      >
        {vehicles.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-full px-6 py-12">
            {/* Illustration */}
            <div className="w-64 h-64 mb-8">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Clouds */}
                <g opacity="0.6">
                  <path
                    d="M80 80C70 80 60 90 60 100C60 105 62 110 65 113C50 120 40 135 40 150C40 170 55 185 75 185H120C130 185 140 175 140 165C140 160 138 155 135 152C150 145 160 130 160 115C160 100 150 90 140 85C130 80 120 75 110 75C100 65 85 80 80 80Z"
                    fill="#C8E6C9"
                  />
                  <path
                    d="M280 60C265 60 252 73 252 90C252 95 254 100 257 105C247 110 240 120 240 132C240 148 252 160 267 160H310C325 160 337 148 337 133C337 128 336 123 334 119C345 110 352 98 352 85C352 70 342 57 328 53C327 52 326 52 325 52C315 40 300 60 280 60Z"
                    fill="#C8E6C9"
                  />
                </g>

                {/* House */}
                <rect x="100" y="200" width="200" height="140" fill="#E0E0E0" />
                <polygon
                  points="100,200 200,100 300,200"
                  fill="#424242"
                />

                {/* Garage Door */}
                <rect x="130" y="215" width="140" height="105" fill="#000000" />
                <line x1="200" y1="215" x2="200" y2="320" stroke="#333" strokeWidth="2" />
                <line x1="130" y1="265" x2="270" y2="265" stroke="#333" strokeWidth="2" />

                {/* Door */}
                <rect x="100" y="285" width="50" height="55" fill="#8D6E63" />
                <circle cx="148" cy="313" r="3" fill="#FFD700" />

                {/* Window Right */}
                <rect x="270" y="225" width="25" height="25" fill="#81D4FA" />

                {/* Person */}
                <circle cx="190" cy="155" r="12" fill="#FFB74D" />
                <rect x="178" y="170" width="24" height="25" fill="#FFA726" />
                <circle cx="180" cy="200" r="4" fill="#FFB74D" />
                <circle cx="200" cy="200" r="4" fill="#FFB74D" />

                {/* Grass */}
                <ellipse cx="200" cy="340" rx="150" ry="30" fill="#66BB6A" />

                {/* Tool */}
                <g transform="translate(250, 300)">
                  <rect width="8" height="30" fill="#8D6E63" />
                  <polygon points="4,-5 12,-5 8,8" fill="#2196F3" />
                </g>
              </svg>
            </div>

            {/* Text */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Garage is empty</h2>
            <p className="text-center text-gray-500 text-sm leading-relaxed">
              Garage is empty please add your vehicle to the garage and experience the luxury of digiyahan.
            </p>
          </div>
        ) : (
          // Vehicles List
          <div className="px-6 py-6 space-y-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                {/* Vehicle Image */}
                <img
                  src={vehicle.image}
                  alt={vehicle.vehicleName}
                  className="w-14 h-14 rounded-full object-cover shrink-0"
                />

                {/* Vehicle Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm">
                    {vehicle.customerName}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {vehicle.vehicleName}
                  </p>
                </div>

                {/* QR Code and Button Container */}
                <div className="flex flex-col items-end gap-2">
                  <p className="text-xs text-gray-400">{vehicle.qrCode}</p>
                  <button
                    onClick={() => handleOrderQR(vehicle)}
                    className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-full transition"
                  >
                    Order QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
