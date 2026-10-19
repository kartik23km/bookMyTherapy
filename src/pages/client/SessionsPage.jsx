import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { setFilters, clearFilters } from "../../store/slices/sessionsSlice";
import { filterSessions } from "../../utils/helpers";
import SessionCard from "../../components/sessions/SessionCard";
import SkeletonGrid from "../../components/ui/SkeletonCard";
import PageTransition from "../../components/ui/PageTransition";
import ClientLayout from "../../components/layout/ClientLayout";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const MODES = ["Online", "In-Person", "Hybrid"];
const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "date", label: "Date" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

// Staggered grid — each card reveals when the container enters viewport
function StaggeredGrid({ sessions }) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.03 });
  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {sessions.map((session, i) => (
        <div
          key={session.id}
          className={`reveal ${isVisible ? "visible" : ""}`}
          style={{ transitionDelay: `${Math.min(i * 0.07, 0.5)}s` }}
        >
          <SessionCard session={session} />
        </div>
      ))}
    </div>
  );
}

export default function SessionsPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { sessions, tags, filters } = useSelector((s) => s.sessions);
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate lazy-loading / data fetch delay
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  // Initialize from URL query param
  useEffect(() => {
    const tag = searchParams.get("tag");
    if (tag) dispatch(setFilters({ tags: [tag], search: "" }));
  }, [searchParams, dispatch]);

  const filtered = filterSessions(
    sessions.filter((s) => s.status === "active"),
    filters,
    tags,
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: localSearch }));
  };

  const toggleTagFilter = (tagId) => {
    const current = filters.tags || [];
    const next = current.includes(tagId)
      ? current.filter((t) => t !== tagId)
      : [...current, tagId];
    dispatch(setFilters({ tags: next }));
  };

  const handleModeFilter = (mode) => {
    dispatch(setFilters({ mode: filters.mode === mode ? "" : mode }));
  };

  const activeFilterCount =
    (filters.tags?.length || 0) +
    (filters.mode ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <ClientLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* ── Header ── */}
          <div className="mb-8 animate-fade-up">
            <h1 className="text-3xl sm:text-4xl font-boldtext-text-primary mb-2">
              Explore Sessions
            </h1>
            <p className="text-text-secondary">
              Find sessions based on what you're experiencing.{" "}
              {!isLoading && (
                <span className="font-semibold text-primary animate-scale-in">
                  {filtered.length} sessions available.
                </span>
              )}
            </p>
          </div>

          {/* ── Search + Filter bar ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-up delay-100">
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 flex items-center gap-2 bg-white rounded-xl border border-border px-4 py-2.5 hover:border-[#C8DDD8] hover:shadow-sm transition-all"
            >
              <Search size={16} className="text-muted" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search by topic, keyword..."
                className="flex-1 bg-transparent text-smtext-text-primary placeholder:text-muted outline-none"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch("");
                    dispatch(setFilters({ search: "" }));
                  }}
                  className="p-0.5 rounded hover:bg-[#F5F8F7] transition-colors"
                >
                  <X size={13} className="text-muted" />
                </button>
              )}
            </form>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all hover:scale-[1.01] ${
                showFilters || activeFilterCount > 0
                  ? "border-[#4F8A7A] bg-[#EBF2F0] text-primary"
                  : "border-border bg-white text-text-secondary hover:border-[#4F8A7A]"
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-fullbg-primary text-white text-xs flex items-center justify-center animate-scale-in">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  dispatch(setFilters({ sortBy: e.target.value }))
                }
                className="appearance-none bg-white border border-border rounded-xl px-4 py-2.5 pr-8 text-smtext-text-primary outline-none cursor-pointer hover:border-[#4F8A7A] transition-all"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
            </div>
          </div>

          {/* ── Filter panel ── */}
          {showFilters && (
            <div className="bg-white rounded-2xl border border-border p-6 mb-6 animate-scale-in">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semiboldtext-text-primary">Filters</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      dispatch(clearFilters());
                      setLocalSearch("");
                    }}
                    className="text-xs text-[#C96A6A] hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semiboldtext-text-primary mb-3">
                  Concern
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTagFilter(tag.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:scale-105 ${
                        filters.tags?.includes(tag.id)
                          ? "bg-primary text-white border-[#4F8A7A]"
                          : "bg-[#FAF9F6] text-text-secondary border-border hover:border-[#4F8A7A] hover:text-primary"
                      }`}
                    >
                      <span>{tag.emoji}</span> {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semiboldtext-text-primary mb-3">
                  Session Mode
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {MODES.map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleModeFilter(mode)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all hover:scale-105 ${
                        filters.mode === mode
                          ? "bg-primary text-white border-[#4F8A7A]"
                          : "bg-[#FAF9F6] text-text-secondary border-border hover:border-[#4F8A7A]"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Active filter chips ── */}
          {(filters.tags?.length > 0 || filters.mode) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.tags?.map((tagId) => {
                const tag = tags.find((t) => t.id === tagId);
                return tag ? (
                  <button
                    key={tagId}
                    onClick={() => toggleTagFilter(tagId)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2F0] text-primary text-xs font-medium hover:bg-[#D5E8E3] transition-colors animate-scale-in"
                  >
                    {tag.emoji} {tag.label} <X size={11} />
                  </button>
                ) : null;
              })}
              {filters.mode && (
                <button
                  onClick={() => dispatch(setFilters({ mode: "" }))}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2F0] text-primary text-xs font-medium animate-scale-in"
                >
                  {filters.mode} <X size={11} />
                </button>
              )}
            </div>
          )}

          {/* ── Session grid (skeleton → real) ── */}
          {isLoading ? (
            <SkeletonGrid count={6} />
          ) : filtered.length > 0 ? (
            <StaggeredGrid sessions={filtered} />
          ) : (
            <div className="text-center py-24 animate-fade-up">
              <div className="text-6xl mb-5 animate-float">🌿</div>
              <h3 className="text-lg font-semiboldtext-text-primary mb-2">
                No sessions found
              </h3>
              <p className="text-text-secondary text-sm mb-6">
                Try adjusting your search or filters.
              </p>
              <button
                onClick={() => {
                  dispatch(clearFilters());
                  setLocalSearch("");
                }}
                className="px-5 py-2.5 rounded-fullbg-primary text-white text-sm font-medium hover:bg-[#356B5F] transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </PageTransition>
    </ClientLayout>
  );
}
