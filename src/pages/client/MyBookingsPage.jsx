import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDate, formatPrice, getStatusStyle } from "../../utils/helpers";
import ClientLayout from "../../components/layout/ClientLayout";
import { Calendar, Clock, Monitor, ArrowRight } from "lucide-react";

const TABS = ["Upcoming", "Completed", "Cancelled"];

export default function MyBookingsPage() {
  const { bookings } = useSelector((s) => s.bookings);
  const [activeTab, setActiveTab] = useState("Upcoming");

  const filtered = bookings.filter((b) => b.status === activeTab.toLowerCase());

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-boldtext-text-primary mb-1">
            My Bookings
          </h1>
          <p className="text-text-secondary">
            Manage and view your session bookings.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
                activeTab === tab
                  ? "border-[#4F8A7A] text-primary"
                  : "border-transparent text-text-secondary hover:text-[#24332F]"
              }`}
            >
              {tab}
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab
                    ? "bg-[#EBF2F0] text-primary"
                    : "bg-[#F5F8F7] text-muted"
                }`}
              >
                {bookings.filter((b) => b.status === tab.toLowerCase()).length}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-border overflow-hidden hover:border-[#4F8A7A] transition-colors"
              >
                <div className="flex items-start gap-4 p-5">
                  {/* Session image */}
                  <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-[#EBF2F0]">
                    <img
                      src={booking.sessionImage}
                      alt={booking.sessionTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semiboldtext-text-primary text-sm leading-snug">
                        {booking.sessionTitle}
                      </h3>
                      <span
                        className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusStyle(booking.status)}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                        <Calendar size={11} className="text-muted" />
                        {formatDate(booking.date)}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                        <Clock size={11} className="text-muted" />
                        {booking.time}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                        <Monitor size={11} className="text-muted" />
                        {booking.mode}
                      </span>
                    </div>
                  </div>

                  {/* Price + action */}
                  <div className="shrink-0 text-right">
                    <div className="font-boldtext-text-primary text-sm mb-2">
                      {formatPrice(booking.price)}
                    </div>
                    <Link
                      to={`/bookings/${booking.id}`}
                      className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      View Details <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-lg font-semiboldtext-text-primary mb-2">
              No {activeTab.toLowerCase()} bookings
            </h3>
            <p className="text-text-secondary text-sm mb-6">
              {activeTab === "Upcoming"
                ? "You don't have any upcoming sessions. Explore sessions and book one."
                : `No ${activeTab.toLowerCase()} bookings to show.`}
            </p>
            {activeTab === "Upcoming" && (
              <Link
                to="/sessions"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-fullbg-primary text-white text-sm font-medium"
              >
                Explore Sessions <ArrowRight size={14} />
              </Link>
            )}
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
