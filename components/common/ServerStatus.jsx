'use client'

import { useEffect, useState } from 'react'
import { Loader2, Wifi, WifiOff } from 'lucide-react'

import { createApiClient } from '@/lib/api'
import { cn } from '@/lib/utils'

const STATES = {
  checking: { icon: Loader2, label: '서버 확인 중', cls: 'bg-jj-paper text-jj-muted', spin: true },
  ok: { icon: Wifi, label: '서버 연결됨', cls: 'bg-jj-green text-white' },
  error: { icon: WifiOff, label: '서버 연결 안 됨', cls: 'bg-jj-red text-white' },
}

export default function ServerStatus({ className }) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let alive = true
    createApiClient()
      .get('/health')
      .then(() => alive && setStatus('ok'))
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
    }
  }, [])

  const { icon: Icon, label, cls, spin } = STATES[status]

  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border-2 border-jj-ink px-2.5 py-1 font-round text-[11px] shadow-hard-sm',
        cls,
        className,
      )}
    >
      <Icon className={cn('h-3 w-3', spin && 'animate-spin')} />
      {label}
    </span>
  )
}
