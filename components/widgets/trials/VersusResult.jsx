'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Share2, Gavel, Bookmark, Scale } from 'lucide-react'

import Layout from '@/components/common/Layout'
import BrutalButton from '@/components/common/BrutalButton'
import BrutalCard from '@/components/common/BrutalCard'
import ProductThumb from '@/components/common/ProductThumb'
import VersusDefenseChat from '@/components/widgets/trials/VersusDefenseChat'
import { useAuth } from '@/contexts/AuthContext'
import { selectors } from '@/stores'
import { claimTrial } from '@/stores/trialsSlice'
import { formatWon } from '@/lib/trial'
import { cn } from '@/lib/utils'

const weight = (jurors, key) =>
  jurors.length
    ? Math.round(jurors.reduce((s, j) => s + (j[key] ?? 0), 0) / jurors.length)
    : 0

// A vs B 비교 재판 결과 화면 (판결 완료).
export default function VersusResult({ trial, onUpdate }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated, initialized } = useAuth()
  const currentTrial = useSelector(selectors.getCurrentTrial)
  const [defending, setDefending] = useState(false)

  if (defending) {
    return (
      <VersusDefenseChat
        trial={trial}
        onUpdate={onUpdate}
        onExit={() => setDefending(false)}
      />
    )
  }

  const jurors = Array.isArray(trial.jury) ? trial.jury : []
  const wA = weight(jurors, 'scoreA')
  const wB = weight(jurors, 'scoreB')
  const result = trial.versusResult // 'A' | 'B' | 'NEITHER'
  const aWin = result === 'A'
  const bWin = result === 'B'
  const neither = result === 'NEITHER'

  const owned =
    !!trial.userId ||
    (currentTrial?.id === trial.id && !!currentTrial?.userId)

  const saveToAccount = () => {
    sessionStorage.setItem(`claim:${trial.id}`, '1')
    router.push(`/login?redirect=${encodeURIComponent(`/trial/?id=${trial.id}`)}`)
  }
  const claimNow = async () => {
    try {
      const updated = await dispatch(claimTrial(trial.id)).unwrap()
      onUpdate(updated)
      toast('🔖 내 판례로 저장했어요')
    } catch (e) {
      toast.error(typeof e === 'string' ? e : '저장에 실패했어요')
    }
  }

  const banner = neither
    ? { bg: 'bg-jj-ink', title: '둘 다 별로 · 지금은 참아요', sub: '배심원단이 둘 다 값어치가 부족하다고 봤어요' }
    : aWin
      ? { bg: 'bg-jj-green', title: `🅰 ${trial.itemName}`, sub: '이걸 사세요 · 배심원단의 선택' }
      : { bg: 'bg-jj-green', title: `🅱 ${trial.itemNameB}`, sub: '이걸 사세요 · 배심원단의 선택' }

  return (
    <Layout headerProps={{ subtitle: '비교 판결 완료' }}>
      <section className="flex flex-col gap-4 px-5 pb-8 pt-6">
        {/* 결과 배너 */}
        <BrutalCard className={cn('p-5 text-center text-white', banner.bg)}>
          <span className="font-round text-[11px] tracking-wide opacity-90">최종 판결</span>
          <h1 className="mt-1 truncate font-display text-[26px] leading-tight">{banner.title}</h1>
          <div className="mt-2 inline-block rounded-full border-2 border-jj-ink bg-jj-ink/20 px-3 py-0.5 font-round text-xs">
            {banner.sub}
          </div>
        </BrutalCard>

        {/* 저장 유도 */}
        {initialized && !owned && (
          <BrutalCard shadow="sm" className="flex items-center gap-3 border-jj-violet bg-jj-violet-soft p-3.5">
            <Bookmark className="h-5 w-5 flex-none text-jj-violet" strokeWidth={2.5} />
            <div className="min-w-0 flex-1">
              <div className="font-display text-[13px]">이 판례, 저장할까요?</div>
              <div className="mt-0.5 font-round text-[11px] text-jj-muted">
                {isAuthenticated ? '내 판례 목록에 남겨둘 수 있어요' : '로그인하면 이 판례가 사라지지 않고 저장돼요'}
              </div>
            </div>
            <BrutalButton tone="ink" onClick={isAuthenticated ? claimNow : saveToAccount} className="flex-none px-3.5 py-2 text-xs">
              {isAuthenticated ? '저장' : '로그인'}
            </BrutalButton>
          </BrutalCard>
        )}

        {/* 후보 A vs B 카드 */}
        <div className="grid grid-cols-2 gap-3">
          <CandidateCard
            badge="A"
            name={trial.itemName}
            price={trial.price}
            imageUrl={trial.imageUrl}
            win={aWin}
            dim={bWin}
          />
          <CandidateCard
            badge="B"
            name={trial.itemNameB}
            price={trial.priceB}
            imageUrl={trial.imageUrlB}
            win={bWin}
            dim={aWin}
          />
        </div>

        {/* ⚖ 저울 — A·B 무게 */}
        <BrutalCard className="p-4">
          <div className="mb-3 font-display text-sm">⚖ 배심원 저울</div>
          <div className="flex flex-col gap-2.5">
            <ScaleBar label="A" name={trial.itemName} value={wA} win={aWin} />
            <ScaleBar label="B" name={trial.itemNameB} value={wB} win={bWin} />
          </div>
          <p className="mt-2 text-center font-round text-[10px] text-jj-muted">
            무게 50 이상이어야 “살 값어치”가 있어요
          </p>
        </BrutalCard>

        {/* 배심원 비교 */}
        <BrutalCard className="p-4">
          <div className="mb-3 font-display text-sm">⚖ 배심원 비교</div>
          <ul className="flex flex-col gap-3">
            {jurors.map((j) => (
              <li key={j.juror} className="flex items-start gap-2.5">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-lg border-2 border-jj-ink bg-jj-app text-lg">
                  {j.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-[13px]">{j.juror}</span>
                    <span className="font-round text-[10px] text-jj-muted">
                      A <b className={j.scoreA >= j.scoreB ? 'text-jj-green' : 'text-jj-ink'}>{j.scoreA}</b>
                      {' · '}B <b className={j.scoreB > j.scoreA ? 'text-jj-green' : 'text-jj-ink'}>{j.scoreB}</b>
                    </span>
                  </div>
                  <p className="mt-0.5 font-round text-[11px] leading-relaxed text-jj-ink/80">{j.argument}</p>
                </div>
              </li>
            ))}
          </ul>
        </BrutalCard>

        {/* 판결 요지 */}
        <BrutalCard className="bg-jj-ink p-4 text-white">
          <div className="mb-1.5 font-round text-[11px] text-jj-yellow">📜 판결 요지</div>
          <p className="text-[13px] leading-relaxed">{trial.summary}</p>
        </BrutalCard>

        {/* 후회지수 */}
        <BrutalCard shadow="sm" className="p-3.5 text-center">
          <div className="font-round text-[11px] text-jj-muted">예상 후회지수</div>
          <div className="mt-1 font-display text-3xl text-jj-red">{trial.regretIndex}%</div>
        </BrutalCard>

        {/* 액션 */}
        <div className="mt-1 flex flex-col gap-2.5">
          <BrutalButton tone="ink" onClick={() => setDefending(true)} className="w-full">
            <span className="inline-flex items-center gap-2">
              <Scale className="h-4 w-4" strokeWidth={2.5} />
              {trial.defenseClosed
                ? '변론 기록 보기'
                : (trial.defenseRounds ?? 0) > 0
                  ? `더 얘기하기 · 남은 ${Math.max(0, 3 - (trial.defenseRounds ?? 0))}회`
                  : '배심원과 더 얘기해보기'}
            </span>
          </BrutalButton>
          {!trial.defenseClosed && (
            <p className="-mt-1 text-center font-round text-[11px] text-jj-muted">
              용도·상황을 더 얘기하면 저울이 움직여요
            </p>
          )}
          <BrutalButton tone="yellow" onClick={() => router.push(`/verdict/?id=${trial.id}`)} className="w-full">
            <span className="inline-flex items-center gap-2">
              <Share2 className="h-4 w-4" strokeWidth={2.5} />
              판결 공유하기
            </span>
          </BrutalButton>
          <BrutalButton tone="ink" onClick={() => router.push('/')} className="w-full">
            <span className="inline-flex items-center gap-2">
              <Gavel className="h-4 w-4" strokeWidth={2.5} />또 재판하기
            </span>
          </BrutalButton>
        </div>
      </section>
    </Layout>
  )
}

function CandidateCard({ badge, name, price, imageUrl, win, dim }) {
  return (
    <BrutalCard
      shadow="sm"
      className={cn(
        'flex flex-col items-center gap-2 p-3 text-center',
        win && 'border-jj-green bg-jj-green-soft',
        dim && 'opacity-55',
      )}
    >
      <div className="flex w-full items-center justify-between">
        <span className="grid h-6 w-6 place-items-center rounded-md border-2 border-jj-ink bg-jj-paper font-display text-[11px]">
          {badge}
        </span>
        {win && (
          <span className="rounded-full border-2 border-jj-ink bg-jj-green px-2 py-0.5 font-round text-[9px] text-white">
            👑 승
          </span>
        )}
      </div>
      <ProductThumb imageUrl={imageUrl} name={name} size="lg" />
      <div className="min-w-0 w-full">
        <div className="truncate font-display text-[13px]">{name}</div>
        <div className="mt-0.5 font-display text-xs text-jj-violet">{formatWon(price)}</div>
      </div>
    </BrutalCard>
  )
}

function ScaleBar({ label, name, value, win }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-5 w-5 flex-none place-items-center rounded border-2 border-jj-ink bg-jj-paper font-display text-[10px]">
        {label}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between font-round text-[10px] text-jj-ink/70">
          <span className="truncate">{name}</span>
          <span className={win ? 'text-jj-green' : 'text-jj-ink'}>{value}</span>
        </div>
        <div className="relative mt-0.5 h-2.5 w-full overflow-hidden rounded-full border-2 border-jj-ink bg-jj-app">
          <div
            className={cn('h-full transition-all duration-700 ease-out', win ? 'bg-jj-green' : 'bg-jj-red')}
            style={{ width: `${value}%` }}
          />
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-jj-ink/40" />
        </div>
      </div>
    </div>
  )
}
