"use client";

import { PIPELINE_STAGES } from "@/src/api/stages";
import { useApplicants } from "../hooks/useApplicants";
import { StageColumn } from "./StageColumn";

export function PipelineBoard() {
  const { applicants, status, errorMessage, reload } = useApplicants();

  return (
    <div className="flex h-screen flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        채용 파이프라인
      </h1>
      <label className="flex max-w-md flex-col gap-1 text-sm text-zinc-900 dark:text-zinc-50">
        검색
        <input
          type="text"
          className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>
      {status === "loading" ? (
        <p role="status">불러오는 중...</p>
      ) : status === "error" ? (
        <div className="flex flex-col items-start gap-3">
          <p role="alert">{errorMessage}</p>
          <button
            type="button"
            onClick={reload}
            className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-medium dark:border-zinc-600"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-4 gap-3">
          {PIPELINE_STAGES.map((stage) => (
            <StageColumn
              key={stage}
              stage={stage}
              applicants={applicants.filter(
                (applicant) => applicant.stage === stage,
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
