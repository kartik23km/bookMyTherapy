import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { showToast } from "../../store/slices/uiSlice";
import ClientLayout from "../../components/layout/ClientLayout";
import { Calendar, Mail, User, LogOut, Shield, Edit3 } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { bookings } = useSelector((s) => s.bookings);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showToast({ message: "Signed out successfully.", type: "info" }));
    navigate("/");
  };

  const stats = [
    { label: "Sessions Booked", value: bookings.length },
    {
      label: "Upcoming",
      value: bookings.filter((b) => b.status === "upcoming").length,
    },
    {
      label: "Completed",
      value: bookings.filter((b) => b.status === "completed").length,
    },
  ];

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-boldtext-text-primary mb-8">My Profile</h1>

        {/* Profile card */}
        <div className="bg-white rounded-3xl border border-border p-6 mb-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-fullbg-primary flex items-center justify-center shrink-0">
              <span className="text-white text-2xl font-bold">
                {user.name?.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-boldtext-text-primary">
                {user.name}
              </h2>
              <p className="text-sm text-text-secondary">{user.email}</p>
            </div>
            <button className="ml-auto p-2 rounded-xl border border-border text-text-secondary hover:border-[#4F8A7A] hover:text-primary transition-colors">
              <Edit3 size={16} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-3 rounded-2xl bg-[#F5F8F7]"
              >
                <div className="text-2xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-xs text-text-secondary mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Info rows */}
          <div className="space-y-3 divide-y divide-[#E4E9E6]">
            <div className="flex items-center gap-3 py-3">
              <Mail size={15} className="text-muted" />
              <span className="text-sm text-text-secondary">Email</span>
              <span className="text-sm font-mediumtext-text-primary ml-auto">
                {user.email}
              </span>
            </div>
            <div className="flex items-center gap-3 py-3">
              <Calendar size={15} className="text-muted" />
              <span className="text-sm text-text-secondary">Member since</span>
              <span className="text-sm font-mediumtext-text-primary ml-auto">
                {new Date(user.joinedAt).toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Account settings */}
        <div className="bg-white rounded-3xl border border-border divide-y divide-[#E4E9E6] mb-6">
          <div className="px-6 py-4">
            <h3 className="font-semiboldtext-text-primary text-sm">
              Account Settings
            </h3>
          </div>
          {[
            {
              label: "Notification preferences",
              desc: "Manage email and push notifications",
            },
            {
              label: "Privacy settings",
              desc: "Control your data and privacy",
            },
            { label: "Language & region", desc: "English (India)" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F5F8F7] transition-colors text-left"
            >
              <div>
                <div className="text-sm font-mediumtext-text-primary">
                  {item.label}
                </div>
                <div className="text-xs text-muted mt-0.5">{item.desc}</div>
              </div>
              <span className="text-muted">›</span>
            </button>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-border text-[#C96A6A] font-medium text-sm hover:bg-red-50 hover:border-[#C96A6A] transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </ClientLayout>
  );
}
