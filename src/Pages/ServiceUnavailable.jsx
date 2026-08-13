import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const ServiceUnavailable = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center border-t-4 border-yellow-500">
        
        {/* Icon Animation */}
        <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <FaExclamationTriangle className="text-5xl text-yellow-500" />
        </div>

        {/* Text Content */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Service Temporarily Unavailable
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          We're currently facing an issue while fetching your request from the 
          <span className="font-semibold text-gray-800"> Government Parivahan database</span>. 
          Please try again after some time.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
          >
            <FaArrowLeft /> Go Back
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#e86616] hover:bg-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ServiceUnavailable;
