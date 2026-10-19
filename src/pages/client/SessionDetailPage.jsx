import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDate, formatPrice, getModeColor } from "../../utils/helpers";
import ClientLayout from "../../components/layout/ClientLayout";
import PageTransition from "../../components/ui/PageTransition";
import RevealSection from "../../components/ui/RevealSection";
import {
  Calendar,
  Clock,
  Monitor,
  MapPin,
  Users,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Share2,
} from "lucide-react";

export default function SessionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sessions, tags } = useSelector((s) => s.sessions);
  const [showModal, setShowModal] = useState(false);

  const session = sessions.find((s) => s.id === id);

  if (!session) {
    return (
      <ClientLayout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-semiboldtext-text-primary mb-2">
            Session not found
          </h2>
          <p className="text-text-secondary mb-6">
            This session may no longer be available.
          </p>
          <Link
            to="/sessions"
            className="px-5 py-2.5 rounded-fullbg-primary text-white text-sm font-medium"
          >
            Browse Sessions
          </Link>
        </div>
      </ClientLayout>
    );
  }

  const getTagLabel = (slug) => {
    const tag = tags.find((t) => t.id === slug || t.slug === slug);
    return tag ? tag.label : slug;
  };

  const getTagEmoji = (slug) => {
    const tag = tags.find((t) => t.id === slug);
    return tag?.emoji || "";
  };

  const spotsLeft = session.availableSeats;
  const spotsUrgent = spotsLeft <= 3;

  return (
    <ClientLayout>
      <PageTransition>
        {/* Back nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-6 group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to sessions
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: main content */}
            <div className="lg:col-span-2">
              {/* Cover image */}
              <div className="rounded-3xl overflow-hidden h-72 sm:h-96 mb-8 bg-[#EBF2F0] img-zoom animate-fade-up">
                <img
                  src={session.coverImage}
                  alt={session.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4 animate-fade-up delay-100">
                {session.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/sessions?tag=${tag}`}
                    className="tag-pill hover:bg-primary hover:text-white transition-colors"
                  >
                    {getTagEmoji(tag)} {getTagLabel(tag)}
                  </Link>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-boldtext-text-primary mb-6 leading-tight animate-fade-up delay-200">
                {session.title}
              </h1>

              {/* About */}
              <RevealSection className="mb-8">
                <h2 className="text-xl font-boldtext-text-primary mb-4">
                  About this session
                </h2>
                <div className="text-text-secondary leading-relaxed space-y-4">
                  {session.description.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </RevealSection>

              {/* What can this help with */}
              <RevealSection className="mb-8">
                <h2 className="text-xl font-boldtext-text-primary mb-4">
                  What can this session help with?
                </h2>
                <div className="flex flex-wrap gap-2">
                  {session.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EBF2F0] text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all cursor-default"
                    >
                      {getTagEmoji(tag)} {getTagLabel(tag)}
                    </span>
                  ))}
                </div>
              </RevealSection>

              {/* Who is this for */}
              <RevealSection className="mb-8">
                <h2 className="text-xl font-boldtext-text-primary mb-4">
                  Who is this for?
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {session.whoIsItFor}
                </p>
              </RevealSection>

              {/* What to expect */}
              <RevealSection className="mb-8">
                <h2 className="text-xl font-boldtext-text-primary mb-4">
                  What to expect
                </h2>
                <ul className="space-y-3">
                  {session.whatToExpect.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle
                        size={18}
                        className="text-primary shrink-0 mt-0.5"
                      />
                      <span className="text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </RevealSection>

              {/* Important note */}
              <div className="bg-[#FEF9F5] border border-[#F3D9CC] rounded-2xl p-5 flex gap-3">
                <AlertCircle
                  size={18}
                  className="text-[#E9A58A] shrink-0 mt-0.5"
                />
                <p className="text-sm text-[#7A5540]">
                  <strong>Important note:</strong> This platform is for
                  discovering and booking sessions. Sessions are not intended to
                  replace emergency or crisis support. If you are in immediate
                  distress, please contact a crisis helpline.
                </p>
              </div>
            </div>

            {/* Right: sticky booking card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-3xl border border-border shadow-sm p-6">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <span className="text-3xl font-boldtext-text-primary">
                        {formatPrice(session.price)}
                      </span>
                      <span className="text-sm text-muted ml-1">/ session</span>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getModeColor(session.mode)} bg-opacity-10`}
                    >
                      {session.mode}
                    </span>
                  </div>

                  {/* Session info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar size={15} className="text-muted" />
                      <span className="text-[#24332F]">
                        {formatDate(session.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock size={15} className="text-muted" />
                      <span className="text-[#24332F]">
                        {session.time} · {session.duration} min
                      </span>
                    </div>
                    {session.location && (
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin size={15} className="text-muted" />
                        <span className="text-[#24332F]">
                          {session.location}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <Users size={15} className="text-muted" />
                      <span
                        className={
                          spotsUrgent
                            ? "text-[#C96A6A] font-semibold"
                            : "text-[#24332F]"
                        }
                      >
                        {spotsLeft} spots available
                      </span>
                    </div>
                  </div>

                  {/* Availability bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-muted mb-1.5">
                      <span>Availability</span>
                      <span>
                        {Math.round(
                          (session.bookedSeats / session.totalSeats) * 100,
                        )}
                        % booked
                      </span>
                    </div>
                    <div className="h-1.5  bg-border rounded-full overflow-hidden">
                      <div
                        className="h-fullbg-primary rounded-full transition-all"
                        style={{
                          width: `${(session.bookedSeats / session.totalSeats) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <button
                    onClick={() => navigate(`/book/${session.id}`)}
                    className="w-full py-3.5 rounded-xlbg-primary text-white font-semibold text-sm hover:bg-[#356B5F] transition-colors mb-3"
                  >
                    Book This Session
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full py-3.5 rounded-xl border border-bordertext-text-primary font-medium text-sm hover:border-[#4F8A7A] hover:text-primary transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={15} />
                    Ask About This Session
                  </button>
                </div>

                {/* Share */}
                <button className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-muted hover:text-primary transition-colors py-2">
                  <Share2 size={13} />
                  Share this session
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>

      {/* Ask modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <MessageCircle size={36} className="text-primary mx-auto mb-4" />
              <h3 className="text-lg font-boldtext-text-primary mb-2">
                Ask About This Session
              </h3>
              <p className="text-text-secondary text-sm mb-6">
                This feature will be available shortly. For now, you can reach
                us at <strong>hello@bookmytherapy.com</strong>
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 rounded-xlbg-primary text-white font-medium"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
