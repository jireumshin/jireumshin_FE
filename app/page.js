'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import Layout from '@/components/common/Layout'
import BrutalButton from '@/components/common/BrutalButton'
import ServerGuard from '@/components/common/ServerGuard'
import AuthButton from '@/components/common/AuthButton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { selectors } from '@/stores'
import { createTrial } from '@/stores/trialsSlice'
import { fieldCls } from '@/lib/formStyles'

const JURORS = [
  { emoji: '🐿️', name: '가성비요정' },
  { emoji: '🧘', name: '텅장지킴이' },
  { emoji: '🔥', name: '지름요정' },
  { emoji: '🔮', name: '팩트봇' },
]

export default function Home() {
  const dispatch = useDispatch()
  const creating = useSelector(selectors.getTrialCreating)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [reason, setReason] = useState('')
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (!image?.url) return
    return () => URL.revokeObjectURL(image.url)
  }, [image])

  const canSubmit = name.trim() !== '' && price.replace(/[^0-9]/g, '') !== ''

  const onPrice = (e) => {
    const digits = e.target.value.replace(/[^0-9]/g, '')
    setPrice(digits ? Number(digits).toLocaleString('ko-KR') : '')
  }

  const onImage = (e) => {
    const file = e.target.files?.[0]
    if (file) setImage({ file, url: URL.createObjectURL(file) })
  }
  const removeImage = () => setImage(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit || creating) return
    try {
      const priceNum = Number(price.replace(/[^0-9]/g, ''))
      await dispatch(
        createTrial({
          itemName: name.trim(),
          price: priceNum,
          reason: reason.trim() || undefined,
        }),
      ).unwrap()
      toast('🔨 기소 접수! 배심원단을 소집합니다')
      // TODO: verdict(심리) 기능 구현 후 심리 화면으로 이동
    } catch (err) {
      toast.error(err?.message || '기소 접수에 실패했어요. 잠시 후 다시 시도해주세요.')
    }
  }

  const dock = (
    <div className="px-4 pb-5 pt-3.5">
      <BrutalButton
        tone="red"
        type="submit"
        form="jiso-form"
        disabled={!canSubmit || creating}
        className="w-full text-[17px]"
      >
        🔨 기소하고 재판 시작
      </BrutalButton>
      <p className="mt-2.5 text-center font-round text-[11px] text-jj-muted">
        약 30초 · 로그인 없이 바로 시작
      </p>
    </div>
  )

  return (
    <Layout
      isLoading={creating}
      headerProps={{ subtitle: '새 사건 접수', right: <AuthButton /> }}
      showBottomNavigation
      bottomNavigation={dock}
    >
      <ServerGuard />
      <form id="jiso-form" onSubmit={onSubmit} className="space-y-6 px-5 pb-6 pt-6">
          <header className="text-center">
            <p className="inline-block -rotate-2 rounded-full border-2 border-jj-ink bg-jj-violet px-3 py-1 font-round text-xs text-white shadow-hard-sm">
              ⚖ 배심원 4명 대기중
            </p>
            <h1 className="mt-3.5 font-display text-[26px] leading-tight">
              살까 말까 고민되는
              <br />그 물건,{' '}
              <span className="relative inline-block text-jj-red">
                <span className="absolute inset-x-0 bottom-1 z-0 h-2.5 -rotate-1 bg-jj-yellow" />
                <span className="relative z-10">기소하세요</span>
              </span>
            </h1>
            <p className="mt-2.5 text-sm font-semibold text-jj-muted">
              배심원들이 갑론을박 끝에 판결을 내려드려요
            </p>
          </header>

          <ul className="flex justify-center gap-2.5">
            {JURORS.map((j) => (
              <li key={j.name} className="flex flex-col items-center gap-1.5">
                <span className="grid h-12 w-12 place-items-center rounded-xl border-[2.5px] border-jj-ink bg-jj-paper text-2xl shadow-hard-sm">
                  {j.emoji}
                </span>
                <small className="font-round text-[9px] text-jj-muted">{j.name}</small>
              </li>
            ))}
          </ul>

          <fieldset className="min-w-0 space-y-4 rounded-2xl border-[2.5px] border-jj-ink bg-jj-paper p-4 shadow-hard">
            {image ? (
              <figure className="relative m-0">
                <img
                  src={image.url}
                  alt="상품 사진"
                  className="h-36 w-full rounded-xl border-[2.5px] border-jj-ink object-cover shadow-hard-sm"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  aria-label="사진 삭제"
                  className="absolute -right-2.5 -top-2.5 grid h-7 w-7 place-items-center rounded-full border-2 border-jj-ink bg-jj-red font-display text-sm text-white shadow-hard-sm"
                >
                  ✕
                </button>
              </figure>
            ) : (
              <label className="flex h-20 cursor-pointer items-center justify-center gap-2 rounded-xl border-[2.5px] border-dashed border-jj-ink bg-jj-app font-display text-sm text-jj-muted">
                📷 상품 사진 추가
                <span className="font-round text-xs font-normal">(선택)</span>
                <input type="file" accept="image/*" onChange={onImage} className="hidden" />
              </label>
            )}

            <label className="block">
              <span className="mb-2 flex items-center gap-2 font-display text-sm">
                <span className="grid h-5 w-5 place-items-center rounded-md bg-jj-ink text-[11px] text-jj-yellow">1</span>
                무엇을 사려고 하나요?
              </span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder="예: 노이즈캔슬링 무선 헤드폰"
                className={fieldCls}
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 font-display text-sm">
                <span className="grid h-5 w-5 place-items-center rounded-md bg-jj-ink text-[11px] text-jj-yellow">2</span>
                얼마인가요?
              </span>
              <span className="relative block">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-jj-violet">₩</span>
                <Input
                  value={price}
                  onChange={onPrice}
                  inputMode="numeric"
                  placeholder="349,000"
                  className={`${fieldCls} pl-8`}
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 font-display text-sm">
                <span className="grid h-5 w-5 place-items-center rounded-md bg-jj-ink text-[11px] text-jj-yellow">3</span>
                사려는 이유는?
                <span className="font-round text-[10px] font-normal text-jj-muted">— 솔직할수록 재밌어져요</span>
              </span>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={200}
                rows={3}
                placeholder="예: 지금 쓰는 건 멀쩡한데 신형 색깔이 너무 예뻐서요…"
                className={`${fieldCls} resize-none`}
              />
            </label>
          </fieldset>
      </form>
    </Layout>
  )
}
