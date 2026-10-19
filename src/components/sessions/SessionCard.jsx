import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { formatDate, formatPrice, getModeColor } from "../../utils/helpers";

export default function SessionCard({ session }) {
  const { tags: allTags } = useSelector((s) => s.sessions);
  const navigate = useNavigate();

  const getTagLabel = (slug) => {
    const tag = allTags.find((t) => t.id === slug || t.slug === slug);
    return tag ? tag.label : slug;
  };

  const spotsLeft = session.availableSeats;
  const spotsUrgent = spotsLeft <= 3;
  const spotsText =
    spotsLeft <= 3
      ? `Only ${spotsLeft} spots left!`
      : `${spotsLeft} spots left`;
  const fillPercent = Math.round(
    (session.bookedSeats / session.totalSeats) * 100,
  );

  return (
    <article
      className="card-hover bg-white rounded-2xl border border-border overflow-hidden cursor-pointer group relative"
      onClick={() => navigate(`/sessions/${session.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === "Enter" && navigate(`/sessions/${session.id}`)
      }
      aria-label={`View session: ${session.title}`}
    >
      {/* ── Cover image ── */}
      <div className="relative overflow-hidden h-48 bg-[#EBF2F0] img-zoom">
        <img
          src={session.coverImage}
          alt={session.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Mode badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm bg-white/90 shadow-sm ${getModeColor(session.mode)}`}
        >
          {session.mode}
        </span>

        {/* Spots badge */}
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm transition-all ${
            spotsUrgent
              ? "bg-error text-white animate-pulse-ring"
              : "bg-white/90 text-text-secondary"
          }`}
        >
          {spotsText}
        </span>

        {/* Hover CTA overlay */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-primary text-xs font-bold shadow-lg">
            View Session <ArrowRight size={12} />
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {session.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="tag-pill"
              onClick={(e) => e.stopPropagation()}
            >
              {getTagLabel(tag)}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-semiboldtext-text-primary text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {session.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4">
          {session.shortDescription}
        </p>

        {/* Meta row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Calendar size={12} className="text-muted shrink-0" />
            <span>{formatDate(session.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Clock size={12} className="text-muted shrink-0" />
            <span>
              {session.time} · {session.duration} min
            </span>
          </div>
        </div>

        {/* Mini availability bar */}
        <div className="mb-4">
          <div className="h-1  bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full avail-bar"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-boldtext-text-primary">
              {formatPrice(session.price)}
            </span>
            <span className="text-xs text-muted ml-1">/ session</span>
          </div>
          <Link
            to={`/sessions/${session.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EBF2F0] text-primary text-xs font-semibold hover:bg-primary hover:text-white active:scale-95 transition-all duration-200 group/btn"
          >
            View Session
            <ArrowRight
              size={11}
              className="group-hover/btn:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
