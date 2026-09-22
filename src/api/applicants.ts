import { createSeedApplicants, SEED_COUNT } from "./seed";
import type { FinalResult, PipelineStage } from "./stages";
import type { Applicant } from "./types";

const STORAGE_KEY = "recruitmap.applicants";
const DELAY_MIN_MS = 200;
const DELAY_MAX_MS = 800;
const FAIL_RATE = 0.15;

function delayMs() {
  return DELAY_MIN_MS + Math.floor(Math.random() * (DELAY_MAX_MS - DELAY_MIN_MS + 1));
}

async function simulateNetwork() {
  await new Promise((resolve) => setTimeout(resolve, delayMs()));
  if (Math.random() < FAIL_RATE) {
    throw new Error("요청에 실패했습니다.");
  }
}

function getStorage() {
  if (typeof window === "undefined") {
    throw new Error("localStorage를 사용할 수 없습니다.");
  }
  return window.localStorage;
}

function readApplicants(): Applicant[] {
  const raw = getStorage().getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = createSeedApplicants();
    getStorage().setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  const parsed = JSON.parse(raw) as Applicant[];
  if (parsed.length < SEED_COUNT) {
    const seeded = createSeedApplicants();
    getStorage().setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  return parsed.map((applicant, index) => {
    const birthYear = 1988 + (index % 18);
    const birthMonth = String(((index * 7) % 12) + 1).padStart(2, "0");
    const birthDay = String(((index * 11) % 28) + 1).padStart(2, "0");
    return {
      ...applicant,
      birthDate:
        applicant.birthDate ?? `${birthYear}-${birthMonth}-${birthDay}`,
      gender: applicant.gender ?? (index % 2 === 0 ? "남" : "여"),
    };
  });
}

function writeApplicants(applicants: Applicant[]) {
  getStorage().setItem(STORAGE_KEY, JSON.stringify(applicants));
}

function clone(applicant: Applicant): Applicant {
  return { ...applicant };
}

export function placeAtStageStart(
  applicants: Applicant[],
  moved: Applicant,
): Applicant[] {
  const without = applicants.filter((item) => item.id !== moved.id);
  const insertAt = without.findIndex((item) => item.stage === moved.stage);
  if (insertAt === -1) return [...without, moved];
  return [...without.slice(0, insertAt), moved, ...without.slice(insertAt)];
}

export async function listApplicants(): Promise<Applicant[]> {
  await simulateNetwork();
  return readApplicants().map(clone);
}

export async function getApplicant(id: string): Promise<Applicant> {
  await simulateNetwork();
  const found = readApplicants().find((applicant) => applicant.id === id);
  if (!found) {
    throw new Error("지원자를 찾을 수 없습니다.");
  }
  return clone(found);
}

export class StageConflictError extends Error {
  constructor() {
    super("다른 변경과 충돌했습니다.");
    this.name = "StageConflictError";
  }
}

export async function updateApplicantStage(
  id: string,
  stage: PipelineStage,
  finalResult: FinalResult | null,
  expectedVersion: number,
): Promise<Applicant> {
  await simulateNetwork();
  const applicants = readApplicants();
  const index = applicants.findIndex((applicant) => applicant.id === id);
  if (index < 0) {
    throw new Error("지원자를 찾을 수 없습니다.");
  }
  const current = applicants[index];
  if (current.version !== expectedVersion) {
    throw new StageConflictError();
  }
  const updated: Applicant = {
    ...current,
    stage,
    finalResult: stage === "final" ? finalResult : null,
    version: current.version + 1,
  };
  const next = placeAtStageStart(applicants, updated);
  writeApplicants(next);
  return clone(updated);
}

export async function saveApplicants(
  applicants: Applicant[],
): Promise<Applicant[]> {
  await simulateNetwork();
  writeApplicants(applicants.map(clone));
  return readApplicants().map(clone);
}
