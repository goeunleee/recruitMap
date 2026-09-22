import type { FinalResult, PipelineStage } from "./stages";

export type Applicant = {
  id: string;
  name: string;
  job: string;
  appliedAt: string;
  birthDate: string;
  gender: "남" | "여";
  stage: PipelineStage;
  finalResult: FinalResult | null;
  version: number;
};
