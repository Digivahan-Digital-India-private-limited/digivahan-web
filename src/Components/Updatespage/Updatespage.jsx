import React from "react";
import GuideImg1 from "../../assets/guide image 1.jpg";
import GuideImg2 from "../../assets/guide image 2.png";
import GuideImg3 from "../../assets/guide image 3.png";

const images = [GuideImg1, GuideImg2, GuideImg3];

function Updatespage() {
  return (
    <main className="w-full h-full py-2">
      <section className="max-w-6xl mx-auto px-2">
        <div className="slider-wrapper">
          <div className="slider-track">
            {[...images, ...images].map((img, index) => (
              <img key={index} src={img} alt="News" className="slider-image" />
            ))}
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
          Growing Demand for Electric Vehicles (EVs)
        </h1>

        {/* Article Content */}
        <div className="w-full mt-6 md:mt-8 space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed text-gray-700 text-left">
          <p>
            The demand for Electric Vehicles (EVs) is increasing rapidly in the
            Indian automobile market. Rising fuel prices, government subsidies,
            and improved charging infrastructure are encouraging people to shift
            from petrol and diesel vehicles to electric options.
          </p>
          <p>Automobile companies are launching new EV models that offer:</p>
          <ul className="list-disc">
            <li>Better driving range</li>
            <li>Lower maintenance costs</li>
            <li>Environment-friendly performance</li>
          </ul>
          <p>
            Electric two-wheelers are currently the most popular, especially for
            daily commuting. At the same time, electric cars are also gaining
            acceptance among urban users.
          </p>
          <p>
            Experts believe that in the next few years, electric vehicles will
            become a common sight on Indian roads.
          </p>
          <ul className="list-disc">
            <li>High fuel costs, especially during long-distance travel</li>
            <li>Traffic congestion causing delays and stress</li>
            <li>Vehicle breakdowns due to mechanical or electrical issues</li>
            <li>Lack of proper parking space in crowded areas</li>
            <li>Poor road conditions leading to uncomfortable rides</li>
            <li>Unexpected maintenance or repair expenses</li>
            <li>Driver fatigue during long journeys</li>
            <li>Navigation issues in unfamiliar locations</li>
            <li>Weather-related problems such as rain, fog, or extreme heat</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default Updatespage;
