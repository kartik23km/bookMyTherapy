import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addBooking } from "../../store/slices/bookingsSlice";
import { showToast } from "../../store/slices/uiSlice";
import {
  formatDate,
  formatPrice,
  generateBookingId,
} from "../../utils/helpers";
import ClientLayout from "../../components/layout/ClientLayout";
import {
  Calendar,
  Clock,
  Monitor,
  Users,
  ArrowLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

const STEPS = ["Choose Date", "Choose Time", "Confirm Booking"];

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sessions, tags } = useSelector((s) => s.sessions);
  const { isAuthenticated } = useSelector((s) => s.auth);

  const session = sessions.find((s) => s.id === id);

  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [seats, setSeats] = useState(1);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!session) {
    return (
      <ClientLayout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h2 className="text-xl font-semiboldtext-text-primary mb-4">
            Session not found
          </h2>
          <button
            onClick={() => navigate("/sessions")}
            className="px-5 py-2.5 rounded-fullbg-primary text-white text-sm"
          >
            Browse Sessions
          </button>
        </div>
      </ClientLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <ClientLayout>
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-xl font-semiboldtext-text-primary mb-2">
            Sign in to book
          </h2>
          <p className="text-text-secondary mb-6">
            Please sign in to continue with your booking.
          </p>
          <button
            onClick={() =>
              navigate("/login", { state: { from: `/book/${id}` } })
            }
            className="px-6 py-3 rounded-fullbg-primary text-white font-medium"
          >
            Sign In
          </button>
        </div>
      </ClientLayout>
    );
  }

  const getTagLabel = (slug) => {
    const tag = tags.find((t) => t.id === slug);
    return tag ? tag.label : slug;
  };

  const availableDates = session.availableSlots || [];
  const availableTimes = selectedDate
    ? availableDates.find((d) => d.date === selectedDate)?.times || []
    : [];
  const bookedSlotsForDate =
    session.bookedSlots
      ?.filter((b) => b.date === selectedDate)
      .map((b) => b.time) || [];

  const handleConfirm = () => {
    setIsConfirming(true);
    const bookingId = generateBookingId();
    const booking = {
      id: bookingId,
      sessionId: session.id,
      sessionTitle: session.title,
      sessionImage: session.coverImage,
      date: selectedDate,
      time: selectedTime,
      duration: session.duration,
      mode: session.mode,
      price: session.price * seats,
      seats,
      status: "upcoming",
      bookedAt: new Date().toISOString(),
      tags: session.tags,
    };

    setTimeout(() => {
      dispatch(addBooking(booking));
      dispatch(
        showToast({ message: "Booking confirmed! 🎉", type: "success" }),
      );
      navigate("/booking-success", { state: { booking } });
    }, 1200);
  };

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Back */}
        <button
          onClick={() => navigate(`/sessions/${id}`)}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to session
        </button>

        <h1 className="text-2xl sm:text-3xl font-boldtext-text-primary mb-2">
          Book Your Session
        </h1>
        <p className="text-text-secondary mb-8">
          Completing booking for:{" "}
          <span className="font-mediumtext-text-primary">{session.title}</span>
        </p>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < step
                      ? "bg-[#4F8A64] text-white"
                      : i === step
                        ? "bg-primary text-white"
                        : " bg-border text-muted"
                  }`}
                >
                  {i < step ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${i === step ? "text-[#24332F]" : "text-muted"}`}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 rounded-full ${i < step ? "bg-[#4F8A64]" : " bg-border"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main step content */}
          <div className="lg:col-span-3">
            {/* Step 0: Choose date */}
            {step === 0 && (
              <div>
                <h2 className="text-xl font-boldtext-text-primary mb-6">
                  Choose your date
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {availableDates.map((slot) => (
                    <button
                      key={slot.date}
                      onClick={() => {
                        setSelectedDate(slot.date);
                        setSelectedTime(null);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedDate === slot.date
                          ? "border-[#4F8A7A] bg-[#EBF2F0]"
                          : "border-border bg-white hover:border-[#4F8A7A]"
                      }`}
                    >
                      <div className="font-semiboldtext-text-primary text-sm">
                        {formatDate(slot.date)}
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        {slot.times.length} time slots available
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  disabled={!selectedDate}
                  onClick={() => setStep(1)}
                  className="mt-8 w-full py-3.5 rounded-xlbg-primary text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#356B5F] transition-colors flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Step 1: Choose time */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-boldtext-text-primary mb-2">
                  Choose your time
                </h2>
                <p className="text-sm text-text-secondary mb-6">
                  {formatDate(selectedDate)}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableTimes.map((time) => {
                    const isBooked = bookedSlotsForDate.includes(time);
                    return (
                      <button
                        key={time}
                        onClick={() => !isBooked && setSelectedTime(time)}
                        disabled={isBooked}
                        className={`p-3.5 rounded-xl border text-sm font-medium transition-all ${
                          isBooked
                            ? "border-border bg-[#F5F8F7] text-[#C4D0CC] line-through cursor-not-allowed"
                            : selectedTime === time
                              ? "border-[#4F8A7A] bg-[#EBF2F0] text-primary"
                              : "border-border bg-whitetext-text-primary hover:border-[#4F8A7A]"
                        }`}
                      >
                        {time}
                        {isBooked && (
                          <div className="text-xs text-muted mt-0.5 no-underline">
                            Booked
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 py-3.5 rounded-xl border border-bordertext-text-primary font-medium hover:border-[#4F8A7A] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    disabled={!selectedTime}
                    onClick={() => setStep(2)}
                    className="flex-1 py-3.5 rounded-xlbg-primary text-white font-semibold disabled:opacity-40 hover:bg-[#356B5F] transition-colors flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-boldtext-text-primary mb-6">
                  Booking Summary
                </h2>
                <div className="bg-white rounded-2xl border border-border divide-y divide-[#E4E9E6]">
                  {[
                    { label: "Session", value: session.title },
                    { label: "Date", value: formatDate(selectedDate) },
                    { label: "Time", value: selectedTime },
                    { label: "Duration", value: `${session.duration} minutes` },
                    { label: "Mode", value: session.mode },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-start px-5 py-4"
                    >
                      <span className="text-sm text-text-secondary">
                        {row.label}
                      </span>
                      <span className="text-sm font-mediumtext-text-primary text-right max-w-[60%]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-5 py-4">
                    <span className="text-sm text-text-secondary">Seats</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSeats((s) => Math.max(1, s - 1))}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-sm font-boldtext-text-primary hover:border-[#4F8A7A]"
                      >
                        –
                      </button>
                      <span className="text-sm font-mediumtext-text-primary w-4 text-center">
                        {seats}
                      </span>
                      <button
                        onClick={() =>
                          setSeats((s) =>
                            Math.min(session.availableSeats, s + 1),
                          )
                        }
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-sm font-boldtext-text-primary hover:border-[#4F8A7A]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-5 py-4 bg-[#F5F8F7] rounded-b-2xl">
                    <span className="font-semiboldtext-text-primary">
                      Total
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(session.price * seats)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 rounded-xl border border-bordertext-text-primary font-medium hover:border-[#4F8A7A] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className="flex-1 py-3.5 rounded-xlbg-primary text-white font-semibold hover:bg-[#356B5F] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isConfirming ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Session summary card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="h-36 overflow-hidden">
                <img
                  src={session.coverImage}
                  alt={session.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semiboldtext-text-primary text-sm mb-3">
                  {session.title}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Calendar size={12} className="text-muted" />
                    <span>{formatDate(session.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Clock size={12} className="text-muted" />
                    <span>
                      {session.time} · {session.duration} min
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Monitor size={12} className="text-muted" />
                    <span>{session.mode}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="text-base font-boldtext-text-primary">
                    {formatPrice(session.price)}
                  </span>
                  <span className="text-xs text-muted ml-1">/ person</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
