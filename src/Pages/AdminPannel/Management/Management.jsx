import React from "react";
import { useNavigate } from "react-router-dom";
import { Car, Scale, Droplet, Lightbulb, Smartphone, Info } from "lucide-react";

const managementCards = [
  {
    id: "trending-cars",
    title: "Add Trending Car",
    description: "Add, view & delete trending cars",
    gradient: "from-violet-500 to-purple-600",
    icon: Car,
    link: "/management/trending-cars",
  },
  {
    id: "compare-cars",
    title: "Compare Trending Car",
    description: "Compare two trending cars & view pairs",
    gradient: "from-blue-500 to-cyan-600",
    icon: Scale,
    link: "/management/compare-cars",
  },
  {
    id: "fuel-prices",
    title: "Update Fuel Price",
    description: "Manage state-wise fuel prices",
    gradient: "from-orange-500 to-amber-600",
    icon: Droplet,
    link: "/management/fuel-prices",
  },
  {
    id: "tips-tricks",
    title: "Add Tips & Tricks",
    description: "Manage driving tips, tricks, and guides",
    gradient: "from-purple-500 to-indigo-600",
    icon: Lightbulb,
    link: "/management/tips-tricks",
  },
  {
    id: "app-version",
    title: "Update App Version",
    description: "Manage Android and iOS app versions and release notes",
    gradient: "from-teal-500 to-emerald-600",
    icon: Smartphone,
    link: "/management/app-version",
  },
  // {
  //   id: "app-info",
  //   title: "App Info",
  //   description: "Manage versions, policies, payment keys & more",
  //   gradient: "from-indigo-500 to-purple-600",
  //   icon: Info,
  //   link: "/management/app-info",
  // },
];

function Management() {
  const navigate = useNavigate();

  return (
    <main className="w-full min-h-screen bg-white">
      <div className="w-full bg-white">
        <div className="p-6">
          <h1 className="text-4xl font-bold mb-2">App Management</h1>
          <p className="text-gray-600 text-lg">Manage all your platform content</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managementCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => navigate(card.link)}
                  className={`group relative flex items-center justify-between p-5 bg-gradient-to-br ${card.gradient} rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{card.title}</h2>
                      <p className="text-sm text-white/90">{card.description}</p>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Management;
