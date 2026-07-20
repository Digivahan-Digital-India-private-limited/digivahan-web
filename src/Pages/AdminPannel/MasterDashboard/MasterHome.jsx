import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Users, ArrowRight, Sparkles } from "lucide-react";
import MasterSidebar from "./MasterSidebar";

const MasterHome = () => {
  const navigate = useNavigate();

  return (
    <main className="w-full h-screen flex lg:flex-row flex-col overflow-hidden bg-gray-50">
      <MasterSidebar />

      <section className="flex-1 w-full overflow-y-auto">
        {/* Welcome Hero */}
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center">

          {/* Status Badge */}
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-full mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            DigiVahan Master Control — Active
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
            Welcome to the
          </h1>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-5 flex items-center gap-3 justify-center">
            Master Panel <span className="text-4xl">🛡️</span>
          </h2>

          {/* Subtitle */}
          <p className="text-gray-500 text-base md:text-lg max-w-lg leading-relaxed mb-10">
            Your secure command hub for managing admin accounts, controlling platform access,
            and keeping DigiVahan running smoothly — all in one place.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate("/page/admin/master/admins")}
            className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-full font-semibold text-base hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-200"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16 w-full max-w-md">
            <div
              onClick={() => navigate("/page/admin/master/admins")}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition">
                  <Users className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="font-semibold text-gray-700">Admin Management</span>
              </div>
              <p className="text-sm text-gray-400 text-left">Add, view, and remove admin accounts</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-700">Secure Access</span>
              </div>
              <p className="text-sm text-gray-400 text-left">Master-level protected authentication</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MasterHome;
