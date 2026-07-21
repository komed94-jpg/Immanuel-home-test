import { boolean, integer, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const ministryRequests = pgTable("ministry_requests", {
  id: serial("id").primaryKey(),
  requestType: text("request_type").notNull(),
  name: text("name"),
  contact: text("contact"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  options: text("options"),
  status: text("status").notNull().default("received"),
  adminNote: text("admin_note"),
  consented: boolean("consented").notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
});

export const discipleshipPrograms = pgTable("discipleship_programs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  schedule: text("schedule"),
  location: text("location"),
  capacity: text("capacity"),
  status: text("status").notNull().default("recruiting"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sermons = pgTable("sermons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  scripture: text("scripture"),
  preacher: text("preacher"),
  videoUrl: text("video_url").notNull(),
  description: text("description"),
  preachedOn: text("preached_on").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const churchEvents = pgTable("church_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category"),
  startsAt: text("starts_at").notNull(),
  endsAt: text("ends_at"),
  location: text("location"),
  description: text("description"),
  registrationOpen: boolean("registration_open").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const givingInformation = pgTable("giving_information", {
  id: serial("id").primaryKey(),
  bank: text("bank").notNull(),
  accountNumber: text("account_number").notNull(),
  accountHolder: text("account_holder").notNull(),
  note: text("note"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const dailyWords = pgTable("daily_words", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  scripture: text("scripture").notNull(),
  revisedKoreanText: text("revised_korean_text"),
  newKoreanTranslationText: text("new_korean_translation_text"),
  nivText: text("niv_text"),
  message: text("message").notNull(),
  application: text("application"),
  prayer: text("prayer"),
  source: text("source").notNull().default("manual"),
  publishedOn: text("published_on").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().unique(),
  birthDate: text("birth_date").notNull(),
  passwordHash: text("password_hash").notNull(),
  accountStatus: text("account_status").notNull().default("active"),
  membershipStatus: text("membership_status").notNull().default("nonmember"),
  role: text("role").notNull().default("member"),
  memberNumber: text("member_number").unique(),
  registrationCategory: integer("registration_category"),
  privacyConsentedAt: timestamp("privacy_consented_at", { withTimezone: true }).notNull().defaultNow(),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const memberSessions = pgTable("member_sessions", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const memberLoginAttempts = pgTable("member_login_attempts", {
  id: serial("id").primaryKey(),
  identifierHash: text("identifier_hash").notNull().unique(),
  attempts: integer("attempts").notNull().default(0),
  windowStartedAt: timestamp("window_started_at", { withTimezone: true }).notNull().defaultNow(),
  blockedUntil: timestamp("blocked_until", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const memberNumberCounters = pgTable("member_number_counters", {
  id: serial("id").primaryKey(),
  registrationYear: integer("registration_year").notNull(),
  category: integer("category").notNull(),
  lastNumber: integer("last_number").notNull().default(0),
}, (table) => [uniqueIndex("member_number_counter_year_category_idx").on(table.registrationYear, table.category)]);

export const attendanceEvents = pgTable("attendance_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  eventType: text("event_type").notNull(),
  heldOn: text("held_on").notNull(),
  startsAt: text("starts_at"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const attendanceRecords = pgTable("attendance_records", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => attendanceEvents.id, { onDelete: "cascade" }),
  memberId: integer("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("present"),
  method: text("method").notNull().default("manual"),
  note: text("note"),
  checkedInAt: timestamp("checked_in_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("attendance_event_member_idx").on(table.eventId, table.memberId)]);
