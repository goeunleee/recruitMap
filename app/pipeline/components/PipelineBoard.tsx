"use client";

import { JOBS } from "@/src/api/seed";
import { PIPELINE_STAGES } from "@/src/api/stages";
import { useMemo, useState } from "react";
import { useApplicants } from "../hooks/useApplicants";
import { ApplicantDetailPanel } from "./ApplicantDetailPanel";
import { StageColumn } from "./StageColumn";

export function PipelineBoard() {
  const {
    applicants,
    status,
    errorMessage,
    feedback,
    reload,
    moveStage,
    lastMovedId,
    undoLastMove,
    nameQuery,
    setNameQuery,
  } = useApplicants();
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedApplicant =
    applicants.find((applicant) => applicant.id === selectedId) ?? null;

  const filteredApplicants = useMemo(() => {
    const query = nameQuery.trim().toLowerCase();
    return applicants.filter((applicant) => {
      if (query && !applicant.name.toLowerCase().includes(query)) return false;
      if (selectedJobs.length > 0 && !selectedJobs.includes(applicant.job)) {
        return false;
      }
      return true;
    });
  }, [applicants, nameQuery, selectedJobs]);

  function toggleJob(job: string) {
    setSelectedJobs((current) =>
      current.includes(job)
        ? current.filter((item) => item !== job)
        : [...current, job],
    );
  }

  return (
    <div className="flex h-screen flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        채용 파이프라인
      </h1>
      <div className="flex max-w-3xl flex-col gap-3">
        <label className="flex max-w-md flex-col gap-1 text-sm text-zinc-900 dark:text-zinc-50">
          검색
          <input
            type="text"
            value={nameQuery}
            onChange={(event) => setNameQuery(event.target.value)}
            className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-900"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {JOBS.map((job) => {
            const selected = selectedJobs.includes(job);
            return (
              <button
                key={job}
                type="button"
                onClick={() => toggleJob(job)}
                className={
                  selected
                    ? "h-8 rounded-full border border-white bg-white px-4 text-sm text-zinc-900"
                    : "h-8 rounded-full border border-zinc-300 bg-transparent px-4 text-sm text-zinc-900 dark:text-zinc-50"
                }
              >
                {job}
              </button>
            );
          })}
        </div>
      </div>
      <div aria-live="polite" className="min-h-6 text-sm text-red-500">
        {feedback}
      </div>
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
              applicants={filteredApplicants.filter(
                (applicant) => applicant.stage === stage,
              )}
              onMoveStage={moveStage}
              onOpenDetail={setSelectedId}
              lastMovedId={lastMovedId}
              onUndo={undoLastMove}
            />
          ))}
        </div>
      )}
      {selectedApplicant ? (
        <ApplicantDetailPanel
          applicant={selectedApplicant}
          onClose={() => setSelectedId(null)}
        />
      ) : null}
    </div>
  );
}
