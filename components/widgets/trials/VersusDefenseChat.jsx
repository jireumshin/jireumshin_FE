'use client'

import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { Send, ScrollText } from 'lucide-react'

import Layout from '@/components/common/Layout'
import BrutalButton from '@/components/common/BrutalButton'
import { Textarea } from '@/components/ui/textarea'
import ChatBubble from '@/components/widgets/trials/ChatBubble'
import { submitDefense } from '@/stores/trialsSlice'
import { cn } from '@/lib/utils'

const weight = (jurors, key) =>
  jurors.length
    ? Math.round(jurors.reduce((s, j) => s + (j[key] ?? 0), 0) / jurors.length)
    : 0

// A vs B 비교 재판 변론 — 편들 물건(A/B)을 골라 진술하면 그 물건 저울추가 움직인다.
export default function VersusDefenseChat({ trial, onUpdate, onExit }) {
  const dispatch = useDispatch()
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const threadRef = useRef(null)

  const jurors = Array.isArray(trial.jury) ? trial.jury : []
  const wA = weight(jurors, 'scoreA')
  const wB = weight(jurors, 'scoreB')
  const messages = Array.isArray(trial.messages) ? trial.messages : []
  const closed = !!trial.defenseClosed
  const roundsLeft = Math.max(0, 3 - (trial.defenseRounds ?? 0))

  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages.length, sending])

  const onSend = async () => {
    const message = text.trim()
    if (!message || sending || closed) return
    setSending(true)
    try {
      const updated = await dispatch(
        submitDefense({ id: trial.id, message }),
      ).unwrap()
      onUpdate(updated)
      setText('')
    } catch (e) {
      toast.error(typeof e === 'string' ? e : '변론 전달에 실패했어요')
    } finally {
      setSending(false)
    }
  }
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const inputDock = closed ? (
    <div className="p-3">
      <BrutalButton tone="ink" onClick={onExit} className="w-full">
        <span className="inline-flex items-center gap-2">
          <ScrollText className="h-4 w-4" strokeWidth={2.5} />
          결과 보기
        </span>
      </BrutalButton>
    </div>
  ) : (
    <div className="flex items-end gap-2 p-3">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        maxLength={500}
        disabled={sending}
        placeholder="용도·상황을 더 얘기해보세요…"
        className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-jj-line bg-jj-paper font-round text-[13px] shadow-hard-sm focus-visible:ring-0"
      />
      <BrutalButton
        tone="yellow"
        onClick={onSend}
        disabled={sending || !text.trim()}
        className="flex-none px-4 py-3 disabled:opacity-50"
      >
        <Send className="h-4 w-4" strokeWidth={2.5} />
      </BrutalButton>
    </div>
  )

  return (
    <Layout
      headerProps={{ subtitle: closed ? '변론 종료' : `변론 · 남은 ${roundsLeft}회` }}
      showBottomNavigation
      bottomNavigation={inputDock}
      noScroll
    >
      <div className="flex h-full flex-col">
        {/* 저울 헤더 */}
        <div className="shrink-0 space-y-2 border-b-2 border-jj-ink/15 bg-jj-paper px-4 py-3">
          <div className="font-display text-xs">⚖ 저울 현황</div>
          <ScaleRow label="A" name={trial.itemName} value={wA} lead={wA >= wB} />
          <ScaleRow label="B" name={trial.itemNameB} value={wB} lead={wB > wA} />
        </div>

        {/* 스레드 */}
        <div
          ref={threadRef}
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
        >
          <div className="rounded-xl border-2 border-dashed border-jj-ink/30 bg-jj-paper/60 px-3.5 py-2.5 text-center font-round text-[11px] leading-relaxed text-jj-muted">
            용도·상황을 <b className="text-jj-ink">더 털어놓으면</b> 배심원이 A·B를 다시
            저울질해요. 편들 필요 없어요.
          </div>

          {messages.map((m) => (
            <ChatBubble
              key={m.id}
              role={m.role}
              juror={m.juror}
              emoji={m.emoji}
              content={m.content}
            />
          ))}

          {sending && (
            <>
              <ChatBubble role="USER" content={text.trim()} />
              <div className="pl-1 font-round text-[11px] text-jj-muted">
                배심원단이 저울질 중…
              </div>
            </>
          )}

          {closed && !sending && (
            <div className="mt-1 rounded-xl border border-jj-line bg-jj-ink px-4 py-3 text-center text-white">
              <div className="font-display text-sm">⚖ 변론 종료 · 판결이 확정됐어요</div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

function ScaleRow({ label, name, value, lead }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-5 w-5 flex-none place-items-center rounded border border-jj-line bg-jj-paper font-display text-[10px]">
        {label}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between font-round text-[10px] text-jj-ink/70">
          <span className="truncate">{name}</span>
          <span className={lead ? 'text-jj-green' : 'text-jj-ink'}>{value}</span>
        </div>
        <div className="relative mt-0.5 h-2.5 w-full overflow-hidden rounded-full border border-jj-line bg-jj-app">
          <div
            className={cn('h-full transition-all duration-700 ease-out', lead ? 'bg-jj-green' : 'bg-jj-red')}
            style={{ width: `${value}%` }}
          />
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-jj-ink/40" />
        </div>
      </div>
    </div>
  )
}
