import React, { useContext, useState } from "react";
import {
  ArrowLeft,
  Package,
  X,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../../ContextApi/DataProvider";

const cancellationReasons = [
  { value: "customer_request", label: "Customer Request" },
  { value: "wrong_details", label: "Wrong Order Details" },
  { value: "duplicate_order", label: "Duplicate Order" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "other", label: "Other" },
];

const ManageOrder = () => {
  const navigate = useNavigate();
  const { getOrderDetailsByAdmin, OrderCancelByAdmin, TrackOrderByAdmin } =
    useContext(MyContext);
  const [activeCard, setActiveCard] = useState(null);
  const [inputOrderId, setInputOrderId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancellationNotes, setCancellationNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCardClick = (cardType) => {
    setActiveCard(cardType);
    setInputOrderId("");
    setSelectedOrder(null);
    setSuccessMessage("");
    setCopiedLink(false);
  };

  const handleCopyTrackingLink = () => {
    if (selectedOrder?.trackingLink) {
      navigator.clipboard.writeText(selectedOrder.trackingLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSubmitOrderId = async () => {
    if (!inputOrderId.trim()) return;

    try {
      if (activeCard === "track") {
        const response = await TrackOrderByAdmin(inputOrderId);

        if (!response?.status) {
          alert("Tracking failed");
          return;
        }

        const data = response.data;

        const mappedOrder = {
          id: data.order_id,
          name: "QR Code Sticker Pack",
          ownerName: data.owner_name,
          vehicleNumber: data.vehicle_number,
          qrCode: data.qr_code,
          status: data.shipment_status,
          trackingLink: data.tracking_url,
          processedDate: data.order_date
            ? new Date(data.order_date).toLocaleDateString()
            : "N/A",
          deliveryPartner: "delhivery",
        };

        setSelectedOrder(mappedOrder);
        setShowDetails(true);
      }

      if (activeCard === "cancel") {
        const response = await getOrderDetailsByAdmin(inputOrderId);

        if (!response?.status) {
          alert("Order not found");
          return;
        }

        const order = response.data.order;

        const mappedOrder = {
          id: order.order_id,
          name: order.order_items?.[0]?.name || "N/A",
          ownerName: `${order.shipping?.first_name || ""} ${order.shipping?.last_name || ""}`,
          vehicleNumber: order.order_items?.[0]?.vehicle_id || "N/A",
          qrCode: order.order_items?.[0]?.sku || "N/A",
          status: order.order_status,
          processedDate: new Date(order.createdAt).toLocaleDateString(),
        };

        setSelectedOrder(mappedOrder);
        setShowDetails(true);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleCancelOrder = async () => {
    if (!cancellationReason || !cancellationNotes.trim()) {
      alert("Please select a reason and add notes");
      return;
    }

    try {
      const response = await OrderCancelByAdmin(selectedOrder.id);

      if (!response?.status) {
        alert("Cancellation failed");
        return;
      }

      setSuccessMessage("Order cancelled successfully!");

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleClose = () => {
    setActiveCard(null);
    setShowDetails(false);
    setInputOrderId("");
    setSelectedOrder(null);
    setCancellationReason("");
    setCancellationNotes("");
    setSuccessMessage("");
    setCopiedLink(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <button
          className="p-2 md:p-2.5 rounded-lg bg-white border-2 border-indigo-100 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-gray-700 shadow-sm hover:shadow-md"
          onClick={() => navigate("/orders-panel")}
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Manage Orders
          </h1>
          <p className="text-sm text-gray-600">
            Track or cancel orders with ease
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div>
        {activeCard === null ? (
          // Cards Grid
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl">
            {/* Track Order Card */}
            <div
              onClick={() => handleCardClick("track")}
              className="group bg-white rounded-lg p-5 md:p-6 cursor-pointer transition-all duration-300 border-t-4 border-t-blue-500 hover:border-t-blue-600 shadow-md hover:shadow-lg hover:-translate-y-1 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-md bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Package className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                  Track Order
                </h2>
                <p className="text-sm text-gray-600">
                  View order status and tracking details
                </p>
                <div className="mt-4 flex justify-end">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors duration-300">
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Cancel Order Card */}
            <div
              onClick={() => handleCardClick("cancel")}
              className="group bg-white rounded-lg p-5 md:p-6 cursor-pointer transition-all duration-300 border-t-4 border-t-red-500 hover:border-t-red-600 shadow-md hover:shadow-lg hover:-translate-y-1 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-linear-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-md bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <X className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                  Cancel Order
                </h2>
                <p className="text-sm text-gray-600">
                  Process cancellation requests
                </p>
                <div className="mt-4 flex justify-end">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors duration-300">
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Action Panel
          <div className="bg-white rounded-xl p-5 md:p-8 shadow-lg max-w-2xl relative">
            <button
              className="absolute top-3 right-3 md:top-5 md:right-5 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-300"
              onClick={handleClose}
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Order ID Input Section */}
            {!showDetails && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {activeCard === "track" ? "Track Order" : "Cancel Order"}
                </h2>
                <p className="text-gray-600 text-sm md:text-base mb-5 md:mb-6">
                  Please enter the Order ID for{" "}
                  {activeCard === "track" ? "tracking" : "cancelling"} and
                  checking details
                </p>

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Enter the Order ID"
                    value={inputOrderId}
                    onChange={(e) => setInputOrderId(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleSubmitOrderId()
                    }
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-lg text-sm md:text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 bg-gray-50 focus:bg-white"
                  />
                </div>

                <button
                  className="w-full py-2.5 md:py-3 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold text-sm md:text-base hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mb-4 disabled:hover:shadow-none"
                  onClick={handleSubmitOrderId}
                  disabled={!inputOrderId.trim()}
                >
                  Submit
                </button>

                <div className="flex items-center gap-2 md:gap-3 bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 rounded text-blue-700 text-xs md:text-sm">
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                  <span>Example: ORD-001, ORD-002, ORD-003</span>
                </div>
              </div>
            )}

            {/* Order Details Section */}
            {showDetails && !successMessage && (
              <div className="animate-fadeIn">
                <div className="mb-5 md:mb-6 pb-4 md:pb-5 border-b-2 border-gray-200">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    Order Details
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {activeCard === "track"
                      ? "View order tracking and status information"
                      : "Update tracking and status information"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-5 md:mb-6">
                  {/* Order ID */}
                  <div>
                    <label className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                      Order ID
                    </label>
                    <input
                      type="text"
                      value={selectedOrder?.id}
                      disabled
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Order Name */}
                  <div>
                    <label className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                      Order Name
                    </label>
                    <input
                      type="text"
                      value={selectedOrder?.name}
                      disabled
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Owner Name */}
                  <div>
                    <label className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      value={selectedOrder?.ownerName}
                      disabled
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Vehicle Number */}
                  <div>
                    <label className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      value={selectedOrder?.vehicleNumber}
                      disabled
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* QR Code */}
                  <div>
                    <label className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                      QR Code
                    </label>
                    <input
                      type="text"
                      value={selectedOrder?.qrCode}
                      disabled
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                      Status
                    </label>
                    <div className="flex items-center">
                      <span
                        className={`inline-block px-3 py-2 rounded-lg text-xs md:text-sm font-semibold ${
                          selectedOrder?.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : selectedOrder?.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {selectedOrder?.status}
                      </span>
                    </div>
                  </div>

                  {/* Processed Date */}
                  <div>
                    <label className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                      Processed Date
                    </label>
                    <input
                      type="text"
                      value={selectedOrder?.processedDate}
                      disabled
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Tracking Link - Only show in Track Order for Delhivery */}
                  {activeCard === "track" &&
                    selectedOrder?.deliveryPartner?.toLowerCase() ===
                      "delhivery" && (
                      <div className="md:col-span-2">
                        <label className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                          Tracking Link
                        </label>
                        {selectedOrder?.trackingLink ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={selectedOrder?.trackingLink}
                              disabled
                              className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                            <button
                              onClick={handleCopyTrackingLink}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-300 whitespace-nowrap ${
                                copiedLink
                                  ? "bg-green-500 hover:bg-green-600 text-white"
                                  : "bg-gray-500 hover:bg-gray-600 text-white"
                              }`}
                            >
                              {copiedLink ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Copy
                                </>
                              )}
                            </button>
                            <a
                              href={selectedOrder?.trackingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-300 whitespace-nowrap"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Track
                            </a>
                          </div>
                        ) : (
                          <div className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-500 italic">
                            No tracking link available
                          </div>
                        )}
                      </div>
                    )}
                </div>

                {/* Cancellation Reason (only for cancel) */}
                {activeCard === "cancel" && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 md:p-5 mb-5 md:mb-6">
                    <h4 className="text-base md:text-lg font-bold text-red-700 mb-3">
                      Cancellation Reason
                    </h4>
                    <select
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      className="w-full px-3 py-2.5 border-2 border-red-300 rounded-lg text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 mb-3 transition-all duration-300 bg-white"
                    >
                      <option value="">-- Select a reason --</option>
                      {cancellationReasons.map((reason) => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>

                    <textarea
                      value={cancellationNotes}
                      onChange={(e) => setCancellationNotes(e.target.value)}
                      placeholder="Add any additional notes or details about cancellation..."
                      className="w-full px-3 py-2.5 border-2 border-red-300 rounded-lg text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-300 resize-none"
                      rows="3"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 md:gap-4">
                  {activeCard === "track" ? (
                    <button
                      className="w-full py-2.5 md:py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg text-sm md:text-base transition-all duration-300"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                  ) : (
                    <>
                      <button
                        className="flex-1 py-2.5 md:py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg text-sm md:text-base transition-all duration-300"
                        onClick={() => setShowDetails(false)}
                      >
                        Back
                      </button>
                      <button
                        className="flex-1 py-2.5 md:py-3 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg text-white font-semibold rounded-lg text-sm md:text-base transition-all duration-300"
                        onClick={handleCancelOrder}
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="flex flex-col items-center justify-center py-8 md:py-12 animate-fadeIn">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-emerald-500 animate-pulse" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    {successMessage}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    The order has been successfully cancelled.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrder;
