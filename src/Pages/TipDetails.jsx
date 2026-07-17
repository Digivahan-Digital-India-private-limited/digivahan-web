import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const TipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTip = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/v1/tips-tricks/${id}`);
        if (res.data.success) {
          setTip(res.data.data);
        } else {
          setError(res.data.message || "Failed to load tip details.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchTip();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !tip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-red-500 text-lg font-medium mb-4">{error || "Tip not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
        >
          <ArrowLeft size={20} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Banner */}
      <div className="w-full h-64 md:h-96 relative">
        <img 
          src={tip.banner} 
          alt={tip.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/30 transition font-semibold"
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{tip.title}</h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-10 whitespace-pre-wrap">{tip.summary}</p>

          {tip.points && tip.points.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-100 pb-2 mb-6">Key Points</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tip.points.map((point, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:shadow-md transition">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden border border-purple-200">
                      <img src={point.icon} alt={`Point ${index + 1}`} className="w-8 h-8 object-contain" />
                    </div>
                    <p className="text-gray-700 text-sm md:text-base self-center">{point.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TipDetails;
