"use client";

import React, { useState, useEffect } from "react";
import { eventBus } from "@/lib/event-emitter";

function RealtimeClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function tick() {
      setTime(
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

  return (
    <span className="font-mono text-sm text-gray-400 tabular-nums">
      {time}
    </span>
  );
}

export default function Navbar({ title }: { title: string }) {
  const [onlineListeners, setOnlineListeners] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineListeners(eventBus.count);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="glass-card rounded-none border-t-0 border-r-0 border-l-0 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="flex items-center gap-6">
        {/* System health */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
          <span className="text-xs text-green-400 font-medium">System Healthy</span>
        </div>

        {/* Online connections */}
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <span className="text-xs">{onlineListeners} online</span>
        </div>

        {/* Clock */}
        <RealtimeClock />
      </div>
    </header>
  );
}
