"use client";

import { useState, useEffect, useCallback } from "react";

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

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timeline, setTimeline] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, timelineRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/timeline"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (timelineRes.ok) {
        const timelineData = await timelineRes.json();
        setTimeline(timelineData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stats, timeline, loading, refetch: fetchData };
}
