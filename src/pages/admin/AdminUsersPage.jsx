import React, { useState } from "react";
import { MOCK_USERS } from "../../data/mockData";
import AdminLayout from "../../components/layout/AdminLayout";
import { Search, User } from "lucide-react";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_USERS.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-boldtext-text-primary">Users</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {MOCK_USERS.length} registered users
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white rounded-xl border border-border px-3 py-2.5 mb-6 max-w-md">
        <Search size={15} className="text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 text-smtext-text-primary placeholder:text-muted outline-none bg-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F8F7] border-b border-border">
                {["User", "Email", "Joined", "Bookings", "Status"].map(
                  (col) => (
                    <th
                      key={col}
                      className="text-left text-xs font-semibold text-text-secondary px-5 py-3.5"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9E6]">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-[#F9FAFA] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-fullbg-primary flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-semibold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-mediumtext-text-primary">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {user.email}
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {new Date(user.joinedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4 text-sm font-semiboldtext-text-primary">
                    {user.bookings}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        user.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted text-sm">
            No users found.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
