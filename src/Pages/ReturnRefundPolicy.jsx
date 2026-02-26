import { BsShieldCheck } from "react-icons/bs";

export default function RefundCancellationPolicy() {
  const policy = {
    heading: "Refund & Cancellation Policy",
    effectivedate: "18/06/2025",
    sections: [
      {
        title: "1. Digital Services",
        content:
          "All our digital services such as challan check, RC verification, PUC check, insurance reminders, etc. are offered free of cost to users. However, if a user pays challan or purchases/renews insurance through Digivahan’s platform, the payment is processed via third-party services. Digivahan acts solely as a facilitator and does not provide the service directly. Therefore, no refund will be issued once the payment is successfully processed.",
      },
      {
        title: "2. Physical Products (QR Sticker Delivery)",
        content: `If a user places an order for a physical QR sticker to be delivered:
• The product can be cancelled only before dispatch from our warehouse
• Once dispatched, no refund or return will be entertained.
• Charges are for material & handling cost, non-refundable once processed`,
      },
      {
        title: "3. Subscriptions",
        content:
          "Currently, no subscription-based services are offered. All services are one-time and mostly free.",
      },
      {
        title: "4. Advance Payments",
        content: `All paid services require full advance payment. Refunds are only applicable in rare cases:
• Transaction failure or technical issue
• Wrong deduction from user account
• Cancellation before dispatch of physical products`,
      },
      {
        title: "5. Cancellation Window",
        content: `• Digital services: Once paid, not cancellable.
• Physical QR sticker: Can be cancelled only before dispatch.`,
      },
      {
        title: "6. Refund Processing",
        content: `• Approved refunds will be processed within 5–7 working days.
• Amount will be credited to the original payment method.`,
      },
      {
        title: "7. How to Cancel / Request Refund",
        content:
          "Users can raise cancellation or refund requests through the Digivahan app using the Support or Help section.",
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

      {/* Sections */}
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
          <BsShieldCheck className="text-blue-600 text-xl" />
          <p className="text-sm font-semibold text-center">
            Your trust matters — we aim for transparent refund processing.
          </p>
        </div>
      </footer>
    </main>
  );
}
