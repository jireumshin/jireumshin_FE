'use client'

import { cn } from '@/lib/utils'
import { jurorAvatar } from '@/lib/trial'
import EmojiThumb from './EmojiThumb'
import CharacterImage from './CharacterImage'

const sizes = {
  xs: 'h-6 w-6 rounded-md p-0.5',
  sm: 'h-9 w-9 rounded-lg',
  md: 'h-11 w-11 rounded-xl',
  lg: 'h-12 w-12 rounded-xl',
}

// 배심원 아바타 — 이름이 캐릭터와 매칭되면 PNG, 아니면 이모지 썸네일 폴백
export default function JurorAvatar({ name, emoji, size = 'sm', alt = name, className }) {
  const a = jurorAvatar(name)
  if (!a) {
    return (
      <EmojiThumb size={size} className={className}>
        {emoji}
      </EmojiThumb>
    )
  }
  return (
    <span
      className={cn('grid flex-none place-items-center p-1 ring-1 ring-jj-line', sizes[size], className)}
      style={{ background: a.soft }}
    >
      <CharacterImage name={name} alt={alt} className="h-full w-full object-contain" />
    </span>
  )
}
