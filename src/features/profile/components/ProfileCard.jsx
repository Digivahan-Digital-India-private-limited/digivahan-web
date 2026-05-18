import React from "react";

const ProfileCard = ({ profile }) => {
  const getInitials = (name) => {
    const parts = (name || "").trim().split(/\s+/);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(profile?.name);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        {profile?.avatar ? (
          <img src={profile.avatar} alt={profile.name} className="h-16 w-16 rounded-full border border-slate-200 object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xl font-bold text-white shadow-sm border border-emerald-400/20">
            {initials}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{profile?.name}</h2>
          <p className="text-sm text-slate-500">{profile?.phone}</p>
          <p className="text-sm text-slate-500">{profile?.email}</p>
          {profile?.occupation ? (
            <p className="text-sm text-slate-500">{profile.occupation}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
        Address: {profile?.address || "N/A"}
      </div>
    </section>
  );
};

export default ProfileCard;
