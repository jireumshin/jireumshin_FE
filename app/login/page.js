'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Mail } from 'lucide-react'
import Layout from '@/components/common/Layout'
import AuthNav from '@/components/common/AuthNav'

const STATS = [
  { v: '12', k: '받은 재판' },
  { v: '58%', k: '유죄율' },
  { v: '34만', k: '아낀 돈', hl: true },
]

const PREVIEW_CASES = [
  { emoji: '🎧', name: '노캔 무선 헤드폰', verdict: '3:1 유죄', guilty: true },
  { emoji: '👟', name: '한정판 러닝화', verdict: '4:0 무죄', guilty: false },
]

function KakaoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none" fill="#3c1e1e" aria-hidden>
      <path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.2 4.7 6.6-.2.7-.7 2.6-.8 3-.1.5.2.5.4.4.2-.1 2.6-1.8 3.7-2.5.6.1 1.3.1 2 .1 5.5 0 10-3.5 10-7.8S17.5 3 12 3z" />
    </svg>
  )
}

function DashboardPreview() {
  return (
    <section aria-hidden className="select-none">
      <p className="mb-2 text-center font-round text-xs text-jj-muted">🔒 로그인하면 이런 판례가 쌓여요</p>
      <div className="rounded-2xl border-[2.5px] border-jj-ink bg-jj-paper p-3 shadow-hard">
        <div className="rounded-xl bg-jj-ink px-3.5 py-3 text-white">
          <p className="font-round text-[10px] text-jj-yellow">💰 재판으로 아낀 돈</p>
          <p className="mt-0.5 font-display text-[26px] leading-none">
            34<span className="text-base"> 만 2천원</span>
          </p>
        </div>
        <ul className="mt-2 flex flex-col gap-1.5">
          {PREVIEW_CASES.map((c) => (
            <li key={c.name} className="flex items-center gap-2.5 rounded-xl border-2 border-jj-ink bg-jj-app px-2.5 py-2">
              <span className="grid h-8 w-8 flex-none place-items-center rounded-lg border-2 border-jj-ink bg-jj-violet-soft text-base">
                {c.emoji}
              </span>
              <span className="flex-1 truncate font-display text-xs">{c.name}</span>
              <span
                className={`flex-none rounded-full border-2 border-jj-ink px-2 py-0.5 font-round text-[9px] ${
                  c.guilty ? 'bg-jj-red-soft text-[#b3352b]' : 'bg-jj-green-soft text-[#0a7a56]'
                }`}
              >
                {c.verdict}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const goBack = () => router.back()
  const notReady = () => toast('카카오 로그인은 곧 열려요 🙏 (준비 중)')

  // TODO: 익명 세션에 쌓인 기록 수로 판단. 신규 유저(기소 초기 진입)는 false.
  const hasRecords = false

  const btnBase =
    'flex items-center justify-center gap-2 rounded-2xl border-[2.5px] border-jj-ink py-3.5 font-display text-[15px] shadow-hard-sm transition-transform hover:-translate-x-px hover:-translate-y-px hover:shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none'

  return (
    <Layout headerProps={{ subtitle: '기록 보관하기', right: <AuthNav showBack={false} /> }}>
      <section className="flex flex-col gap-5 px-5 pb-8 pt-7">
        <header className="text-center">
          <span className="text-4xl">{hasRecords ? '🗂️' : '⚖️'}</span>
          <h1 className="mt-3 font-display text-2xl leading-tight">
            {hasRecords ? '지금까지의 재판 기록,' : '내 판례를 안전하게'}
            <br />
            <span className="relative inline-block text-jj-violet">
              <span className="absolute inset-x-0 bottom-1 z-0 h-2.5 -rotate-1 bg-jj-yellow" />
              <span className="relative z-10">영구 보관</span>
            </span>
            {hasRecords ? '할까요?' : '하세요'}
          </h1>
          <p className="mt-2.5 text-sm font-semibold text-jj-muted">
            {hasRecords
              ? '로그인하면 어느 기기에서든 내 판례를 다시 볼 수 있어요'
              : '로그인하면 재판 기록이 사라지지 않고 어디서든 다시 볼 수 있어요'}
          </p>
        </header>

        {hasRecords ? (
          <article className="rounded-2xl border-[2.5px] border-jj-ink bg-jj-ink p-4 text-white shadow-hard">
            <p className="mb-3 font-round text-[11px] tracking-wide text-jj-yellow">⚖ 이 브라우저에 쌓인 나의 기록</p>
            <ul className="grid grid-cols-3 gap-2">
              {STATS.map((s) => (
                <li key={s.k} className="text-center">
                  <p className={`font-display text-2xl leading-none ${s.hl ? 'text-jj-yellow' : ''}`}>{s.v}</p>
                  <p className="mt-1.5 font-round text-[10px] text-[#b9aee6]">{s.k}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-2 rounded-xl border-2 border-jj-red bg-[rgba(255,91,91,0.16)] px-3 py-2 text-[11.5px] font-semibold text-[#ffd9d9]">
              ⚠️
              <span>
                <b className="text-white">쿠키를 지우거나 기기를 바꾸면</b> 이 기록은 사라져요
              </span>
            </p>
          </article>
        ) : (
          <DashboardPreview />
        )}

        <div className="flex flex-col gap-2.5">
          <button type="button" onClick={notReady} className={`${btnBase} relative bg-[#FEE500] text-[#3c1e1e]`}>
            <KakaoIcon />
            카카오로 계속하기
            <span className="absolute -top-2.5 right-3 -rotate-2 rounded-full border-2 border-jj-ink bg-jj-violet px-2 py-0.5 font-round text-[10px] text-white">
              3초면 끝나요
            </span>
          </button>
          <button
            type="button"
            onClick={() => router.push('/login/id')}
            className={`${btnBase} bg-jj-paper text-jj-ink`}
          >
            <Mail className="h-5 w-5 flex-none" strokeWidth={2.5} />
            일반 로그인
          </button>
        </div>

        <button type="button" onClick={goBack} className="font-round text-sm text-jj-muted underline underline-offset-4">
          나중에 할게요 · 계속 익명으로 쓰기
        </button>

        <p className="text-center font-round text-[10.5px] leading-relaxed text-jj-muted">
          로그인하면 지금 이 브라우저의 판례가 <b className="text-[#7a6ba8]">내 계정으로 연결</b>돼요.
          <br />
          우린 재판 기록만 저장하고, 그 외엔 아무것도 수집하지 않아요.
        </p>
      </section>
    </Layout>
  )
}
