import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Mail, Phone, User } from "lucide-react";
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
    } catch {
      toast.error("Failed to read selected image");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    try {
      await mutation.mutateAsync({
        ...formData,
        phone: formData.phone.trim(),
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
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
            <img
              src={formData.avatar || "https://randomuser.me/api/portraits/men/75.jpg"}
              alt="Profile"
              className="h-32 w-32 rounded-full border-4 border-emerald-500 object-cover"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm hover:bg-amber-500"
              aria-label="Upload profile image"
            >
              <Camera size={18} />
            </button>
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
                  required
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
    </div>
  );
};

export default UpdateProfilePage;
