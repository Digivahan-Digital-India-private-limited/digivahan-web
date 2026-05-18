import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Mail, Phone, User, Upload, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { getProfile, updateProfile } from "../services/profileApi";

const occupations = [
  "IT / Software",
  "Business",
  "Student",
  "Government Service",
  "Healthcare",
  "Education",
  "Other",
];

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const UpdateProfilePage = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    occupation: occupations[0],
    avatar: "",
    address: "",
  });

  const [showDpOptions, setShowDpOptions] = useState(false);
  const [removeAvatarFlag, setRemoveAvatarFlag] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState(["", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setFormData({
      firstName: profile.firstName || profile.name?.split(" ")?.[0] || "",
      lastName: profile.lastName || profile.name?.split(" ")?.slice(1).join(" ") || "",
      email: profile.email || "",
      phone: profile.phone || "",
      occupation: profile.occupation || occupations[0],
      avatar: profile.avatar || "",
      address: profile.address || "",
    });
  }, [profile]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully");
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile image must be under 2MB");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setFormData((prev) => ({ ...prev, avatar: dataUrl }));
      setRemoveAvatarFlag(false);
    } catch {
      toast.error("Failed to read selected image");
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: "" }));
    setRemoveAvatarFlag(true);
    setShowDpOptions(false);
    toast.info("Profile picture marked for removal. Please save to apply changes.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    try {
      const response = await mutation.mutateAsync({
        ...formData,
        phone: formData.phone.trim(),
        remove_avatar: removeAvatarFlag,
      });

      if (response?.otp_required) {
        toast.info(response.message || "Verification code sent to your old number.");
        setShowOtpModal(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
  };

  const handleVerifyOtp = async () => {
    const code = otpValue.join("");
    if (code.length !== 4) {
      toast.error("Please enter a valid 4-digit verification code.");
      return;
    }

    try {
      setIsVerifying(true);
      const response = await mutation.mutateAsync({
        ...formData,
        phone: formData.phone.trim(),
        remove_avatar: removeAvatarFlag,
        phone_otp: code,
      });

      if (!response?.otp_required) {
        setShowOtpModal(false);
        setOtpValue(["", "", "", ""]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otpValue];
    next[index] = value;
    setOtpValue(next);

    if (value && index < otpValue.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValue[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const getInitials = () => {
    const f = formData.firstName ? formData.firstName.trim().charAt(0).toUpperCase() : "";
    const l = formData.lastName ? formData.lastName.trim().charAt(0).toUpperCase() : "";
    return (f + l) || "U";
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Profile Update</h2>
        <p className="text-sm text-slate-500">
          Add your profile photo and personal details similar to the mobile app profile update flow.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex justify-center">
          <div className="relative">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="Profile"
                className="h-32 w-32 rounded-full border-4 border-emerald-500 object-cover"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-100 text-3xl font-bold text-emerald-700">
                {getInitials()}
              </div>
            )}
             <button
              type="button"
              onClick={() => setShowDpOptions((prev) => !prev)}
              className="absolute bottom-1 right-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm hover:bg-amber-500 transition active:scale-95 cursor-pointer"
              aria-label="Upload profile image"
            >
              <Camera size={18} />
            </button>
            {showDpOptions && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDpOptions(false)} 
                />
                <div className="absolute right-[-40px] top-[105px] z-20 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowDpOptions(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Upload size={16} className="text-emerald-600" />
                    Upload DP
                  </button>
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 size={16} className="text-rose-600" />
                      Remove DP
                    </button>
                  )}
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleSelectImage}
              className="hidden"
            />
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200">
          <div className="border-b border-slate-200 px-4 py-3">
            <h3 className="text-lg font-semibold text-slate-900">Basic Details</h3>
          </div>

          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium text-slate-700">First Name</span>
              <div className="flex items-center rounded-xl border-2 border-emerald-400 px-3 py-2.5">
                <User size={17} className="mr-2 text-emerald-600" />
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm outline-none"
                  required
                />
              </div>
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium text-slate-700">Last Name</span>
              <div className="flex items-center rounded-xl border-2 border-emerald-400 px-3 py-2.5">
                <User size={17} className="mr-2 text-emerald-600" />
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm outline-none"
                  required
                />
              </div>
            </label>

            <label className="space-y-1 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Email Address</span>
              <div className="flex items-center rounded-xl border-2 border-emerald-400 px-3 py-2.5">
                <Mail size={17} className="mr-2 text-emerald-600" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>

            <label className="space-y-1 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Phone Number</span>
              <div className="flex items-center rounded-xl border-2 border-emerald-400 px-3 py-2.5">
                <Phone size={17} className="mr-2 text-emerald-600" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(event) => {
                    const value = event.target.value.replace(/[^+\d\s-]/g, "");
                    setFormData((prev) => ({ ...prev, phone: value }));
                  }}
                  className="w-full bg-transparent text-sm outline-none"
                  required
                />
              </div>
            </label>

            <label className="space-y-1 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Occupation</span>
              <div className="rounded-xl border-2 border-emerald-400 px-3 py-2.5">
                <select
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  {occupations.map((occupation) => (
                    <option key={occupation} value={occupation}>
                      {occupation}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>
        </section>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {mutation.isPending ? "Updating..." : "Update Details"}
        </button>
      </form>

      <section className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Link to="/profile/change-password" className="rounded-xl border border-slate-200 px-3 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50">
          Change Password
        </Link>
        <Link to="/profile/emergency-contacts" className="rounded-xl border border-slate-200 px-3 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50">
          Emergency Contacts
        </Link>
        <Link to="/profile" className="rounded-xl border border-slate-200 px-3 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50">
          Back to Profile
        </Link>
      </section>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full">
                <Phone className="w-8 h-8 text-emerald-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 mb-2">
                Verify Old Phone Number
              </h3>
              <p className="text-center text-slate-600 text-sm mb-6">
                We've sent a 4-digit verification code to your current registered number. Please enter it below to confirm changing your phone number to <strong className="text-emerald-700">{formData.phone}</strong>.
              </p>
              
              <div className="flex justify-center gap-2 mb-6">
                {otpValue.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="h-12 w-12 rounded-xl border-2 border-emerald-200 text-center text-lg font-semibold outline-none focus:border-emerald-500"
                  />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtpValue(["", "", "", ""]);
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifying || otpValue.join("").length !== 4}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Verify & Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfilePage;
