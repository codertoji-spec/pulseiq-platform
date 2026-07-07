"use client";

import React, { useState, useEffect, useCallback } from "react";
import StatCard from "../StatCard";
import { SkeletonCard, SkeletonChart } from "../Skeleton";
import LineChartCard from "../charts/LineChartCard";
import BarChartCard from "../charts/BarChartCard";
import PieChartCard from "../charts/PieChartCard";
import EventBadge from "../EventBadge";

interface DashboardStats {
  totalEvents: number;
  todayEvents: number;
  totalUsers: number;
  todayLogins: number;
  todayPurchases: number;
  todaySearches: number;
  todayErrors: number;
  successRate: number;
  eventTypeBreakdown: Array<{ eventType: string; count: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  countryBreakdown: Array<{ country: string; count: number }>;
}

interface TimelineData {
  loginsOverTime: Array<{ hour: string; count: number }>;
  errorsOverTime: Array<{ hour: string; count: number }>;
  requestsPerHour: Array<{ hour: string; count: number }>;
}

interface RecentEvent {
  id: number;
  userId: number;
  eventType: string;
  country: string;
  device: string;
  browser: string;
  timestamp: string;
}

export default function DashboardPage({ refreshKey }: { refreshKey: number }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timeline, setTimeline] = useState<TimelineData | null>(null);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, timelineRes, recentRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/timeline"),
        fetch("/api/events/recent"),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (timelineRes.ok) setTimeline(await timelineRes.json());
      if (recentRes.ok) {
        const data = await recentRes.json();
        setRecentEvents(data.events);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonChart key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-400 mb-2">No data available</p>
          <p className="text-gray-500 text-sm">
            Generate some events to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          color="indigo"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
        <StatCard
          title="Today's Logins"
          value={stats.todayLogins}
          color="green"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          }
        />
        <StatCard
          title="Purchases Today"
          value={stats.todayPurchases}
          color="purple"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          }
        />
        <StatCard
          title="Searches Today"
          value={stats.todaySearches}
          color="amber"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          }
        />
        <StatCard
          title="Errors Today"
          value={stats.todayErrors}
          color="red"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          }
        />
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          color="blue"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
          }
        />
        <StatCard
          title="Today's Events"
          value={stats.todayEvents}
          color="cyan"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Success Rate"
          value={stats.successRate}
          suffix="%"
          color="emerald"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Avg Response"
          value={Math.floor(Math.random() * 200) + 50}
          suffix="ms"
          color="rose"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          }
        />
        <StatCard
          title="API Requests"
          value={stats.totalEvents}
          color="indigo"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {timeline && (
          <>
            <LineChartCard
              title="Logins Over Time (24h)"
              data={timeline.loginsOverTime}
              color="#22c55e"
              gradientId="loginsGradient"
            />
            <LineChartCard
              title="Requests Per Hour (24h)"
              data={timeline.requestsPerHour}
              color="#6366f1"
              gradientId="requestsGradient"
            />
          </>
        )}

        <BarChartCard
          title="Events by Type"
          data={stats.eventTypeBreakdown.map((e) => ({
            name: e.eventType,
            value: e.count,
          }))}
        />

        <PieChartCard
          title="Device Distribution"
          data={stats.deviceBreakdown.map((d) => ({
            name: d.device,
            value: d.count,
          }))}
        />

        <BarChartCard
          title="Top Countries"
          data={stats.countryBreakdown.map((c) => ({
            name: c.country,
            value: c.count,
          }))}
        />

        {timeline && (
          <LineChartCard
            title="Errors Over Time (24h)"
            data={timeline.errorsOverTime}
            color="#ef4444"
            gradientId="errorsGradient"
          />
        )}
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-400">
            Recent Activity
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
            <span className="text-xs text-green-400">Live</span>
          </div>
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {recentEvents.slice(0, 10).map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors animate-fade-in"
            >
              <span className="text-xs text-gray-500 font-mono tabular-nums min-w-[50px]">
                {new Date(event.timestamp).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
              <span className="text-sm text-gray-300">
                User {event.userId}
              </span>
              <EventBadge type={event.eventType} />
              <span className="text-xs text-gray-500 ml-auto">
                {event.country}
              </span>
              <span className="text-xs text-gray-600">{event.device}</span>
            </div>
          ))}
          {recentEvents.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-8">
              No events yet. Generate some events to see activity.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
