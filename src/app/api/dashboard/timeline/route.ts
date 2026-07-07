import { NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { sql, gte, eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [loginsOverTime, errorsOverTime, requestsPerHour] =
      await Promise.all([
        // Logins over time (hourly for last 24h)
        db
          .select({
            hour: sql<string>`to_char(date_trunc('hour', ${events.timestamp}), 'HH24:00')`,
            count: sql<number>`count(*)::int`,
          })
          .from(events)
          .where(
            and(
              gte(events.timestamp, twentyFourHoursAgo),
              eq(events.eventType, "LOGIN")
            )
          )
          .groupBy(sql`date_trunc('hour', ${events.timestamp})`)
          .orderBy(sql`date_trunc('hour', ${events.timestamp})`),

        // Errors over time (hourly for last 24h)
        db
          .select({
            hour: sql<string>`to_char(date_trunc('hour', ${events.timestamp}), 'HH24:00')`,
            count: sql<number>`count(*)::int`,
          })
          .from(events)
          .where(
            and(
              gte(events.timestamp, twentyFourHoursAgo),
              eq(events.eventType, "API_ERROR")
            )
          )
          .groupBy(sql`date_trunc('hour', ${events.timestamp})`)
          .orderBy(sql`date_trunc('hour', ${events.timestamp})`),

        // Requests per hour (last 24h)
        db
          .select({
            hour: sql<string>`to_char(date_trunc('hour', ${events.timestamp}), 'HH24:00')`,
            count: sql<number>`count(*)::int`,
          })
          .from(events)
          .where(gte(events.timestamp, twentyFourHoursAgo))
          .groupBy(sql`date_trunc('hour', ${events.timestamp})`)
          .orderBy(sql`date_trunc('hour', ${events.timestamp})`),
      ]);

    return NextResponse.json({
      loginsOverTime,
      errorsOverTime,
      requestsPerHour,
    });
  } catch (error) {
    console.error("Timeline error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
