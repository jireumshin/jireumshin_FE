"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { createApiClient } from "@/lib/api";

export default function ServerGuard() {
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    createApiClient()
      .get("/health", { timeout: 5000 })
      .catch(() => {
        if (alive) router.replace("/server-error");
      });
    return () => {
      alive = false;
    };
  }, [router]);

  return null;
}
