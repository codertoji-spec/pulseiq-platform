"use client";

import React, { useEffect, useRef, useState } from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
  trend?: number;
}

function AnimatedNumber({ value, suffix }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const duration = 600;
    const startTime = Date.now();

    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    animate();
    prevRef.current = end;
  }, [value]);

  return (
    <span className="animate-count">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

const colorMap: Record<string, { bg: string; text: string; glow: string; border: string }> = {
  indigo: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    glow: "shadow-indigo-500/10",
    border: "border-indigo-500/20",
  },
  green: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    glow: "shadow-green-500/10",
    border: "border-green-500/20",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    glow: "shadow-purple-500/10",
    border: "border-purple-500/20",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    glow: "shadow-amber-500/10",
    border: "border-amber-500/20",
  },
  red: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    glow: "shadow-red-500/10",
    border: "border-red-500/20",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    glow: "shadow-blue-500/10",
    border: "border-blue-500/20",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/10",
    border: "border-cyan-500/20",
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    glow: "shadow-rose-500/10",
    border: "border-rose-500/20",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/10",
    border: "border-emerald-500/20",
  },
};

export default function StatCard({
  title,
  value,
  icon,
  color,
  suffix,
  trend,
}: StatCardProps) {
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div
      className={`glass-card glass-card-hover p-5 transition-all duration-300 shadow-lg ${c.glow}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-white">
            <AnimatedNumber value={value} suffix={suffix} />
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-1">
              {trend >= 0 ? (
                <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
                </svg>
              )}
              <span
                className={`text-xs font-medium ${
                  trend >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-xl ${c.bg} border ${c.border}`}
        >
          <div className={c.text}>{icon}</div>
        </div>
      </div>
    </div>
  );
}
