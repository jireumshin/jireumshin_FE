'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { fieldCls } from '@/lib/formStyles'

// 기소 후보 1개 입력(사진·상품명·가격·이유). 단일/비교 모드 공용.
export default function CandidateFields({
  title,
  image,
  onPickImage,
  onRemoveImage,
  name,
  onName,
  price,
  onPrice,
  reason,
  onReason,
  namePlaceholder = '예: 노이즈캔슬링 무선 헤드폰',
  pricePlaceholder = '349,000',
  reasonPlaceholder = '예: 매일 출퇴근에 쓸 거라서요',
  onRemove,
}) {
  return (
    <fieldset className="min-w-0 space-y-4 rounded-2xl border border-jj-line bg-jj-paper p-4 shadow-hard">
      {title && (
        <div className="flex items-center justify-between">
          <span className="font-display text-sm">{title}</span>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="font-round text-[11px] text-jj-muted underline underline-offset-2"
            >
              빼기
            </button>
          )}
        </div>
      )}

      {image ? (
        <figure className="relative m-0 aspect-3/2 w-full overflow-hidden rounded-xl border border-jj-line shadow-hard-sm">
          <img src={image.url} alt="상품 사진" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={onRemoveImage}
            aria-label="사진 삭제"
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border border-jj-line bg-jj-red font-display text-sm text-white shadow-hard-sm"
          >
            ✕
          </button>
        </figure>
      ) : (
        <label className="flex h-16 cursor-pointer items-center justify-center gap-2 rounded-xl border border-jj-line bg-jj-app font-display text-sm text-jj-muted">
          📷 상품 사진 <span className="font-round text-xs font-normal">(선택)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onPickImage(f)
            }}
            className="hidden"
          />
        </label>
      )}

      <label className="block">
        <span className="mb-1.5 block font-display text-[13px]">상품명</span>
        <Input
          value={name}
          onChange={(e) => onName(e.target.value)}
          maxLength={40}
          placeholder={namePlaceholder}
          className={fieldCls}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block font-display text-[13px]">가격</span>
        <span className="relative block">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-jj-violet">
            ₩
          </span>
          <Input
            value={price}
            onChange={onPrice}
            inputMode="numeric"
            placeholder={pricePlaceholder}
            className={`${fieldCls} pl-8`}
          />
        </span>
      </label>

      <label className="block">
        <span className="mb-1.5 block font-display text-[13px]">
          사려는 이유{' '}
          <span className="font-round text-[10px] font-normal text-jj-muted">— 솔직할수록 재밌어져요</span>
        </span>
        <Textarea
          value={reason}
          onChange={(e) => onReason(e.target.value)}
          maxLength={500}
          rows={2}
          placeholder={reasonPlaceholder}
          className={`${fieldCls} resize-none`}
        />
        <span className="mt-1 block text-right font-round text-[10px] text-jj-muted">
          {reason.length}/500
        </span>
      </label>
    </fieldset>
  )
}
