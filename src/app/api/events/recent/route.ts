import { NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const recentEvents = await db
      .select()
      .from(events)
      .orderBy(desc(events.timestamp))
      .limit(30);

    return NextResponse.json({ events: recentEvents });
  } catch (error) {
    console.error("Recent events error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
