import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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
