"use client";

import { forwardRef } from "react";
import ProductThumb from "@/components/common/ProductThumb";
import { formatWon, tally } from "@/lib/trial";

const VerdictShareCard = forwardRef(function VerdictShareCard({ trial }, ref) {
  const guilty = trial.verdict === "GUILTY";
  const jury = Array.isArray(trial.jury) ? trial.jury : [];
  const t = tally(jury, trial.verdict);

  return (
    <div
      ref={ref}
      className="w-85 shrink-0 border-[3px] border-jj-ink bg-jj-paper font-sans shadow-hard"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b-[3px] border-jj-ink bg-jj-yellow px-4 py-2.5">
        <span className="font-display text-[15px] text-jj-ink">
          ⚖ 지름신 재판소
        </span>
        <span className="rounded-full border-2 border-jj-ink bg-jj-paper px-2 py-0.5 font-round text-[10px] text-jj-ink">
          판결문
        </span>
      </div>

      {/* 판결 배너 */}
      <div
        className={`px-5 py-5 text-center text-white ${
          guilty ? "bg-jj-red" : "bg-jj-green"
        }`}
      >
        <div className="font-round text-[11px] tracking-wide opacity-90">
          최종 판결
        </div>
        <div className="mt-1 font-display text-[26px] leading-tight">
          {guilty ? "유죄 · 사지 마세요" : "무죄 · 사도 돼요"}
        </div>
        <div className="mt-2.5 inline-block rounded-full border-2 border-jj-ink bg-black/20 px-3 py-1 font-round text-[12px]">
          배심원 {t.label}
        </div>
      </div>

      {/* 기소 대상 */}
      <div className="flex items-center gap-3 border-b-[2.5px] border-jj-ink px-4 py-3">
        <ProductThumb
          imageUrl={trial.imageUrl}
          name={trial.itemName}
          size="md"
          share
        />
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[15px] text-jj-ink">
            {trial.itemName}
          </div>
          {trial.reason && (
            <div className="mt-0.5 line-clamp-3 font-round text-[11px] leading-snug text-jj-muted">
              “{trial.reason}”
            </div>
          )}
        </div>
        <div className="shrink-0 font-display text-[14px] text-jj-violet">
          {formatWon(trial.price)}
        </div>
      </div>

      {/* 판결 요지 */}
      {trial.summary && (
        <div className="bg-jj-ink px-4 py-3 text-white">
          <div className="mb-1 font-round text-[10px] text-jj-yellow">
            📜 판결 요지
          </div>
          <p className="line-clamp-3 text-[12px] leading-relaxed">
            {trial.summary}
          </p>
        </div>
      )}

      {/* 통계 + 푸터 */}
      <div className="flex items-stretch border-t-[2.5px] border-jj-ink">
        <div className="flex-1 border-r-[2.5px] border-jj-ink px-3 py-2.5 text-center">
          <div className="font-round text-[10px] text-jj-muted">예상 후회</div>
          <div className="font-display text-[20px] leading-tight text-jj-red">
            {trial.regretIndex}%
          </div>
        </div>
        <div className="flex-1 px-3 py-2.5 text-center">
          <div className="font-round text-[10px] text-jj-muted">
            {guilty ? "아낀 돈" : "쓴 돈"}
          </div>
          <div className="font-display text-[20px] leading-tight text-jj-green">
            {formatWon(trial.price)}
          </div>
        </div>
      </div>

      <div className="border-t-[2.5px] border-jj-ink bg-jj-app px-4 py-2 text-center font-round text-[11px] text-jj-muted">
        나도 재판받기 · <span className="text-jj-ink">jireumshin.shop</span>
      </div>
    </div>
  );
});

export default VerdictShareCard;
