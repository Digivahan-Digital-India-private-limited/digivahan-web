import React from "react";
import protectionIcon from "../../assets/247 protection ico.png";
import alertIcon from "../../assets/Instant Alert icon.svg";
import secureIcon from "../../assets/Secure System.png";

const cards = [
  {
    img: protectionIcon,
    title: "24/7 Protection",
    desc: "Ensure your vehicle’s safety with our advanced round-the-clock monitoring system, keeping it protected 24/7 no matter where you are.",
  },
  {
    img: alertIcon,
    title: "Instant Alerts",
    desc: "Real-time notifications delivered instantly for your vehicle’s safety, keeping you informed and in control at all times.",
  },
  {
    img: secureIcon,
    title: "Secure System",
    desc: "End-to-end encrypted chat system ensuring safe, private, and secure communication with the public.",
  },
];

const Categorypage = () => {
  return (
    <div
      className="max-w-7xl mx-auto px-4 py-10"
      aria-label="Digivahan Features"
    >
      {/* Desktop Cards */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl shadow-md bg-white text-center"
          >
            <img
              src={card.img}
              alt={`${card.title} - Digivahan Vehicle Safety Feature`}
              title={card.title}
              loading="lazy"
              className="h-16 mx-auto mb-4"
            />
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
              {card.title}
            </h3>
            <p className="text-gray-600 text-sm md:text-[14px] leading-tight">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile Slider */}
      <div className="md:hidden overflow-hidden w-full p-2">
        <div className="flex w-max animate-slide">
          {[...cards, ...cards].map((card, index) => (
            <div
              key={index}
              className="w-70 mx-3 p-4 rounded-2xl shadow-md bg-white text-center"
            >
              <img
                src={card.img}
                alt={`${card.title} - Digivahan Feature`}
                title={card.title}
                loading="lazy"
                className="h-16 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm leading-tight">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categorypage;
