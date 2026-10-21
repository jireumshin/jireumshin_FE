'use client'

import { cn } from '@/lib/utils'

const FALLBACK = '/assets/judge.png'

const sizes = {
  xs: 'h-6 w-6 rounded-md p-0.5',
  sm: 'h-8 w-8 rounded-lg p-0.5',
  md: 'h-14 w-14 rounded-xl p-1',
  xl: 'h-20 w-20 rounded-2xl p-1.5',
}

// 유저 프로필 캐릭터 (URL은 서버가 내려줌, 실패 시 판사 캐릭터)
export default function UserAvatar({ src, alt = '프로필 캐릭터', size = 'sm', className }) {
  return (
    <span
      className={cn(
        'grid flex-none place-items-center border border-jj-line bg-jj-violet-soft',
        sizes[size],
        className,
      )}
    >
      <img
        src={src || FALLBACK}
        alt={alt}
        crossOrigin="anonymous"
        draggable={false}
        onError={(e) => {
          if (!e.currentTarget.src.endsWith(FALLBACK)) e.currentTarget.src = FALLBACK
        }}
        className="h-full w-full object-contain"
      />
    </span>
  )
}
