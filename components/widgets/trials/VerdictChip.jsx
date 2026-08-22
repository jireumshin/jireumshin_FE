'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { tally } from '@/lib/trial'

const styles = {
  guilty: 'bg-jj-red-soft text-jj-red',
  innocent: 'bg-jj-green-soft text-jj-green',
  pending: 'bg-jj-app text-jj-muted',
}

// 판결 칩 (유죄/무죄/심리중). jury를 주면 'N : N 유죄'처럼 집계 라벨, label로 직접 지정도 가능.
export default function VerdictChip({
  verdict,
  jury,
  pending,
  label,
  className,
}) {
  const base = 'border border-jj-line font-round text-[11px]'

  if (pending || (!verdict && !label)) {
    return (
      <Badge className={cn(base, styles.pending, className)}>심리 중</Badge>
    )
  }

  const guilty = verdict === 'GUILTY'
  const text = label ?? (jury ? tally(jury, verdict).label : guilty ? '유죄' : '무죄')
  const style = !verdict ? styles.pending : guilty ? styles.guilty : styles.innocent
  return <Badge className={cn(base, style, className)}>{text}</Badge>
}
