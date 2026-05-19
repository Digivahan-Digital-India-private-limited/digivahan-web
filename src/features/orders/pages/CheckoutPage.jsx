import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  Package,
  MapPin,
  CreditCard,
  ChevronRight,
  CheckCircle2,
  Truck,
  AlertCircle,
} from "lucide-react";
import { listVehicles } from "../../vehicles/services/vehiclesApi";
import { createOrder } from "../services/ordersApi";
import {
  createRazorpayOrder,
  openRazorpayCheckout,
  loadRazorpayScript,
} from "../services/razorpayApi";

// Price in paise (Rs 199)
const QR_PRICE_PAISE = 19900;
const QR_PRICE_INR = 199;

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

const STEPS = [
  { id: 1, label: "Select Vehicle", icon: Package },
  { id: 2, label: "Delivery Address", icon: MapPin },
  { id: 3, label: "Review & Pay", icon: CreditCard },
];

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400";

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Step state
  const [step, setStep] = useState(1);
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    searchParams.get("vehicle_id") || ""
  );
  const [address, setAddress] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Get user info from token
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });
  useEffect(() => {
    const token = Cookies.get("user_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const name = decoded.name || decoded.full_name || decoded.username || "";
        const [first_name = "", ...rest] = name.trim().split(" ");
        const last_name = rest.join(" ");
        setUserInfo({
          name,
          email: decoded.email || "",
          phone: decoded.mobile || decoded.phone || "",
        });
        setAddress((prev) => ({
          ...prev,
          first_name,
          last_name,
          phone: decoded.mobile || decoded.phone || "",
          email: decoded.email || "",
        }));
      } catch (e) {
        console.error("Token decode error", e);
      }
    }

    // Pre-select vehicle from URL
    const vid = searchParams.get("vehicle_id");
    if (vid) {
      setSelectedVehicleId(vid);
    }

    // Load Razorpay SDK early
    loadRazorpayScript().catch(() => {});
  }, [searchParams]);

  // Fetch vehicles
  const { data: vehicles = [], isLoading: isVehiclesLoading } = useQuery({
    queryKey: ["user-vehicles"],
    queryFn: listVehicles,
  });

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Address change handler
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Validate step
  const isStep1Valid = Boolean(selectedVehicleId || vehicles.length > 0);
  const isStep2Valid =
    address.first_name.trim() &&
    address.phone.trim().length >= 10 &&
    address.address1.trim() &&
    address.city.trim() &&
    address.state.trim() &&
    address.pincode.trim().length === 6;

  // Handle Razorpay payment + order creation
  const handlePayAndOrder = async () => {
    setIsProcessing(true);
    setPaymentError("");

    try {
      // 1. Load Razorpay SDK
      await loadRazorpayScript();

      // 2. Create Razorpay order from backend
      const rzpOrder = await createRazorpayOrder(QR_PRICE_PAISE, "DigiVahan Smart QR Order");

      // 3. Open Razorpay checkout
      const paymentResult = await openRazorpayCheckout(rzpOrder, userInfo);

      // 4. Payment success — create order in backend
      const orderId = `DV-${Date.now()}`;
      const orderPayload = {
        order_id: orderId,
        active_partner: "manual",
        payment_method: "Prepaid",
        shipping_mode: "Surface",
        amount: QR_PRICE_INR,
        sub_total: QR_PRICE_INR,
        order_value: QR_PRICE_INR,
        declared_value: QR_PRICE_INR,
        vehicle_id: selectedVehicle?.id || "",
        item: "DigiVahan Smart QR",
        shipping_is_billing: true,
        razorpay_payment_id: paymentResult.razorpay_payment_id,
        razorpay_order_id: paymentResult.razorpay_order_id,
        shipping: { ...address },
        billing: { ...address },
      };

      const createdOrder = await createOrder(orderPayload);

      // 5. Invalidate orders cache
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });

      // 6. Navigate to success
      toast.success("Order placed successfully!");
      navigate(`/orders/${createdOrder.id || orderId}/success`, { replace: true });
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Payment failed";
      if (msg.includes("cancelled")) {
        toast.warn("Payment was cancelled.");
      } else {
        toast.error(msg);
      }
      setPaymentError(msg.includes("cancelled") ? "" : msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Order DigiVahan Smart QR</h2>
        <p className="mt-1 text-sm text-slate-500">
          Physical QR sticker delivered to your doorstep.
        </p>

        {/* Step Indicator */}
        <nav className="mt-4 flex items-center gap-1" aria-label="Checkout steps">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const active = step === s.id;
            const done = step > s.id;
            return (
              <React.Fragment key={s.id}>
                <button
                  type="button"
                  onClick={() => done && setStep(s.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition
                    ${active ? "bg-emerald-600 text-white" : done ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer" : "bg-slate-100 text-slate-400 cursor-default"}`}
                >
                  {done ? <CheckCircle2 size={13} /> : <Icon size={13} />}
                  {s.label}
                </button>
                {idx < STEPS.length - 1 && (
                  <ChevronRight size={13} className="text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </section>

      {/* Step 1: Select Vehicle */}
      {step === 1 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Select Vehicle</h3>
            <p className="mt-1 text-sm text-slate-500">
              Which vehicle is this QR for?
            </p>
          </div>

          {isVehiclesLoading ? (
            <div className="text-sm text-slate-500">Loading vehicles...</div>
          ) : vehicles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-500">No vehicles found in your garage.</p>
              <button
                type="button"
                onClick={() => navigate("/vehicles/add")}
                className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Add Vehicle First
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`w-full flex items-center gap-3 rounded-xl border p-3.5 text-left transition
                    ${selectedVehicleId === v.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 bg-slate-50 hover:border-emerald-300"
                    }`}
                >
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition
                    ${selectedVehicleId === v.id ? "border-emerald-600" : "border-slate-300"}`}
                  >
                    {selectedVehicleId === v.id && (
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{v.name}</p>
                    <p className="text-xs text-slate-500">{v.plate} • {v.type} • {v.fuel}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {vehicles.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (!selectedVehicleId && vehicles[0]) {
                  setSelectedVehicleId(vehicles[0].id);
                }
                setStep(2);
              }}
              disabled={!isStep1Valid}
              className="mt-1 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          )}
        </section>
      )}

      {/* Step 2: Delivery Address */}
      {step === 2 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Delivery Address</h3>
            <p className="mt-1 text-sm text-slate-500">
              Enter the address to ship your QR sticker.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">First Name *</label>
                <input name="first_name" value={address.first_name} onChange={handleAddressChange} className={inputCls} placeholder="First name" required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Last Name</label>
                <input name="last_name" value={address.last_name} onChange={handleAddressChange} className={inputCls} placeholder="Last name" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Phone *</label>
                <input name="phone" value={address.phone} onChange={handleAddressChange} className={inputCls} placeholder="10-digit mobile number" maxLength={10} required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
                <input name="email" type="email" value={address.email} onChange={handleAddressChange} className={inputCls} placeholder="Email address" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Address Line 1 *</label>
              <input name="address1" value={address.address1} onChange={handleAddressChange} className={inputCls} placeholder="House / Flat no., Street, Area" required />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Address Line 2</label>
              <input name="address2" value={address.address2} onChange={handleAddressChange} className={inputCls} placeholder="Landmark (optional)" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">City *</label>
                <input name="city" value={address.city} onChange={handleAddressChange} className={inputCls} placeholder="City" required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">State *</label>
                <select name="state" value={address.state} onChange={handleAddressChange} className={inputCls} required>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Pincode *</label>
                <input name="pincode" value={address.pincode} onChange={handleAddressChange} className={inputCls} placeholder="6-digit pincode" maxLength={6} required />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={!isStep2Valid}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Step 3: Review & Pay */}
      {step === 3 && (
        <section className="space-y-4">
          {/* Order Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-base font-semibold text-slate-900">Order Summary</h3>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Package size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">DigiVahan Smart QR Sticker</p>
                <p className="text-xs text-slate-500">
                  Vehicle: {selectedVehicle?.name || "—"} • {selectedVehicle?.plate || "—"}
                </p>
              </div>
              <p className="text-sm font-bold text-slate-900">₹{QR_PRICE_INR}</p>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Item</span><span>₹{QR_PRICE_INR}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span><span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
                <span>Total</span><span>₹{QR_PRICE_INR}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <MapPin size={15} className="text-emerald-600" />
                Delivery Address
              </h3>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="text-sm text-slate-600 space-y-0.5">
              <p className="font-medium text-slate-900">{address.first_name} {address.last_name}</p>
              <p>{address.address1}{address.address2 ? `, ${address.address2}` : ""}</p>
              <p>{address.city}, {address.state} – {address.pincode}</p>
              <p>{address.phone}</p>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 flex items-start gap-3">
            <Truck size={16} className="text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-sm text-emerald-700">
              Estimated delivery within <strong>5–7 business days</strong>. Free shipping across India.
            </p>
          </div>

          {/* Payment Error */}
          {paymentError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
              <AlertCircle size={16} className="text-rose-600 mt-0.5 shrink-0" />
              <p className="text-sm text-rose-700">{paymentError}</p>
            </div>
          )}

          {/* Pay Button */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handlePayAndOrder}
              disabled={isProcessing}
              className="flex-1 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  Pay ₹{QR_PRICE_INR} & Place Order
                </>
              )}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default CheckoutPage;
