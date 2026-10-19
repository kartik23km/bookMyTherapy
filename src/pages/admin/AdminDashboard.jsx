import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ADMIN_STATS,
  POPULAR_CONCERNS,
  MOCK_BOOKINGS,
} from "../../data/mockData";
import { formatDate, formatPrice, getStatusStyle } from "../../utils/helpers";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  CalendarDays,
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";

const STAT_CARDS = [
  {
    label: "Total Sessions",
    value: ADMIN_STATS.totalSessions,
    icon: CalendarDays,
    color: "text-primary",
    bg: "bg-[#EBF2F0]",
  },
  {
    label: "Active Sessions",
    value: ADMIN_STATS.activeSessions,
    icon: TrendingUp,
    color: "text-[#4F8A64]",
    bg: "bg-emerald-50",
  },
  {
    label: "Total Bookings",
    value: ADMIN_STATS.totalBookings,
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Upcoming Sessions",
    value: ADMIN_STATS.upcomingSessions,
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Registered Users",
    value: ADMIN_STATS.registeredUsers,
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "Consultation Requests",
    value: ADMIN_STATS.consultationRequests,
    icon: CalendarDays,
    color: "text-[#E9A58A]",
    bg: "bg-orange-50",
  },
];

export default function AdminDashboard() {
  const { sessions } = useSelector((s) => s.sessions);
  const { bookings } = useSelector((s) => s.bookings);

  const upcomingSessions = sessions
    .filter((s) => s.status === "active")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt))
    .slice(0, 5);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-boldtext-text-primary">Dashboard</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            Welcome back! Here's what's happening.
          </p>
        </div>
        <Link
          to="/admin/sessions/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xlbg-primary text-white text-sm font-semibold hover:bg-[#356B5F] transition-colors"
        >
          <Plus size={16} />
          New Session
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {STAT_CARDS.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-border p-5"
          >
            <div
              className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}
            >
              <stat.icon size={18} className={stat.color} />
            </div>
            <div className="text-2xl font-boldtext-text-primary mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming sessions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-semiboldtext-text-primary">
              Upcoming Sessions
            </h2>
            <Link
              to="/admin/sessions"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-[#E4E9E6]">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-[#EBF2F0]">
                  <img
                    src={session.coverImage}
                    alt={session.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mediumtext-text-primary truncate">
                    {session.title}
                  </p>
                  <p className="text-xs text-muted">
                    {formatDate(session.date)} · {session.time}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semiboldtext-text-primary">
                    {formatPrice(session.price)}
                  </p>
                  <p className="text-xs text-muted">
                    {session.availableSeats} left
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular concerns */}
        <div className="bg-white rounded-2xl border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semiboldtext-text-primary">Popular Concerns</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            {POPULAR_CONCERNS.map((concern, i) => {
              const maxBookings = POPULAR_CONCERNS[0].bookings;
              return (
                <div key={concern.tag}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-mediumtext-text-primary">
                      {concern.label}
                    </span>
                    <span className="text-muted">{concern.bookings}</span>
                  </div>
                  <div className="h-1.5  bg-border rounded-full overflow-hidden">
                    <div
                      className="h-fullbg-primary rounded-full"
                      style={{
                        width: `${(concern.bookings / maxBookings) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="mt-6 bg-white rounded-2xl border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semiboldtext-text-primary">Recent Bookings</h2>
          <Link
            to="/admin/bookings"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={11} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F8F7]">
                {[
                  "Booking ID",
                  "Session",
                  "Date",
                  "Mode",
                  "Amount",
                  "Status",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left text-xs font-semibold text-text-secondary px-6 py-3"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9E6]">
              {recentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-[#F5F8F7] transition-colors"
                >
                  <td className="px-6 py-3.5 text-xs font-mono text-primary">
                    {booking.id}
                  </td>
                  <td className="px-6 py-3.5 text-smtext-text-primary max-w-[200px] truncate">
                    {booking.sessionTitle}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-text-secondary">
                    {formatDate(booking.date)}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-text-secondary">
                    {booking.mode}
                  </td>
                  <td className="px-6 py-3.5 text-sm font-semiboldtext-text-primary">
                    {formatPrice(booking.price)}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusStyle(booking.status)}`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
