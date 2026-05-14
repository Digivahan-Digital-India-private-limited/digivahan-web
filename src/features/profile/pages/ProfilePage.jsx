import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProfileCard from "../components/ProfileCard";
import { getProfile } from "../services/profileApi";

const ProfilePage = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile,
  });

  if (isLoading || !profile) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ProfileCard profile={profile} />

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Account Actions</h3>
        <div className="mt-3 space-y-2">
          <Link to="/profile/emergency-contacts" className="block rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Manage Emergency Contacts
          </Link>
          <Link
            to="/profile/update"
            className="block rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Update Profile
          </Link>
          <Link to="/profile/change-password" className="block rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">
            Change Password
          </Link>
          <Link to="/document-vault" className="block rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">
            Document Vault
          </Link>
          <Link to="/chat" className="block rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">
            Support Chat
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
