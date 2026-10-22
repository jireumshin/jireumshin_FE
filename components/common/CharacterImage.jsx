'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectors } from '@/stores'
import { fetchOptions } from '@/stores/optionsSlice'
import { jurorAvatar } from '@/lib/trial'

// 배심원 캐릭터 이미지 — 서버 options(버킷, 256px) 우선, 응답 전·실패 시 로컬 PNG
export default function CharacterImage({ name, alt = name, className }) {
  const dispatch = useDispatch()
  const avatars = useSelector(selectors.getAvatarOptions)
  const a = jurorAvatar(name)

  useEffect(() => {
    dispatch(fetchOptions())
  }, [dispatch])

  if (!a) return null
  const src = avatars.find((o) => o.key === a.key)?.url ?? a.img

  return (
    <img
      src={src}
      alt={alt}
      crossOrigin="anonymous"
      draggable={false}
      onError={(e) => {
        if (!e.currentTarget.src.endsWith(a.img)) e.currentTarget.src = a.img
      }}
      className={className}
    />
  )
}
