"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Send, ScrollText } from "lucide-react";

import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";
import { Textarea } from "@/components/ui/textarea";
import VerdictChip from "@/components/widgets/trials/VerdictChip";
import JuryGaugeBar from "@/components/widgets/trials/JuryGaugeBar";
import ChatBubble from "@/components/widgets/trials/ChatBubble";
import ProductThumb from "@/components/common/ProductThumb";
import { submitDefense } from "@/stores/trialsSlice";
import { gaugesFor, defenseInfo, formatWon } from "@/lib/trial";

// 판결 후 배심원을 설득해 표를 뒤집는 변론 챗.
export default function DefenseChat({ trial, onUpdate, onExit }) {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [deltas, setDeltas] = useState(null); // 직전 변론 대비 배심원별 증감
  const threadRef = useRef(null);

  const messages = Array.isArray(trial.messages) ? trial.messages : [];
  const gauges = gaugesFor(trial);
  const { closed, inExtension, roundsLeft } = defenseInfo(trial);

  // 새 메시지·전송 상태 변화 시 맨 아래로
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, sending]);

  const onSend = async () => {
    const message = text.trim();
    if (!message || sending || closed) return;
    // 전송 직전 게이지 스냅샷 → 응답 후 증감 계산용
    const before = Object.fromEntries(gauges.map((g) => [g.juror, g.gauge]));
    setSending(true);
    try {
      const updated = await dispatch(
        submitDefense({ id: trial.id, message }),
      ).unwrap();
      const next = {};
      gaugesFor(updated).forEach((g) => {
        next[g.juror] = g.gauge - (before[g.juror] ?? g.gauge);
      });
      setDeltas(next);
      onUpdate(updated);
      setText("");
    } catch (e) {
      toast.error(typeof e === "string" ? e : "변론 전달에 실패했어요");
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const inputDock = closed ? (
    <div className="p-3">
      <BrutalButton tone="ink" onClick={onExit} className="w-full">
        <span className="inline-flex items-center gap-2">
          <ScrollText className="h-4 w-4" strokeWidth={2.5} />
          판결 결과 보기
        </span>
      </BrutalButton>
    </div>
  ) : (
    <div className="flex items-end gap-2 p-3">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        maxLength={500}
        disabled={sending}
        placeholder="못다 한 사정을 솔직히 적어보세요"
        className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-jj-line bg-jj-paper font-round text-[13px] shadow-hard-sm focus-visible:ring-0"
      />
      <BrutalButton
        tone="yellow"
        onClick={onSend}
        disabled={sending || !text.trim()}
        className="flex-none px-4 py-3 disabled:opacity-50"
      >
        <Send className="h-4 w-4" strokeWidth={2.5} />
      </BrutalButton>
    </div>
  );

  return (
    <Layout
      headerProps={{
        subtitle: closed
          ? "변론 종료"
          : inExtension
            ? `동점 연장전 · ${roundsLeft}회`
            : `변론 · 남은 기회 ${roundsLeft}회`,
      }}
      showBottomNavigation
      bottomNavigation={inputDock}
      noScroll
    >
      <div className="flex h-full flex-col">
        {/* 게이지 헤더 (고정) */}
        <div className="shrink-0 border-b-2 border-jj-ink/15 bg-jj-paper px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-display text-xs">⚖ 배심원 심증 현황</span>
            <VerdictChip
              verdict={trial.verdict}
              jury={trial.jury}
              className="px-2 py-0 text-[10px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {gauges.map((g) => (
              <JuryGaugeBar key={g.juror} {...g} delta={deltas?.[g.juror]} />
            ))}
          </div>
          {inExtension && (
            <div className="mt-2.5 rounded-lg border border-jj-line bg-jj-violet px-3 py-1.5 text-center font-round text-[11px] text-white">
              ⚡ 2:2 동점! 연장전이에요 — 중립 <b>🔮 팩트봇</b>을 넘기면
              뒤집혀요
            </div>
          )}
        </div>

        {/* 대화 스레드 (스크롤) */}
        <div
          ref={threadRef}
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
        >
          {/* 기소 개요 — 어떤 지름을 무슨 사유로 변호 중인지 */}
          <div className="rounded-xl border border-jj-line bg-jj-paper px-3.5 py-3 shadow-hard-sm">
            <div className="flex items-center gap-2.5">
              <ProductThumb
                imageUrl={trial.imageUrl}
                name={trial.itemName}
                size="sm"
              />
              <span className="min-w-0 flex-1 truncate font-display text-[13px]">
                {trial.itemName}
              </span>
              <span className="flex-none font-display text-[12px] text-jj-violet">
                {formatWon(trial.price)}
              </span>
            </div>
            {trial.reason && (
              <p className="mt-2 whitespace-pre-wrap border-t-2 border-jj-ink/10 pt-2 font-round text-[11.5px] leading-relaxed text-jj-ink/80">
                🧾 “{trial.reason}”
              </p>
            )}
          </div>

          {/* 안내 */}
          <div className="rounded-xl border-2 border-dashed border-jj-ink/30 bg-jj-paper/60 px-3.5 py-2.5 text-center font-round text-[11px] leading-relaxed text-jj-muted">
            배심원마다 <b className="text-jj-ink">마음이 움직이는 지점이 달라요.</b>{" "}
            🐿️는 숫자·계산, 🧘는 감당·필요, 🔥는 감정, 🔮는 새로운 정보에
            움직여요.
          </div>

          {messages.map((m) => (
            <ChatBubble
              key={m.id}
              role={m.role}
              juror={m.juror}
              emoji={m.emoji}
              content={m.content}
            />
          ))}

          {/* 전송 중: 낙관적 유저 말풍선 + 심리 인디케이터 */}
          {sending && (
            <>
              <ChatBubble role="USER" content={text.trim()} />
              <div className="flex items-center gap-1.5 pl-1 font-round text-[11px] text-jj-muted">
                <span className="inline-flex gap-0.5">
                  <Dot delay="0s" />
                  <Dot delay="0.15s" />
                  <Dot delay="0.3s" />
                </span>
                배심원단이 변론을 검토 중…
              </div>
            </>
          )}

          {/* 변론 종료 배너 */}
          {closed && !sending && (
            <div className="mt-1 rounded-xl border border-jj-line bg-jj-ink px-4 py-3 text-center text-white">
              <div className="font-display text-sm">
                ⚖ 변론 종료 · 판결이 확정됐어요
              </div>
              <div className="mt-0.5 font-round text-[11px] text-jj-yellow">
                {trial.verdict === "GUILTY"
                  ? "끝내 배심원을 못 넘겼네요. 이번엔 참아봐요."
                  : "배심원을 설득했어요! 후회 없는 소비 되세요."}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function Dot({ delay }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-jj-muted"
      style={{ animationDelay: delay, animationDuration: "0.9s" }}
    />
  );
}
