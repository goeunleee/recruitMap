"use client";

import { listApplicants, placeAtStageStart, updateApplicantStage } from "@/src/api/applicants";
import {
  getAdjacentStage,
  type FinalResult,
  type PipelineStage,
} from "@/src/api/stages";
import type { Applicant } from "@/src/api/types";
import { useCallback, useEffect, useRef, useState } from "react";

type LastMove = {
  id: string;
  stage: PipelineStage;
  finalResult: FinalResult | null;
};

export function useApplicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const applicantsRef = useRef(applicants);
  applicantsRef.current = applicants;

  const load = useCallback(() => {
    setStatus("loading");
    setErrorMessage(null);
    void listApplicants()
      .then((data) => {
        setApplicants(data);
        setStatus("ready");
      })
      .catch(() => {
        setApplicants([]);
        setStatus("error");
        setErrorMessage("목록을 불러오지 못했습니다.");
      });
  }, []);

  const moveStage = useCallback(
    async (
      id: string,
      direction: "prev" | "next",
      finalResult?: FinalResult | null,
    ) => {
      const current = applicantsRef.current.find((item) => item.id === id);
      if (!current) return;
      const nextStage = getAdjacentStage(current.stage, direction);
      if (!nextStage) return;
      if (nextStage === "final" && finalResult !== "passed" && finalResult !== "rejected") {
        return;
      }
      const snapshotList = applicantsRef.current;
      const nextFinalResult: FinalResult | null =
        nextStage === "final" &&
        (finalResult === "passed" || finalResult === "rejected")
          ? finalResult
          : null;
      const optimistic = {
        ...current,
        stage: nextStage,
        finalResult: nextFinalResult,
      };
      const previous: LastMove = {
        id,
        stage: current.stage,
        finalResult: current.finalResult,
      };
      setFeedback(null);
      setApplicants((items) => placeAtStageStart(items, optimistic));
      try {
        const updated = await updateApplicantStage(
          id,
          nextStage,
          nextFinalResult,
        );
        setApplicants((items) => placeAtStageStart(items, updated));
        setLastMove(previous);
      } catch {
        setApplicants(snapshotList);
        setFeedback("단계 이동에 실패했습니다.");
      }
    },
    [],
  );

  const undoLastMove = useCallback(async () => {
    if (!lastMove) return;
    const current = applicantsRef.current.find((item) => item.id === lastMove.id);
    if (!current) return;
    const snapshotList = applicantsRef.current;
    const target = lastMove;
    const restored = {
      ...current,
      stage: target.stage,
      finalResult: target.finalResult,
    };
    setFeedback(null);
    setLastMove(null);
    setApplicants((items) => placeAtStageStart(items, restored));
    try {
      const updated = await updateApplicantStage(
        target.id,
        target.stage,
        target.finalResult,
      );
      setApplicants((items) => placeAtStageStart(items, updated));
    } catch {
      setApplicants(snapshotList);
      setLastMove(target);
      setFeedback("되돌리기에 실패했습니다.");
    }
  }, [lastMove]);

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
    lastMovedId: lastMove?.id ?? null,
    undoLastMove,
  };
}
