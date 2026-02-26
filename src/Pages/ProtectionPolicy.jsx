import { BsShieldCheck } from "react-icons/bs";

export default function ProtectionPolicy() {
  const data = {
    heading: "Digivahan Digital India Pvt. Ltd – Data Protection Policy",
    effectivedate: "18/06/2025",
    appliesTo:
      "All employees, interns, freelancers, contractors, and associated vendors.",
    sections: [
      {
        title: "1. Purpose",
        content:
          "This Data Protection Policy outlines Digivahan’s commitment to safeguarding the personal and sensitive data of its users, clients, partners, and employees. It ensures that data is handled in a secure, ethical, and legally compliant manner.",
      },
      {
        title: "2. Scope",
        content: `This policy applies to all personal data collected, stored, processed, or shared by Digivahan, including but not limited to:
• Full Name, Mobile Number, Email Address
• Vehicle Number, RC, PUC, Insurance Documents
• PAN, Voter ID, Driving License
• GPS-based Location Data
• OTPs and Verification Logs
• Uploaded Media via Camera or Gallery
• Payment Data (processed via Razorpay)
• Firebase or other Analytics SDK data`,
      },
      {
        title: "3. Data Handling Guidelines",
        content:
          "Employees must access data strictly for business purposes using authorized systems and must never share, misuse, or export data improperly.",
      },
      {
        title: "4. Security Measures",
        content:
          "All user data is protected using encryption, access control, two-factor authentication, role-based permissions, and continuous monitoring.",
      },
    ],
  };

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4 md:px-8">
      {/* Header */}
      <section className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-500">
          {data.heading}
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          Effective Date:{" "}
          <span className="font-semibold text-gray-800">
            {data.effectivedate}
          </span>
        </p>

        <p className="mt-4 text-gray-700 text-base max-w-3xl mx-auto">
          <span className="font-semibold">Applies To:</span> {data.appliesTo}
        </p>

        <div className="w-24 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
      </section>

      {/* Sections */}
      <section className="max-w-4xl mx-auto space-y-8">
        {data.sections.map((sec, index) => (
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
          <BsShieldCheck className="text-blue-600 text-xl" />
          <p className="text-sm font-semibold text-center">
            We value your protection — your data is always secure with us.
          </p>
        </div>
      </footer>
    </main>
  );
}
