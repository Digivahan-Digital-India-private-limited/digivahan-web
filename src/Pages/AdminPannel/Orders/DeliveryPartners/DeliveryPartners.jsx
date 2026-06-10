import React, { useContext, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../../../ContextApi/DataProvider";
import { toast } from "react-toastify";

const deliveryPartners = [
  { id: "shiprocket", name: "Shiprocket" },
  { id: "delhivery", name: "Delhivery" },
];

function DeliveryPartners() {
  const navigate = useNavigate();
  const { AddDeliveryPartners, getOrderStats } = useContext(MyContext);

  const [activePartner, setActivePartner] = useState(
    localStorage.getItem("active_partner") || null,
  );
  const [confirmPartner, setConfirmPartner] = useState(null);

  // 👇 when component loads, fetch from backend
  useEffect(() => {
    const fetchActivePartner = async () => {
      try {
        const stats = await getOrderStats();
        if (stats && stats.active_partner) {
          setActivePartner(stats.active_partner);
          localStorage.setItem("active_partner", stats.active_partner);
        } else {
          const storedPartner = localStorage.getItem("active_partner");
          if (storedPartner) {
            setActivePartner(storedPartner);
          }
        }
      } catch (error) {
        console.error("Failed to fetch active partner", error);
      }
    };
    fetchActivePartner();
  }, []);

  const setActivePartnerHandler = (partnerId) => {
    setConfirmPartner(partnerId);
  };

  const confirmActivation = async () => {
    if (!confirmPartner) return;
    try {
      const response = await AddDeliveryPartners(confirmPartner);

      if (response?.data?.active_partner) {
        const partnerFromServer = response.data.active_partner;

        // ✅ Save in localStorage
        localStorage.setItem("active_partner", partnerFromServer);

        // ✅ Update state
        setActivePartner(partnerFromServer);
        toast.success(`${confirmPartner} set as active partner successfully!`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to set active partner");
    } finally {
      setConfirmPartner(null);
    }
  };

  return (
    <main className="w-full h-screen flex flex-col bg-white">
      <div className="flex items-center gap-4 p-6 border-b border-gray-200 bg-white">
        <button
          onClick={() => navigate("/orders-panel")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold">Delivery Partners</h1>
      </div>

      <div className="flex-1 p-6">
        <div className="mb-6">
          <p className="text-sm text-gray-500">Active Partner</p>
          <p className="text-lg font-semibold text-gray-900">
            {activePartner || "Not set"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliveryPartners.map((partner) => (
            <div
              key={partner.id}
              className={`group relative bg-white border-2 rounded-2xl p-6 transition-all duration-300 
    ${
      activePartner === partner.id
        ? "border-blue-400 shadow-xl"
        : "border-orange-200 shadow-md"
    }
  `}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {partner.id === "shiprocket" ? "🚀" : "🚚"}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">
                    {partner.name}
                  </h3>
                </div>

                <button className="text-red-400 hover:text-red-600 transition text-lg">
                  ✕
                </button>
              </div>

              {/* Status Badge */}
              <span
                className={`inline-block px-4 py-1 text-xs font-semibold rounded-full mb-6
      ${
        activePartner === partner.id
          ? "bg-green-100 text-green-700"
          : "bg-orange-100 text-orange-600"
      }
    `}
              >
                {activePartner === partner.id ? "active" : "inactive"}
              </span>

              {/* Button */}
              {activePartner === partner.id ? (
                <button className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold shadow-md">
                  ✓ Active
                </button>
              ) : (
                <button
                  onClick={() => setActivePartnerHandler(partner.id)}
                  className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md transition"
                >
                  Set Active
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmPartner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Activation</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to set <strong className="text-indigo-600 capitalize">{confirmPartner}</strong> as the active delivery partner?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmPartner(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmActivation}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-md transition-all duration-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default DeliveryPartners;
