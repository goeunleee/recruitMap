"use client";

import { listApplicants, placeAtStageStart, updateApplicantStage } from "@/src/api/applicants";
import {
  getAdjacentStage,
  type FinalResult,
  type PipelineStage,
} from "@/src/api/stages";
import type { Applicant } from "@/src/api/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type LastMove = {
  id: string;
  stage: PipelineStage;
  finalResult: FinalResult | null;
};

type PipelineState = {
  applicants: Applicant[];
  status: "loading" | "error" | "ready";
  errorMessage: string | null;
  feedback: string | null;
  lastMove: LastMove | null;
  nameQuery: string;
  setNameQuery: (nameQuery: string) => void;
  load: () => void;
  moveStage: (
    id: string,
    direction: "prev" | "next",
    finalResult?: FinalResult | null,
  ) => Promise<void>;
  undoLastMove: () => Promise<void>;
};

export const usePipelineStore = create<PipelineState>()(
  persist(
    (set, get) => ({
      applicants: [],
      status: "loading",
      errorMessage: null,
      feedback: null,
      lastMove: null,
      nameQuery: "",
      setNameQuery: (nameQuery) => set({ nameQuery }),
      load: () => {
        set({ status: "loading", errorMessage: null });
        void listApplicants()
          .then((data) => {
            set({ applicants: data, status: "ready" });
          })
          .catch(() => {
            set({
              applicants: [],
              status: "error",
              errorMessage: "목록을 불러오지 못했습니다.",
            });
          });
      },
      moveStage: async (id, direction, finalResult) => {
        const current = get().applicants.find((item) => item.id === id);
        if (!current) return;
        const nextStage = getAdjacentStage(current.stage, direction);
        if (!nextStage) return;
        if (
          nextStage === "final" &&
          finalResult !== "passed" &&
          finalResult !== "rejected"
        ) {
          return;
        }
        const snapshotList = get().applicants;
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
        set({
          feedback: null,
          applicants: placeAtStageStart(snapshotList, optimistic),
        });
        try {
          const updated = await updateApplicantStage(
            id,
            nextStage,
            nextFinalResult,
          );
          set({
            applicants: placeAtStageStart(get().applicants, updated),
            lastMove: previous,
          });
        } catch {
          set({
            applicants: snapshotList,
            feedback: "단계 이동에 실패했습니다.",
          });
        }
      },
      undoLastMove: async () => {
        const lastMove = get().lastMove;
        if (!lastMove) return;
        const current = get().applicants.find((item) => item.id === lastMove.id);
        if (!current) return;
        const snapshotList = get().applicants;
        const restored = {
          ...current,
          stage: lastMove.stage,
          finalResult: lastMove.finalResult,
        };
        set({
          feedback: null,
          lastMove: null,
          applicants: placeAtStageStart(snapshotList, restored),
        });
        try {
          const updated = await updateApplicantStage(
            lastMove.id,
            lastMove.stage,
            lastMove.finalResult,
          );
          set({ applicants: placeAtStageStart(get().applicants, updated) });
        } catch {
          set({
            applicants: snapshotList,
            lastMove,
            feedback: "되돌리기에 실패했습니다.",
          });
        }
      },
    }),
    {
      name: "recruitmap.search",
      partialize: (state) => ({ nameQuery: state.nameQuery }),
    },
  ),
);
