import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cancelBooking } from "../../store/slices/bookingsSlice";
import { showToast } from "../../store/slices/uiSlice";
import { formatDate, formatPrice, getStatusStyle } from "../../utils/helpers";
import ClientLayout from "../../components/layout/ClientLayout";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Monitor,
  Users,
  AlertTriangle,
} from "lucide-react";

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookings } = useSelector((s) => s.bookings);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <ClientLayout>
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <p className="text-text-secondary mb-6">Booking not found.</p>
          <Link
            to="/bookings"
            className="px-5 py-2.5 rounded-fullbg-primary text-white text-sm"
          >
            My Bookings
          </Link>
        </div>
      </ClientLayout>
    );
  }

  const handleCancel = () => {
    dispatch(cancelBooking(booking.id));
    dispatch(
      showToast({ message: "Booking cancelled successfully.", type: "info" }),
    );
    setShowCancelModal(false);
    navigate("/bookings");
  };

  const detailRows = [
    { label: "Booking ID", value: booking.id, mono: true },
    { label: "Session", value: booking.sessionTitle },
    { label: "Date", value: formatDate(booking.date) },
    { label: "Time", value: booking.time },
    { label: "Duration", value: `${booking.duration} minutes` },
    { label: "Mode", value: booking.mode },
    { label: "Seats", value: booking.seats },
    {
      label: "Amount Paid",
      value: formatPrice(booking.price),
      highlight: true,
    },
  ];

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <button
          onClick={() => navigate("/bookings")}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to bookings
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-boldtext-text-primary">
            Booking Details
          </h1>
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${getStatusStyle(booking.status)}`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>

        {/* Session image */}
        {booking.sessionImage && (
          <div className="rounded-2xl overflow-hidden h-48 mb-6 bg-[#EBF2F0]">
            <img
              src={booking.sessionImage}
              alt={booking.sessionTitle}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Details card */}
        <div className="bg-white rounded-2xl border border-border divide-y divide-[#E4E9E6] mb-6">
          {detailRows.map((row) => (
            <div
              key={row.label}
              className="flex justify-between items-center px-5 py-4"
            >
              <span className="text-sm text-text-secondary">{row.label}</span>
              <span
                className={`text-sm text-right max-w-[60%] ${
                  row.highlight
                    ? "font-bold text-primary text-base"
                    : row.mono
                      ? "font-mono font-semibold text-primary"
                      : "font-mediumtext-text-primary"
                }`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Booked at */}
        <p className="text-xs text-muted mb-8">
          Booked on{" "}
          {new Date(booking.bookedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to={`/sessions/${booking.sessionId}`}
            className="flex-1 py-3 rounded-xl border border-bordertext-text-primary font-medium text-sm text-center hover:border-[#4F8A7A] transition-colors"
          >
            View Session
          </Link>
          {booking.status === "upcoming" && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex-1 py-3 rounded-xl border border-[#C96A6A] text-[#C96A6A] font-medium text-sm hover:bg-red-50 transition-colors"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>

      {/* Cancel modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mx-auto mb-5">
              <AlertTriangle size={24} className="text-[#C96A6A]" />
            </div>
            <h3 className="text-lg font-boldtext-text-primary text-center mb-2">
              Cancel this booking?
            </h3>
            <p className="text-sm text-text-secondary text-center mb-6">
              This action cannot be undone. Your booking for{" "}
              <strong>{booking.sessionTitle}</strong> will be cancelled.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 rounded-xl border border-bordertext-text-primary font-medium text-sm"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-3 rounded-xl bg-error text-white font-semibold text-sm"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
