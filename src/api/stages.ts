export const PIPELINE_STAGES = [
  "document_review",
  "interview",
  "offer",
  "final",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const PIPELINE_STAGE_LABEL: Record<PipelineStage, string> = {
  document_review: "서류검토",
  interview: "면접",
  offer: "처우협의",
  final: "최종",
};

export const FINAL_RESULTS = ["passed", "rejected"] as const;

export type FinalResult = (typeof FINAL_RESULTS)[number];

export const FINAL_RESULT_LABEL: Record<FinalResult, string> = {
  passed: "최종합격",
  rejected: "불합격",
};

export function getAdjacentStage(
  stage: PipelineStage,
  direction: "prev" | "next",
): PipelineStage | null {
  const index = PIPELINE_STAGES.indexOf(stage);
  const nextIndex = direction === "next" ? index + 1 : index - 1;
  return PIPELINE_STAGES[nextIndex] ?? null;
}
