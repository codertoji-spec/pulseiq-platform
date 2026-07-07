import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { eventBus } from "@/lib/event-emitter";
import {
  EVENT_TYPES,
  COUNTRIES,
  DEVICES,
  BROWSERS,
} from "@/lib/constants";

function randomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomEvents(count: number) {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  return Array.from({ length: count }, (_, i) => {
    const eventType = randomElement(EVENT_TYPES);
    const randomTimeOffset = Math.floor(Math.random() * oneDayMs);
    const timestamp = new Date(now - randomTimeOffset);

    return {
      userId: Math.floor(Math.random() * 500) + 1,
      eventType,
      country: randomElement(COUNTRIES),
      device: randomElement(DEVICES),
      browser: randomElement(BROWSERS),
      timestamp,
      metadata: generateMetadata(eventType),
    };
  }).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

function generateMetadata(eventType: string): Record<string, unknown> {
  switch (eventType) {
    case "PURCHASE":
      return {
        amount: parseFloat((Math.random() * 500 + 5).toFixed(2)),
        currency: "USD",
        product: randomElement([
          "Pro Plan",
          "Enterprise",
          "Starter",
          "Team",
          "Premium",
        ]),
      };
    case "SEARCH":
      return {
        query: randomElement([
          "dashboard",
          "analytics",
          "reports",
          "settings",
          "billing",
          "users",
          "api docs",
        ]),
        resultsCount: Math.floor(Math.random() * 100),
      };
    case "API_ERROR":
      return {
        statusCode: randomElement([400, 401, 403, 404, 500, 502, 503]),
        endpoint: randomElement([
          "/api/users",
          "/api/events",
          "/api/billing",
          "/api/auth",
          "/api/reports",
        ]),
        message: randomElement([
          "Timeout",
          "Rate limited",
          "Internal error",
          "Bad request",
          "Not found",
        ]),
      };
    case "LOGIN":
      return {
        method: randomElement(["password", "oauth", "sso", "magic-link"]),
        success: true,
      };
    case "SIGNUP":
      return {
        source: randomElement([
          "organic",
          "referral",
          "ad",
          "social",
          "email",
        ]),
      };
    case "LOGOUT":
      return {
        sessionDuration: Math.floor(Math.random() * 7200) + 60,
      };
    default:
      return {};
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = Math.min(Math.max(parseInt(body.count) || 100, 1), 5000);

    const generatedEvents = generateRandomEvents(count);

    // Insert in batches of 500
    const batchSize = 500;
    let insertedCount = 0;

    for (let i = 0; i < generatedEvents.length; i += batchSize) {
      const batch = generatedEvents.slice(i, i + batchSize);
      await db.insert(events).values(batch);
      insertedCount += batch.length;
    }

    // Broadcast the latest events for real-time updates
    const latestEvents = generatedEvents.slice(-10);
    eventBus.emit(
      JSON.stringify({
        type: "EVENTS_GENERATED",
        count: insertedCount,
        latestEvents,
      })
    );

    return NextResponse.json({
      success: true,
      count: insertedCount,
      message: `Generated ${insertedCount} events successfully`,
    });
  } catch (error) {
    console.error("Generate events error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
