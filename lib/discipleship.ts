import { getDb } from "@/db";
import { discipleshipSessions } from "@/db/schema";

export const transformationSteps = [
  { sessionNumber: 1, title: "인식", stageKey: "awareness" },
  { sessionNumber: 2, title: "직면", stageKey: "confrontation" },
  { sessionNumber: 3, title: "회개", stageKey: "repentance" },
  { sessionNumber: 4, title: "치유", stageKey: "healing" },
  { sessionNumber: 5, title: "재해석", stageKey: "reinterpretation" },
  { sessionNumber: 6, title: "훈련", stageKey: "training" },
  { sessionNumber: 7, title: "관계 변화", stageKey: "relationship" },
  { sessionNumber: 8, title: "사명 회복", stageKey: "mission" },
] as const;

export function numericCapacity(value: string | null | undefined) {
  const match = value?.match(/\d+/);
  return match ? Number(match[0]) : null;
}

export async function ensureDiscipleshipSessions(programId: number) {
  await getDb().insert(discipleshipSessions).values(
    transformationSteps.map((step) => ({ programId, ...step })),
  ).onConflictDoNothing();
}

