import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { FaPhoneAlt, FaTimes } from "react-icons/fa";

const Contactpage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    emailjs
      .send(
        "service_714b67q",
        "template_x7eknz8",
        formData,
        "jDelYHimttaB-w2vA"
      )
      .then(() => {
        setSuccess("Your message has been sent successfully! 💙");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          message: "",
        });
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess("");
        }, 2000);
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        alert("Failed to send message 😔");
      })
      .finally(() => setLoading(false));
  };

  const faqData = [
    {
      question: "What is Digivahan?",
      answer: "Digivahan is a vehicle-focused digital platform that provides automotive data, business integrations, and service solutions for dealers, logistics partners, and enterprise clients."
    },
    {
      question: "Who can partner with Digivahan?",
      answer: "Authorized vehicle dealers, logistics & courier partners, fleet operators, technology providers, and business associates can collaborate with Digivahan for long-term partnerships."
    },
    {
      question: "How can I become a dealer or service partner?",
      answer: 'You can visit our "Visit Us" page to schedule a business meeting or submit a partnership inquiry through the contact form. Our Business Development team will guide you through the onboarding process.'
    },
    {
      question: "Does Digivahan provide API integration?",
      answer: "Yes. Digivahan offers API integration support for businesses that want to connect their systems with our platform. Our Technical Integration team assists with documentation, testing, and deployment."
    },
    {
      question: "What documents are required for partnership onboarding?",
      answer: "Required documents may include: Business registration proof, GST details (if applicable), Authorized signatory details, Company profile. Our team will share the complete checklist during the onboarding discussion."
    },
    {
      question: "How long does the onboarding process take?",
      answer: "The onboarding timeline depends on document verification and technical integration requirements. Typically, the process may take 3–7 working days after submission of complete documentation."
    },
    {
      question: "How can I raise a service-related concern?",
      answer: 'You can use the "Raise Concern" page to submit your issue with complete details. Our team reviews and responds within 24 working hours.'
    },
    {
      question: "Is Digivahan available for bulk or enterprise services?",
      answer: "Yes. We support enterprise-level collaborations and bulk service requirements based on business needs and operational alignment."
    },
    {
      question: "Can I schedule a meeting before visiting the office?",
      answer: "Yes. We recommend booking an appointment in advance to ensure proper availability of the concerned department."
    },
    {
      question: "How can I contact Digivahan for urgent queries?",
      answer: 'You can reach out via our official email or contact number mentioned on the "Contact Us" page for priority assistance.'
    }
  ];

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-50px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }
        
        .fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }
        
        .scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }
        
        .modal-slide-in {
          animation: modalSlideIn 0.4s ease-out forwards;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .backdrop-blur-active {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="fade-in-left space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <FaPhoneAlt className="text-4xl text-yellow-500" />
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Contact Us</h1>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="flex items-start gap-2">
                  <span className="text-2xl">🏠</span>
                  <span><strong>Let's Connect with Digivahan</strong></span>
                </p>
                
                <p>
                  At Digivahan, we believe that strong relationships are built on trust, transparency, and timely support. We are committed to making your vehicle-related journey simple, reliable, and hassle-free.
                </p>
                
                <p>
                  Whether you have a question about our services, need technical assistance, want help with vehicle details, or are facing any issue — our dedicated support team is always ready to guide you at every step.
                </p>
                
                <p>
                  We understand how important accurate information and quick responses are in the automotive space. That's why we focus on providing clear communication, fast resolutions, and dependable assistance whenever you reach out to us.
                </p>
                
                <p>
                  If you are a customer looking for support, a dealer interested in onboarding, or a business exploring partnership opportunities — Digivahan welcomes you.
                </p>
                
                <p>
                  Your satisfaction, trust, and long-term association matter the most to us. We don't just respond to queries — we build connections.
                </p>
                
                <p className="flex items-start gap-2">
                  <span className="text-2xl">🤝</span>
                  <span>Let's move forward together with confidence and reliability.</span>
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
              >
                Open Contact Form
              </button>
            </div>

            {/* Right Image */}
            <div className="fade-in-right delay-200">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl blur-2xl opacity-20"></div>
                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800"
                  alt="Contact Team"
                  className="relative rounded-2xl shadow-2xl w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 fade-in-up">
              FAQ Section
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md hover-lift border-l-4 border-yellow-500 fade-in-up delay-${Math.min((index + 1) * 100, 400)}`}
                >
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    {index + 1}. {faq.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-active"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto modal-slide-in">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all duration-300"
            >
              <FaTimes className="text-2xl" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Contact Form
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                We'd love to hear from you. Please fill out the form below.
              </p>
            </div>

            {success && (
              <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <p className="text-green-700 font-semibold">{success}</p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <label className="text-sm font-semibold text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                    className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300"
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <label className="text-sm font-semibold text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                    className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <label className="text-sm font-semibold text-gray-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300"
                />
              </div>

              {/* Phone */}
              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <label className="text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300"
                />
              </div>

              {/* Query */}
              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <label className="text-sm font-semibold text-gray-700">
                  Your Query *
                </label>
                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  required
                  className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-300"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Contactpage;
