"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SkeletonChart } from "../Skeleton";
import LineChartCard from "../charts/LineChartCard";
import BarChartCard from "../charts/BarChartCard";
import PieChartCard from "../charts/PieChartCard";

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

export default function AnalyticsPage({ refreshKey }: { refreshKey: number }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timeline, setTimeline] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, timelineRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/timeline"),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (timelineRes.ok) setTimeline(await timelineRes.json());
    } catch (error) {
      console.error("Analytics fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonChart key={i} />
        ))}
      </div>
    );
  }

  if (!stats || !timeline) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <p className="text-xs text-gray-500 mb-1">Total Events Processed</p>
          <p className="text-2xl font-bold text-white">{stats.totalEvents.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-gray-500 mb-1">Unique Users Tracked</p>
          <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-gray-500 mb-1">System Uptime</p>
          <p className="text-2xl font-bold text-green-400">99.9%</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-gray-500 mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.successRate}%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LineChartCard
          title="Login Activity (24h)"
          data={timeline.loginsOverTime}
          color="#22c55e"
          gradientId="analyticsLogins"
        />
        <LineChartCard
          title="Request Volume (24h)"
          data={timeline.requestsPerHour}
          color="#6366f1"
          gradientId="analyticsRequests"
        />
        <LineChartCard
          title="Error Trends (24h)"
          data={timeline.errorsOverTime}
          color="#ef4444"
          gradientId="analyticsErrors"
        />
        <PieChartCard
          title="Device Distribution"
          data={stats.deviceBreakdown.map((d) => ({
            name: d.device,
            value: d.count,
          }))}
        />
        <BarChartCard
          title="Events by Type"
          data={stats.eventTypeBreakdown.map((e) => ({
            name: e.eventType,
            value: e.count,
          }))}
        />
        <BarChartCard
          title="Top Countries"
          data={stats.countryBreakdown.map((c) => ({
            name: c.country,
            value: c.count,
          }))}
        />
      </div>

      {/* Insights */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📊</span>
              <span className="text-sm font-medium text-indigo-400">Traffic Pattern</span>
            </div>
            <p className="text-xs text-gray-400">
              {stats.todayEvents > 0
                ? `${stats.todayEvents.toLocaleString()} events recorded today with ${stats.successRate}% success rate.`
                : "No events recorded today. Generate some traffic to see patterns."}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">👤</span>
              <span className="text-sm font-medium text-green-400">User Engagement</span>
            </div>
            <p className="text-xs text-gray-400">
              {stats.totalUsers > 0
                ? `${stats.totalUsers} unique users tracked. ${stats.todayLogins} logins today.`
                : "No user data available yet."}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚠️</span>
              <span className="text-sm font-medium text-amber-400">Error Monitoring</span>
            </div>
            <p className="text-xs text-gray-400">
              {stats.todayErrors > 0
                ? `${stats.todayErrors} errors detected today. Monitor the error trend chart for patterns.`
                : "No errors detected. System is running smoothly."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
