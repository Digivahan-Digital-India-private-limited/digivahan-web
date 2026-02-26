import { BsFileEarmarkCheck } from "react-icons/bs";

export default function TermsAndConditionsPage() {
  const terms = {
    heading: "Terms & Conditions – Digivahan Digital India Pvt. Ltd",
    effectivedate: "18/06/2025",
    sections: [
      {
        title: "1. Services Offered",
        content: `The Digivahan App allows users to:
• Verify vehicle details such as RC, Insurance, PUC, and Challans
• Upload vehicle-related documents for digital validation
• Generate and scan a unique QR code for vehicle identity
• Report or alert about lost, damaged, or found vehicles through QR
• Opt for physical delivery of QR stickers (paid service)`,
      },
      {
        title: "2. User Eligibility",
        content:
          "Our platform is available for all individuals. Users below 18 must use the app under parental or guardian supervision.",
      },
      {
        title: "3. Account Creation & Authentication",
        content:
          "Users must verify their mobile number via OTP. You are responsible for maintaining the confidentiality of your login credentials and all activities under your account.",
      },
      {
        title: "4. Payments",
        content: `• Some services like physical QR sticker delivery are paid.
• Payments are processed securely via Razorpay.
• Once processed, payments are non-refundable unless stated.
• For failures or errors, users may contact support.`,
      },
      {
        title: "5. Use of Third-party Services",
        content: `We rely on:
• Firebase – authentication, analytics, storage
• Razorpay – payments
• External APIs – vehicle data

These services use your data as per their privacy policies.`,
      },
      {
        title: "6. User Responsibilities",
        content: `• Provide accurate information.
• Fake documents or QR misuse is prohibited.
• Report only genuine incidents.`,
      },
      {
        title: "7. Data Storage and Retention",
        content: `• Data stored on device, AWS and Firebase.
• Retained until user deletes account.
• Users can request edit or deletion.`,
      },
      {
        title: "8. QR Sticker Delivery",
        content: `• Correct address required.
• Delivery time may vary.
• Not responsible for courier delays.`,
      },
      {
        title: "9. Intellectual Property",
        content:
          "All logos, content, and services belong to Digivahan Digital India Pvt. Ltd. Unauthorized use is prohibited.",
      },
      {
        title: "10. Limitation of Liability",
        content: `Digivahan is not liable for:
• Wrong user data
• QR misuse
• Third-party failures
• Any indirect losses`,
      },
      {
        title: "11. Termination of Services",
        content: `Accounts may be suspended for:
• Terms violation
• Fake data
• Platform misuse`,
      },
      {
        title: "12. Changes to Terms",
        content:
          "We may update these Terms anytime. Continued use means acceptance of changes.",
      },
      {
        title: "13. Governing Law",
        content:
          "These Terms are governed by Indian laws. Disputes fall under Indian courts.",
      },
      {
        title: "14. Contact Us",
        content: `For support:
📧 Email: info@digivahan.in`,
      },
    ],
  };

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4 md:px-8">
      {/* Header */}
      <section className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-500">
          {terms.heading}
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          Effective Date:{" "}
          <span className="font-semibold text-gray-800">
            {terms.effectivedate}
          </span>
        </p>

        <p className="mt-4 text-gray-700 text-base max-w-3xl mx-auto">
          Welcome to Digivahan Digital India Pvt. Ltd. These Terms govern your
          access and use of our application. By using the app, you agree to
          these Terms. If you disagree, please stop using the services.
        </p>

        <div className="w-24 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
      </section>

      {/* Sections */}
      <section className="max-w-4xl mx-auto space-y-8">
        {terms.sections.map((sec, index) => (
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
          <BsFileEarmarkCheck className="text-blue-600 text-xl" />
          <p className="text-sm font-semibold text-center">
            By continuing, you agree to follow all Terms & Conditions.
          </p>
        </div>
      </footer>
    </main>
  );
}
