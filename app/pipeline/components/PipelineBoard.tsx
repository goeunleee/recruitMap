import { PIPELINE_STAGES } from "@/src/api/stages";
import { MOCK_APPLICANTS } from "../mockApplicants";
import { StageColumn } from "./StageColumn";

export function PipelineBoard() {
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
      <div className="grid min-h-0 flex-1 grid-cols-4 gap-3">
        {PIPELINE_STAGES.map((stage) => (
          <StageColumn
            key={stage}
            stage={stage}
            applicants={MOCK_APPLICANTS.filter(
              (applicant) => applicant.stage === stage,
            )}
          />
        ))}
      </div>
    </div>
  );
}
