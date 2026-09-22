"use client";

import { FINAL_RESULT_LABEL, PIPELINE_STAGE_LABEL } from "@/src/api/stages";
import type { Applicant } from "@/src/api/types";
import { useEffect, useRef } from "react";

export function ApplicantDetailPanel({
  applicant,
  onClose,
}: {
  applicant: Applicant;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    function onPointerDown(event: PointerEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onClose]);

  return (
    <aside
      ref={panelRef}
      role="dialog"
      aria-labelledby="applicant-detail-title"
      className="fixed inset-y-0 right-0 z-10 flex w-80 flex-col border-l border-zinc-200 bg-white"
    >
      <div className="flex items-center justify-between border-b border-zinc-200 p-4">
        <h2
          id="applicant-detail-title"
          className="text-base font-semibold text-zinc-900"
        >
          상세
        </h2>
        <button
          type="button"
          aria-label="상세 닫기"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 text-sm text-zinc-900"
        >
          ×
        </button>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <p className="text-lg font-semibold text-zinc-900">{applicant.name}</p>
        <p className="text-sm text-zinc-600">{applicant.job}</p>
        <p className="text-sm text-zinc-600">지원일 {applicant.appliedAt}</p>
        <p className="text-sm text-zinc-600">생년월일 {applicant.birthDate}</p>
        <p className="text-sm text-zinc-600">성별 {applicant.gender}</p>
        <p className="text-sm text-zinc-600">
          {PIPELINE_STAGE_LABEL[applicant.stage]}
          {applicant.stage === "final" && applicant.finalResult
            ? ` · ${FINAL_RESULT_LABEL[applicant.finalResult]}`
            : ""}
        </p>
      </div>
    </aside>
  );
}
