import React, { useEffect, useState, useRef } from "react";

const images = [
  "https://images.unsplash.com/photo-1713623311317-d3c43a4be4cf?w=600",
  "https://images.unsplash.com/photo-1575987446487-56eba08666cf?w=600",
  "https://plus.unsplash.com/premium_photo-1715300001979-1841b9deb61d?w=600",
  "https://plus.unsplash.com/premium_photo-1678318784591-cb64d92e14cb?w=600",
];

function Popupnotification() {
  const [show, setShow] = useState(() => {
    return !localStorage.getItem("popupShown");
  });

  const [index, setIndex] = useState(0);
  const sliderRef = useRef(null);

  // infinite reset
  useEffect(() => {
    if (!show) return;

    localStorage.setItem("popupShown", "true");

    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 2500);

    if (index === images.length) {
      setTimeout(() => {
        sliderRef.current.style.transition = "none";
        setIndex(0);
      }, 500);
    } else {
      sliderRef.current.style.transition = "transform 0.5s ease-in-out";
    }
    return () => clearInterval(interval);
  }, [index, show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {/* Close */}
      <button
        onClick={() => setShow(false)}
        className="absolute z-10 lg:top-[22%] lg:right-[26%] md:top-[15%] top-[21%] right-2 text-xl font-bold text-white"
      >
        ✕
      </button>

      <div className="relative overflow-hidden lg:w-[45%] md:w-[90%] w-[97%]">
        {/* SLIDER */}
        <div
          ref={sliderRef}
          className="flex"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {[...images, images[0]].map((img, i) => (
            <img
              key={i}
              src={img}
              alt="vehicle"
              className="w-full shrink-0 h-60 md:h-80 object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Popupnotification;
