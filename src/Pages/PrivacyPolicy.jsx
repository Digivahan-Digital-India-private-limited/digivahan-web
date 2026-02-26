import { BsBalloonHeartFill } from "react-icons/bs";

export default function PrivacyPolicy() {
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
