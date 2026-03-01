import { BsBalloonHeartFill } from "react-icons/bs";
import { useEffect, useRef } from "react";

export default function PrivacyPolicy() {
  const permRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("perm-visible");
          }
        });
      },
      { threshold: 0.08 }
    );
    const cards = document.querySelectorAll(".perm-card-anim");
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const permissions = [
    {
      icon: "📞",
      title: "Phone & Calling Access",
      desc: "Used to let you directly call drivers, vendors, or customer support from the app for quick assistance.",
      color: "from-blue-50 to-blue-100",
      border: "border-blue-300",
      badge: "bg-blue-100 text-blue-700",
    },
    {
      icon: "📷",
      title: "Camera Access",
      desc: "Used to capture photos for profile setup, document verification, QR scanning, or uploading proof while raising a report.",
      color: "from-purple-50 to-purple-100",
      border: "border-purple-300",
      badge: "bg-purple-100 text-purple-700",
    },
    {
      icon: "🖼️",
      title: "Storage & Media Access",
      desc: "Used to allow you to upload images, documents, or videos from your device when required.",
      color: "from-pink-50 to-pink-100",
      border: "border-pink-300",
      badge: "bg-pink-100 text-pink-700",
    },
    {
      icon: "📍",
      title: "Location Access",
      desc: "Used to show your current location and provide nearby vehicle-related services and navigation support.",
      color: "from-red-50 to-red-100",
      border: "border-red-300",
      badge: "bg-red-100 text-red-700",
    },
    {
      icon: "🌐",
      title: "Internet Access",
      desc: "Required to connect the app with our servers for login, bookings, data updates, and other online services.",
      color: "from-cyan-50 to-cyan-100",
      border: "border-cyan-300",
      badge: "bg-cyan-100 text-cyan-700",
    },
    {
      icon: "🔔",
      title: "Notifications",
      desc: "Used to send important updates, booking alerts, and security-related messages.",
      color: "from-yellow-50 to-yellow-100",
      border: "border-yellow-300",
      badge: "bg-yellow-100 text-yellow-700",
    },
    {
      icon: "🔵",
      title: "Bluetooth Access",
      desc: "Used when connecting the app with compatible car systems or Bluetooth devices (if applicable).",
      color: "from-indigo-50 to-indigo-100",
      border: "border-indigo-300",
      badge: "bg-indigo-100 text-indigo-700",
    },
    {
      icon: "🔄",
      title: "Background Services",
      desc: "Used to ensure essential features like tracking or navigation work smoothly without interruption.",
      color: "from-green-50 to-green-100",
      border: "border-green-300",
      badge: "bg-green-100 text-green-700",
    },
  ];


  const policy = {
    heading: "Privacy Policy",
    effectivedate: "18/09/2025",
    sections: [
      {
        title: "1. Introduction",
        content:
          "Digivahan Digital India is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal data when you use our mobile application and services.",
      },
      {
        title: "2. Data We Collect",
        content: `We collect the following user data to deliver and enhance our services:
• Full Name
• Mobile Number
• Vehicle Number
• Email Address
• Location (GPS)
• RC, PUC, Insurance documents
• Uploaded documents
• Camera / Gallery Access
• PAN / Voter ID / Driving License
• OTP for verification
• Payment information (via Razorpay)
• Analytics and engagement data (via Firebase)`,
      },
      {
        title: "3. How We Use Your Data",
        content: `Your information is used for:
• Account creation & user verification
• RC & document validation
• Report generation & vehicle alerts
• Providing services from Digivahan and its subsidiaries
• Analytics and app performance improvement
• Location-based vehicle services
• Enabling secure payments`,
      },

      {
        title: "4. Data Sharing with Third Parties",
        content: `We only share data with trusted third-party services for functionality:
• Firebase (Analytics, push notifications)
• Razorpay (Payments)
• Google Maps API (Location services)
• AWS (Data storage)
We do not sell or trade your data to any unauthorized parties`,
      },

      {
        title: "5. Data Storage & Security",
        content: `Your data is securely stored on AWS and Firebase servers with encryption protocols. We ensure reasonable security measures to protect against unauthorized access or disclosure.`,
      },

      {
        title: "6. Data Retention",
        content: `We retain user data as long as the account is active or until the user requests data deletion. Once requested, we delete data within a reasonable time frame unless legally required to retain it.`,
      },

      {
        title: "7. Children’s Privacy",
        content: `Our services are intended for individuals who own vehicles. We do not knowingly collect data from children below 18 years unless they are using legally permitted electric vehicles`,
      },

      {
        title: "8. User Rights",
        content: `Users may access, update, or delete their personal data at any time through the mobile application settings.`,
      },

      {
        title: "9. Consent",
        content: `We only share data with trusted third-party services for functionality:
• Firebase (Analytics, push notifications)
• Razorpay (Payments)
• Google Maps API (Location services)
• AWS (Data storage)
We do not sell or trade your data to any unauthorized parties`,
      },

      {
        title: "10. Grievance & Contact",
        content: `For any questions, concerns, or requests related to privacy, please contact:
📩 Email: info@digivahan.in`,
      },
    ],
  };

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4 md:px-8">
      <style>{`
        @keyframes permFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes permFadeLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmerBg {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        .perm-card-anim {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .perm-card-anim.perm-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .perm-card-anim:nth-child(odd)  { transition-delay: 0.05s; }
        .perm-card-anim:nth-child(even) { transition-delay: 0.15s; }
        .perm-card-anim:nth-child(3)    { transition-delay: 0.22s; }
        .perm-card-anim:nth-child(4)    { transition-delay: 0.30s; }
        .perm-card-anim:nth-child(5)    { transition-delay: 0.38s; }
        .perm-card-anim:nth-child(6)    { transition-delay: 0.46s; }
        .perm-card-anim:nth-child(7)    { transition-delay: 0.54s; }
        .perm-card-anim:nth-child(8)    { transition-delay: 0.62s; }
        .perm-card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .perm-card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.10);
        }
        .perm-card-hover:hover .perm-icon {
          animation: floatIcon 1.2s ease-in-out infinite;
        }
        .perm-icon { display: inline-block; }
        .perm-section-title {
          animation: permFadeLeft 0.7s ease forwards;
        }
      `}</style>

      {/* Header */}
      <section className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-500">
          {policy.heading}
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          Effective Date:{" "}
          <span className="font-semibold text-gray-800">
            {policy.effectivedate}
          </span>
        </p>

        <div className="w-24 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
      </section>

      {/* Policy Sections */}
      <section className="max-w-4xl mx-auto space-y-8">
        {policy.sections.map((sec, index) => (
          <div
            key={index}
            className="bg-white border-l-4 border-yellow-500 rounded-lg p-6 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-2xl font-bold text-green-600 mb-3">
              {sec.title}
            </h2>

            <p className="text-gray-800 whitespace-pre-line leading-relaxed">
              {sec.content}
            </p>
          </div>
        ))}
      </section>

      {/* ─── PERMISSIONS & DATA TRANSPARENCY ─── */}
      <section ref={permRef} className="max-w-4xl mx-auto mt-16">
        {/* Section header */}
        <div className="perm-section-title text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full mb-4">
            Transparency First
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            🔐 Permissions &amp; Data Transparency
          </h2>
          <div className="w-20 h-1 bg-yellow-400 rounded-full mx-auto mb-4" />
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            At Digivahan, we request only the permissions that are necessary to deliver core features of the app. Every permission is used strictly for functionality, security, and improving user experience.
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            We do not collect unnecessary data, and user privacy remains our top priority.
          </p>
        </div>

        {/* Permission cards grid */}
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {permissions.map((perm, i) => (
            <div
              key={i}
              className={`perm-card-anim perm-card-hover bg-linear-to-br ${perm.color} border ${perm.border} rounded-2xl p-5 shadow-sm`}
            >
              <div className="flex items-start gap-4">
                <div className="perm-icon text-3xl leading-none mt-0.5">{perm.icon}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-gray-900 text-base">{perm.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${perm.badge}`}>
                      Required
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{perm.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy note banner */}
        <div className="perm-card-anim bg-linear-to-r from-gray-900 to-gray-800 rounded-2xl p-7 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-yellow-400/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🛡️</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Your Privacy Matters</h3>
          <p className="text-gray-300 text-sm leading-relaxed max-w-lg mx-auto">
            We only use permissions to improve your app experience. You can manage or revoke permissions anytime from your <strong className="text-yellow-400">device settings</strong>.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-16 border-t pt-6">
        <div className="flex items-center justify-center gap-2 text-gray-700">
          <BsBalloonHeartFill className="text-red-500 text-xl" />
          <p className="text-sm font-semibold text-center">
            Your trust matters — your data is our responsibility.
          </p>
        </div>
      </footer>
    </main>
  );
}
