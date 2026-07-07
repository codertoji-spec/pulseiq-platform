import {
  pgTable,
  text,
  timestamp,
  varchar,
  serial,
  jsonb,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const eventTypeEnum = pgEnum("event_type", [
  "LOGIN",
  "SIGNUP",
  "PURCHASE",
  "SEARCH",
  "LOGOUT",
  "API_ERROR",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  eventType: eventTypeEnum("event_type").notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  device: varchar("device", { length: 100 }).notNull(),
  browser: varchar("browser", { length: 100 }).notNull(),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventType = "LOGIN" | "SIGNUP" | "PURCHASE" | "SEARCH" | "LOGOUT" | "API_ERROR";
