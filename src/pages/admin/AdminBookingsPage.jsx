import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatDate, formatPrice, getStatusStyle } from "../../utils/helpers";
import AdminLayout from "../../components/layout/AdminLayout";
import { Search, ChevronDown } from "lucide-react";

export default function AdminBookingsPage() {
  const { bookings } = useSelector((s) => s.bookings);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filtered = bookings.filter((b) => {
    const matchSearch =
      !search ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.sessionTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.price, 0);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-boldtext-text-primary">Bookings</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {bookings.length} total bookings · Revenue:{" "}
            {formatPrice(totalRevenue)}
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Upcoming",
            value: bookings.filter((b) => b.status === "upcoming").length,
            color: "text-[#4F8A64] bg-emerald-50",
          },
          {
            label: "Completed",
            value: bookings.filter((b) => b.status === "completed").length,
            color: "text-text-secondary bg-[#F5F8F7]",
          },
          {
            label: "Cancelled",
            value: bookings.filter((b) => b.status === "cancelled").length,
            color: "text-[#C96A6A] bg-red-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-border p-4 text-center"
          >
            <div
              className={`text-2xl font-bold mb-0.5 ${s.color.split(" ")[0]}`}
            >
              {s.value}
            </div>
            <div className="text-xs text-text-secondary">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-xl border border-border px-3 py-2.5">
          <Search size={15} className="text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Booking ID or session..."
            className="flex-1 text-smtext-text-primary placeholder:text-muted outline-none bg-transparent"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-white border border-border rounded-xl px-4 py-2.5 pr-8 text-smtext-text-primary outline-none"
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F8F7] border-b border-border">
                {[
                  "Booking ID",
                  "Session",
                  "Date & Time",
                  "Mode",
                  "Amount",
                  "Status",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left text-xs font-semibold text-text-secondary px-5 py-3.5"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9E6]">
              {filtered.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-[#F9FAFA] transition-colors"
                >
                  <td className="px-5 py-4 text-xs font-mono text-primary font-semibold">
                    {booking.id}
                  </td>
                  <td className="px-5 py-4 text-smtext-text-primary max-w-[180px] truncate font-medium">
                    {booking.sessionTitle}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-smtext-text-primary">
                      {formatDate(booking.date)}
                    </div>
                    <div className="text-xs text-muted">{booking.time}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {booking.mode}
                  </td>
                  <td className="px-5 py-4 text-sm font-semiboldtext-text-primary">
                    {formatPrice(booking.price)}
                  </td>
                  <td className="px-5 py-4">
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
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted text-sm">
            No bookings found.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
