"use client";

import React from "react";

const badgeStyles: Record<string, string> = {
  LOGIN: "bg-green-500/15 text-green-400 border-green-500/30",
  SIGNUP: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  PURCHASE: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  SEARCH: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  LOGOUT: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  API_ERROR: "bg-red-500/15 text-red-400 border-red-500/30",
};

const icons: Record<string, string> = {
  LOGIN: "🔐",
  SIGNUP: "👤",
  PURCHASE: "💳",
  SEARCH: "🔍",
  LOGOUT: "🚪",
  API_ERROR: "⚠️",
};

export default function EventBadge({ type }: { type: string }) {
  const style = badgeStyles[type] || badgeStyles.LOGIN;
  return (
    <span
      className={`status-badge border ${style}`}
    >
      <span className="text-xs">{icons[type]}</span>
      {type.replace("_", " ")}
    </span>
  );
}
