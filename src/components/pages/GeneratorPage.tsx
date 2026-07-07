"use client";

import React, { useState } from "react";
import { useToast } from "../ToastProvider";

const PRESETS = [
  { count: 100, label: "100 Events", desc: "Quick test batch" },
  { count: 500, label: "500 Events", desc: "Medium traffic simulation" },
  { count: 1000, label: "1,000 Events", desc: "High traffic test" },
  { count: 5000, label: "5,000 Events", desc: "Stress test" },
];

export default function GeneratorPage({
  onGenerated,
}: {
  onGenerated: () => void;
}) {
  const [loading, setLoading] = useState<number | null>(null);
  const [customCount, setCustomCount] = useState("");
  const [lastResult, setLastResult] = useState<{
    count: number;
    time: number;
  } | null>(null);
  const { addToast } = useToast();

  async function generateEvents(count: number) {
    setLoading(count);
    const startTime = Date.now();

    try {
      const res = await fetch("/api/events/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count }),
      });

      if (res.ok) {
        const data = await res.json();
        const elapsed = Date.now() - startTime;
        setLastResult({ count: data.count, time: elapsed });
        addToast(`Generated ${data.count} events in ${elapsed}ms`, "success");
        onGenerated();
      } else {
        addToast("Failed to generate events", "error");
      }
    } catch (error) {
      console.error("Generate error:", error);
      addToast("Failed to generate events", "error");
    } finally {
      setLoading(null);
    }
  }

  function handleCustomGenerate() {
    const count = parseInt(customCount);
    if (count > 0 && count <= 5000) {
      generateEvents(count);
    } else {
      addToast("Enter a number between 1 and 5000", "error");
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card p-6 glow-accent">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Event Traffic Generator
            </h2>
            <p className="text-sm text-gray-400">
              Simulate production traffic by generating random application
              events
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Each generated event includes a random user ID, event type (Login,
          Signup, Purchase, Search, Logout, API Error), country, device,
          browser, and metadata. Events are distributed across the last 24
          hours to simulate realistic traffic patterns.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRESETS.map((preset) => (
          <button
            key={preset.count}
            onClick={() => generateEvents(preset.count)}
            disabled={loading !== null}
            className="glass-card glass-card-hover p-5 text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                  {preset.label}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{preset.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                {loading === preset.count ? (
                  <svg className="animate-spin h-6 w-6 text-indigo-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Count */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-medium text-gray-400 mb-3">
          Custom Amount
        </h3>
        <div className="flex gap-3">
          <input
            type="number"
            value={customCount}
            onChange={(e) => setCustomCount(e.target.value)}
            placeholder="Enter event count (1-5000)"
            min={1}
            max={5000}
            className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm"
          />
          <button
            onClick={handleCustomGenerate}
            disabled={loading !== null || !customCount}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Last Result */}
      {lastResult && (
        <div className="glass-card p-5 border-green-500/20 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-400">
                Successfully Generated
              </p>
              <p className="text-xs text-gray-500">
                {lastResult.count.toLocaleString()} events created in{" "}
                {lastResult.time}ms
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-medium text-gray-400 mb-3">
          Event Types Generated
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { type: "LOGIN", icon: "🔐", desc: "User authentication events" },
            { type: "SIGNUP", icon: "👤", desc: "New user registrations" },
            { type: "PURCHASE", icon: "💳", desc: "E-commerce transactions" },
            { type: "SEARCH", icon: "🔍", desc: "Search query events" },
            { type: "LOGOUT", icon: "🚪", desc: "Session terminations" },
            { type: "API_ERROR", icon: "⚠️", desc: "Backend error events" },
          ].map((item) => (
            <div
              key={item.type}
              className="p-3 rounded-xl bg-white/[0.02] border border-gray-700/30"
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{item.icon}</span>
                <span className="text-xs font-medium text-gray-300">
                  {item.type}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
