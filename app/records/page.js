"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { X, Gavel, ChevronRight } from "lucide-react";
import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";
import { fetchMyTrials } from "@/stores/trialsSlice";
import { selectors } from "@/stores";
import { useAuth } from "@/contexts/AuthContext";
import { guessEmoji, formatWon, tally } from "@/lib/trial";

function relativeDay(iso) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= 0) return "오늘";
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}

function summarize(trials) {
  const judged = trials.filter((t) => t.status === "JUDGED");
  const guilty = judged.filter((t) => t.verdict === "GUILTY");
  const total = judged.length;
  const guiltyRate = total ? Math.round((guilty.length / total) * 100) : 0;
  const saved = guilty.reduce((sum, t) => sum + (t.price || 0), 0);
  return {
    guiltyRate,
    notGuiltyRate: total ? 100 - guiltyRate : 0,
    saved,
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

  const closeBtn = (
    <button
      type="button"
      onClick={() => router.push("/")}
      aria-label="닫기"
      className="grid h-9 w-9 place-items-center rounded-lg border-[2.5px] border-jj-ink bg-jj-paper shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
    >
      <X className="h-4 w-4" strokeWidth={2.5} />
    </button>
  );

  const { guiltyRate, notGuiltyRate, saved } = summarize(trials);
  const isEmpty = !loading && trials.length === 0;

  return (
    <Layout
      headerProps={{ subtitle: "나의 판례", right: closeBtn }}
      allowScroll
    >
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
            <div className="relative overflow-hidden rounded-[20px] border-[2.5px] border-jj-ink bg-jj-ink p-5 text-white shadow-hard">
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
            </div>

            {/* 유죄/무죄율 */}
            <div className="grid grid-cols-2 gap-3">
              <RateCard tone="red" label="유죄율 (사지마)" rate={guiltyRate} />
              <RateCard
                tone="green"
                label="무죄율 (사도됨)"
                rate={notGuiltyRate}
              />
            </div>

            {/* 판례 리스트 */}
            <div className="mt-2 flex items-center gap-2">
              <h2 className="font-display text-[15px]">최근 판례</h2>
              <span className="rounded-full bg-jj-ink px-2.5 py-0.5 font-round text-[11px] text-white">
                {trials.length}건
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {trials.map((t) => (
                <TrialRow
                  key={t.id}
                  trial={t}
                  onClick={() => router.push(`/trial/?id=${t.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}

function RateCard({ tone, label, rate }) {
  const isRed = tone === "red";
  return (
    <div className="rounded-2xl border-[2.5px] border-jj-ink bg-jj-paper p-4 shadow-hard-sm">
      <p className="font-round text-[11px] text-jj-muted">{label}</p>
      <p
        className={`mt-1 font-display text-3xl leading-none ${
          isRed ? "text-jj-red" : "text-jj-green"
        }`}
      >
        {rate}%
      </p>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full border-2 border-jj-ink bg-white">
        <span
          className={`block h-full ${isRed ? "bg-jj-red" : "bg-jj-green"}`}
          style={{ width: `${rate}%` }}
        />
      </div>
    </div>
  );
}

function TrialRow({ trial, onClick }) {
  const pending = trial.status !== "JUDGED";
  const guilty = trial.verdict === "GUILTY";
  const chip = pending
    ? { cls: "bg-jj-app text-jj-muted", text: "심리 중" }
    : guilty
      ? {
          cls: "bg-jj-red-soft text-jj-red",
          text: tally(trial.jury || [], trial.verdict).label,
        }
      : {
          cls: "bg-jj-green-soft text-jj-green",
          text: tally(trial.jury || [], trial.verdict).label,
        };

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-[15px] border-[2.5px] border-jj-ink bg-jj-paper p-3 text-left shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
    >
      <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border-2 border-jj-ink bg-jj-violet-soft text-xl">
        {guessEmoji(trial.itemName)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-sm leading-tight">
          {trial.itemName}
        </span>
        <span className="mt-0.5 block font-round text-[10.5px] text-jj-muted">
          {relativeDay(trial.createdAt)} · {formatWon(trial.price)}
        </span>
      </span>
      <span
        className={`flex-none rounded-full border-2 border-jj-ink px-2.5 py-1 font-round text-[11px] ${chip.cls}`}
      >
        {chip.text}
      </span>
      <ChevronRight
        className="h-4 w-4 flex-none text-jj-muted"
        strokeWidth={2.5}
      />
    </button>
  );
}

function EmptyState({ onStart }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border-[2.5px] border-jj-ink bg-jj-paper px-6 py-10 text-center shadow-hard">
      <span className="grid h-16 w-16 place-items-center rounded-2xl border-[2.5px] border-jj-ink bg-jj-violet-soft text-3xl shadow-hard-sm">
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
    </div>
  );
}
