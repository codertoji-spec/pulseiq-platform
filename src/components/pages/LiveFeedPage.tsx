"use client";

import React, { useState, useEffect, useCallback } from "react";
import EventBadge from "../EventBadge";

interface EventRecord {
  id: number;
  userId: number;
  eventType: string;
  country: string;
  device: string;
  browser: string;
  timestamp: string;
}

const EVENT_ICONS: Record<string, string> = {
  LOGIN: "🔐",
  SIGNUP: "👤",
  PURCHASE: "💳",
  SEARCH: "🔍",
  LOGOUT: "🚪",
  API_ERROR: "⚠️",
};

const EVENT_LABELS: Record<string, string> = {
  LOGIN: "Logged In",
  SIGNUP: "Signed Up",
  PURCHASE: "Made a Purchase",
  SEARCH: "Searched",
  LOGOUT: "Logged Out",
  API_ERROR: "API Error",
};

export default function LiveFeedPage({ refreshKey }: { refreshKey: number }) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events/recent");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Feed fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, refreshKey]);

  if (loading) {
    return (
      <div className="glass-card p-5">
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-gray-400">
            Live Activity Feed
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
            <span className="text-xs text-green-400">Live</span>
          </div>
        </div>
        <button
          onClick={fetchEvents}
          className="px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-xs text-gray-400 hover:bg-gray-700/50 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="glass-card p-4">
        <div className="space-y-1">
          {events.map((event, index) => {
            const time = new Date(event.timestamp);
            const icon = EVENT_ICONS[event.eventType] || "📌";
            const label = EVENT_LABELS[event.eventType] || event.eventType;

            return (
              <div
                key={event.id}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/[0.03] transition-all animate-fade-in group"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Time column */}
                <div className="flex flex-col items-center min-w-[60px]">
                  <span className="text-xs font-mono text-gray-500 tabular-nums">
                    {time.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                  <span className="text-[10px] text-gray-600 font-mono tabular-nums">
                    :{time.getSeconds().toString().padStart(2, "0")}
                  </span>
                </div>

                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      event.eventType === "API_ERROR"
                        ? "bg-red-500/15"
                        : event.eventType === "PURCHASE"
                        ? "bg-purple-500/15"
                        : event.eventType === "LOGIN"
                        ? "bg-green-500/15"
                        : event.eventType === "SIGNUP"
                        ? "bg-blue-500/15"
                        : "bg-gray-500/15"
                    }`}
                  >
                    {icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-200">
                      User {event.userId}
                    </span>
                    <span className="text-sm text-gray-500">{label}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-600">
                      {event.country}
                    </span>
                    <span className="text-xs text-gray-700">•</span>
                    <span className="text-xs text-gray-600">
                      {event.device}
                    </span>
                    <span className="text-xs text-gray-700">•</span>
                    <span className="text-xs text-gray-600">
                      {event.browser}
                    </span>
                  </div>
                </div>

                {/* Badge */}
                <EventBadge type={event.eventType} />
              </div>
            );
          })}

          {events.length === 0 && (
            <div className="text-center py-16">
              <span className="text-4xl mb-4 block">📡</span>
              <p className="text-gray-400 mb-2">No events yet</p>
              <p className="text-gray-500 text-sm">
                Generate some events to see the live feed in action
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
