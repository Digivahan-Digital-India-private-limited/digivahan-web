import React from "react";

const ProfileCard = ({ name, role, quote, points, image, align }) => {
  return (
    <div className="relative flex items-center justify-end w-full">
      {/* Profile Image (Overlapping) */}
      <div className={`absolute ${align === "right" ? "md:right-0 right-1" : "md:left-0 left-2"}`}>
        <div className="w-20 h-20 lg:w-44 lg:h-44 md:w-38 md:h-38 rounded-full border-[6px] border-green-500 bg-white overflow-hidden">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Card */}
      <div className="w-full bg-[#f6f6f6] md:rounded-full rounded-4xl md:px-18 lg:py-4 py-2 px-4">
        <div className={`${align === "right" ? "" : "md:pl-28 pl-20"}`}>
          <h2 className="text-xl font-bold text-gray-800">{name}</h2>
          <p className="text-sm font-semibold text-gray-600">{role}</p>

          {quote && <p className="italic md:block hidden text-gray-500">“{quote}”</p>}

          <ul className="list-disc ml-5 text-gray-600 text-[12px]">
            {points?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
