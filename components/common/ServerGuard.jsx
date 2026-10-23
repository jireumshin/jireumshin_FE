"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Loading from "@/components/common/Loading";
import { createApiClient, HEALTH_TIMEOUT_MS } from "@/lib/api";

const WAKE_MESSAGES = [
  "법정 불 켜는 중",
  "배심원 입장 중",
  "사건 기록 펼치는 중",
  "판사봉 준비 중",
  "곧 개정합니다",
];

export default function ServerGuard() {
  const router = useRouter();
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    let alive = true;
    // 잠든 서버(Render 무료)가 깨어나는 중이면 에러 대신 로딩 화면
    const slow = setTimeout(() => setWaking(true), 3000);
    createApiClient()
      .get("/health", { timeout: HEALTH_TIMEOUT_MS })
      .catch(() => {
        if (alive) router.replace("/server-error");
      })
      .finally(() => {
        clearTimeout(slow);
        if (alive) setWaking(false);
      });
    return () => {
      alive = false;
      clearTimeout(slow);
    };
  }, [router]);

  if (!waking) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="h-svh w-full max-w-117 border-x border-jj-line">
        <Loading messages={WAKE_MESSAGES} />
      </div>
    </div>
  );
}
