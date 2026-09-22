"use client";

import {
  FINAL_RESULT_LABEL,
  getAdjacentStage,
  PIPELINE_STAGE_LABEL,
  type FinalResult,
} from "@/src/api/stages";
import type { Applicant } from "@/src/api/types";
import { useState, type KeyboardEvent } from "react";

export function ApplicantCard({
  applicant,
  onMoveStage,
}: {
  applicant: Applicant;
  onMoveStage: (
    id: string,
    direction: "prev" | "next",
    finalResult?: FinalResult | null,
  ) => void;
}) {
  const [finalPick, setFinalPick] = useState<FinalResult | "">("");
  const nextStage = getAdjacentStage(applicant.stage, "next");
  const needsFinalPick = nextStage === "final";
  const canMovePrev = getAdjacentStage(applicant.stage, "prev") !== null;
  const canMoveNext =
    nextStage !== null && (!needsFinalPick || finalPick !== "");

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === " ") {
      event.preventDefault();
    }
  }

  return (
    <article
      aria-label={`${applicant.name}, ${PIPELINE_STAGE_LABEL[applicant.stage]}`}
      className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        {applicant.name}
      </p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {applicant.job}
      </p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        지원일 {applicant.appliedAt}
      </p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {PIPELINE_STAGE_LABEL[applicant.stage]}
        {applicant.stage === "final" && applicant.finalResult
          ? ` · ${FINAL_RESULT_LABEL[applicant.finalResult]}`
          : ""}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          aria-label="이전 단계"
          disabled={!canMovePrev}
          onClick={() => onMoveStage(applicant.id, "prev")}
          onKeyDown={handleButtonKeyDown}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 text-sm text-zinc-900 disabled:opacity-40 dark:text-zinc-50"
        >
          ←
        </button>
        {needsFinalPick ? (
          <select
            aria-label="최종 결과"
            value={finalPick}
            onChange={(event) =>
              setFinalPick(event.target.value as FinalResult | "")
            }
            className={`h-8 rounded-md border border-zinc-300 bg-white px-2 text-sm ${
              finalPick === "" ? "text-black/38" : "text-zinc-900"
            }`}
          >
            <option value="">결과</option>
            <option value="passed">합격</option>
            <option value="rejected">불합격</option>
          </select>
        ) : null}
        <button
          type="button"
          aria-label="다음 단계"
          disabled={!canMoveNext}
          onClick={() =>
            onMoveStage(
              applicant.id,
              "next",
              needsFinalPick && finalPick !== "" ? finalPick : null,
            )
          }
          onKeyDown={handleButtonKeyDown}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 text-sm text-zinc-900 disabled:opacity-40 dark:text-zinc-50"
        >
          →
        </button>
      </div>
    </article>
  );
}
