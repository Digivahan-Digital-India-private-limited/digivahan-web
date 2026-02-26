import React, { useState } from "react";
import { Bell, Pencil, Trash2, Plus, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmergencyContactsList() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Suhail Pandit",
      phoneNumber: "+91 9897000001",
      profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Sabnam Tiwari",
      phoneNumber: "+91 9897000001",
      profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Sabnam Tiwari",
      phoneNumber: "+91 9897000001",
      profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 4,
      name: "Susmita Khan",
      phoneNumber: "+91 9897000001",
      profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ]);

  const handleEdit = (contact) => {
    navigate("/ios/edit-emergency-contact", {
      state: {
        contactId: contact.id,
        firstName: contact.name.split(' ')[0],
        lastName: contact.name.split(' ')[1] || '',
        phoneNumber: contact.phoneNumber,
        contactImage: contact.profileImage,
      },
    });
  };

  const handleDelete = (contactId) => {
    setContacts(contacts.filter((contact) => contact.id !== contactId));
  };

  const handleAddContact = () => {
    navigate("/ios/add-emergency-contact");
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

        {/* Top Navigation Bar */}
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Profile Picture */}
          <div className="relative w-10 h-10">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-gray-900">Emergency Contacts</h1>

          {/* Notification Bell */}
          <button className="w-6 h-6 flex items-center justify-center">
            <Bell className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 pb-24">
        {contacts.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <div className="relative mb-8">
              <div className="w-64 h-80 bg-green-500 rounded-2xl relative">
                <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-around py-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-4 h-6 bg-white rounded-r-lg"></div>
                  ))}
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 bg-green-300 rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-green-200 rounded-full flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-yellow-300 rounded-full mb-2"></div>
                        <div className="w-16 h-10 bg-yellow-300 rounded-t-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">✕</span>
                  </div>
                </div>
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                  <p className="text-white font-bold text-lg whitespace-nowrap">No Contact</p>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Contacts Found</h2>
            <p className="text-gray-500 text-center">Please add some contacts for your safety.</p>
          </div>
        ) : (
          /* Contact List */
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-4 bg-white py-4"
              >
                {/* Profile Picture */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <img
                    src={contact.profileImage}
                    alt={contact.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                {/* Contact Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {contact.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{contact.phoneNumber}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(contact)}
                    className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                  >
                    <Pencil className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={handleAddContact}
        className="fixed bottom-8 right-8 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-30"
      >
        <Plus className="w-8 h-8 text-white" />
      </button>
    </div>
  );
}
