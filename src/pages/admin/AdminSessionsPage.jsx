import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deactivateSession } from "../../store/slices/sessionsSlice";
import { showToast } from "../../store/slices/uiSlice";
import { formatDate, formatPrice, getStatusStyle } from "../../utils/helpers";
import AdminLayout from "../../components/layout/AdminLayout";
import { Plus, Search, Edit, Eye, PowerOff, ChevronDown } from "lucide-react";

export default function AdminSessionsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sessions, tags } = useSelector((s) => s.sessions);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const getTagLabel = (slug) => {
    const tag = tags.find((t) => t.id === slug);
    return tag?.label || slug;
  };

  const filtered = sessions.filter((s) => {
    const matchSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) =>
        getTagLabel(t).toLowerCase().includes(search.toLowerCase()),
      );
    const matchStatus = !filterStatus || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDeactivate = (id, title) => {
    dispatch(deactivateSession(id));
    dispatch(
      showToast({ message: `"${title}" has been deactivated.`, type: "info" }),
    );
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-boldtext-text-primary">Sessions</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {sessions.length} total sessions
          </p>
        </div>
        <Link
          to="/admin/sessions/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xlbg-primary text-white text-sm font-semibold hover:bg-[#356B5F] transition-colors"
        >
          <Plus size={16} />
          Create Session
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-xl border border-border px-3 py-2.5">
          <Search size={15} className="text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sessions..."
            className="flex-1 text-smtext-text-primary placeholder:text-muted outline-none bg-transparent"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-white border border-border rounded-xl px-4 py-2.5 pr-8 text-smtext-text-primary outline-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
                  "Session",
                  "Date",
                  "Mode",
                  "Price",
                  "Seats",
                  "Status",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className={`text-left text-xs font-semibold text-text-secondary px-5 py-3.5 ${col === "Actions" ? "text-right" : ""}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9E6]">
              {filtered.map((session) => (
                <tr
                  key={session.id}
                  className="hover:bg-[#F9FAFA] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-[#EBF2F0]">
                        <img
                          src={session.coverImage}
                          alt={session.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-mediumtext-text-primary max-w-[200px] truncate">
                          {session.title}
                        </p>
                        <div className="flex gap-1 mt-0.5">
                          {session.tags.slice(0, 2).map((t) => (
                            <span key={t} className="text-xs text-muted">
                              {getTagLabel(t)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {formatDate(session.date)}
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {session.mode}
                  </td>
                  <td className="px-5 py-4 text-sm font-semiboldtext-text-primary">
                    {formatPrice(session.price)}
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {session.bookedSeats}/{session.totalSeats}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusStyle(session.status)}`}
                    >
                      {session.status.charAt(0).toUpperCase() +
                        session.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/sessions/${session.id}`}
                        className="p-1.5 rounded-lg text-text-secondary hover:bg-[#F5F8F7] hover:text-primary transition-colors"
                        title="View"
                      >
                        <Eye size={15} />
                      </Link>
                      <Link
                        to={`/admin/sessions/${session.id}/edit`}
                        className="p-1.5 rounded-lg text-text-secondary hover:bg-[#F5F8F7] hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit size={15} />
                      </Link>
                      {session.status === "active" && (
                        <button
                          onClick={() =>
                            handleDeactivate(session.id, session.title)
                          }
                          className="p-1.5 rounded-lg text-text-secondary hover:bg-red-50 hover:text-[#C96A6A] transition-colors"
                          title="Deactivate"
                        >
                          <PowerOff size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted">
            <p className="text-sm">No sessions found.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
