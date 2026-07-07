import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { desc, eq, and, gte, lte, like, sql, SQL } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const eventType = url.searchParams.get("eventType");
    const country = url.searchParams.get("country");
    const device = url.searchParams.get("device");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const search = url.searchParams.get("search");
    const sortBy = url.searchParams.get("sortBy") || "timestamp";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    const conditions: SQL[] = [];

    if (eventType && eventType !== "all") {
      conditions.push(eq(events.eventType, eventType as "LOGIN" | "SIGNUP" | "PURCHASE" | "SEARCH" | "LOGOUT" | "API_ERROR"));
    }
    if (country && country !== "all") {
      conditions.push(eq(events.country, country));
    }
    if (device && device !== "all") {
      conditions.push(eq(events.device, device));
    }
    if (startDate) {
      conditions.push(gte(events.timestamp, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(events.timestamp, new Date(endDate)));
    }
    if (search) {
      conditions.push(like(sql`CAST(${events.userId} AS TEXT)`, `%${search}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const offset = (page - 1) * limit;

    const [countResult, data] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(events)
        .where(whereClause),
      db
        .select()
        .from(events)
        .where(whereClause)
        .orderBy(
          sortOrder === "asc"
            ? sql`${sortBy === "timestamp" ? events.timestamp : sortBy === "eventType" ? events.eventType : events.timestamp} ASC`
            : desc(events.timestamp)
        )
        .limit(limit)
        .offset(offset),
    ]);

    const total = countResult[0].count;

    return NextResponse.json({
      events: data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch events error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
