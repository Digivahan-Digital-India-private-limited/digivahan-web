import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  Package,
  MapPin,
  CreditCard,
  ChevronRight,
  CheckCircle2,
  Truck,
  AlertCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { listVehicles } from "../../vehicles/services/vehiclesApi";
import { createOrder } from "../services/ordersApi";
import {
  createRazorpayOrder,
  openRazorpayCheckout,
  loadRazorpayScript,
} from "../services/razorpayApi";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

// Price in paise (Rs 199)
const QR_PRICE_PAISE = 29900;
const QR_PRICE_INR = 299;

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

  // Address book state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [userId, setUserId] = useState("");
  const [editingAddressId, setEditingAddressId] = useState("");

  // Helper to map saved address back to checkout form format
  const handleSelectSavedAddress = (savedAddr) => {
    if (!savedAddr) return;
    const parts = (savedAddr.name || "").trim().split(/\s+/);
    const first_name = parts[0] || "";
    const last_name = parts.slice(1).join(" ") || "";

    setAddress({
      first_name,
      last_name,
      phone: savedAddr.contact_no || "",
      email: address.email || userInfo.email || "",
      address1: savedAddr.house_no_building || "",
      address2: savedAddr.landmark || "",
      city: savedAddr.city || "",
      state: savedAddr.state || "",
      pincode: savedAddr.pincode || "",
    });
  };

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
        const uid = decoded.id || decoded.user_id || decoded._id || "";
        setUserId(uid);
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

  // Fetch address book when userId is loaded
  useEffect(() => {
    if (!userId) return;

    const fetchAddresses = async () => {
      setIsLoadingAddresses(true);
      try {
        const res = await axios.post(`${BASE_URL}/api/get_user_details`, {
          user_id: userId,
          details_type: "address_book",
        });
        if (res.data?.success && Array.isArray(res.data.data)) {
          setSavedAddresses(res.data.data);
          // Auto select default or first address
          const defaultAddr = res.data.data.find(addr => addr.default_status);
          const activeAddr = defaultAddr || res.data.data[0];
          if (activeAddr) {
            setSelectedAddressId(activeAddr._id || activeAddr.id);
            handleSelectSavedAddress(activeAddr);
          } else {
            setIsAddingNew(true);
          }
        } else {
          setIsAddingNew(true);
        }
      } catch (err) {
        console.error("Failed to fetch address book:", err);
        setIsAddingNew(true);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [userId]);

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

  // Handle address deletion
  const handleAddressDelete = async (addressId, e) => {
    if (e) e.stopPropagation(); // Prevent card selection when clicking delete
    
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user-address/delete`, {
        user_id: userId,
        address_id: addressId,
      });

      if (res.data?.status) {
        toast.success("Address deleted successfully!");
        
        // Update local list
        const updatedList = res.data.address_book || [];
        setSavedAddresses(updatedList);

        // If the deleted address was currently selected
        if (selectedAddressId === addressId) {
          if (updatedList.length > 0) {
            const nextSelect = updatedList[0];
            setSelectedAddressId(nextSelect._id || nextSelect.id);
            handleSelectSavedAddress(nextSelect);
          } else {
            setSelectedAddressId("");
            setIsAddingNew(true);
          }
        }
      }
    } catch (err) {
      console.error("Failed to delete address:", err);
      toast.error(err?.response?.data?.message || "Failed to delete address.");
    }
  };

  // Handle address form submission (saving or updating in backend)
  const handleAddressSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isStep2Valid) return;

    if (userId) {
      setIsProcessing(true);
      try {
        if (editingAddressId) {
          // EDIT MODE
          const payload = {
            user_id: userId,
            address_id: editingAddressId,
            name: `${address.first_name || ""} ${address.last_name || ""}`.trim(),
            contact_no: address.phone,
            house_no_building: address.address1,
            landmark: address.address2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
          };

          const res = await axios.put(`${BASE_URL}/api/v1/user-address/upadte`, payload);
          if (res.data?.status) {
            toast.success("Address updated successfully!");
            const updatedBook = res.data.address_book || [];
            setSavedAddresses(updatedBook);
            
            // Set updated address as active selection
            const updatedAddr = updatedBook.find(addr => addr._id === editingAddressId || addr.id === editingAddressId);
            if (updatedAddr) {
              setSelectedAddressId(updatedAddr._id || updatedAddr.id);
              handleSelectSavedAddress(updatedAddr);
            }
            setEditingAddressId("");
            setIsAddingNew(false);
          }
        } else {
          // ADD MODE
          const payload = {
            user_id: userId,
            name: `${address.first_name || ""} ${address.last_name || ""}`.trim(),
            contact_no: address.phone,
            house_no_building: address.address1,
            landmark: address.address2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            default_status: true,
          };

          const res = await axios.post(`${BASE_URL}/api/v1/user-address/add`, payload);
          if (res.data?.status) {
            toast.success("Address saved to address book!");
            
            // Refetch saved addresses
            const fetchRes = await axios.post(`${BASE_URL}/api/get_user_details`, {
              user_id: userId,
              details_type: "address_book",
            });
            if (fetchRes.data?.success && Array.isArray(fetchRes.data.data)) {
              setSavedAddresses(fetchRes.data.data);
              // Select the newly created address
              const newAddr = fetchRes.data.data.find(
                addr => addr.house_no_building === address.address1 && addr.pincode === address.pincode
              ) || fetchRes.data.data[fetchRes.data.data.length - 1];
              if (newAddr) {
                setSelectedAddressId(newAddr._id || newAddr.id);
                handleSelectSavedAddress(newAddr);
              }
            }
            setIsAddingNew(false);
          }
        }
      } catch (err) {
        console.error("Failed to process address:", err);
        toast.error(err?.response?.data?.message || "Failed to save address. Proceeding anyway.");
      } finally {
        setIsProcessing(false);
      }
    }

    setStep(3);
  };

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
            <h3 className="text-base font-semibold text-slate-900">
              {editingAddressId ? "Edit Address" : "Delivery Address"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {isAddingNew ? (editingAddressId ? "Modify your shipping address below." : "Enter the address to ship your QR sticker.") : "Select a shipping address or add a new one."}
            </p>
          </div>

          {isLoadingAddresses ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-2">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
              <p className="text-sm text-slate-500 font-medium">Loading saved addresses...</p>
            </div>
          ) : !isAddingNew && savedAddresses.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddressId === (addr._id || addr.id);
                  return (
                    <button
                      key={addr._id || addr.id}
                      type="button"
                      onClick={() => {
                        setSelectedAddressId(addr._id || addr.id);
                        handleSelectSavedAddress(addr);
                      }}
                      className={`w-full text-left rounded-xl border p-4 transition flex flex-col justify-between h-full min-h-[160px]
                        ${isSelected
                          ? "border-emerald-500 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500"
                          : "border-slate-200 bg-white hover:border-emerald-300"
                        }`}
                    >
                      <div className="flex flex-col justify-between h-full space-y-3 w-full">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm text-slate-900 truncate">{addr.name}</p>
                            {isSelected && (
                              <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold shrink-0">
                                ✓
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 font-medium">{addr.contact_no}</p>
                          <p className="text-xs text-slate-500 leading-relaxed pt-1">
                            {addr.house_no_building}
                            {addr.landmark ? `, ${addr.landmark}` : ""}
                            <br />
                            {addr.city}, {addr.state} – {addr.pincode}
                          </p>
                        </div>

                        {/* Edit and Delete Actions */}
                        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2 shrink-0 w-full">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingAddressId(addr._id || addr.id);
                              setIsAddingNew(true);
                              // Prefill form for editing
                              const parts = (addr.name || "").trim().split(/\s+/);
                              const first_name = parts[0] || "";
                              const last_name = parts.slice(1).join(" ") || "";
                              setAddress({
                                first_name,
                                last_name,
                                phone: addr.contact_no || "",
                                email: address.email || userInfo.email || "",
                                address1: addr.house_no_building || "",
                                address2: addr.landmark || "",
                                city: addr.city || "",
                                state: addr.state || "",
                                pincode: addr.pincode || "",
                              });
                            }}
                            className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition cursor-pointer"
                          >
                            <Pencil size={11} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleAddressDelete(addr._id || addr.id, e)}
                            className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <Trash2 size={11} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Add New Address Card */}
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(true);
                    setEditingAddressId("");
                    // Pre-fill name and details from user profile but clear address specific fields
                    const name = userInfo.name || "";
                    const [first_name = "", ...rest] = name.trim().split(" ");
                    const last_name = rest.join(" ");
                    setAddress({
                      first_name,
                      last_name,
                      phone: userInfo.phone || "",
                      email: userInfo.email || "",
                      address1: "",
                      address2: "",
                      city: "",
                      state: "",
                      pincode: "",
                    });
                  }}
                  className="w-full h-full min-h-[160px] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:border-emerald-500 hover:bg-emerald-50/20 flex flex-col items-center justify-center p-4 transition group cursor-pointer"
                >
                  <span className="text-2xl text-slate-400 group-hover:text-emerald-600 mb-1 font-bold">+</span>
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-emerald-600">Add New Address</span>
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Continue →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAddressSubmit} className="space-y-3">
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
                  onClick={() => {
                    if (savedAddresses.length > 0) {
                      setIsAddingNew(false);
                      setEditingAddressId("");
                      // Restore previously selected address
                      const activeAddr = savedAddresses.find(addr => addr._id === selectedAddressId || addr.id === selectedAddressId) || savedAddresses[0];
                      if (activeAddr) {
                        handleSelectSavedAddress(activeAddr);
                      }
                    } else {
                      setStep(1);
                    }
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {savedAddresses.length > 0 ? "Cancel" : "← Back"}
                </button>
                <button
                  type="submit"
                  disabled={!isStep2Valid || isProcessing}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isProcessing && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  {editingAddressId ? "Save Changes" : "Save & Continue"}
                </button>
              </div>
            </form>
          )}
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
