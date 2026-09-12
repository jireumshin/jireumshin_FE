"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Share2, Gavel, Scale, Bookmark } from "lucide-react";
import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";
import BrutalCard from "@/components/common/BrutalCard";
import JurorAvatar from "@/components/common/JurorAvatar";
import ProductThumb from "@/components/common/ProductThumb";
import VerdictChip from "@/components/widgets/trials/VerdictChip";
import DefenseChat from "@/components/widgets/trials/DefenseChat";
import VersusResult from "@/components/widgets/trials/VersusResult";
import { useAuth } from "@/contexts/AuthContext";
import { selectors } from "@/stores";
import { fetchTrial, requestVerdict, claimTrial } from "@/stores/trialsSlice";
import { formatWon, tally, defenseInfo } from "@/lib/trial";

const JURORS = ["가성비요정", "텅장지킴이", "지름요정", "팩트봇"];
const JUROR_EMOJI = {
  가성비요정: "🐿️",
  텅장지킴이: "🧘",
  지름요정: "🔥",
  팩트봇: "🔮",
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function TrialResult() {
  const router = useRouter();
  const dispatch = useDispatch();
  const id = useSearchParams().get("id");
  const { isAuthenticated, initialized } = useAuth();
  const currentTrial = useSelector(selectors.getCurrentTrial);

  const [phase, setPhase] = useState("loading"); // loading | deliberating | result | error
  const [trial, setTrial] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let alive = true;
    if (!id) {
      setErrMsg("잘못된 접근이에요");
      setPhase("error");
      return;
    }
    (async () => {
      try {
        const t = await dispatch(fetchTrial(id)).unwrap();
        if (!alive) return;
        if (t.status === "JUDGED") {
          setTrial(t);
          setPhase("result");
          return;
        }
        setTrial(t);
        setPhase("deliberating");
        const [judged] = await Promise.all([
          dispatch(requestVerdict(id)).unwrap(),
          wait(2200), // 심리 연출을 위한 최소 시간
        ]);
        if (!alive) return;
        setTrial(judged);
        setPhase("result");
      } catch (e) {
        if (!alive) return;
        setErrMsg(typeof e === "string" ? e : "사건을 불러오지 못했어요");
        setPhase("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, dispatch]);

  // 로그인 유도 → 카카오/일반 로그인 선택 화면(/login). claim은 로그인 성공 후
  // AuthProvider의 전역 처리기가 착지 페이지와 무관하게 수행한다(카카오 대응).
  const saveToAccount = () => {
    sessionStorage.setItem(`claim:${trial.id}`, "1");
    const redirect = `/trial/?id=${trial.id}`;
    router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
  };

  const claimNow = async () => {
    try {
      const updated = await dispatch(claimTrial(trial.id)).unwrap();
      setTrial(updated);
      toast("🔖 내 판례로 저장했어요");
    } catch (e) {
      toast.error(typeof e === "string" ? e : "저장에 실패했어요");
    }
  };

  if (phase === "loading") {
    return <Layout isLoading headerProps={{ subtitle: "사건 조회 중" }} />;
  }

  if (phase === "error") {
    return (
      <Layout headerProps={{ subtitle: "재판소" }}>
        <div className="flex flex-col items-center gap-4 px-6 py-24 text-center">
          <span className="text-5xl">🧑‍⚖️</span>
          <p className="font-display text-lg">{errMsg}</p>
          <BrutalButton tone="ink" onClick={() => router.replace("/")}>
            홈으로 가기
          </BrutalButton>
        </div>
      </Layout>
    );
  }

  if (phase === "deliberating") {
    return (
      <Layout headerProps={{ subtitle: "심리 중" }} noScroll>
        <div className="flex h-full flex-col items-center justify-center gap-7 px-8 text-center">
          <p className="inline-block -rotate-2 rounded-full border border-jj-line bg-jj-violet px-4 py-1.5 font-round text-sm text-white shadow-hard-sm">
            ⚖ 배심원단이 심리 중…
          </p>
          <h1 className="font-display text-xl leading-snug">
            {trial?.mode === "VERSUS" ? (
              <>
                {trial?.itemName} vs {trial?.itemNameB}
                <br />
                배심원 4명이 저울질 중이에요
              </>
            ) : (
              <>
                {trial?.itemName}, 살까 말까
                <br />
                배심원 4명이 갑론을박 중이에요
              </>
            )}
          </h1>
          <ul className="flex gap-3">
            {JURORS.map((name, i) => (
              <li
                key={name}
                className="flex flex-col items-center gap-1.5 animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "1s",
                }}
              >
                <span className="grid h-14 w-14 place-items-center rounded-xl border border-jj-line bg-jj-paper text-2xl shadow-hard-sm">
                  {JUROR_EMOJI[name]}
                </span>
                <small className="font-round text-[9px] text-jj-muted">
                  {name}
                </small>
              </li>
            ))}
          </ul>
          <p className="font-round text-xs text-jj-muted">곧 판결이 나와요…</p>
        </div>
      </Layout>
    );
  }

  if (phase === "defense") {
    return (
      <DefenseChat
        trial={trial}
        onUpdate={setTrial}
        onExit={() => setPhase("result")}
      />
    );
  }

  // phase === "result"
  if (trial.mode === "VERSUS") {
    return <VersusResult trial={trial} onUpdate={setTrial} />;
  }

  const guilty = trial.verdict === "GUILTY";
  const jury = Array.isArray(trial.jury) ? trial.jury : [];
  const t = tally(jury, trial.verdict);
  const saved = guilty ? formatWon(trial.price) : "0원";
  // 전역 claim이 store(current)를 갱신하면 CTA가 사라지도록 store 기준도 함께 본다
  const owned =
    !!trial.userId || (currentTrial?.id === trial.id && !!currentTrial?.userId);
  const { closed: defenseClosed, inExtension, roundsLeft } = defenseInfo(trial);
  const usedRounds = trial.defenseRounds ?? 0;
  const defenseLabel = defenseClosed
    ? "변론 기록 보기"
    : inExtension
      ? `동점 연장전 · ${roundsLeft}회 남음`
      : usedRounds > 0
        ? `변론 이어가기 · 남은 ${roundsLeft}회`
        : "배심원에게 변론하기";

  const goShare = () => router.push(`/verdict/?id=${trial.id}`);

  return (
    <Layout headerProps={{ subtitle: "판결 완료" }}>
      <section className="flex flex-col gap-4 px-5 pb-8 pt-6">
        {/* 판결 배너 */}
        <BrutalCard
          className={`p-5 text-center text-white ${
            guilty ? "bg-jj-red" : "bg-jj-green"
          }`}
        >
          <span className="font-round text-[11px] tracking-wide opacity-90">
            최종 판결
          </span>
          <h1 className="mt-1 font-display text-[28px] leading-tight">
            {guilty ? "유죄 · 사지 마세요" : "무죄 · 사도 돼요"}
          </h1>
          <div className="mt-2 inline-block rounded-full border border-jj-line bg-jj-ink/20 px-3 py-0.5 font-round text-xs">
            배심원 {t.label}
          </div>
        </BrutalCard>

        {/* 익명 판례 저장 유도 (로그인/가입) */}
        {initialized && !owned && (
          <BrutalCard
            shadow="sm"
            className="flex items-center gap-3 border-jj-violet bg-jj-violet-soft p-3.5"
          >
            <Bookmark
              className="h-5 w-5 flex-none text-jj-violet"
              strokeWidth={2.5}
            />
            <div className="min-w-0 flex-1">
              <div className="font-display text-[13px]">
                이 판례, 저장할까요?
              </div>
              <div className="mt-0.5 font-round text-[11px] text-jj-muted">
                {isAuthenticated
                  ? "내 판례 목록에 남겨둘 수 있어요"
                  : "로그인하면 이 판례가 사라지지 않고 저장돼요"}
              </div>
            </div>
            <BrutalButton
              tone="ink"
              onClick={isAuthenticated ? claimNow : saveToAccount}
              className="flex-none px-3.5 py-2 text-xs"
            >
              {isAuthenticated ? "저장" : "로그인"}
            </BrutalButton>
          </BrutalCard>
        )}

        {/* 기소 대상 */}
        <BrutalCard shadow="sm" className="p-3.5">
          <div className="flex items-center gap-3">
            <ProductThumb
              imageUrl={trial.imageUrl}
              name={trial.itemName}
              size="lg"
            />
            <div className="min-w-0 flex-1 truncate font-display text-[15px]">
              {trial.itemName}
            </div>
            <div className="flex-none font-display text-sm text-jj-violet">
              {formatWon(trial.price)}
            </div>
          </div>
          {trial.reason && (
            <div className="mt-3">
              <div className="mb-1 font-round text-[10px] text-jj-muted">
                🧾 기소 사유
              </div>
              <p className="whitespace-pre-wrap rounded-xl border border-jj-line bg-jj-app px-3 py-2 font-round text-[11.5px] leading-relaxed text-jj-ink/80">
                “{trial.reason}”
              </p>
            </div>
          )}
        </BrutalCard>

        {/* 배심원 평결 */}
        <BrutalCard className="p-4">
          <div className="mb-3 font-display text-sm">⚖ 배심원 평결</div>
          <ul className="flex flex-col gap-2.5">
            {jury.map((j) => (
              <li key={j.juror} className="flex items-start gap-2.5">
                <JurorAvatar name={j.juror} emoji={j.emoji} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-[13px]">{j.juror}</span>
                    <VerdictChip
                      verdict={j.vote}
                      className="px-1.5 py-0 text-[9px]"
                    />
                  </div>
                  <p className="mt-0.5 font-round text-[11px] leading-relaxed text-jj-ink/80">
                    {j.argument}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </BrutalCard>

        {/* 판결 요지 */}
        <BrutalCard className="bg-jj-ink p-4 text-white">
          <div className="mb-1.5 font-round text-[11px] text-jj-yellow">
            📜 판결 요지
          </div>
          <p className="text-[13px] leading-relaxed">{trial.summary}</p>
        </BrutalCard>

        {/* 통계 */}
        <div className="grid grid-cols-2 gap-3">
          <BrutalCard shadow="sm" className="p-3.5 text-center">
            <div className="font-round text-[11px] text-jj-muted">
              예상 후회지수
            </div>
            <div className="mt-1 font-display text-3xl text-jj-red">
              {trial.regretIndex}%
            </div>
          </BrutalCard>
          <BrutalCard shadow="sm" className="p-3.5 text-center">
            <div className="font-round text-[11px] text-jj-muted">
              {guilty ? "아낀 돈" : "쓴 돈"}
            </div>
            <div className="mt-1 font-display text-3xl text-jj-green">
              {saved}
            </div>
          </BrutalCard>
        </div>

        {/* 액션 */}
        <div className="mt-1 flex flex-col gap-2.5">
          <BrutalButton
            tone="ink"
            onClick={() => setPhase("defense")}
            className="w-full"
          >
            <span className="inline-flex items-center gap-2">
              <Scale className="h-4 w-4" strokeWidth={2.5} />
              {defenseLabel}
            </span>
          </BrutalButton>
          {!trial.defenseClosed && (
            <p className="-mt-1 text-center font-round text-[11px] text-jj-muted">
              못다 한 사정을 솔직히 털어놓으면 판결이 달라질 수 있어요
            </p>
          )}
          <BrutalButton tone="yellow" onClick={goShare} className="w-full">
            <span className="inline-flex items-center gap-2">
              <Share2 className="h-4 w-4" strokeWidth={2.5} />
              판결 공유하기
            </span>
          </BrutalButton>
          <BrutalButton
            tone="ink"
            onClick={() => router.push("/")}
            className="w-full"
          >
            <span className="inline-flex items-center gap-2">
              <Gavel className="h-4 w-4" strokeWidth={2.5} />또 기소하기
            </span>
          </BrutalButton>
        </div>
      </section>
    </Layout>
  );
}

export default function TrialResultPage() {
  return (
    <Suspense
      fallback={<Layout isLoading headerProps={{ subtitle: "사건 조회 중" }} />}
    >
      <TrialResult />
    </Suspense>
  );
}
