import { desc, eq, inArray } from "drizzle-orm";
import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import {
  attendanceEvents,
  attendanceRecords,
  churchEvents,
  discipleshipApplications,
  discipleshipPrograms,
  eventApplications,
  memberApprovalLogs,
  members,
  ministryRequests,
  newFamilyJourneys,
  newFamilyRegistrations,
} from "@/db/schema";

function koreaDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${pick("year")}-${pick("month")}-${pick("day")}`;
}

function weekRange(today: string) {
  const date = new Date(`${today}T00:00:00Z`);
  const weekday = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() - weekday + 1);
  const start = date.toISOString().slice(0, 10);
  date.setUTCDate(date.getUTCDate() + 6);
  return { start, end: date.toISOString().slice(0, 10) };
}

export async function GET(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });

  const db = getDb();
  const today = koreaDate();
  const week = weekRange(today);
  const [memberRows, cards, journeys, requests, programs, applications, events, eventRows, attendance, allAttendanceRecords, logs] = await Promise.all([
    db.select({ id: members.id, name: members.name, membershipStatus: members.membershipStatus, createdAt: members.createdAt }).from(members).orderBy(desc(members.createdAt)).limit(1500),
    db.select({ id: newFamilyRegistrations.id, reviewStatus: newFamilyRegistrations.reviewStatus, cardType: newFamilyRegistrations.cardType, createdAt: newFamilyRegistrations.createdAt, name: ministryRequests.name }).from(newFamilyRegistrations).innerJoin(ministryRequests, eq(newFamilyRegistrations.requestId, ministryRequests.id)).orderBy(desc(newFamilyRegistrations.createdAt)).limit(500),
    db.select({ id: newFamilyJourneys.id, journeyStatus: newFamilyJourneys.journeyStatus, assignee: newFamilyJourneys.assignee, nextActionOn: newFamilyJourneys.nextActionOn }).from(newFamilyJourneys).limit(1500),
    db.select({ id: ministryRequests.id, requestType: ministryRequests.requestType, subject: ministryRequests.subject, name: ministryRequests.name, status: ministryRequests.status, submittedAt: ministryRequests.submittedAt }).from(ministryRequests).orderBy(desc(ministryRequests.submittedAt)).limit(300),
    db.select({ id: discipleshipPrograms.id, title: discipleshipPrograms.title }).from(discipleshipPrograms).limit(100),
    db.select({ id: discipleshipApplications.id, programId: discipleshipApplications.programId, status: discipleshipApplications.status, appliedAt: discipleshipApplications.appliedAt, memberName: members.name }).from(discipleshipApplications).innerJoin(members, eq(discipleshipApplications.memberId, members.id)).orderBy(desc(discipleshipApplications.appliedAt)).limit(1000),
    db.select({ id: churchEvents.id, title: churchEvents.title, startsAt: churchEvents.startsAt, registrationOpen: churchEvents.registrationOpen, capacity: churchEvents.capacity }).from(churchEvents).orderBy(desc(churchEvents.startsAt)).limit(300),
    db.select({ id: eventApplications.id, eventId: eventApplications.eventId, status: eventApplications.status }).from(eventApplications).limit(10000),
    db.select({ id: attendanceEvents.id, eventType: attendanceEvents.eventType, heldOn: attendanceEvents.heldOn, finalizedAt: attendanceEvents.finalizedAt }).from(attendanceEvents).orderBy(desc(attendanceEvents.heldOn)).limit(200),
    db.select({ eventId: attendanceRecords.eventId, memberId: attendanceRecords.memberId, status: attendanceRecords.status }).from(attendanceRecords).limit(20000),
    db.select({ id: memberApprovalLogs.id, action: memberApprovalLogs.action, previousValue: memberApprovalLogs.previousValue, newValue: memberApprovalLogs.newValue, note: memberApprovalLogs.note, createdAt: memberApprovalLogs.createdAt, memberName: members.name }).from(memberApprovalLogs).innerJoin(members, eq(memberApprovalLogs.memberId, members.id)).orderBy(desc(memberApprovalLogs.createdAt)).limit(12),
  ]);

  const newMembers = memberRows.filter((item) => koreaDate(item.createdAt) === today).slice(0, 8);
  const pendingMembers = memberRows.filter((item) => item.membershipStatus === "pending");
  const pendingCards = cards.filter((item) => ["received", "reviewing", "needs_update", "on_hold"].includes(item.reviewStatus));
  const newFamily = {
    active: journeys.filter((item) => item.journeyStatus === "active").length,
    overdue: journeys.filter((item) => item.journeyStatus === "active" && item.nextActionOn && item.nextActionOn < today).length,
    unassigned: journeys.filter((item) => item.journeyStatus === "active" && !item.assignee).length,
    completed: journeys.filter((item) => item.journeyStatus === "completed").length,
  };
  const pendingRequests = requests.filter((item) => item.status !== "completed");
  const programMap = new Map(programs.map((item) => [item.id, item.title]));
  const pendingApplications = applications.filter((item) => ["pending", "waitlisted"].includes(item.status));
  const weekEvents = attendance.filter((item) => item.heldOn >= week.start && item.heldOn <= week.end);
  const weekIds = new Set(weekEvents.map((item) => item.id));
  const weekRecords = allAttendanceRecords.filter((item) => weekIds.has(item.eventId));
  const weeklyAttendance = { events: weekEvents.length, present: weekRecords.filter((item) => ["present", "late"].includes(item.status)).length, absent: weekRecords.filter((item) => item.status === "absent").length, pending: weekEvents.filter((item) => !item.finalizedAt).length };

  const activeMembers = memberRows.filter((item) => ["active", "long_absent"].includes(item.membershipStatus));
  const finalizedSundays = attendance.filter((item) => item.eventType === "sunday" && item.finalizedAt).sort((a, b) => b.heldOn.localeCompare(a.heldOn)).slice(0, 6);
  const statusByKey = new Map(allAttendanceRecords.map((item) => [`${item.eventId}:${item.memberId}`, item.status]));
  const absentees = activeMembers.map((member) => {
    let consecutive = 0;
    for (const sunday of finalizedSundays) { if (statusByKey.get(`${sunday.id}:${member.id}`) === "absent") consecutive += 1; else break; }
    return { id: member.id, name: member.name, consecutive };
  }).filter((item) => item.consecutive >= 2).sort((a, b) => b.consecutive - a.consecutive).slice(0, 8);

  const eventSummaries = events.filter((item) => item.registrationOpen && item.startsAt >= today).sort((a, b) => a.startsAt.localeCompare(b.startsAt)).slice(0, 5).map((event) => {
    const items = eventRows.filter((item) => item.eventId === event.id);
    return { id: event.id, title: event.title, startsAt: event.startsAt, capacity: event.capacity, registered: items.filter((item) => item.status === "registered").length, waitlisted: items.filter((item) => item.status === "waitlisted").length };
  });

  return Response.json({
    generatedAt: new Date().toISOString(), today, newMembers, pendingMembers: pendingMembers.slice(0, 8), pendingMemberCount: pendingMembers.length,
    pendingCards: pendingCards.slice(0, 8), pendingCardCount: pendingCards.length, newFamily,
    weeklyAttendance, absentees, pendingApplications: pendingApplications.slice(0, 8).map((item) => ({ ...item, programTitle: programMap.get(item.programId) ?? "제자훈련" })), pendingApplicationCount: pendingApplications.length,
    events: eventSummaries, pendingRequests: pendingRequests.slice(0, 8), pendingRequestCount: pendingRequests.length, logs,
  });
}
