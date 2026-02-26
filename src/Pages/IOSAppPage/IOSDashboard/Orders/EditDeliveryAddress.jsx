import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

export default function EditDeliveryAddress() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Pankaj Quereshi",
    contactNo: "+91 9897000001",
    houseNo: "Pankaj Quereshi",
    roadName: "Pankaj Quereshi",
    zipCode: "Pankaj Quereshi",
    city: "New Delhi",
    state: "Delhi",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    console.log("Address saved:", formData);
    navigate(-1);
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
          <h1 className="text-xl font-bold text-gray-900">Edit Delivery Address</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 pb-12">
        {/* Form Container */}
        <div className="bg-white border border-gray-300 rounded-xl p-6 space-y-4 mb-8">
          {/* Row 1: Name and Contact No */}
          <div className="grid grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="relative">
              <label className="text-xs text-gray-600 font-medium block mb-2">
                *Name*
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-2 border-2 border-green-500 rounded-lg text-sm text-gray-900 bg-white"
                />
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              </div>
            </div>

            {/* Contact No Field */}
            <div className="relative">
              <label className="text-xs text-gray-600 font-medium block mb-2">
                *Contact No*
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.contactNo}
                  onChange={(e) => handleInputChange("contactNo", e.target.value)}
                  className="w-full px-4 py-2 border-2 border-green-500 rounded-lg text-sm text-gray-900 bg-white"
                />
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>

          {/* Row 2: House No */}
          <div>
            <label className="text-xs text-gray-600 font-medium block mb-2">
              *House No./Building Name*
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.houseNo}
                onChange={(e) => handleInputChange("houseNo", e.target.value)}
                className="w-full px-4 py-2 border-2 border-green-500 rounded-lg text-sm text-gray-900 bg-white"
              />
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            </div>
          </div>

          {/* Row 3: Road Name */}
          <div>
            <label className="text-xs text-gray-600 font-medium block mb-2">
              *Road Name / Area / Colony*
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.roadName}
                onChange={(e) => handleInputChange("roadName", e.target.value)}
                className="w-full px-4 py-2 border-2 border-green-500 rounded-lg text-sm text-gray-900 bg-white"
              />
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            </div>
          </div>

          {/* Row 4: Zip Code */}
          <div>
            <label className="text-xs text-gray-600 font-medium block mb-2">
              *Zip Code*
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                className="w-full px-4 py-2 border-2 border-green-500 rounded-lg text-sm text-gray-900 bg-white"
              />
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            </div>
          </div>

          {/* Row 5: City and State */}
          <div className="grid grid-cols-2 gap-4">
            {/* City Field */}
            <div>
              <label className="text-xs text-gray-600 font-medium block mb-2">
                *City*
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-4 py-2 border-2 border-green-500 rounded-lg text-sm text-gray-900 bg-white"
                />
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              </div>
            </div>

            {/* State Field */}
            <div>
              <label className="text-xs text-gray-600 font-medium block mb-2">
                *State*
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full px-4 py-2 border-2 border-green-500 rounded-lg text-sm text-gray-900 bg-white"
                />
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-lg transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}
