import React from "react";
import ringimg from "../../assets/Right.png";
import conimg from "../../assets/Container.png";
import OfficeImg from "../../assets/Digivahan Building.png";
import About1Img from "../../assets/About us 3.webp";
import VisionImg from "../../assets/Vision.png";
import ProfileCard from "./ProfileCard";
import SandeepRathore from "../../assets/Sandeep_ji_profile_pic.webp";
import ParvezAnsari from "../../assets/Parvez Ansari.webp";

const Aboutpage = () => {
  return (
    <main className="w-full h-full">
      {/* ---- First Section ---- */}
      <section className="max-w-6xl mx-auto flex flex-col md:flex-row gap-2 md:gap-12 items-center p-3 md:px-6">
        {/* Left Part */}
        <div className="lg:w-1/2 md:w-1/2 flex flex-col gap-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            About Us
          </h2>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Digivahan Digital India Pvt. Ltd.
          </h3>
          <h4 className="text-base sm:text-lg font-semibold text-gray-700">
            Empowering India with Smart Vehicle Solutions
          </h4>

          <p className="text-gray-600 leading-relaxed sm:text-sm text-base">
            Digivahan is India’s trusted digital platform for all your
            vehicle-related services. From RC, insurance, and PUC status to
            challan checks and safety QR stickers — we bring everything to your
            fingertips. With a mission to make transportation smarter, safer,
            and more accessible, we are revolutionizing the way India moves.
          </p>

          <p className="text-gray-600 leading-relaxed sm:text-sm text-base">
            Established in 2023, Digivahan Digital India Pvt. Ltd. is a
            technology-driven company focused on transforming vehicle management
            and public safety through digital innovation. Our mission is to
            create a smart, mobile-first ecosystem where vehicle-related
            services are seamless, secure, and easily accessible for every
            Indian citizen.
          </p>

          <p className="text-gray-600 leading-relaxed sm:text-sm text-base">
            We specialize in offering QR-based vehicle identification and
            real-time verification services that not only assist vehicle owners
            but also empower the public to report lost or misplaced vehicles
            using our unique QR code system.
          </p>
        </div>

        {/* Right Part */}
        <div className="lg:w-1/2 md:w-1/3 w-full">
          <img
            src={About1Img}
            alt="Main Illustration"
            className="h-100 w-full h- object-cover"
          />
        </div>
      </section>

      {/* ---- Second Section ---- */}
      <section className="max-w-6xl mx-auto p-3 flex flex-col lg:flex-row gap-2 md:gap-4">
        {/* Left: Image */}
        <div className="lg:w-1/2 h-full space-y-6">
          {/* First – image RIGHT */}
          <ProfileCard
            align="right"
            name="Sandeep Rathor"
            role="CEO (Founder)"
            quote="Building vision, leading with purpose"
            image={SandeepRathore}
            points={[
              "Visionary Entrepreneur",
              "Business & Growth Strategist",
              "Founder-led Leadership",
            ]}
          />

          {/* Second – image LEFT */}
          <ProfileCard
            align="left"
            name="Rehan Ansari"
            role="Director"
            quote="Committed to vision, driven by excellence."
            image={ParvezAnsari}
            points={[
              "10+ Years Experience",
              "Startup & Product Specialist",
              "Business Leadership",
            ]}
          />
        </div>

        {/* Right: Text */}
        <div className="lg:w-1/2 md:w-[70%] flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            About Our Team
          </h2>
          <p className="text-gray-600 leading-relaxed sm:text-sm text-base">
            Our team is a group of dedicated and skilled professionals driven by
            a shared passion for innovation and excellence. Each member brings
            unique expertise and experience, working collaboratively to deliver
            reliable, high-quality solutions. We believe in transparency,
            teamwork, and continuous improvement, ensuring that every project is
            handled with precision, responsibility, and a commitment to
            long-term value. <br /> We work in a collaborative and transparent
            environment where ideas are encouraged, accountability is valued,
            and continuous learning is a priority. By combining strong technical
            knowledge with a deep understanding of client needs, we ensure that
            every solution we deliver is reliable, scalable, and aligned with
            long-term business goals.
          </p>
        </div>
      </section>

      {/* ---- Third Section ---- */}
      <section className="max-w-6xl mx-auto py-3 px-2 flex flex-col md:flex-row gap-8 md:gap-12 items-start">
        {/* Left: Vision + Mission */}
        <div className="md:w-2/3 flex flex-col gap-4">
          {/* Vision & Mission */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#f6f6f6] p-6 rounded-2xl">
              <h2 className="text-lg sm:text-xl font-bold text-black mb-2">
                🌍 Our Vision
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                To make every Indian vehicle digitally verifiable and connected
                — enabling a safer and more transparent transport ecosystem.
              </p>
            </div>

            <div className="bg-[#f6f6f6] p-6 rounded-2xl">
              <h2 className="text-lg sm:text-xl font-bold text-black mb-2">
                🚀 Our Mission
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                We simplify vehicle documentation, safety, and verification
                through an all-in-one digital platform offering trusted, secure,
                and real-time services to every citizen.
              </p>
            </div>
          </div>

          {/* Core Services & Target Audience */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Core Services */}
            <div className="border rounded-2xl p-6">
              <h2 className="text-lg sm:text-xl font-bold text-black mb-4">
                🛠️ Core Services
              </h2>
              <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                <li>✔ RC, Insurance, Challan & PUC Verification</li>
                <li>✔ QR-Based Digital Identity for Vehicles</li>
                <li>✔ Public Alert & Lost Vehicle Reporting</li>
                <li>✔ Secure Document Upload & Instant Validation</li>
              </ul>
            </div>

            {/* Target Audience */}
            <div className="border rounded-2xl p-6">
              <h2 className="text-lg sm:text-xl font-bold text-black mb-4">
                🎯 Target Audience
              </h2>
              <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                <li>👤 Private & Commercial Vehicle Owners</li>
                <li>🚨 Citizens reporting found or lost vehicles</li>
                <li>🏛️ Transport professionals & RTO partners</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Image */}
        <div className="md:w-1/3">
          <img
            src={VisionImg}
            alt="Illustration"
            className="sm:h-95 w-auto md:w-full object-contain"
          />
        </div>
      </section>

      {/* ---- Fourth Section ---- */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col md:flex-row gap-5 md:gap-12 items-center justify-between">
        {/* Left */}
        <div className="md:w-1/2 space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            What Makes Us Unique (USP)
          </h1>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            We offer a wide range of services designed to make your vehicle
            ownership experience smarter, safer, and more convenient. Among our
            many features, some stand out as true gems:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2 text-sm sm:text-base">
            <li>
              First-of-its-kind QR-based public alert system for vehicles.
            </li>
            <li>Mobile-first, secure and lightweight application.</li>
            <li>
              Real-time updates on vehicle document validity and compliance.
            </li>
          </ul>
        </div>

        {/* Right */}
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src={ringimg}
            alt="Ring Illustration"
            className="h-64 sm:h-90 w-auto object-contain"
          />
        </div>
      </div>

      {/* ---- Container Image Section ---- */}
      <div className="max-w-6xl mx-auto flex justify-center items-center p-2">
        <img
          src={conimg}
          alt="Container img"
          className="w-full md:h-full h-40 object-cover"
        />
      </div>

      {/* ---- Legal Section ---- */}
      <section className="max-w-6xl mx-auto p-3 flex flex-col md:flex-row gap-4 md:gap-5 items-center justify-between ">
        {/* Left */}
        <div className="md:w-1/2 space-y-2 text-sm sm:text-base">
          <h1 className="text-xl sm:text-2xl font-bold text-black">
            Legal Entity & Contact Info
          </h1>
          <p>Company Name: Digivahan Digital India Pvt Ltd</p>
          <p>Established: 2023</p>
          <p>CIN: U62099DL2023PTC420571</p>
          <p>
            Registered Address: Plot No, 2-A, Third Floor, Block-R, Uttam Nagar,
            New Delhi - 110059, India
          </p>
          <p>Email: info@digivahan.in</p>
        </div>

        {/* Right */}
        <div className="md:w-1/2 flex justify-center md:justify-end bg-amber-500">
          <img
            src={OfficeImg}
            alt="Desktop img"
            className="sm:h-72 w-full object-cover"
          />
        </div>
      </section>

      {/* ---- Final Banner ---- */}
      <div className=" max-w-6xl mx-auto md:h-100 bg-gray-100 overflow-hidden my-2 p-2">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d89879.39895896293!2d76.9286923357915!3d28.57726296237831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d050021878051%3A0xd9da7e82a08b4777!2sDIGIVAHAN!5e0!3m2!1sen!2sin!4v1768393071255!5m2!1sen!2sin%22"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </main>
  );
};

export default Aboutpage;
