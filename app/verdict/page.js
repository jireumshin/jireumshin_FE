"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { Download, Link2, Gavel } from "lucide-react";
import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";
import BrutalCard from "@/components/common/BrutalCard";
import JurorAvatar from "@/components/common/JurorAvatar";
import VerdictChip from "@/components/widgets/trials/VerdictChip";
import VerdictShareCard from "@/components/widgets/trials/VerdictShareCard";
import { fetchTrial } from "@/stores/trialsSlice";

function VerdictView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const id = useSearchParams().get("id");
  const cardRef = useRef(null);

  const [phase, setPhase] = useState("loading"); // loading | ready | pending | error
  const [trial, setTrial] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!id) {
      setPhase("error");
      return;
    }
    (async () => {
      try {
        const t = await dispatch(fetchTrial(id)).unwrap();
        if (!alive) return;
        setTrial(t);
        setPhase(t.status === "JUDGED" ? "ready" : "pending");
      } catch {
        if (alive) setPhase("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, dispatch]);

  const copyLink = async () => {
    try {
      const url = `${window.location.origin}/verdict/?id=${trial.id}`;
      await navigator.clipboard.writeText(url);
      toast("🔗 공유 링크를 복사했어요");
    } catch {
      toast.error("링크 복사에 실패했어요");
    }
  };

  const saveImage = async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "지름신-판결.png", { type: "image/png" });

      // 모바일(터치)은 공유 시트로 → iOS는 이 경로라야 사진앱 저장이 됨.
      // 데스크톱은 PNG 파일을 바로 다운로드.
      const isTouch =
        navigator.maxTouchPoints > 0 ||
        window.matchMedia?.("(pointer: coarse)").matches;

      if (isTouch && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "지름신 재판소 판결" });
        } catch (e) {
          if (e?.name !== "AbortError") throw e;
        }
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "지름신-판결.png";
        a.click();
        toast("🖼 판결 카드를 저장했어요");
      }
    } catch {
      toast.error("이미지 저장에 실패했어요");
    } finally {
      setSaving(false);
    }
  };

  if (phase === "loading") {
    return <Layout isLoading headerProps={{ subtitle: "판례 조회 중" }} />;
  }

  if (phase === "error") {
    return (
      <Layout headerProps={{ subtitle: "재판소" }}>
        <div className="flex flex-col items-center gap-4 px-6 py-24 text-center">
          <span className="text-5xl">🧑‍⚖️</span>
          <p className="font-display text-lg">판례를 찾을 수 없어요</p>
          <BrutalButton tone="ink" onClick={() => router.replace("/")}>
            나도 재판받아보기
          </BrutalButton>
        </div>
      </Layout>
    );
  }

  if (phase === "pending") {
    return (
      <Layout headerProps={{ subtitle: "재판소" }}>
        <div className="flex flex-col items-center gap-4 px-6 py-24 text-center">
          <span className="text-5xl">⏳</span>
          <p className="font-display text-lg">아직 판결 전인 사건이에요</p>
          <BrutalButton tone="ink" onClick={() => router.replace("/")}>
            나도 재판받아보기
          </BrutalButton>
        </div>
      </Layout>
    );
  }

  // phase === "ready"
  const jury = Array.isArray(trial.jury) ? trial.jury : [];

  return (
    <Layout allowScroll headerProps={{ subtitle: "판례 공유" }}>
      <section className="flex flex-col items-center gap-5 px-5 pb-8 pt-6">
        {/* 공유 카드 프리뷰 (= 저장될 이미지) */}
        <VerdictShareCard ref={cardRef} trial={trial} />

        {/* 공유 액션 */}
        <div className="flex w-full gap-2.5">
          <BrutalButton
            tone="ink"
            onClick={saveImage}
            disabled={saving}
            className="flex-1"
          >
            <span className="inline-flex items-center gap-2">
              <Download className="h-4 w-4" strokeWidth={2.5} />
              {saving ? "만드는 중…" : "이미지 저장"}
            </span>
          </BrutalButton>
          <BrutalButton tone="paper" onClick={copyLink} className="flex-1 border border-jj-line">
            <span className="inline-flex items-center gap-2">
              <Link2 className="h-4 w-4" strokeWidth={2.5} />
              링크 복사
            </span>
          </BrutalButton>
        </div>

        {/* 기소 사유 전문 — 배심원 판결이 타당한지 판단하는 근거 */}
        {trial.mode === "VERSUS" ? (
          <BrutalCard className="w-full space-y-3 p-4">
            <div className="font-round text-[11px] text-jj-muted">🧾 기소 사유</div>
            {[
              { b: "🅰", name: trial.itemName, r: trial.reason },
              { b: "🅱", name: trial.itemNameB, r: trial.reasonB },
            ].map((x) => (
              <div key={x.b}>
                <div className="font-display text-[12px]">
                  {x.b} {x.name}
                </div>
                <p className="mt-0.5 whitespace-pre-wrap font-round text-[12px] leading-relaxed text-jj-ink/80">
                  “{x.r}”
                </p>
              </div>
            ))}
          </BrutalCard>
        ) : trial.reason ? (
          <BrutalCard className="w-full p-4">
            <div className="mb-1.5 font-round text-[11px] text-jj-muted">🧾 기소 사유</div>
            <p className="whitespace-pre-wrap font-round text-[12px] leading-relaxed text-jj-ink/80">
              “{trial.reason}”
            </p>
          </BrutalCard>
        ) : null}

        {/* 배심원 평결 상세 */}
        <BrutalCard className="w-full p-4">
          <div className="mb-3 font-display text-sm">
            {trial.mode === "VERSUS" ? "⚖ 배심원 비교" : "⚖ 배심원 평결"}
          </div>
          <ul className="flex flex-col gap-2.5">
            {jury.map((j) => (
              <li key={j.juror} className="flex items-start gap-2.5">
                <JurorAvatar name={j.juror} emoji={j.emoji} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-[13px]">{j.juror}</span>
                    {trial.mode === "VERSUS" ? (
                      <span className="font-round text-[10px] text-jj-muted">
                        A <b className={j.scoreA >= j.scoreB ? "text-jj-green" : "text-jj-ink"}>{j.scoreA}</b>
                        {" · "}B <b className={j.scoreB > j.scoreA ? "text-jj-green" : "text-jj-ink"}>{j.scoreB}</b>
                      </span>
                    ) : (
                      <VerdictChip verdict={j.vote} className="px-1.5 py-0 text-[9px]" />
                    )}
                  </div>
                  <p className="mt-0.5 font-round text-[11px] leading-relaxed text-jj-ink/80">
                    {j.argument}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </BrutalCard>

        {/* 자연 유입 CTA */}
        <BrutalButton
          tone="ink"
          onClick={() => router.push("/")}
          className="w-full"
        >
          <span className="inline-flex items-center gap-2">
            <Gavel className="h-4 w-4" strokeWidth={2.5} />
            나도 지름 재판받아보기
          </span>
        </BrutalButton>
      </section>
    </Layout>
  );
}

export default function VerdictSharePage() {
  return (
    <Suspense
      fallback={<Layout isLoading headerProps={{ subtitle: "판례 조회 중" }} />}
    >
      <VerdictView />
    </Suspense>
  );
}
