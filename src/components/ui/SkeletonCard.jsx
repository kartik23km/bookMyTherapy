import React from "react";

export function SessionCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="skeleton h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-4 w-3/5 rounded" />
        <div className="skeleton h-1 w-full rounded-full mt-2" />
        <div className="flex justify-between items-center pt-1">
          <div className="skeleton h-6 w-16 rounded" />
          <div className="skeleton h-7 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SessionCardSkeleton key={i} />
      ))}
    </div>
  );
}
