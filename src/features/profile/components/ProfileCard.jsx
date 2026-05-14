import React from "react";

const ProfileCard = ({ profile }) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <img src={profile.avatar} alt={profile.name} className="h-16 w-16 rounded-full border border-slate-200 object-cover" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{profile.name}</h2>
          <p className="text-sm text-slate-500">{profile.phone}</p>
          <p className="text-sm text-slate-500">{profile.email}</p>
          {profile.occupation ? (
            <p className="text-sm text-slate-500">{profile.occupation}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
        Address: {profile.address}
      </div>
    </section>
  );
};

export default ProfileCard;
