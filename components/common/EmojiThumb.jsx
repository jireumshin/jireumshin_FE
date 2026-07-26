'use client'

import { cn } from '@/lib/utils'

const sizes = {
  sm: 'h-9 w-9 rounded-lg text-lg',
  md: 'h-11 w-11 rounded-xl text-xl',
  lg: 'h-12 w-12 rounded-xl text-2xl',
}

// 이모지 사각 썸네일 (판례 행·기소 대상 등에서 반복되던 표면)
export default function EmojiThumb({ children, size = 'md', className }) {
  return (
    <span
      className={cn(
        'grid flex-none place-items-center border-2 border-jj-ink bg-jj-violet-soft',
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
