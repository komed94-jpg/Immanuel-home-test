import { boolean, integer, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const ministryRequests = pgTable("ministry_requests", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id"),
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

export const discipleshipSessions = pgTable("discipleship_sessions", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").notNull().references(() => discipleshipPrograms.id, { onDelete: "cascade" }),
  sessionNumber: integer("session_number").notNull(),
  title: text("title").notNull(),
  stageKey: text("stage_key").notNull(),
  heldOn: text("held_on"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("discipleship_program_session_idx").on(table.programId, table.sessionNumber)]);

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
  address: text("address"),
  occupation: text("occupation"),
  currentDepartment: text("current_department"),
  faithYears: text("faith_years"),
  baptismType: text("baptism_type"),
  baptismChurch: text("baptism_church"),
  previousChurchName: text("previous_church_name"),
  previousChurchPosition: text("previous_church_position"),
  serviceHistory: text("service_history"),
  pastoralNote: text("pastoral_note"),
  privacyConsentedAt: timestamp("privacy_consented_at", { withTimezone: true }).notNull().defaultNow(),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const discipleshipApplications = pgTable("discipleship_applications", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").notNull().references(() => discipleshipPrograms.id, { onDelete: "cascade" }),
  memberId: integer("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  motivation: text("motivation"),
  status: text("status").notNull().default("pending"),
  adminNote: text("admin_note"),
  appliedAt: timestamp("applied_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("discipleship_program_member_idx").on(table.programId, table.memberId)]);

export const discipleshipAttendance = pgTable("discipleship_attendance", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => discipleshipSessions.id, { onDelete: "cascade" }),
  applicationId: integer("application_id").notNull().references(() => discipleshipApplications.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("absent"),
  note: text("note"),
  checkedAt: timestamp("checked_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("discipleship_session_application_idx").on(table.sessionId, table.applicationId)]);

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

export const memberPasswordResetTokens = pgTable("member_password_reset_tokens", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const newFamilyRegistrations = pgTable("new_family_registrations", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull().references(() => ministryRequests.id, { onDelete: "cascade" }).unique(),
  memberId: integer("member_id").references(() => members.id, { onDelete: "set null" }),
  cardType: text("card_type").notNull(),
  birthDate: text("birth_date").notNull(),
  address: text("address").notNull(),
  email: text("email").notNull(),
  occupation: text("occupation").notNull(),
  familyInfo: text("family_info").notNull(),
  referral: text("referral").notNull(),
  guideName: text("guide_name"),
  guidePhone: text("guide_phone"),
  guideRelation: text("guide_relation"),
  faithStatus: text("faith_status"),
  faithYears: text("faith_years"),
  previousChurchName: text("previous_church_name"),
  faithHistory: text("faith_history"),
  churchPosition: text("church_position"),
  serviceHistory: text("service_history"),
  ordinanceType: text("ordinance_type"),
  ordinanceChurch: text("ordinance_church"),
  participation: text("participation"),
  reviewStatus: text("review_status").notNull().default("received"),
  reviewNote: text("review_note"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const memberApprovalLogs = pgTable("member_approval_logs", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  previousValue: text("previous_value"),
  newValue: text("new_value"),
  note: text("note"),
  actor: text("actor").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const households = pgTable("households", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const householdMembers = pgTable("household_members", {
  id: serial("id").primaryKey(),
  householdId: integer("household_id").notNull().references(() => households.id, { onDelete: "cascade" }),
  memberId: integer("member_id").notNull().references(() => members.id, { onDelete: "cascade" }).unique(),
  relationship: text("relationship").notNull().default("본인"),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
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
  finalizedAt: timestamp("finalized_at", { withTimezone: true }),
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
