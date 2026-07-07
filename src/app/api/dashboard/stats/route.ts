import { NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { sql, eq, gte, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalEventsResult,
      todayEventsResult,
      eventTypeBreakdown,
      deviceBreakdown,
      countryBreakdown,
      uniqueUsersResult,
      todayLoginsResult,
      todayPurchasesResult,
      todaySearchesResult,
      todayErrorsResult,
    ] = await Promise.all([
      // Total events
      db.select({ count: sql<number>`count(*)::int` }).from(events),

      // Today's events
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(events)
        .where(gte(events.timestamp, todayStart)),

      // Event type breakdown
      db
        .select({
          eventType: events.eventType,
          count: sql<number>`count(*)::int`,
        })
        .from(events)
        .groupBy(events.eventType),

      // Device breakdown
      db
        .select({
          device: events.device,
          count: sql<number>`count(*)::int`,
        })
        .from(events)
        .groupBy(events.device),

      // Country breakdown (top 10)
      db
        .select({
          country: events.country,
          count: sql<number>`count(*)::int`,
        })
        .from(events)
        .groupBy(events.country)
        .orderBy(sql`count(*) DESC`)
        .limit(10),

      // Unique users
      db
        .select({
          count: sql<number>`count(DISTINCT ${events.userId})::int`,
        })
        .from(events),

      // Today's logins
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(events)
        .where(
          and(
            gte(events.timestamp, todayStart),
            eq(events.eventType, "LOGIN")
          )
        ),

      // Today's purchases
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(events)
        .where(
          and(
            gte(events.timestamp, todayStart),
            eq(events.eventType, "PURCHASE")
          )
        ),

      // Today's searches
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(events)
        .where(
          and(
            gte(events.timestamp, todayStart),
            eq(events.eventType, "SEARCH")
          )
        ),

      // Today's errors
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(events)
        .where(
          and(
            gte(events.timestamp, todayStart),
            eq(events.eventType, "API_ERROR")
          )
        ),
    ]);

    // Calculate success rate (non-error events / total)
    const totalToday = todayEventsResult[0].count || 1;
    const errorsToday = todayErrorsResult[0].count;
    const successRate = (((totalToday - errorsToday) / totalToday) * 100).toFixed(1);

    return NextResponse.json({
      totalEvents: totalEventsResult[0].count,
      todayEvents: todayEventsResult[0].count,
      totalUsers: uniqueUsersResult[0].count,
      todayLogins: todayLoginsResult[0].count,
      todayPurchases: todayPurchasesResult[0].count,
      todaySearches: todaySearchesResult[0].count,
      todayErrors: todayErrorsResult[0].count,
      successRate: parseFloat(successRate),
      eventTypeBreakdown,
      deviceBreakdown,
      countryBreakdown,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
