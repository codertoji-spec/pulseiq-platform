"use client";

import React, { useState, useEffect, useCallback } from "react";
import EventBadge from "../EventBadge";
import { SkeletonTable } from "../Skeleton";

interface EventRecord {
  id: number;
  userId: number;
  eventType: string;
  country: string;
  device: string;
  browser: string;
  timestamp: string;
  metadata: Record<string, unknown> | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const EVENT_TYPES = ["all", "LOGIN", "SIGNUP", "PURCHASE", "SEARCH", "LOGOUT", "API_ERROR"];
const DEVICES = ["all", "Desktop", "Mobile", "Tablet"];
const COUNTRIES = [
  "all",
  "United States",
  "India",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "Canada",
  "Australia",
  "South Korea",
];

export default function EventsPage({ refreshKey }: { refreshKey: number }) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    eventType: "all",
    country: "all",
    device: "all",
    search: "",
    startDate: "",
    endDate: "",
  });

  const fetchEvents = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });

      if (filters.eventType !== "all")
        params.set("eventType", filters.eventType);
      if (filters.country !== "all") params.set("country", filters.country);
      if (filters.device !== "all") params.set("device", filters.device);
      if (filters.search) params.set("search", filters.search);
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);

      const res = await fetch(`/api/events?${params}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Fetch events error:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents(1);
  }, [fetchEvents, refreshKey]);

  function handleExport() {
    const params = new URLSearchParams();
    if (filters.eventType !== "all")
      params.set("eventType", filters.eventType);
    if (filters.country !== "all") params.set("country", filters.country);
    if (filters.device !== "all") params.set("device", filters.device);
    if (filters.search) params.set("search", filters.search);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);

    window.open(`/api/events/export?${params}`, "_blank");
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs text-gray-500 mb-1">
              Search User ID
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              placeholder="e.g. 42"
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div className="min-w-[140px]">
            <label className="block text-xs text-gray-500 mb-1">
              Event Type
            </label>
            <select
              value={filters.eventType}
              onChange={(e) =>
                setFilters((f) => ({ ...f, eventType: e.target.value }))
              }
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All Types" : t}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[140px]">
            <label className="block text-xs text-gray-500 mb-1">Country</label>
            <select
              value={filters.country}
              onChange={(e) =>
                setFilters((f) => ({ ...f, country: e.target.value }))
              }
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Countries" : c}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[120px]">
            <label className="block text-xs text-gray-500 mb-1">Device</label>
            <select
              value={filters.device}
              onChange={(e) =>
                setFilters((f) => ({ ...f, device: e.target.value }))
              }
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
            >
              {DEVICES.map((d) => (
                <option key={d} value={d}>
                  {d === "all" ? "All Devices" : d}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[140px]">
            <label className="block text-xs text-gray-500 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, startDate: e.target.value }))
              }
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div className="min-w-[140px]">
            <label className="block text-xs text-gray-500 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, endDate: e.target.value }))
              }
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg text-sm font-medium hover:bg-emerald-500/25 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable />
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/40">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Browser
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-400 font-mono tabular-nums whitespace-nowrap">
                      {new Date(event.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      User {event.userId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {event.country}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {event.device}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {event.browser}
                    </td>
                    <td className="px-4 py-3">
                      <EventBadge type={event.eventType} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`status-badge border ${
                          event.eventType === "API_ERROR"
                            ? "bg-red-500/15 text-red-400 border-red-500/30"
                            : "bg-green-500/15 text-green-400 border-green-500/30"
                        }`}
                      >
                        {event.eventType === "API_ERROR"
                          ? "Error"
                          : "Success"}
                      </span>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      No events found. Try adjusting your filters or generate
                      some events.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700/40">
              <p className="text-xs text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.total
                )}{" "}
                of {pagination.total.toLocaleString()} events
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchEvents(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-xs text-gray-400 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    const start = Math.max(
                      1,
                      Math.min(
                        pagination.page - 2,
                        pagination.totalPages - 4
                      )
                    );
                    const pageNum = start + i;
                    if (pageNum > pagination.totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchEvents(pageNum)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          pageNum === pagination.page
                            ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                            : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
                <button
                  onClick={() => fetchEvents(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-xs text-gray-400 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
