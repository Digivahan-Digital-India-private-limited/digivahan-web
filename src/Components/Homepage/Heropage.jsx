import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png"

const Heropage = () => {
  return (
    <>
      {/* SEO Meta */}
      <Helmet>
        <title>Digivahan – Smart Vehicle Services in India</title>
        <meta
          name="description"
          content="Digivahan is India’s smart digital platform for RC, insurance, PUC, challan check, and vehicle safety QR services. Manage your vehicle easily with Digivahan."
        />
        <meta
          name="keywords"
          content="Digivahan, vehicle services India, RC check, PUC status, challan check, vehicle QR, smart vehicle app"
        />
        <meta
          property="og:title"
          content="Digivahan – Smart Vehicle Services"
        />
        <meta
          property="og:description"
          content="Manage your vehicle with Digivahan – RC, PUC, insurance, challan, and safety QR in one app."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <header className="w-full bg-white md:py-10 px-2 md:px-6">
        <main className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-5">
          {/* Left Content */}
          <section className="flex-1">
            <img src={Logo} alt=""  className="md:w-40 w-24 pt-2 object-cover"/>

            <h2 className="text-md sm:text-lg text-gray-700 mt-4">
              Empowering India with Smart Vehicle Solutions
            </h2>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-4">
              Digivahan is India’s trusted digital platform for all your
              vehicle-related services. From RC details, insurance status, PUC,
              challan checks to safety QR stickers — we bring everything to your
              fingertips.
            </p>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-3">
              Our mission is to make transportation smarter, safer, and more
              accessible by using modern digital technology.
            </p>

            <p className="text-md sm:text-lg text-gray-700 mt-4">
              Download Digivahan today and manage your vehicle the smart way.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
              <Link
                to="https://play.google.com/store/apps/details?id=com.digivahan"
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition"
                aria-label="Download Digivahan App from Play Store"
              >
                Download Digivahan App
              </Link>
            </div>
          </section>

          {/* Right Image – animated rings + orbiting dots */}
          <aside className="flex-1 flex justify-center">
            <div className="relative flex items-center justify-center" style={{ width: 420, height: 460 }}>

              {/* Outer ring (slow 18s) — carries yellow dot (left) + green dot (top-right) */}
              <div
                className="absolute inset-0 flex items-center justify-center animate-spin-cw-slow"
                style={{ pointerEvents: "none" }}
              >
                <div
                  className="absolute rounded-full border-2 border-dashed border-gray-300"
                  style={{ width: 370, height: 370, opacity: 0.6 }}
                />
                {/* yellow ball */}
                <div
                  className="absolute rounded-full shadow-md"
                  style={{
                    width: 20, height: 20,
                    background: "#F5C518",
                    left: "50%", top: "50%",
                    transform: "translate(calc(-50% - 185px), -50%)",
                  }}
                />
                {/* green ball top-right */}
                <div
                  className="absolute rounded-full shadow-md"
                  style={{
                    width: 16, height: 16,
                    background: "#34C759",
                    left: "50%", top: "50%",
                    transform: "translate(calc(-50% + 131px), calc(-50% - 131px))",
                  }}
                />
              </div>

              {/* Inner ring (faster 10s) — carries green ball (bottom-right) */}
              <div
                className="absolute inset-0 flex items-center justify-center animate-spin-cw"
                style={{ pointerEvents: "none" }}
              >
                <div
                  className="absolute rounded-full border-2 border-dashed border-gray-200"
                  style={{ width: 270, height: 270, opacity: 0.5 }}
                />
                {/* green ball bottom-right */}
                <div
                  className="absolute rounded-full shadow-md"
                  style={{
                    width: 14, height: 14,
                    background: "#30D158",
                    left: "50%", top: "50%",
                    transform: "translate(calc(-50% + 96px), calc(-50% + 96px))",
                  }}
                />
              </div>

              {/* QR card — stays stationary */}
              <div className="relative z-10">
                <img
                  src="/DigiVahan Updated QR.png"
                  alt="Scan Digivahan QR to access vehicle details"
                  className="w-52"
                  loading="lazy"
                />
              </div>
            </div>
          </aside>
        </main>
      </header>
    </>
  );
};

export default Heropage;
