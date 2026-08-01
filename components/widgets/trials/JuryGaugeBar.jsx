"use client";

import { cn } from "@/lib/utils";

// 배심원 1명의 설득 게이지 바.
export default function JuryGaugeBar({ juror, emoji, gauge, vote }) {
  const inno = vote === "NOT_GUILTY";
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-base leading-none">{emoji}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between font-round text-[10px] text-jj-ink/70">
          <span className="truncate">{juror}</span>
          <span className={inno ? "text-jj-green" : "text-jj-red"}>
            {gauge}
          </span>
        </div>
        {/* 트랙 + 임계(50) 마커 */}
        <div className="relative mt-0.5 h-2.5 w-full overflow-hidden rounded-full border-2 border-jj-ink bg-jj-app">
          <div
            className={cn(
              "h-full transition-all duration-700 ease-out",
              inno ? "bg-jj-green" : "bg-jj-red",
            )}
            style={{ width: `${gauge}%` }}
          />
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-jj-ink/40" />
        </div>
      </div>
    </div>
  );
}
