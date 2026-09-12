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

// 배심원 4명 — 캐릭터 이미지·accent 색(포인트로만)·성격 한마디
const JURORS = [
  { img: '/assets/value-fairy.png', name: '가성비요정', soft: '#F0F8E8', glow: 'rgba(168,215,122,.28)', desc: '그 가격이면 조금 더 고민해봐도 좋아요.' },
  { img: '/assets/wallet-guardian.png', name: '텅장지킴이', soft: '#EAF2FE', glow: 'rgba(111,168,248,.28)', desc: '이번 달 소비 내역부터 확인하시죠.' },
  { img: '/assets/impluse-fairy.png', name: '지름요정', soft: '#FFF0F3', glow: 'rgba(255,143,163,.28)', desc: '근데… 예쁘긴 하네요. 인생 한 방이잖아요.' },
  { img: '/assets/fact-bot.png', name: '팩트봇', soft: '#F0EEFC', glow: 'rgba(155,143,232,.28)', desc: '감정은 빼고 객관적인 정보만 확인하겠습니다.' },
]

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
      <div className="flex flex-col gap-9 px-5 pb-10 pt-6">

        {/* 히어로 — 법정 씬 + 배심원단 */}
        <section className="flex flex-col items-center text-center">
          <h1 className="mt-3 font-display text-[26px] leading-tight text-jj-ink">
            당신의 지름,<br />재판을 시작합니다
          </h1>
          <p className="mt-2.5 font-round text-[13px] leading-relaxed text-jj-muted">
            성격 다른 배심원 4명이 30초 만에<br />유·무죄를 가립니다
          </p>

          {/* 배심원 아바타 (탭 → 한마디) */}
          <div className="mt-6 w-full">
            <ul className="flex justify-between gap-2">
              {JURORS.map((j, i) => (
                <li key={j.name} className="flex-1">
                  <button
                    type="button"
                    onClick={() => setOpenJuror(openJuror === i ? null : i)}
                    className="flex w-full flex-col items-center gap-1.5 transition-transform hover:scale-105"
                  >
                    <span
                      className={cn(
                        'grid aspect-square w-full place-items-center rounded-2xl p-1.5 transition-all',
                        openJuror === i ? 'ring-2 ring-jj-navy' : 'ring-1 ring-jj-line',
                      )}
                      style={{ background: j.soft, boxShadow: openJuror === i ? `0 6px 16px ${j.glow}` : 'none' }}
                    >
                      <img src={j.img} alt={j.name} className="h-full w-full object-contain" draggable={false} />
                    </span>
                    <span
                      className={cn(
                        'font-round text-[10.5px]',
                        openJuror === i ? 'font-bold text-jj-ink' : 'text-jj-muted',
                      )}
                    >
                      {j.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {openJuror !== null && (
              <div className="relative mt-3">
                <span
                  className="absolute -top-1.5 h-3 w-3 rotate-45 rounded-xs bg-jj-navy"
                  style={{ left: `calc(${12.5 + openJuror * 25}% - 6px)` }}
                />
                <div className="rounded-2xl bg-jj-navy px-4 py-3 text-left">
                  <p className="font-round text-[13px] leading-relaxed text-white">
                    “{JURORS[openJuror].desc}”
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => router.push('/new')}
            className="mt-6 w-full rounded-2xl bg-jj-navy py-4 font-display text-[17px] text-white transition-transform hover:scale-[1.02] active:scale-[.98]"
            style={{ boxShadow: '0 10px 24px rgba(37,45,82,.28)' }}
          >
            <span className="inline-flex items-center gap-2">
              <Gavel className="h-4 w-4" strokeWidth={2.5} />
              지금 기소하기
            </span>
          </button>
          <p className="mt-2.5 font-round text-[11px] text-jj-muted">
            약 30초 · 로그인 없이 바로 시작
          </p>
        </section>

        {/* 지금 재판 중 (가로 스크롤) */}
        {feedPreview.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-[16px] text-jj-ink">지금 재판 중인 판례</h2>
              <button
                type="button"
                onClick={() => router.push('/feed')}
                className="inline-flex items-center gap-0.5 font-round text-xs text-jj-violet transition-transform hover:scale-105"
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
          <h2 className="mb-3 font-display text-[16px] text-jj-ink">이렇게 써보세요</h2>
          <div className="flex flex-col gap-2.5">
            <ShortcutRow
              iconBg="var(--jj-navy)"
              icon={<Gavel className="h-5 w-5 text-white" strokeWidth={2.5} />}
              title="살까 말까 재판"
              desc="한 물건, 유죄 vs 무죄"
              onClick={() => router.push('/new')}
            />
            <ShortcutRow
              iconBg="var(--jj-violet)"
              icon={<Scale className="h-5 w-5 text-white" strokeWidth={2.5} />}
              title="A vs B 비교"
              desc="둘 중 뭘 살지 저울에"
              onClick={() => router.push('/new?mode=versus')}
            />
            <ShortcutRow
              iconBg="var(--jj-value)"
              icon={<ClipboardList className="h-5 w-5 text-white" strokeWidth={2.5} />}
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

// 홈 가로 스크롤용 컴팩트 판례 카드
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
      className="flex w-40 shrink-0 snap-start flex-col gap-2 rounded-[18px] border border-jj-line bg-jj-paper p-3.5 text-left shadow-hard-sm transition-transform hover:scale-[1.03] active:scale-[.98]"
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
      <p className="line-clamp-2 min-h-[2.4em] font-display text-[12.5px] leading-tight text-jj-ink">
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
      className="flex items-center gap-3 rounded-[18px] border border-jj-line bg-jj-paper p-3.5 text-left shadow-hard-sm transition-transform hover:scale-[1.01] active:scale-[.99]"
    >
      <span
        className="grid h-11 w-11 flex-none place-items-center rounded-xl"
        style={{ background: iconBg }}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[14px] leading-tight text-jj-ink">{title}</span>
        <span className="mt-0.5 block font-round text-[11px] text-jj-muted">{desc}</span>
      </span>
      <ChevronRight className="h-4 w-4 flex-none text-jj-muted" strokeWidth={2.5} />
    </button>
  )
}
