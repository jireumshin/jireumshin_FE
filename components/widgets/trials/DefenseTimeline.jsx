"use client";

import { Fragment } from "react";

import ChatBubble from "@/components/widgets/trials/ChatBubble";

function RoundDivider({ children }) {
  return (
    <div className="flex items-center gap-2 py-1 font-round text-[10.5px] text-jj-muted">
      <span className="h-px flex-1 bg-jj-ink/15" />
      {children}
      <span className="h-px flex-1 bg-jj-ink/15" />
    </div>
  );
}

// 변론 대화 흐름 — 0라운드(1심 의견) + 라운드별 구분선 + 메시지(게이지 변화 포함)
// onToggleHidden(message)을 주면 판례 주인이 진술마다 공개본 숨김을 토글할 수 있음
export default function DefenseTimeline({ trial, messages, onToggleHidden }) {
  const jury = Array.isArray(trial.jury) ? trial.jury : [];

  return (
    <>
      {jury.length > 0 && (
        <>
          <RoundDivider>0라운드 · 1심 판결</RoundDivider>
          {jury.map((j) => (
            <ChatBubble
              key={`r0-${j.juror}`}
              role="JUROR"
              juror={j.juror}
              emoji={j.emoji}
              content={j.argument}
            />
          ))}
        </>
      )}

      {messages.map((m, i) => (
        <Fragment key={m.id}>
          {m.round !== messages[i - 1]?.round && (
            <RoundDivider>{m.round}라운드</RoundDivider>
          )}
          <ChatBubble
            role={m.role}
            juror={m.juror}
            emoji={m.emoji}
            content={m.content}
            gauge={m.gauge}
            gaugeDelta={m.gaugeDelta}
            gaugeB={m.gaugeB}
            gaugeDeltaB={m.gaugeDeltaB}
            hidden={m.hidden}
            onToggleHidden={onToggleHidden && (() => onToggleHidden(m))}
          />
        </Fragment>
      ))}
    </>
  );
}
