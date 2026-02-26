import React from "react";
import { ArrowLeft, MoreVertical, Shield, FileText, Leaf, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DocumentVault = () => {
  const navigate = useNavigate();
  
  const securityCode = "9580";

  const documents = [
    {
      id: 1,
      title: "Insurance",
      description: "Keep your vehicle secured with valid insurance",
      icon: <Shield className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-50"
    },
    {
      id: 2,
      title: "Pollution",
      description: "Keep PUC certificate handy",
      icon: <Leaf className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-50"
    },
    {
      id: 3,
      title: "Registration Certificate",
      description: "Save your vehicle RC for Quick access any time",
      icon: <Award className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-50"
    },
    {
      id: 4,
      title: "Other Documents",
      description: "Keep your all digital document on your finger tip",
      icon: <FileText className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-50"
    }
  ];

  const handleBack = () => {
    navigate("/ios/notifications");
  };

  const handleViewDocument = (documentId) => {
    console.log("Viewing document:", documentId);
    // Here you would navigate to specific document view
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-1 hover:bg-gray-100 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="font-semibold text-gray-900">Document Vault</h1>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-full transition">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div className="px-6 py-8">
        {/* Security Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Outer circle */}
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
              {/* Middle circle */}
              <div className="w-24 h-24 bg-green-200 rounded-full flex items-center justify-center">
                {/* Inner circle */}
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Code Section */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Code</h2>
          
          {/* Security Code Display */}
          <div className="flex justify-center gap-4 mb-6">
            {securityCode.split('').map((digit, index) => (
              <div
                key={index}
                className="w-12 h-12 border-2 border-green-500 rounded-lg flex items-center justify-center bg-white"
              >
                <span className="text-xl font-semibold text-gray-900">{digit}</span>
              </div>
            ))}
          </div>

          {/* Warning Text */}
          <p className="text-gray-500 text-sm leading-relaxed px-4">
            Please share your security code only with trusted requesters. Your safety and security are our top priority.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 mb-6"></div>

        {/* Documents Section */}
        <div className="space-y-4">
          {documents.map((document) => (
            <div
              key={document.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Document Icon */}
                  <div className={`w-12 h-12 ${document.bgColor} rounded-lg flex items-center justify-center`}>
                    {document.icon}
                  </div>
                  
                  {/* Document Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {document.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {document.description}
                    </p>
                  </div>
                </div>

                {/* View Button */}
                <button
                  onClick={() => handleViewDocument(document.id)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentVault;