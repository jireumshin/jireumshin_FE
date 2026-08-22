'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { Gavel, Scale, ClipboardList, ArrowRight, Heart, ChevronRight } from 'lucide-react'
import Layout from '@/components/common/Layout'
import ServerGuard from '@/components/common/ServerGuard'
import AuthButton from '@/components/common/AuthButton'
import ProductThumb from '@/components/common/ProductThumb'
import VerdictChip from '@/components/widgets/trials/VerdictChip'
import { selectors } from '@/stores'
import { fetchFeed } from '@/stores/trialsSlice'
import { formatWon } from '@/lib/trial'
import { cn } from '@/lib/utils'

// 배심원 4명 — 이모지(브랜드)·이름·성격 한마디 + 아바타 톤/그림자색
const JURORS = [
  { emoji: '🐿️', name: '가성비요정', bg: '#FFE1E1', glow: 'rgba(255,91,91,.22)', desc: '그 돈이면 딴 것도 사요. 가성비부터 따지고 봅니다.' },
  { emoji: '🧘', name: '텅장지킴이', bg: '#D2F6EA', glow: 'rgba(18,192,138,.22)', desc: '통장 잔고 먼저요. 감당 안 되면 반대예요.' },
  { emoji: '🔥', name: '지름요정', bg: '#FFE9C9', glow: 'rgba(255,164,60,.22)', desc: '인생 한 방! 갖고 싶으면 지르는 거죠.' },
  { emoji: '🔮', name: '팩트봇', bg: '#ECE4FF', glow: 'rgba(139,108,255,.22)', desc: '후회 확률 계산 완료. 감정 빼고 팩트로만.' },
]

// 소프트 팝: 부드러운 그림자 + 여백, 강조는 빨간 CTA 하나
const softShadow = '0 6px 18px rgba(122,107,168,.12)'

export default function Home() {
  const dispatch = useDispatch()
  const router = useRouter()
  const feedPreview = useSelector(selectors.getFeed).slice(0, 6)
  const [openJuror, setOpenJuror] = useState(null)

  useEffect(() => {
    dispatch(fetchFeed())
  }, [dispatch])

  return (
    <Layout headerProps={{ subtitle: '홈', right: <AuthButton /> }} activeTab="home" allowScroll>
      <ServerGuard />
      <div className="flex flex-col gap-8 px-5 pb-10 pt-7">

        {/* 히어로 — 배심원단이 주인공 */}
        <section>
          <h1 className="font-display text-[27px] leading-tight">
            충동구매,<br />이 4명이 판결합니다
          </h1>
          <p className="mt-2 font-round text-[13px] text-jj-muted">
            성격 다른 배심원단이 30초 만에 갑론을박
          </p>

          <div className="mt-5">
            <ul className="flex gap-2.5">
              {JURORS.map((j, i) => (
                <li key={j.name} className="flex-1">
                  <button
                    type="button"
                    onClick={() => setOpenJuror(openJuror === i ? null : i)}
                    className="flex w-full flex-col items-center gap-1.5 transition-transform hover:scale-105"
                  >
                    <span
                      className={cn(
                        'grid h-13 w-13 place-items-center rounded-full text-[25px] transition-transform',
                        openJuror === i && '-translate-y-0.5 ring-2 ring-jj-ink',
                      )}
                      style={{ background: j.bg, boxShadow: `0 4px 12px ${j.glow}` }}
                    >
                      {j.emoji}
                    </span>
                    <span
                      className={cn(
                        'font-round text-[10.5px]',
                        openJuror === i && 'font-bold text-jj-ink',
                      )}
                    >
                      {j.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {openJuror !== null && (
              <div className="relative mt-2.5">
                <span
                  className="absolute -top-1.5 h-3 w-3 rotate-45 rounded-xs bg-jj-ink"
                  style={{ left: `calc(${12.5 + openJuror * 25}% - 6px)` }}
                />
                <div className="rounded-2xl bg-jj-ink px-4 py-3">
                  <span className="font-display text-[12px] text-jj-yellow">
                    {JURORS[openJuror].emoji} {JURORS[openJuror].name}
                  </span>
                  <p className="mt-1 font-round text-[12.5px] leading-relaxed text-white/90">
                    “{JURORS[openJuror].desc}”
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => router.push('/new')}
            className="mt-5 w-full rounded-2xl bg-jj-red py-4 font-display text-[17px] text-white transition-transform hover:scale-[1.02] active:scale-[.98]"
            style={{ boxShadow: '0 8px 20px rgba(255,91,91,.35)' }}
          >
            <span className="inline-flex items-center gap-2">
              <Gavel className="h-4 w-4" strokeWidth={2.5} />
              지금 기소하기
            </span>
          </button>
          <p className="mt-2.5 text-center font-round text-[11px] text-jj-muted">
            약 30초 · 로그인 없이 바로 시작
          </p>
        </section>

        {/* 지금 재판 중 (가로 스크롤) */}
        {feedPreview.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-[16px]">👀 지금 재판 중인 판례</h2>
              <button
                type="button"
                onClick={() => router.push('/feed')}
                className="inline-flex items-center gap-0.5 font-round text-xs text-jj-violet"
              >
                피드 <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            </div>
            <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1">
              {feedPreview.map((t) => (
                <MiniTrialCard
                  key={t.id}
                  trial={t}
                  onClick={() => router.push(`/verdict/?id=${t.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 이렇게 써보세요 */}
        <section>
          <h2 className="mb-3 font-display text-[16px]">⚡ 이렇게 써보세요</h2>
          <div className="flex flex-col gap-2.5">
            <ShortcutRow
              iconBg="#FFE1E1"
              icon={<Gavel className="h-5 w-5 text-jj-red" strokeWidth={2.5} />}
              title="살까 말까 재판"
              desc="한 물건, 유죄 vs 무죄"
              onClick={() => router.push('/new')}
            />
            <ShortcutRow
              iconBg="#ECE4FF"
              icon={<Scale className="h-5 w-5 text-jj-violet" strokeWidth={2.5} />}
              title="A vs B 비교"
              desc="둘 중 뭘 살지 저울에"
              onClick={() => router.push('/new?mode=versus')}
            />
            <ShortcutRow
              iconBg="#D2F6EA"
              icon={<ClipboardList className="h-5 w-5 text-jj-green" strokeWidth={2.5} />}
              title="내 판례 보기"
              desc="아낀 돈·후회율·재판 기록"
              onClick={() => router.push('/records')}
            />
          </div>
        </section>
      </div>
    </Layout>
  )
}

// 홈 가로 스크롤용 컴팩트 판례 카드 (소프트)
function MiniTrialCard({ trial, onClick }) {
  const versus = trial.mode === 'VERSUS'
  const versusLabel = versus
    ? trial.versusResult === 'A'
      ? '🅰 승'
      : trial.versusResult === 'B'
        ? '🅱 승'
        : '둘 다 별로'
    : undefined
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-40 shrink-0 snap-start flex-col gap-2 rounded-[18px] bg-jj-paper p-3.5 text-left transition-transform hover:scale-[1.03] active:scale-[.98]"
      style={{ boxShadow: softShadow }}
    >
      <div className="flex items-center justify-between">
        <ProductThumb
          imageUrl={versus ? undefined : trial.imageUrl}
          name={trial.itemName}
          size="sm"
          className="border-0"
        />
        <VerdictChip
          verdict={trial.verdict}
          jury={trial.jury || []}
          label={versusLabel}
          className="border-0 px-2 py-0 text-[9px]"
        />
      </div>
      <p className="line-clamp-2 min-h-[2.4em] font-display text-[12.5px] leading-tight">
        {versus ? `${trial.itemName} vs ${trial.itemNameB}` : trial.itemName}
      </p>
      <div className="flex items-center justify-between font-round text-[10.5px] text-jj-muted">
        <span>{formatWon(trial.price)}</span>
        <span className="inline-flex items-center gap-0.5">
          <Heart className="h-3 w-3" strokeWidth={2.5} />
          {trial.likeCount || 0}
        </span>
      </div>
    </button>
  )
}

function ShortcutRow({ icon, iconBg, title, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-[18px] bg-jj-paper p-3.5 text-left transition-transform hover:scale-[1.01] active:scale-[.99]"
      style={{ boxShadow: softShadow }}
    >
      <span
        className="grid h-11 w-11 flex-none place-items-center rounded-xl"
        style={{ background: iconBg }}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[14px] leading-tight">{title}</span>
        <span className="mt-0.5 block font-round text-[11px] text-jj-muted">{desc}</span>
      </span>
      <ChevronRight className="h-4 w-4 flex-none text-jj-muted" strokeWidth={2.5} />
    </button>
  )
}
