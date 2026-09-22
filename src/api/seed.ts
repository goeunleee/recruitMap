import { PIPELINE_STAGES, type FinalResult, type PipelineStage } from "./stages";
import type { Applicant } from "./types";

export const SEED_COUNT = 1000;

export const JOBS = ["프론트엔드", "백엔드", "디자인", "기획", "데이터", "QA"] as const;
const LAST_NAMES = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"];
const FIRST_NAMES = [
  "서연",
  "민준",
  "지우",
  "도윤",
  "하은",
  "서준",
  "지민",
  "수아",
  "현우",
  "예준",
];

function stageForIndex(index: number): PipelineStage {
  return PIPELINE_STAGES[index % PIPELINE_STAGES.length];
}

function finalResultFor(stage: PipelineStage, index: number): FinalResult | null {
  if (stage !== "final") return null;
  return index % 2 === 0 ? "passed" : "rejected";
}

export function createSeedApplicants(count = SEED_COUNT): Applicant[] {
  return Array.from({ length: count }, (_, index) => {
    const stage = stageForIndex(index);
    const day = String((index % 28) + 1).padStart(2, "0");
    const month = String((index % 12) + 1).padStart(2, "0");
    const birthYear = 1988 + (index % 18);
    const birthMonth = String(((index * 7) % 12) + 1).padStart(2, "0");
    const birthDay = String(((index * 11) % 28) + 1).padStart(2, "0");
    return {
      id: `app-${index + 1}`,
      name: `${LAST_NAMES[index % LAST_NAMES.length]}${FIRST_NAMES[index % FIRST_NAMES.length]}`,
      job: JOBS[index % JOBS.length],
      appliedAt: `2026-${month}-${day}`,
      birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
      gender: index % 2 === 0 ? "남" : "여",
      stage,
      finalResult: finalResultFor(stage, index),
      version: 1,
    };
  });
}
