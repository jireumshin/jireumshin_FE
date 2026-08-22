'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCw, ServerCrash } from 'lucide-react'

import Layout from '@/components/common/Layout'
import BrutalButton from '@/components/common/BrutalButton'
import { createApiClient } from '@/lib/api'

export default function ServerErrorPage() {
  const router = useRouter()
  const [retrying, setRetrying] = useState(false)

  const onRetry = async () => {
    if (retrying) return
    setRetrying(true)
    try {
      await createApiClient().get('/health', { timeout: 5000 })
      router.replace('/')
    } catch {
      setRetrying(false)
    }
  }

  return (
    <Layout showHeader={false} noScroll>
      <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
        <span className="grid h-24 w-24 -rotate-3 place-items-center rounded-2xl border border-jj-line bg-jj-red text-white shadow-hard">
          <ServerCrash className="h-12 w-12" />
        </span>

        <div className="space-y-2.5">
          <h1 className="font-display text-2xl leading-tight">
            재판소가 잠시
            <br />
            문을 닫았어요
          </h1>
          <p className="text-sm font-semibold text-jj-muted">
            서버에 연결하지 못했어요.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>
        </div>

        <BrutalButton
          tone="ink"
          onClick={onRetry}
          disabled={retrying}
          className="w-full max-w-64"
        >
          <RotateCw className={`mr-2 h-5 w-5 ${retrying ? 'animate-spin' : ''}`} />
          {retrying ? '연결 확인 중…' : '다시 시도'}
        </BrutalButton>
      </div>
    </Layout>
  )
}
