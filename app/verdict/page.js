"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { Download, Link2, Gavel, Globe } from "lucide-react";
import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";
import BrutalCard from "@/components/common/BrutalCard";
import VerdictShareCard from "@/components/widgets/trials/VerdictShareCard";
import DefenseTimeline from "@/components/widgets/trials/DefenseTimeline";
import CommentSection from "@/components/widgets/trials/CommentSection";
import PublishPreviewDialog from "@/components/dialog/trials/PublishPreviewDialog";
import UserAvatar from "@/components/common/UserAvatar";
import {
  fetchTrial,
  publishTrial,
  unpublishTrial,
  claimTrial,
  setMessageHidden,
} from "@/stores/trialsSlice";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

function VerdictView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const id = useSearchParams().get("id");
  const cardRef = useRef(null);

  const { requireAuth } = useAuth();
  const [phase, setPhase] = useState("loading"); // loading | ready | pending | error
  const [trial, setTrial] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pubBusy, setPubBusy] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

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

  // 커뮤니티 피드 공개/비공개 (공개는 로그인 필요 — 익명은 로그인 유도)
  // 변론 대화가 있으면 공개 전에 미리보기에서 숨길 진술을 고르게 함
  const onTogglePublish = async () => {
    if (!requireAuth()) return; // 비로그인 → 로그인 페이지로
    if (pubBusy) return;
    setPubBusy(true);
    try {
      let t = trial;
      if (!t.userId) t = await dispatch(claimTrial(t.id)).unwrap(); // 익명 판례 본인 귀속
      if (t.isPublic) {
        t = await dispatch(unpublishTrial(t.id)).unwrap();
        toast("피드에서 내렸어요");
      } else if (t.messages?.length) {
        setPreviewOpen(true);
      } else {
        t = await dispatch(publishTrial(t.id)).unwrap();
        toast("🌐 커뮤니티 피드에 공개했어요");
      }
      setTrial(t);
    } catch (e) {
      toast.error(typeof e === "string" ? e : "변경에 실패했어요");
    } finally {
      setPubBusy(false);
    }
  };

  const confirmPublish = async () => {
    setPubBusy(true);
    try {
      setTrial(await dispatch(publishTrial(trial.id)).unwrap());
      setPreviewOpen(false);
      toast("🌐 커뮤니티 피드에 공개했어요");
    } catch (e) {
      toast.error(typeof e === "string" ? e : "공개에 실패했어요");
    } finally {
      setPubBusy(false);
    }
  };

  const onToggleHidden = async (m) => {
    try {
      const t = await dispatch(
        setMessageHidden({ id: trial.id, messageId: m.id, hidden: !m.hidden }),
      ).unwrap();
      setTrial(t);
    } catch (e) {
      toast.error(typeof e === "string" ? e : "변경에 실패했어요");
    }
  };

  if (phase === "loading") {
    return <Layout isLoading headerProps={{ subtitle: "판례 조회 중" }} />;
  }

  if (phase === "error") {
    return (
      <Layout headerProps={{ subtitle: "재판소" }}>
        <div className="flex flex-col items-center gap-4 px-6 py-24 text-center">
          <img
            src="/assets/judge.png"
            alt=""
            draggable={false}
            className="h-28 w-28 object-contain"
          />
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
          <img
            src="/assets/judge.png"
            alt=""
            draggable={false}
            className="h-28 w-28 object-contain"
          />
          <p className="font-display text-lg">아직 판결 전인 사건이에요</p>
          <BrutalButton tone="ink" onClick={() => router.replace("/")}>
            나도 재판받아보기
          </BrutalButton>
        </div>
      </Layout>
    );
  }

  // phase === "ready"
  const canHide = !trial.isPublicView && !!trial.userId; // 소유된 판례의 주인 뷰
  return (
    <Layout allowScroll headerProps={{ subtitle: "판례 공유" }}>
      <section className="flex flex-col items-center gap-5 px-5 pb-8 pt-6">
        {/* 타인이 보는 공개본 — 작성자 표시 */}
        {trial.isPublicView && trial.authorNickname && (
          <p className="flex items-center gap-2 self-start font-round text-[13px] text-jj-muted">
            <UserAvatar src={trial.authorAvatarUrl} alt="" size="sm" />
            <span>
              <b className="font-display text-jj-ink">{trial.authorNickname}</b>님의 판례
            </span>
          </p>
        )}

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

        {/* 커뮤니티 공개 (본인/작성자 뷰에서만) — 공개는 로그인 필요 */}
        {!trial.isPublicView && (
          <BrutalCard className="flex w-full items-center gap-3 p-4">
            <span
              className={cn(
                "grid h-10 w-10 flex-none place-items-center rounded-xl",
                trial.isPublic ? "bg-jj-green-soft text-jj-green" : "bg-jj-violet-soft text-jj-violet",
              )}
            >
              <Globe className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-display text-[14px] text-jj-ink">커뮤니티 피드에 공개</div>
              <div className="mt-0.5 font-round text-[11px] leading-snug text-jj-muted">
                {trial.isPublic
                  ? "다른 사람들이 닉네임·변론 대화와 함께 볼 수 있어요"
                  : "공개하면 닉네임·변론 대화와 함께 피드에 올라가요"}
              </div>
            </div>
            <button
              type="button"
              onClick={onTogglePublish}
              disabled={pubBusy}
              aria-pressed={trial.isPublic}
              className={cn(
                "flex-none rounded-full px-3.5 py-1.5 font-display text-[12px] shadow-hard-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-50",
                trial.isPublic ? "bg-jj-green text-white" : "bg-jj-navy text-white",
              )}
            >
              {trial.isPublic ? "공개 중" : "공개하기"}
            </button>
          </BrutalCard>
        )}

        {/* 변론 기록 — 공개본엔 주인이 숨긴 진술이 가려져 내려옴. 주인은 진술별 숨김 토글 */}
        {trial.messages?.length > 0 && (
          <section aria-labelledby="defense-log" className="flex w-full flex-col gap-2.5">
            <header>
              <h2 id="defense-log" className="font-display text-[15px] text-jj-ink">
                변론 기록 · {trial.defenseRounds}라운드
              </h2>
              {canHide && (
                <p className="mt-0.5 font-round text-[11px] text-jj-muted">
                  눈 아이콘으로 공개본에서 숨길 진술을 고를 수 있어요
                </p>
              )}
            </header>
            <BrutalCard shadow="sm" className="flex flex-col gap-2.5 bg-jj-app p-3.5">
              <DefenseTimeline
                trial={trial}
                messages={trial.messages}
                onToggleHidden={canHide ? onToggleHidden : undefined}
              />
            </BrutalCard>
          </section>
        )}

        {trial.isPublic && <CommentSection trialId={trial.id} />}

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

      <PublishPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        trial={trial}
        onToggleHidden={onToggleHidden}
        onConfirm={confirmPublish}
        busy={pubBusy}
      />
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
