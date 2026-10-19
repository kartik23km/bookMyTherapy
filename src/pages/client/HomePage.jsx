import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setFilters } from "../../store/slices/sessionsSlice";
import {
  Search,
  ArrowRight,
  Sparkles,
  Shield,
  Heart,
  ChevronRight,
} from "lucide-react";
import SessionCard from "../../components/sessions/SessionCard";
import ClientLayout from "../../components/layout/ClientLayout";
import RevealSection from "../../components/ui/RevealSection";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const CONCERNS = [
  { id: "anxiety", label: "Anxiety", emoji: "🌿", slug: "anxiety" },
  { id: "depression", label: "Depression", emoji: "🌤", slug: "depression" },
  {
    id: "social-anxiety",
    label: "Social Anxiety",
    emoji: "🤝",
    slug: "social-anxiety",
  },
  { id: "stress", label: "Stress", emoji: "🍃", slug: "stress" },
  { id: "burnout", label: "Burnout", emoji: "🔋", slug: "burnout" },
  { id: "sleep", label: "Sleep Issues", emoji: "🌙", slug: "sleep" },
  {
    id: "relationships",
    label: "Relationships",
    emoji: "💛",
    slug: "relationships",
  },
  { id: "self-esteem", label: "Self Esteem", emoji: "✨", slug: "self-esteem" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Tell us what you're looking for",
    desc: "Choose a concern or search for a topic that resonates with what you're experiencing right now.",
    icon: Search,
  },
  {
    step: "02",
    title: "Explore sessions",
    desc: "Browse sessions curated around the areas you want support with, at times that work for you.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Book your session",
    desc: "Choose a convenient time, reserve your spot, and show up ready to explore.",
    icon: Heart,
  },
];

// ── concern grid with individual stagger ──────────────────────────
function ConcernGrid({ onConcernClick }) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto"
    >
      {CONCERNS.map((concern, i) => (
        <button
          key={concern.id}
          onClick={() => onConcernClick(concern.slug)}
          className={`concern-card group flex flex-col items-center gap-2 p-5 rounded-2xl border border-border bg-[#FAF9F6] cursor-pointer reveal ${isVisible ? "visible" : ""}`}
          style={{ transitionDelay: `${i * 0.06}s` }}
        >
          <span className="text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
            {concern.emoji}
          </span>
          <span className="text-sm font-semiboldtext-text-primary group-hover:text-primary transition-colors text-center">
            {concern.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ── staggered session cards ────────────────────────────────────────
function FeaturedSessions({ sessions }) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.05 });
  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {sessions.map((session, i) => (
        <div
          key={session.id}
          className={`reveal ${isVisible ? "visible" : ""}`}
          style={{ transitionDelay: `${i * 0.09}s` }}
        >
          <SessionCard session={session} />
        </div>
      ))}
    </div>
  );
}

// ── how it works steps ─────────────────────────────────────────────
function HowItWorksSteps() {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
    >
      {HOW_IT_WORKS.map((step, i) => (
        <div
          key={i}
          className={`flex flex-col items-center text-center reveal ${isVisible ? "visible" : ""}`}
          style={{ transitionDelay: `${i * 0.12}s` }}
        >
          <div className="relative mb-5">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#EBF2F0] group-hover:bg-primary transition-colors">
              <step.icon size={24} className="text-primary" />
            </div>
            <span className="absolute -top-2 -right-2 text-xs font-bold text-primary bg-white border-2 border-[#EBF2F0] rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
              {step.step}
            </span>
          </div>
          <h3 className="font-semiboldtext-text-primary text-lg mb-2">
            {step.title}
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── stat counter boxes ─────────────────────────────────────────────
function StatBoxes() {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.15 });
  const stats = [
    { num: "10+", label: "Sessions available" },
    { num: "150+", label: "People supported" },
    { num: "8+", label: "Concern areas covered" },
    { num: "4.9", label: "Average session rating" },
  ];
  return (
    <div ref={ref} className="grid grid-cols-2 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`bg-[#2E403B] rounded-2xl p-5 reveal ${isVisible ? "visible" : ""}`}
          style={{ transitionDelay: `${i * 0.1}s` }}
        >
          <div
            className={`text-3xl font-bold text-primary mb-1 stat-number ${isVisible ? "" : "opacity-0"}`}
            style={{ animationDelay: `${0.3 + i * 0.1}s` }}
          >
            {stat.num}
          </div>
          <div className="text-sm text-muted">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN HOME PAGE
// ══════════════════════════════════════════════════════════════════
export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sessions } = useSelector((s) => s.sessions);
  const [searchQuery, setSearchQuery] = useState("");

  const featuredSessions = sessions
    .filter((s) => s.featured && s.status === "active")
    .slice(0, 6);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(setFilters({ search: searchQuery.trim(), tags: [] }));
      navigate("/sessions");
    }
  };

  const handleConcernClick = (slug) => {
    dispatch(setFilters({ tags: [slug], search: "" }));
    navigate(`/sessions?tag=${slug}`);
  };

  return (
    <ClientLayout>
      {/* ════════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#FAF9F6] mesh-bg">
        {/* Animated blobs */}
        <div
          className="absolute -top-48 -right-48 w-[700px] h-[700px] hero-blobbg-primary/20"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] hero-blob bg-[#E9A58A]/15"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-[300px] h-[300px] hero-blobbg-primary/10"
          style={{ animationDelay: "-6s" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* ── Left copy ── */}
          <div>
            <div className="animate-fade-up delay-100 inline-flex items-center gap-2 bg-[#EBF2F0] text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-fullbg-primary animate-pulse-ring" />
              Sessions now available
            </div>

            <h1 className="animate-fade-up delay-200 text-4xl sm:text-5xl lg:text-6xl font-boldtext-text-primary leading-tight tracking-tight mb-6">
              Find a session that
              <br />
              <span className="text-gradient relative">
                meets you where
                {/* animated underline */}
                <span
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#4F8A7A] to-[#356B5F] animate-fade-up delay-700"
                  style={{
                    width: "100%",
                    animation: "drawUnderline 1s ease 0.9s both",
                  }}
                />
              </span>
              <br />
              you are.
            </h1>

            <p className="animate-fade-up delay-300 text-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
              Explore therapy and wellness sessions based on what you're going
              through, and find a session that feels right for you.
            </p>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="animate-fade-up delay-400 mb-4"
            >
              <div className="flex items-center gap-2 bg-white rounded-2xl border border-border shadow-sm p-2 max-w-lg hover:shadow-md hover:border-[#C8DDD8] transition-all duration-300">
                <Search size={18} className="text-muted ml-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for help with?"
                  className="flex-1 bg-transparenttext-text-primary placeholder:text-muted text-sm outline-none py-2 px-1"
                />
                <button
                  type="submit"
                  className="shrink-0 px-5 py-2.5bg-primary text-white text-sm font-semibold rounded-xl hover:bg-[#356B5F] active:scale-95 transition-all"
                >
                  Search
                </button>
              </div>
              <p className="text-xs text-muted mt-2 ml-2">
                Try: anxiety, stress, sleep, burnout…
              </p>
            </form>

            {/* Quick concern pills */}
            <div className="animate-fade-up delay-500 flex flex-wrap gap-2 mt-6">
              {CONCERNS.slice(0, 5).map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => handleConcernClick(c.slug)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border bg-white text-xs font-medium text-text-secondary hover:border-[#4F8A7A] hover:text-primary hover:bg-[#EBF2F0] hover:scale-105 transition-all duration-200"
                  style={{ animationDelay: `${0.55 + i * 0.06}s` }}
                >
                  <span>{c.emoji}</span> {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: floating card visual ── */}
          <div className="hidden lg:flex justify-center items-center animate-fade-right delay-400">
            <div className="relative">
              {/* Main card */}
              <div className="animate-float-slow bg-white rounded-3xl shadow-2xl shadow-[#4F8A7A]/10 border border-border p-6 w-80">
                <div className="rounded-2xl h-44 mb-4 overflow-hidden img-zoom">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"
                    alt="Peaceful nature"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-1.5 mb-3">
                  <span className="tag-pill">Anxiety</span>
                  <span className="tag-pill">Stress</span>
                </div>
                <h3 className="font-semiboldtext-text-primary text-sm mb-1">
                  Quieting the Overthinking Mind
                </h3>
                <p className="text-xs text-text-secondary mb-4">
                  Learn to recognise and interrupt overthinking patterns.
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-boldtext-text-primary">₹799</span>
                  <button className="px-3 py-1.5bg-primary text-white text-xs font-semibold rounded-full hover:bg-[#356B5F] transition-colors">
                    View Session →
                  </button>
                </div>
              </div>

              {/* Floating badge 1 */}
              <div className="badge-float-1 absolute -top-5 -right-5 bg-white rounded-xl shadow-lg border border-border px-3 py-2">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-primary" />
                  <span className="text-xs font-semiboldtext-text-primary">
                    Safe space
                  </span>
                </div>
              </div>

              {/* Floating badge 2 */}
              <div className="badge-float-2 absolute -bottom-5 -left-5bg-primary rounded-xl shadow-lg px-3 py-2">
                <span className="text-white text-xs font-semibold">
                  ✓ 12 spots left
                </span>
              </div>

              {/* Small orbiting dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div
                  className="w-3 h-3 rounded-full bg-[#E9A58A] opacity-60"
                  style={{ animation: "orbitSlow 8s linear infinite" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <div className="w-5 h-8 rounded-full border-2 border-[#4F8A7A] flex items-start justify-center pt-1.5">
            <div
              className="w-1 h-2 rounded-fullbg-primary animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CONCERNS
      ════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-boldtext-text-primary mb-3">
              What are you looking for support with?
            </h2>
            <p className="text-text-secondary text-base max-w-xl mx-auto">
              Click a concern below to find sessions designed around that
              experience.
            </p>
          </RevealSection>
          <ConcernGrid onConcernClick={handleConcernClick} />
        </div>
      </section>

      {/* ════════════════════════════════════
          FEATURED SESSIONS
      ════════════════════════════════════ */}
      <section className="section-padding bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-boldtext-text-primary mb-2">
                Sessions you might find helpful
              </h2>
              <p className="text-text-secondary">
                Curated sessions covering a range of experiences.
              </p>
            </div>
            <Link
              to="/sessions"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:underline group"
            >
              View all{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </RevealSection>

          <FeaturedSessions sessions={featuredSessions} />

          <RevealSection className="text-center mt-10">
            <Link
              to="/sessions"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#4F8A7A] text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all group"
            >
              Explore all sessions
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="section-padding bg-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#EBF2F0] -translate-y-1/2 translate-x-1/2 opacity-60" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#FEF3EC] translate-y-1/2 -translate-x-1/2 opacity-70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-boldtext-text-primary mb-3">
              How it works
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              Finding a session should be simple. Here's how bookMyTherapy
              works.
            </p>
          </RevealSection>
          <HowItWorksSteps />
        </div>
      </section>

      {/* ════════════════════════════════════
          TRUST SECTION
      ════════════════════════════════════ */}
      <section className="section-padding bg-[#24332F] relative overflow-hidden">
        {/* Subtle animated mesh */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div
            className="absolute top-1/4 right-1/4 w-64 h-64 rounded-fullbg-primary animate-blob"
            style={{ filter: "blur(80px)" }}
          />
          <div
            className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-[#E9A58A] animate-blob"
            style={{ filter: "blur(60px)", animationDelay: "-4s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <RevealSection direction="left">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
                Finding support shouldn't feel overwhelming.
              </h2>
              <p className="text-muted text-base leading-relaxed mb-6">
                bookMyTherapy brings relevant sessions into one simple place so
                you can explore your options at your own pace — without
                pressure, without complexity.
              </p>
              <p className="text-text-secondary text-sm">
                We believe everyone deserves access to quality mental wellness
                support. Our sessions are designed to be approachable,
                practical, and genuinely helpful.
              </p>
            </RevealSection>
            <RevealSection direction="right">
              <StatBoxes />
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════ */}
      <section className="section-padding relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#EBF2F0] via-[#F5EFE9] to-[#EBF2F0]" />
        <div className="absolute inset-0 mesh-bg" />

        <RevealSection
          direction="scale"
          className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center"
        >
          <div className="w-14 h-14 rounded-2xlbg-primary/10 flex items-center justify-center mx-auto mb-6 animate-float">
            <Heart size={24} className="text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-boldtext-text-primary mb-4">
            Ready to find your session?
          </h2>
          <p className="text-text-secondary mb-8">
            Take the first step at your own pace. There's no pressure — just
            sessions built to support you.
          </p>
          <Link
            to="/sessions"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-fullbg-primary text-white font-semibold text-base hover:bg-[#356B5F] transition-all shadow-xl shadow-[#4F8A7A]/25 hover:shadow-[#4F8A7A]/40 hover:-translate-y-1 group"
          >
            Explore Sessions
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </RevealSection>
      </section>
    </ClientLayout>
  );
}
