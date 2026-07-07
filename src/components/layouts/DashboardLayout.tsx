"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthProvider";
import { useToast } from "../ToastProvider";
import { useSSE } from "@/hooks/useSSE";
import DashboardPage from "../pages/DashboardPage";
import EventsPage from "../pages/EventsPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import LiveFeedPage from "../pages/LiveFeedPage";
import GeneratorPage from "../pages/GeneratorPage";

const tabs = [
  { id: "dashboard", name: "Dashboard", icon: "📊" },
  { id: "events", name: "Events", icon: "📋" },
  { id: "analytics", name: "Analytics", icon: "📈" },
  { id: "feed", name: "Live Feed", icon: "📡" },
  { id: "generator", name: "Generator", icon: "⚡" },
];

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [clock, setClock] = useState("");

  useEffect(() => {
    function tick() {
      setClock(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    }
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSSEMessage = useCallback(
    (data: { type: string; count?: number }) => {
      if (data.type === "EVENTS_GENERATED") {
        addToast(`${data.count} new events received!`, "info");
        setRefreshKey((k) => k + 1);
      }
    },
    [addToast]
  );

  useSSE(handleSSEMessage);

  function renderPage() {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage refreshKey={refreshKey} />;
      case "events":
        return <EventsPage refreshKey={refreshKey} />;
      case "analytics":
        return <AnalyticsPage refreshKey={refreshKey} />;
      case "feed":
        return <LiveFeedPage refreshKey={refreshKey} />;
      case "generator":
        return <GeneratorPage onGenerated={() => setRefreshKey((k) => k + 1)} />;
      default:
        return <DashboardPage refreshKey={refreshKey} />;
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col glass-card rounded-none border-r border-t-0 border-b-0 border-l-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-700/40">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              PulseIQ
            </h1>
            <p className="text-[10px] text-gray-500 -mt-0.5">
              Event Analytics
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 pulse-dot" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-gray-700/40 p-3">
          {user && (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  {user.role}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Logout"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top bar */}
        <header className="glass-card rounded-none border-t-0 border-r-0 border-l-0 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <h2 className="text-lg font-semibold text-white">
            {tabs.find((t) => t.id === activeTab)?.name || "Dashboard"}
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
              <span className="text-xs text-green-400 font-medium">
                System Healthy
              </span>
            </div>
            <span className="font-mono text-sm text-gray-400 tabular-nums">
              {clock}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto animate-fade-in" key={activeTab}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
