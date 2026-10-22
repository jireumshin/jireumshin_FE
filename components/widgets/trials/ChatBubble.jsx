"use client";

import JurorAvatar from "@/components/common/JurorAvatar";
import { cn } from "@/lib/utils";

// 이번 라운드 게이지 변화 — ▲10 → 75 / ▼5 → 30 / – 35
function GaugeChange({ label, delta, value }) {
  if (typeof value !== "number") return null;
  const d = typeof delta === "number" ? delta : 0;
  return (
    <span
      className={cn(
        "font-round text-[10.5px] font-bold tabular-nums",
        d > 0 ? "text-jj-green" : d < 0 ? "text-jj-red" : "text-jj-muted",
      )}
    >
      {label && <span className="mr-0.5 text-jj-ink/60">{label}</span>}
      {d > 0 ? `▲${d}` : d < 0 ? `▼${Math.abs(d)}` : "–"} → {value}
    </span>
  );
}

export default function ChatBubble({
  role,
  juror,
  emoji,
  content,
  gauge,
  gaugeDelta,
  gaugeB,
  gaugeDeltaB,
}) {
  if (role === "USER") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-jj-navy px-3.5 py-2 font-round text-[12.5px] leading-relaxed text-white shadow-hard-sm">
          {content}
        </div>
      </div>
    );
  }
  const versus = typeof gaugeB === "number";
  return (
    <div className="flex items-start gap-2">
      <JurorAvatar name={juror} emoji={emoji} size="sm" />
      <div className="max-w-[80%]">
        <div className="mb-0.5 flex flex-wrap items-center gap-x-1.5 font-display text-[11px] text-jj-ink/70">
          {juror}
          <GaugeChange label={versus ? "A" : undefined} delta={gaugeDelta} value={gauge} />
          {versus && <GaugeChange label="B" delta={gaugeDeltaB} value={gaugeB} />}
        </div>
        <div className="rounded-2xl rounded-tl-sm border border-jj-line bg-jj-paper px-3.5 py-2 font-round text-[12.5px] leading-relaxed text-jj-ink/90 shadow-hard-sm">
          {content}
        </div>
      </div>
    </div>
  );
}
