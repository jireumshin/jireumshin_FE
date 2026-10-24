"use client";

import { Eye, EyeOff } from "lucide-react";

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

// 판례 주인용 — 공개본에서 이 진술 숨기기/보이기
function HideToggle({ hidden, onToggle }) {
  const Icon = hidden ? EyeOff : Eye;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={hidden}
      aria-label={hidden ? "공개본에 다시 보이기" : "공개본에서 숨기기"}
      className={cn(
        "grid h-7 w-7 flex-none place-items-center self-center rounded-full border border-jj-line transition-transform active:scale-90",
        hidden ? "bg-jj-ink text-white" : "bg-jj-paper text-jj-muted",
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
    </button>
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
  hidden = false,
  onToggleHidden,
}) {
  // 공개본에서 주인이 숨긴 진술은 내용 없이 내려옴
  const redacted = content === null;
  const text = redacted ? "작성자가 숨긴 진술이에요" : content;
  const toggle = onToggleHidden && <HideToggle hidden={hidden} onToggle={onToggleHidden} />;

  if (role === "USER") {
    return (
      <div className="flex justify-end gap-1.5">
        {toggle}
        <div
          className={cn(
            "max-w-[80%] rounded-2xl rounded-tr-sm px-3.5 py-2 font-round text-[12.5px] leading-relaxed shadow-hard-sm",
            redacted ? "border border-dashed border-jj-line bg-jj-app text-jj-muted" : "bg-jj-navy text-white",
            hidden && !redacted && "opacity-45",
          )}
        >
          {text}
        </div>
      </div>
    );
  }
  const versus = typeof gaugeB === "number";
  return (
    <div className="flex items-start gap-2">
      <JurorAvatar name={juror} emoji={emoji} size="sm" />
      <div className={cn("max-w-[80%]", hidden && !redacted && "opacity-45")}>
        <div className="mb-0.5 flex flex-wrap items-center gap-x-1.5 font-display text-[11px] text-jj-ink/70">
          {juror}
          <GaugeChange label={versus ? "A" : undefined} delta={gaugeDelta} value={gauge} />
          {versus && <GaugeChange label="B" delta={gaugeDeltaB} value={gaugeB} />}
        </div>
        <div
          className={cn(
            "rounded-2xl rounded-tl-sm border px-3.5 py-2 font-round text-[12.5px] leading-relaxed shadow-hard-sm",
            redacted ? "border-dashed border-jj-line bg-jj-app text-jj-muted" : "border-jj-line bg-jj-paper text-jj-ink/90",
          )}
        >
          {text}
        </div>
      </div>
      {toggle}
    </div>
  );
}
