import React, { useState, useEffect } from "react";
import { Truck, FileText, Settings, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
 
function Order() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderCounts, setOrderCounts] = useState({
    shiprocket: 0,
    delhivery: 0,
    manifest: 0,
    partners: 3
  });
 
  // Fetch order counts from API
  const fetchOrderCounts = async () => {
    setLoading(true);
    try {
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
     
      // Mock data - replace with actual API calls
      setOrderCounts({
        shiprocket: 8,
        delhivery: 8,
        manifest: 13,
        partners: 3
      });
    } catch (error) {
      console.error("Error fetching order counts:", error);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchOrderCounts();
  }, []);
 
  const orderCards = [
    {
      id: "shiprocket",
      title: "Shiprocket",
      description: "Click to view details",
      count: orderCounts.shiprocket,
      gradient: "from-purple-400 to-purple-500",
      icon: Package,
      link: "/orders-panel/shiprocket"
    },
    {
      id: "partners",
      title: "Delivery Partners",
      description: "Switch and manage partners",
      count: orderCounts.partners,
      gradient: "from-cyan-400 to-cyan-500",
      icon: Truck,
      link: "/orders-panel/delivery-partners",
      showPartnersText: true
    },
    {
      id: "delhivery",
      title: "Delhivery",
      description: "Click to view details",
      count: orderCounts.delhivery,
      gradient: "from-rose-400 to-rose-500",
      icon: Truck,
      link: "/orders-panel/delhivery"
    },
    {
      id: "manifest",
      title: "Generate Manifest & Label",
      description: "Click to view details",
      count: orderCounts.manifest,
      gradient: "from-amber-400 to-amber-500",
      icon: FileText,
      link: "/orders-panel/generate-manifest"
    },
    {
      id: "manage",
      title: "Manage Order",
      description: "Update & Cancel Orders",
      gradient: "from-indigo-400 to-indigo-500",
      icon: Settings,
      link: "/orders-panel/manage",
      hideCount: true
    }
  ];
 
  return (
    <main className="w-full min-h-screen bg-white">
      <div className="w-full bg-white">
        <div className="p-6">
          <h1 className="text-4xl font-bold mb-2">Orders Management</h1>
          <p className="text-gray-600 text-lg">Manage all your order operations</p>
        </div>
 
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => navigate(card.link)}
                  className={`group relative flex items-center justify-between p-5 bg-linear-to-br ${card.gradient} rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{card.title}</h2>
                      <p className="text-sm text-white/90">{card.description}</p>
                      {!card.hideCount && (
                        <p className="text-sm font-semibold text-white mt-1">
                          {loading ? (
                            <span className="inline-flex items-center">
                              <span className="animate-pulse">Loading...</span>
                            </span>
                          ) : card.showPartnersText ? (
                            `${card.count} Partners`
                          ) : (
                            `Total Orders: ${card.count}`
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  {!card.hideCount && !card.showPartnersText && (
                    <div className="relative z-10">
                      <div className="text-5xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                        {loading ? (
                          <span className="animate-pulse text-3xl">...</span>
                        ) : (
                          card.count
                        )}
                      </div>
                    </div>
                  )}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
 
export default Order;
 
 