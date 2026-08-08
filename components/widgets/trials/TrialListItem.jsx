'use client'

import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { guessEmoji, formatWon, relativeDay } from '@/lib/trial'
import EmojiThumb from '@/components/common/EmojiThumb'
import VerdictChip from './VerdictChip'

// 판례 행 (썸네일 + 이름 + 날짜·가격 + 판결 칩). 클릭 가능한 버튼.
export default function TrialListItem({ trial, onClick, className }) {
  const pending = trial.status !== 'JUDGED'
  const versus = trial.mode === 'VERSUS'
  const versusLabel =
    versus && !pending
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
      className={cn(
        'flex items-center gap-3 rounded-[15px] border-[2.5px] border-jj-ink bg-jj-paper p-3 text-left shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
        className,
      )}
    >
      <EmojiThumb>{guessEmoji(trial.itemName)}</EmojiThumb>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-sm leading-tight">
          {versus ? `${trial.itemName} vs ${trial.itemNameB}` : trial.itemName}
        </span>
        <span className="mt-0.5 block font-round text-[10.5px] text-jj-muted">
          {relativeDay(trial.createdAt)} · {formatWon(trial.price)}
        </span>
      </span>
      <VerdictChip
        pending={pending}
        verdict={trial.verdict}
        jury={trial.jury || []}
        label={versusLabel}
      />
      <ChevronRight className="h-4 w-4 flex-none text-jj-muted" strokeWidth={2.5} />
    </button>
  )
}
