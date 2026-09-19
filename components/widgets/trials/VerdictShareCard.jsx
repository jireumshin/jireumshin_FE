"use client";

import { forwardRef } from "react";
import ProductThumb from "@/components/common/ProductThumb";
import JurorAvatar from "@/components/common/JurorAvatar";
import VerdictChip from "@/components/widgets/trials/VerdictChip";
import { formatWon, tally } from "@/lib/trial";
import { cn } from "@/lib/utils";

const GRAD = {
  green: "linear-gradient(160deg, #1ECFA0 0%, #0EA47B 100%)",
  red: "linear-gradient(160deg, #FF6B6B 0%, #F03E3E 100%)",
  navy: "linear-gradient(160deg, #2E3560 0%, #1B2140 100%)",
};

const VerdictShareCard = forwardRef(function VerdictShareCard({ trial }, ref) {
  const versus = trial.mode === "VERSUS";

  return (
    <div
      ref={ref}
      className="w-full overflow-hidden rounded-2xl border border-jj-line bg-jj-paper font-sans shadow-hard"
    >
      {/* 브랜드 헤더 */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="font-display text-[13px] text-jj-ink">지름신 재판소</span>
        <span className="rounded-full bg-jj-violet-soft px-2.5 py-0.5 font-round text-[10px] text-jj-violet">
          판결문
        </span>
      </div>

      {versus ? <VersusBody trial={trial} /> : <SingleBody trial={trial} />}

      {/* 판결 요지 */}
      {trial.summary && (
        <div className="mx-4 mb-3 rounded-xl bg-jj-app px-3.5 py-2.5">
          <div className="mb-0.5 font-round text-[10px] text-jj-muted">📜 판결 요지</div>
          <p className="line-clamp-2 font-round text-[11.5px] leading-relaxed text-jj-ink/85">
            {trial.summary}
          </p>
        </div>
      )}

      <div className="border-t border-jj-line px-4 py-2 text-center font-round text-[10.5px] text-jj-muted">
        나도 재판받기 · <span className="font-display text-jj-ink">jireumshin.shop</span>
      </div>
    </div>
  );
});

function VerdictHero({ grad, label, big, sub, chipLabel }) {
  return (
    <div
      className="relative flex flex-col items-center overflow-hidden px-5 pb-4 pt-1 text-center"
      style={{ background: GRAD[grad] }}
    >
      <span className="pointer-events-none absolute -right-4 -top-5 select-none text-[100px] leading-none text-white/10">
        ⚖
      </span>
      <img
        src="/assets/judge.png"
        alt=""
        className="relative h-[72px] w-[72px] object-contain drop-shadow"
        draggable={false}
      />
      <div className="relative font-round text-[11px] tracking-wide text-white/85">
        {label}
      </div>
      <div className="relative mt-0.5 font-display text-[28px] leading-none text-white">
        {big}
      </div>
      {sub && (
        <div className="relative mt-1 max-w-[90%] truncate px-1 font-display text-[15px] leading-tight text-white/95">
          {sub}
        </div>
      )}
      <div className="relative mt-2.5 inline-block rounded-full bg-white/20 px-3.5 py-1 font-round text-[12px] text-white">
        {chipLabel}
      </div>
    </div>
  );
}

function StatTile({ label, value, tone }) {
  return (
    <div className="flex-1 rounded-xl bg-jj-app px-3 py-2 text-center">
      <div className="font-round text-[10px] text-jj-muted">{label}</div>
      <div className={cn("mt-0.5 font-display text-[18px] leading-tight", tone)}>
        {value}
      </div>
    </div>
  );
}

function ReasonBlock({ label, text }) {
  if (!text) return null;
  return (
    <div className="mx-4 mb-3 rounded-xl bg-jj-app px-3.5 py-2.5">
      <div className="mb-0.5 font-round text-[10px] text-jj-muted">
        🧾 기소 사유{label ? ` ${label}` : ""}
      </div>
      <p className="line-clamp-2 font-round text-[11.5px] leading-relaxed text-jj-ink/80">
        “{text}”
      </p>
    </div>
  );
}

function JuryList({ title, jury, versus }) {
  if (!jury.length) return null;
  return (
    <div className="mx-4 mb-3 rounded-xl bg-jj-app px-3.5 py-3">
      <div className="mb-2 font-display text-[12px] text-jj-ink">{title}</div>
      <ul className="flex flex-col gap-2">
        {jury.map((j) => (
          <li key={j.juror} className="flex items-start gap-2">
            <JurorAvatar name={j.juror} emoji={j.emoji} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-[12px]">{j.juror}</span>
                {versus ? (
                  <span className="font-round text-[10px] text-jj-muted">
                    A <b className={j.scoreA >= j.scoreB ? "text-jj-green" : "text-jj-ink"}>{j.scoreA}</b>
                    {" · "}B <b className={j.scoreB > j.scoreA ? "text-jj-green" : "text-jj-ink"}>{j.scoreB}</b>
                  </span>
                ) : (
                  <VerdictChip verdict={j.vote} className="px-1.5 py-0 text-[9px]" />
                )}
              </div>
              {j.argument && (
                <p className="mt-0.5 line-clamp-2 font-round text-[10.5px] leading-relaxed text-jj-ink/75">
                  {j.argument}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SingleBody({ trial }) {
  const guilty = trial.verdict === "GUILTY";
  const jury = Array.isArray(trial.jury) ? trial.jury : [];
  const t = tally(jury, trial.verdict);
  return (
    <>
      <VerdictHero
        grad={guilty ? "red" : "green"}
        label="최종 판결"
        big={guilty ? "유죄" : "무죄"}
        sub={guilty ? "사지 마세요" : "사도 돼요"}
        chipLabel={`배심원 ${t.label}`}
      />

      {/* 상품 */}
      <div className="mx-4 mt-3 flex items-center gap-3 rounded-xl bg-jj-app px-3.5 py-2.5">
        <ProductThumb imageUrl={trial.imageUrl} name={trial.itemName} size="sm" share />
        <div className="min-w-0 flex-1 truncate font-display text-[14px] text-jj-ink">
          {trial.itemName}
        </div>
        <div className="shrink-0 font-display text-[14px] text-jj-violet">
          {formatWon(trial.price)}
        </div>
      </div>

      {/* 스탯 */}
      <div className="mx-4 mb-3 mt-2 flex gap-2">
        <StatTile label="예상 후회" value={`${trial.regretIndex}%`} tone="text-jj-red" />
        <StatTile
          label={guilty ? "아낀 돈" : "쓴 돈"}
          value={formatWon(trial.price)}
          tone="text-jj-green"
        />
      </div>

      <ReasonBlock text={trial.reason} />
      <JuryList title="⚖ 배심원 평결" jury={jury} />
    </>
  );
}

function VersusBody({ trial }) {
  const result = trial.versusResult; // 'A' | 'B' | 'NEITHER'
  const aWin = result === "A";
  const bWin = result === "B";
  const neither = result === "NEITHER";
  const jury = Array.isArray(trial.jury) ? trial.jury : [];

  return (
    <>
      <VerdictHero
        grad={neither ? "navy" : "green"}
        label="비교 판결"
        big={neither ? "둘 다 별로" : aWin ? "🅰 승" : "🅱 승"}
        sub={neither ? null : aWin ? trial.itemName : trial.itemNameB}
        chipLabel={neither ? "지금은 참아요" : "이걸 사세요"}
      />

      <div className="mx-4 mb-3 mt-3 flex flex-col gap-2">
        <CardRow badge="A" name={trial.itemName} price={trial.price} imageUrl={trial.imageUrl} win={aWin} />
        <CardRow badge="B" name={trial.itemNameB} price={trial.priceB} imageUrl={trial.imageUrlB} win={bWin} />
      </div>

      <ReasonBlock label="🅰" text={trial.reason} />
      <ReasonBlock label="🅱" text={trial.reasonB} />
      <JuryList title="⚖ 배심원 비교" jury={jury} versus />
    </>
  );
}

function CardRow({ badge, name, price, imageUrl, win }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2",
        win ? "bg-jj-green-soft" : "bg-jj-app",
      )}
    >
      <span className="grid h-5 w-5 flex-none place-items-center rounded-md bg-jj-paper font-display text-[10px] text-jj-ink">
        {badge}
      </span>
      <ProductThumb imageUrl={imageUrl} name={name} size="sm" share />
      <div className="min-w-0 flex-1 truncate font-display text-[13px] text-jj-ink">{name}</div>
      {win && <span className="shrink-0 font-round text-[11px] text-jj-green">👑 승</span>}
      <div className="shrink-0 font-display text-[12px] text-jj-violet">{formatWon(price)}</div>
    </div>
  );
}

export default VerdictShareCard;
