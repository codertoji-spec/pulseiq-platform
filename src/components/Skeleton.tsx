"use client";

import React from "react";

export function SkeletonCard() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-7 w-24" />
          <div className="skeleton h-3 w-16" />
        </div>
        <div className="skeleton w-12 h-12 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-card p-5">
      <div className="skeleton h-4 w-32 mb-4" />
      <div className="skeleton h-[250px] w-full rounded-xl" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="glass-card p-5">
      <div className="skeleton h-4 w-40 mb-4" />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
