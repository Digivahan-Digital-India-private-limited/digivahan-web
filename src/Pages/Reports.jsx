import React from "react";
import { useNavigate } from "react-router-dom";

const Reports = () => {
    const navigate = useNavigate()
  return (
    <main className="w-full min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-10">

        {/* PAGE HEADING */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Reports & Customer Support
        </h1>

        <p className="text-gray-600 mb-10">
          At Digivahan, we are committed to providing quick assistance and
          resolving your concerns efficiently. If you face any issue or have
          a query, please follow the steps below to raise a report.
        </p>

        {/* HOW TO RAISE QUERY */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How to Raise a Customer Query
          </h2>

          <ul className="space-y-4 text-gray-600">
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">1.</span>
              <span>
                Visit the <strong>Contact Us</strong> page from the Digivahan
                app or website.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">2.</span>
              <span>
                Select the issue category such as <em>App Issue</em>,
                <em> Vehicle QR</em>, <em>Emergency Contact</em>, or
                <em> Account Related</em>.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">3.</span>
              <span>
                Clearly describe your problem or query in the message box.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">4.</span>
              <span>
                Submit the form and our support team will review your request.
              </span>
            </li>
          </ul>
        </section>

        {/* RESPONSE INFO */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            What Happens After You Submit a Report?
          </h2>

          <p className="text-gray-600 mb-4">
            Once your query is submitted, our customer support team will
            analyze the issue and get back to you as soon as possible.
          </p>

          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>You may receive a response via email or in-app notification.</li>
            <li>Urgent issues are prioritized for faster resolution.</li>
            <li>You can track the status of your report from the app.</li>
          </ul>
        </section>

        {/* COMMON ISSUES */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Common Issues You Can Report
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
            <div className="bg-gray-100 rounded-lg p-5">
              🚗 Vehicle QR not working
            </div>
            <div className="bg-gray-100 rounded-lg p-5">
              📱 App login or performance issues
            </div>
            <div className="bg-gray-100 rounded-lg p-5">
              📞 Emergency contact update issues
            </div>
            <div className="bg-gray-100 rounded-lg p-5">
              🔐 Account or password related problems
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <p className="text-gray-600 mb-6">
            Need help right now? Our support team is just one click away.
          </p>

          <button onClick={()=> navigate("/contact-page")} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
            Go to Contact Us
          </button>
        </section>

      </div>
    </main>
  );
};

export default Reports;
