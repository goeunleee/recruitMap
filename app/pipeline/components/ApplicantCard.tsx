import {
  FINAL_RESULT_LABEL,
  PIPELINE_STAGE_LABEL,
} from "@/src/api/stages";
import type { Applicant } from "@/src/api/types";

export function ApplicantCard({ applicant }: { applicant: Applicant }) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
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
    </article>
  );
}
