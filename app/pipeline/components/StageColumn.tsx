import { PIPELINE_STAGE_LABEL, type FinalResult, type PipelineStage } from "@/src/api/stages";
import type { Applicant } from "@/src/api/types";
import { ApplicantCard } from "./ApplicantCard";

export function StageColumn({
  stage,
  applicants,
  onMoveStage,
  onOpenDetail,
  lastMovedId,
  onUndo,
}: {
  stage: PipelineStage;
  applicants: Applicant[];
  onMoveStage: (
    id: string,
    direction: "prev" | "next",
    finalResult?: FinalResult | null,
  ) => void;
  onOpenDetail: (id: string) => void;
  lastMovedId: string | null;
  onUndo: () => void;
}) {
  return (
    <section className="flex min-h-0 flex-col rounded-lg bg-white">
      <h2 className="p-3 text-base font-semibold text-zinc-900">
        {PIPELINE_STAGE_LABEL[stage]} ({applicants.length})
      </h2>
      <div className="flex flex-col gap-2 overflow-y-auto p-3 pt-0">
        {applicants.map((applicant) => (
          <ApplicantCard
            key={applicant.id}
            applicant={applicant}
            onMoveStage={onMoveStage}
            onOpenDetail={onOpenDetail}
            canUndo={applicant.id === lastMovedId}
            onUndo={onUndo}
          />
        ))}
      </div>
    </section>
  );
}
