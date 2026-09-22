import type { FinalResult, PipelineStage } from "./stages";

export type Applicant = {
  id: string;
  name: string;
  job: string;
  appliedAt: string;
  stage: PipelineStage;
  finalResult: FinalResult | null;
  version: number;
};
