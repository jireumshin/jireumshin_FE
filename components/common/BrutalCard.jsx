'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const shadows = {
  hard: 'shadow-hard',
  sm: 'shadow-hard-sm',
  none: 'shadow-none',
}

// shadcn Card를 네오브루탈 톤으로 래핑 (BrutalButton과 대칭).
// 기본: 종이 카드 + 하드 그림자. tone/shadow/className으로 덮어씀(cn=twMerge).
export default function BrutalCard({ className, shadow = 'hard', ...props }) {
  return (
    <Card
      className={cn(
        'rounded-2xl border-[2.5px] border-jj-ink bg-jj-paper text-jj-ink',
        shadows[shadow],
        className,
      )}
      {...props}
    />
  )
}
