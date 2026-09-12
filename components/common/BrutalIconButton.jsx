'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// tone별 배경(호버도 같은 색으로 고정 — shadcn 기본 hover 무력화)
const tones = {
  paper: 'bg-jj-paper text-jj-ink hover:bg-jj-paper',
  app: 'bg-jj-app text-jj-ink hover:bg-jj-app',
  green: 'bg-jj-green text-white hover:bg-jj-green',
  red: 'bg-jj-red text-white hover:bg-jj-red',
  ink: 'bg-jj-navy text-white hover:bg-jj-navy',
  yellow: 'bg-jj-yellow text-jj-ink hover:bg-jj-yellow',
}

const sizes = {
  sm: 'h-9 w-9 rounded-lg',
  md: 'h-11 w-11 rounded-xl',
}

// 아이콘 전용 브루탈 버튼 (shadcn Button 래핑, BrutalButton과 대칭)
export default function BrutalIconButton({
  tone = 'paper',
  size = 'sm',
  className,
  children,
  ...props
}) {
  return (
    <Button
      size="icon"
      className={cn(
        'border border-jj-line shadow-hard-sm',
        'transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-40',
        sizes[size],
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
