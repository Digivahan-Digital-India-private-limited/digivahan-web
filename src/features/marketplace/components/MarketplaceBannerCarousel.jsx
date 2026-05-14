import React, { useEffect, useState } from "react";

const MarketplaceBannerCarousel = ({ slides = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(timerId);
  }, [slides.length]);

  if (!slides.length) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="relative h-56 overflow-hidden rounded-2xl sm:h-72">
        {slides.map((slide, index) => (
          <article
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              activeIndex === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={activeIndex !== index}
          >
            <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-r from-slate-900/75 via-slate-900/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-200">
                {slide.badge}
              </p>
              <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">{slide.title}</h3>
              <p className="mt-1 max-w-xl text-sm text-white/90">{slide.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 px-1">
        <div className="flex gap-1.5">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index ? "w-8 bg-sky-600" : "w-2.5 bg-slate-300"
              }`}
              aria-label={`Show banner ${index + 1}`}
            />
          ))}
        </div>
        <p className="text-xs font-medium text-slate-500">
          {activeIndex + 1} / {slides.length}
        </p>
      </div>
    </section>
  );
};

export default MarketplaceBannerCarousel;
