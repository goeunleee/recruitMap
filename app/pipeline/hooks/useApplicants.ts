"use client";

import { useEffect } from "react";
import { usePipelineStore, hasBoardChanges } from "../store/usePipelineStore";

export function useApplicants() {
  const applicants = usePipelineStore((state) => state.applicants);
  const status = usePipelineStore((state) => state.status);
  const errorMessage = usePipelineStore((state) => state.errorMessage);
  const feedback = usePipelineStore((state) => state.feedback);
  const lastMovedId = usePipelineStore((state) => state.lastMove?.id ?? null);
  const load = usePipelineStore((state) => state.load);
  const moveStage = usePipelineStore((state) => state.moveStage);
  const undoLastMove = usePipelineStore((state) => state.undoLastMove);
  const refresh = usePipelineStore((state) => state.refresh);
  const hasChanges = usePipelineStore((state) =>
    hasBoardChanges(state.applicants, state.baseline),
  );
  const nameQuery = usePipelineStore((state) => state.nameQuery);
  const setNameQuery = usePipelineStore((state) => state.setNameQuery);

  useEffect(() => {
    load();
  }, [load]);

  return {
    applicants,
    status,
    errorMessage,
    feedback,
    reload: load,
    moveStage,
    lastMovedId,
    undoLastMove,
    refresh,
    hasChanges,
    nameQuery,
    setNameQuery,
  };
}
