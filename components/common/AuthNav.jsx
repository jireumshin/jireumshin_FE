'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, X } from 'lucide-react'

const btnCls =
  'grid h-9 w-9 place-items-center rounded-lg border border-jj-line bg-jj-paper shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'

// X는 인증 플로우 종료 → 진입 화면(현재는 기소). TODO: 판결 등 다른 진입점은 ?returnTo로 확장
export default function AuthNav({ showBack = true }) {
  const router = useRouter()
  return (
    <span className="flex items-center gap-1.5">
      {showBack && (
        <button type="button" onClick={() => router.back()} aria-label="이전" className={btnCls}>
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
        </button>
      )}
      <button type="button" onClick={() => router.push('/')} aria-label="닫기" className={btnCls}>
        <X className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </span>
  )
}
