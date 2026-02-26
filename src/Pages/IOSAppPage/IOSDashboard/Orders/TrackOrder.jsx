import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Package,
  Truck,
  MapPin,
  CheckCircle,
} from "lucide-react";

export default function TrackOrder() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const timelineSteps = [
    {
      id: 1,
      title: "Order Placed",
      date: "18 Dec 2025",
      time: "04:30PM",
      location: "At Digiyahan",
      icon: ShoppingBag,
      completed: true,
    },
    {
      id: 2,
      title: "Order Processed",
      date: "19 Dec 2025",
      time: "06:20 PM",
      location: "At Digiyahan Digital India Pvt. LTD.",
      icon: Package,
      completed: true,
    },
    {
      id: 3,
      title: "Order Shipped",
      date: "19 Dec 2025",
      time: "06:20 PM",
      location: "From Digiyahan Digital India Pvt. LTD.",
      icon: Truck,
      completed: true,
    },
    {
      id: 4,
      title: "Ready to pickup",
      date: "21 Dec 2025",
      time: "06:20 PM",
      location: "From Delhi Fast D",
      icon: MapPin,
      completed: true,
    },
    {
      id: 5,
      title: "Out for Delivery",
      date: "21 Dec 2025",
      time: "06:20 PM",
      location: "From Delhi Fast D",
      icon: Truck,
      completed: true,
    },
    {
      id: 6,
      title: "Order Delivered",
      date: "",
      time: "04:30PM",
      location: "",
      icon: CheckCircle,
      completed: false,
    },
  ];

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
          <h1 className="text-xl font-bold text-gray-900">Track your order</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Booking ID and Status */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">Booking id</p>
              <p className="font-bold text-gray-900">#412 - 639 - JTO</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600 font-medium mb-1">Status</p>
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                Out for Delivery
              </span>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex gap-2 items-center mt-6">
            <div className="w-5 h-5 bg-green-500 rounded-full"></div>
            <div className="w-3 h-1 bg-green-500 rounded-full"></div>
            <div className="w-5 h-5 bg-green-500 rounded-full"></div>
            <div className="w-3 h-1 bg-green-500 rounded-full"></div>
            <div className="w-5 h-5 bg-green-500 rounded-full"></div>
            <div className="w-3 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Location and Dates */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-600 font-medium mb-2">From</p>
            <p className="font-semibold text-gray-900">Delhi, 110091</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium mb-2">To</p>
            <p className="font-semibold text-gray-900">Delhi,110059</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium mb-2">Created</p>
            <p className="font-semibold text-gray-900">18 Dec 2025</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium mb-2">Estimated</p>
            <p className="font-semibold text-gray-900">22 Dec 2025</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium mb-2">Sender</p>
            <p className="font-semibold text-gray-900">DIGIYAHAN</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium mb-2">Receiver</p>
            <p className="font-semibold text-gray-900">Ravi Khan</p>
          </div>
        </div>

        {/* Package Image */}
        <div className="flex justify-end mb-8 -mr-6">
          <div className="w-48 h-48 bg-linear-to-b from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
            <div className="text-white text-6xl">📦</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-0">
          {timelineSteps.map((step, index) => {
            const IconComponent = step.icon;
            const isCompleted = step.completed;

            return (
              <div key={step.id}>
                <div className="flex gap-4 pb-6">
                  {/* Timeline Icon and Line */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-green-200"
                          : "bg-gray-200"
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 ${
                          isCompleted ? "text-green-600" : "text-gray-400"
                        }`}
                      />
                    </div>
                    {/* Dashed Line */}
                    {index < timelineSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-12 mt-2 border-l-2 border-dashed ${
                          isCompleted ? "border-green-300" : "border-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>

                  {/* Timeline Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="font-bold text-gray-900 text-sm">
                      {step.title}
                    </h3>
                    {step.date && (
                      <p className="text-xs text-gray-600 mt-1">
                        {step.date} {step.time}
                      </p>
                    )}
                    {step.location && !step.date ? (
                      <p className="text-xs text-gray-600 mt-1">{step.time}</p>
                    ) : null}
                    {step.location && (
                      <p className="text-xs text-gray-500 mt-1">{step.location}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
