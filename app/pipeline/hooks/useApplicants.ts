"use client";

import { listApplicants } from "@/src/api/applicants";
import type { Applicant } from "@/src/api/types";
import { useCallback, useEffect, useState } from "react";

export function useApplicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  useEffect(() => {
    load();
  }, [load]);

  return { applicants, status, errorMessage, reload: load };
}
