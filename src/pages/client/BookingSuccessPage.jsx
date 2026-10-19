import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDate, formatPrice } from "../../utils/helpers";
import ClientLayout from "../../components/layout/ClientLayout";
import PageTransition from "../../components/ui/PageTransition";
import {
  CheckCircle,
  Calendar,
  Clock,
  Monitor,
  ArrowRight,
} from "lucide-react";

export default function BookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lastBooking } = useSelector((s) => s.bookings);

  const booking = location.state?.booking || lastBooking;

  if (!booking) {
    return (
      <ClientLayout>
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <p className="text-text-secondary mb-6">No booking found.</p>
          <Link
            to="/sessions"
            className="px-5 py-2.5 rounded-fullbg-primary text-white text-sm"
          >
            Explore Sessions
          </Link>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <PageTransition>
        <div className="max-w-lg mx-auto px-4 py-16 sm:py-24">
          {/* Success icon */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-[#EBF2F0] flex items-center justify-center mb-6 animate-scale-in">
              <CheckCircle size={40} className="text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-boldtext-text-primary mb-3 animate-fade-up delay-100">
              You're booked.
            </h1>
            <p className="text-text-secondary animate-fade-up delay-200">
              Your session has been successfully reserved. We look forward to
              seeing you there.
            </p>
          </div>

          {/* Booking card */}
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden mb-8 animate-fade-up delay-300">
            {/* Header */}
            <div className="bg-[#EBF2F0] px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-secondary mb-0.5">
                    Booking ID
                  </p>
                  <p className="font-mono font-bold text-primary text-sm">
                    {booking.id}
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-fullbg-primary text-white">
                  Confirmed
                </span>
              </div>
            </div>

            {/* Session image */}
            {booking.sessionImage && (
              <div className="h-36 overflow-hidden">
                <img
                  src={booking.sessionImage}
                  alt={booking.sessionTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Details */}
            <div className="px-6 py-5 space-y-4">
              <h3 className="font-semiboldtext-text-primary text-base">
                {booking.sessionTitle}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={15} className="text-muted" />
                  <span className="text-[#24332F]">
                    {formatDate(booking.date)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={15} className="text-muted" />
                  <span className="text-[#24332F]">
                    {booking.time} · {booking.duration} min
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Monitor size={15} className="text-muted" />
                  <span className="text-[#24332F]">{booking.mode}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-sm text-text-secondary">Amount paid</span>
                <span className="font-boldtext-text-primary text-lg">
                  {formatPrice(booking.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 animate-fade-up delay-400">
            <Link
              to={`/bookings`}
              className="flex-1 py-3.5 rounded-xl border border-[#4F8A7A] text-primary font-semibold text-sm text-center hover:bg-[#EBF2F0] transition-all hover:scale-[1.01]"
            >
              View My Bookings
            </Link>
            <Link
              to="/sessions"
              className="flex-1 py-3.5 rounded-xlbg-primary text-white font-semibold text-sm text-center hover:bg-[#356B5F] transition-all hover:scale-[1.01] flex items-center justify-center gap-2 group"
            >
              Explore More Sessions{" "}
              <ArrowRight
                size={15}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </PageTransition>
    </ClientLayout>
  );
}
