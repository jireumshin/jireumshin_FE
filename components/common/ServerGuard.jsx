"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createApiClient, HEALTH_TIMEOUT_MS } from "@/lib/api";

const WAKE_TOAST_ID = "server-wake";

export default function ServerGuard() {
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    // 잠든 서버가 깨어나는 중이면 에러 대신 안내
    const slow = setTimeout(
      () => toast.loading("재판소 문 여는 중… (최대 1분)", { id: WAKE_TOAST_ID }),
      3000,
    );
    createApiClient()
      .get("/health", { timeout: HEALTH_TIMEOUT_MS })
      .catch(() => {
        if (alive) router.replace("/server-error");
      })
      .finally(() => {
        clearTimeout(slow);
        toast.dismiss(WAKE_TOAST_ID);
      });
    return () => {
      alive = false;
      clearTimeout(slow);
      toast.dismiss(WAKE_TOAST_ID);
    };
  }, [router]);

  return null;
}
