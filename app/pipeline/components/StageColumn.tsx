import { PIPELINE_STAGE_LABEL, type PipelineStage } from "@/src/api/stages";
import type { Applicant } from "@/src/api/types";
import { ApplicantCard } from "./ApplicantCard";

export function StageColumn({
  stage,
  applicants,
}: {
  stage: PipelineStage;
  applicants: Applicant[];
}) {
  return (
    <section className="flex min-h-0 flex-col rounded-lg bg-zinc-100 dark:bg-zinc-900/60">
      <h2 className="p-3 text-base font-semibold text-zinc-900 dark:text-zinc-50">
        {PIPELINE_STAGE_LABEL[stage]} ({applicants.length})
      </h2>
      <div className="flex flex-col gap-2 overflow-y-auto p-3 pt-0">
        {applicants.map((applicant) => (
          <ApplicantCard key={applicant.id} applicant={applicant} />
        ))}
      </div>
    </section>
  );
}
