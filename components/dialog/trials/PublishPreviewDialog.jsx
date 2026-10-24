'use client'

import { EyeOff, ShieldAlert } from 'lucide-react'

import BrutalButton from '@/components/common/BrutalButton'
import DefenseTimeline from '@/components/widgets/trials/DefenseTimeline'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// 공개 직전 변론 대화 미리보기 — 개인정보가 담긴 진술은 숨기고 공개
export default function PublishPreviewDialog({
  open,
  onOpenChange,
  trial,
  onToggleHidden,
  onConfirm,
  busy,
}) {
  const messages = trial?.messages ?? []
  const hiddenCount = messages.filter((m) => m.hidden).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85svh] max-w-[380px] flex-col gap-3 rounded-2xl border border-jj-line bg-jj-paper p-5 shadow-hard">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-lg">변론 대화도 함께 공개돼요</DialogTitle>
          <DialogDescription className="font-round text-[12px] leading-snug">
            닉네임과 함께 판결·변론 대화 전체가 피드에 올라가요.
          </DialogDescription>
        </DialogHeader>

        <p className="flex items-start gap-2 rounded-xl bg-jj-red-soft px-3 py-2.5 font-round text-[11.5px] leading-snug text-jj-ink">
          <ShieldAlert className="mt-px h-4 w-4 flex-none text-jj-red" strokeWidth={2.5} />
          <span>
            이름·연락처·회사·사는 곳 같은 개인정보가 있는지 확인해 주세요.{' '}
            <EyeOff className="inline h-3 w-3 align-[-1px]" strokeWidth={2.5} /> 를 누르면 그 진술만 숨겨져요.
          </span>
        </p>

        {trial && (
          <section
            aria-label="공개될 변론 대화"
            className="-mx-1 flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto rounded-xl bg-jj-app px-3 py-3"
          >
            <DefenseTimeline trial={trial} messages={messages} onToggleHidden={onToggleHidden} />
          </section>
        )}

        <DialogFooter className="flex-row gap-2 sm:flex-row">
          <BrutalButton tone="paper" onClick={() => onOpenChange(false)} className="flex-1 border border-jj-line">
            취소
          </BrutalButton>
          <BrutalButton tone="ink" onClick={onConfirm} disabled={busy} className="flex-1">
            {hiddenCount > 0 ? `${hiddenCount}개 숨기고 공개` : '공개하기'}
          </BrutalButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
