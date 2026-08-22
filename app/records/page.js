"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Gavel, Clock, Globe, Heart } from "lucide-react";
import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";
import BrutalCard from "@/components/common/BrutalCard";
import StatBar from "@/components/common/StatBar";
import EmojiThumb from "@/components/common/EmojiThumb";
import TrialListItem from "@/components/widgets/trials/TrialListItem";
import {
  fetchMyTrials,
  submitFollowUp,
  publishTrial,
  unpublishTrial,
} from "@/stores/trialsSlice";
import { selectors } from "@/stores";
import { useAuth } from "@/contexts/AuthContext";
import { guessEmoji, formatWon } from "@/lib/trial";
import { cn } from "@/lib/utils";

// 판결났고, 재질문 시점이 지났고, 아직 응답 안 한 사건
function isDue(t) {
  if (t.status !== "JUDGED" || t.followedUpAt || !t.followUpDueAt) return false;
  return new Date(t.followUpDueAt).getTime() <= Date.now();
}

function summarize(trials) {
  const judged = trials.filter((t) => t.status === "JUDGED");
  const guilty = judged.filter((t) => t.verdict === "GUILTY");
  const total = judged.length;
  const guiltyRate = total ? Math.round((guilty.length / total) * 100) : 0;
  const saved = guilty.reduce((sum, t) => sum + (t.price || 0), 0);

  const answered = trials.filter((t) => t.followedUpAt);
  const regretCount = answered.filter((t) => t.regret).length;
  const regretRate = answered.length
    ? Math.round((regretCount / answered.length) * 100)
    : 0;

  return {
    guiltyRate,
    notGuiltyRate: total ? 100 - guiltyRate : 0,
    saved,
    answeredCount: answered.length,
    regretRate,
  };
}

export default function RecordsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, initialized } = useAuth();
  const trials = useSelector(selectors.getMyTrials);
  const loading = useSelector(selectors.getMyTrialsLoading);

  useEffect(() => {
    if (initialized && !user) router.replace("/login");
  }, [initialized, user, router]);

  useEffect(() => {
    if (user) dispatch(fetchMyTrials());
  }, [dispatch, user]);

  if (!initialized || !user) {
    return <Layout isLoading headerProps={{ subtitle: "나의 판례" }} />;
  }

  const { guiltyRate, notGuiltyRate, saved, answeredCount, regretRate } =
    summarize(trials);
  const dueFollowUps = trials.filter(isDue);
  const isEmpty = !loading && trials.length === 0;

  const onAnswer = async (id, purchased, regret) => {
    try {
      await dispatch(submitFollowUp({ id, purchased, regret })).unwrap();
      toast("🗳️ 후회 여부를 기록했어요");
    } catch (e) {
      toast.error(typeof e === "string" ? e : "응답 저장에 실패했어요");
    }
  };

  const [pubBusyId, setPubBusyId] = useState(null);
  const onTogglePublish = async (t) => {
    setPubBusyId(t.id);
    try {
      if (t.isPublic) {
        await dispatch(unpublishTrial(t.id)).unwrap();
        toast("피드에서 내렸어요");
      } else {
        await dispatch(publishTrial(t.id)).unwrap();
        toast("🌐 피드에 공개했어요");
      }
    } catch (e) {
      toast.error(typeof e === "string" ? e : "변경에 실패했어요");
    } finally {
      setPubBusyId(null);
    }
  };

  return (
    <Layout headerProps={{ subtitle: "나의 판례" }} allowScroll activeTab="records">
      <section className="flex flex-col gap-3 px-5 pb-10 pt-6">
        <header className="mb-1">
          <h1 className="font-display text-2xl leading-tight">
            나의 재판 기록 ⚖
          </h1>
          <p className="mt-0.5 font-round text-xs text-jj-muted">
            지름신과 싸운 나의 전적이에요
          </p>
        </header>

        {isEmpty ? (
          <EmptyState onStart={() => router.push("/")} />
        ) : (
          <>
            {/* 아낀 돈 hero */}
            <BrutalCard className="relative overflow-hidden rounded-[20px] bg-jj-ink p-5 text-white">
              <span className="pointer-events-none absolute -bottom-3 -right-2 text-8xl opacity-15 select-none">
                💰
              </span>
              <p className="font-round text-xs text-jj-yellow">
                💰 재판으로 아낀 돈
              </p>
              <p className="mt-1 font-display text-[40px] leading-none">
                {formatWon(saved)}
              </p>
              <p className="mt-2 text-[11px] font-semibold text-white/70">
                유죄 판결로 참은 지출의 합계예요
              </p>
            </BrutalCard>

            {/* 다시 물어볼 판례 (재질문 due) */}
            {dueFollowUps.length > 0 && (
              <BrutalCard className="flex flex-col gap-2.5 bg-jj-violet-soft p-3.5">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-jj-violet" strokeWidth={2.5} />
                  <h2 className="font-display text-sm">다시 물어볼게요</h2>
                  <span className="rounded-full bg-jj-violet px-2 py-0.5 font-round text-[10.5px] text-white">
                    {dueFollowUps.length}건
                  </span>
                </div>
                {dueFollowUps.map((t) => (
                  <FollowUpCard key={t.id} trial={t} onAnswer={onAnswer} />
                ))}
              </BrutalCard>
            )}

            {/* 유죄/무죄율 */}
            <div className="grid grid-cols-2 gap-3">
              <StatBar tone="red" label="유죄율 (사지마)" value={guiltyRate} />
              <StatBar
                tone="green"
                label="무죄율 (사도됨)"
                value={notGuiltyRate}
              />
            </div>

            {/* 후회율 (재질문 응답 있을 때만) */}
            {answeredCount > 0 && (
              <StatBar
                tone="violet"
                label={`후회율 (재질문 ${answeredCount}건 응답)`}
                value={regretRate}
              />
            )}

            {/* 판례 리스트 */}
            <div className="mt-2 flex items-center gap-2">
              <h2 className="font-display text-[15px]">최근 판례</h2>
              <span className="rounded-full bg-jj-ink px-2.5 py-0.5 font-round text-[11px] text-white">
                {trials.length}건
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {trials.map((t) => (
                <div key={t.id} className="flex flex-col gap-1.5">
                  <TrialListItem
                    trial={t}
                    onClick={() => router.push(`/trial/?id=${t.id}`)}
                  />
                  {t.status === "JUDGED" && (
                    <PublishToggle
                      trial={t}
                      busy={pubBusyId === t.id}
                      onToggle={() => onTogglePublish(t)}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}

function PublishToggle({ trial, busy, onToggle }) {
  const pub = trial.isPublic;
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onToggle}
      className={cn(
        "ml-1 flex items-center gap-1.5 self-start rounded-full border border-jj-line px-2.5 py-1 font-round text-[11px] shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50",
        pub ? "bg-jj-green-soft text-jj-green" : "bg-jj-app text-jj-muted",
      )}
    >
      <Globe className="h-3 w-3" strokeWidth={2.5} />
      {pub ? "피드 공개중" : "피드에 공개"}
      {pub && trial.likeCount > 0 && (
        <span className="inline-flex items-center gap-0.5">
          · <Heart className="h-3 w-3" strokeWidth={2.5} fill="currentColor" />
          {trial.likeCount}
        </span>
      )}
    </button>
  );
}

function FollowUpCard({ trial, onAnswer }) {
  const [purchased, setPurchased] = useState(null); // null | true | false
  const [busy, setBusy] = useState(false);

  const answer = async (regret) => {
    setBusy(true);
    try {
      await onAnswer(trial.id, purchased, regret);
    } finally {
      setBusy(false);
    }
  };

  const q2 = purchased
    ? [
        { label: "😊 만족해요", regret: false, tone: "green" },
        { label: "😩 후회해요", regret: true, tone: "red" },
      ]
    : [
        { label: "👍 잘 참았어요", regret: false, tone: "green" },
        { label: "😢 그래도 살걸", regret: true, tone: "red" },
      ];

  return (
    <BrutalCard shadow="none" className="rounded-[14px] border-2 p-3">
      <div className="flex items-center gap-2.5">
        <EmojiThumb size="sm">{guessEmoji(trial.itemName)}</EmojiThumb>
        <p className="min-w-0 flex-1 truncate font-display text-sm">
          {trial.itemName}
        </p>
      </div>

      <p className="mt-2.5 font-round text-[12px] text-jj-ink">
        {purchased === null
          ? "그때 그 물건, 결국 샀어요?"
          : purchased
            ? "사고 나서 어때요?"
            : "지금 돌아보면 어때요?"}
      </p>

      <div className="mt-2 grid grid-cols-2 gap-2">
        {purchased === null ? (
          <>
            <ChoiceButton onClick={() => setPurchased(true)}>
              🛍️ 샀어요
            </ChoiceButton>
            <ChoiceButton onClick={() => setPurchased(false)}>
              🙅 안 샀어요
            </ChoiceButton>
          </>
        ) : (
          q2.map((o) => (
            <ChoiceButton
              key={o.label}
              tone={o.tone}
              disabled={busy}
              onClick={() => answer(o.regret)}
            >
              {o.label}
            </ChoiceButton>
          ))
        )}
      </div>
    </BrutalCard>
  );
}

function ChoiceButton({ tone, children, ...props }) {
  const toneCls =
    tone === "red"
      ? "bg-jj-red-soft"
      : tone === "green"
        ? "bg-jj-green-soft"
        : "bg-jj-app";
  return (
    <button
      type="button"
      className={`rounded-lg border border-jj-line px-2 py-2.5 font-round text-[12px] shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-40 ${toneCls}`}
      {...props}
    >
      {children}
    </button>
  );
}

function EmptyState({ onStart }) {
  return (
    <BrutalCard className="mt-6 flex flex-col items-center gap-4 px-6 py-10 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl border border-jj-line bg-jj-violet-soft text-3xl shadow-hard-sm">
        <Gavel className="h-8 w-8" strokeWidth={2} />
      </span>
      <div>
        <p className="font-display text-lg">아직 판례가 없어요</p>
        <p className="mt-1 font-round text-xs text-jj-muted">
          첫 지름을 재판대에 세워볼까요?
        </p>
      </div>
      <BrutalButton tone="red" onClick={onStart} className="w-full">
        지름신 기소하기
      </BrutalButton>
    </BrutalCard>
  );
}
