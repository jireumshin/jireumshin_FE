'use client'

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import BrutalCard from './BrutalCard'

const tones = {
  red: {
    text: 'text-jj-red',
    ind: '[&_[data-slot=progress-indicator]]:bg-jj-red',
  },
  green: {
    text: 'text-jj-green',
    ind: '[&_[data-slot=progress-indicator]]:bg-jj-green',
  },
  violet: {
    text: 'text-jj-violet',
    ind: '[&_[data-slot=progress-indicator]]:bg-jj-violet',
  },
}

// 통계 카드 (라벨 + 큰 % + 진행바). shadcn Progress 래핑.
export default function StatBar({ label, value, tone = 'violet', className }) {
  const t = tones[tone] ?? tones.violet
  return (
    <BrutalCard shadow="sm" className={cn('p-4', className)}>
      <p className="font-round text-[11px] text-jj-muted">{label}</p>
      <p className={cn('mt-1 font-display text-3xl leading-none', t.text)}>
        {value}%
      </p>
      <Progress
        value={value}
        className={cn('mt-2.5 h-2 border-2 border-jj-ink bg-white', t.ind)}
      />
    </BrutalCard>
  )
}
