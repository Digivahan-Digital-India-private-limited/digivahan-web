import React, { useState } from "react";
import { ArrowLeft, MoreVertical, Paperclip, Send, Mic } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  
  // Get notification data from navigation state
  const notificationData = location.state?.notification || {
    name: "Rajat Malik",
    type: "accident"
  };

  const handleBack = () => {
    navigate("/ios/notifications");
  };

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
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
            <h1 className="font-semibold text-gray-900">{notificationData.name}</h1>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-full transition">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        {/* Sender Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Jhon Abraham"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-gray-900">Jhon Abraham</p>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-red-500">🚨</span>
              <span className="text-red-500 font-medium">Accident Alert</span>
            </div>
          </div>
        </div>

        {/* Accident Image */}
        <div className="mb-4">
          <img
            src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop"
            alt="Car Accident"
            className="w-full max-w-xs rounded-lg shadow-sm"
          />
        </div>

        {/* Messages */}
        <div className="space-y-3 mb-4">
          {/* Message 1 */}
          <div className="bg-green-100 rounded-lg p-3 max-w-xs">
            <p className="text-sm text-gray-700">
              Yeh message aapki relative ki car ke QR code ko scan karte bheja gaya hai.
            </p>
          </div>

          {/* Message 2 */}
          <div className="bg-green-100 rounded-lg p-3 max-w-xs">
            <p className="text-sm text-gray-700">
              <span className="text-red-500">🚗</span> Car Accident Ho Gaya Hai
            </p>
          </div>

          {/* Message 3 */}
          <div className="bg-green-100 rounded-lg p-3 max-w-xs">
            <p className="text-sm text-gray-700">
              <span className="text-orange-500">⚠️</span> 1 vyakti ki site par hi death ho gayi hai
            </p>
          </div>

          {/* Message 4 */}
          <div className="bg-green-100 rounded-lg p-3 max-w-xs">
            <p className="text-sm text-gray-700">
              <span className="text-blue-500">🏥</span> 2 logon ki halat bahut gambhir hai
            </p>
          </div>

          {/* Message 5 */}
          <div className="bg-green-100 rounded-lg p-3 max-w-xs">
            <p className="text-sm text-gray-700">
              <span className="text-red-500">❤️</span> Police aur ambulance unhe le ja chuki hai.
            </p>
          </div>

          {/* Message 6 */}
          <div className="bg-green-100 rounded-lg p-3 max-w-xs">
            <p className="text-sm text-gray-700">
              Yeh car aapke parivaar se judi hui hai, isliye kripya turant neeche diye gaye location par pahunchiye.
            </p>
          </div>
        </div>

        {/* Location Section */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <span className="text-red-500">📍</span> Accident Location:
          </p>
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="relative h-32 bg-gray-800">
              {/* Google Maps placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-6 h-6 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white text-xs">📍</span>
                  </div>
                  <p className="text-white text-xs">Building Marg</p>
                </div>
              </div>
              {/* Google logo */}
              <div className="absolute bottom-2 left-2">
                <span className="text-white text-xs font-medium">Google</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final Message */}
        <div className="bg-green-100 rounded-lg p-3 max-w-xs mb-4">
          <p className="text-sm text-gray-700">
            <span className="text-green-500">✅</span> Har second important hai.
          </p>
          <p className="text-sm text-gray-700 mt-1">
            Agar aap yeh message padh rahe hain to bina deri kiye turant location par pahunchiye ya emergency service se sampark kijiye.
          </p>
        </div>

        {/* Prayer Message */}
        <div className="bg-green-100 rounded-lg p-3 max-w-xs mb-6">
          <p className="text-sm text-gray-700">
            <span className="text-orange-500">🙏</span> Prarthana hai sabhi theek ho jayein.
          </p>
        </div>

        {/* Audio Message */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 gap-2">
            <button className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
            </button>
            <div className="flex items-center gap-1">
              <div className="w-1 h-2 bg-orange-400 rounded-full"></div>
              <div className="w-1 h-3 bg-orange-400 rounded-full"></div>
              <div className="w-1 h-2 bg-orange-400 rounded-full"></div>
              <div className="w-1 h-4 bg-orange-400 rounded-full"></div>
              <div className="w-1 h-2 bg-orange-400 rounded-full"></div>
              <div className="w-1 h-3 bg-orange-400 rounded-full"></div>
            </div>
            <span className="text-orange-400 text-xs font-medium">00:16</span>
          </div>
        </div>

        {/* Time Stamp */}
        <p className="text-xs text-gray-400 text-right mb-4">06:04 AM</p>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Make"
              className="w-full px-4 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition">
              <Mic className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <button
            onClick={handleSend}
            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;