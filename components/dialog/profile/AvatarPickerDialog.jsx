'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Check } from 'lucide-react'

import UserAvatar from '@/components/common/UserAvatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { selectors } from '@/stores'
import { fetchOptions } from '@/stores/optionsSlice'
import { cn } from '@/lib/utils'

export default function AvatarPickerDialog({ open, onOpenChange, current, onSelect, saving }) {
  const dispatch = useDispatch()
  const avatars = useSelector(selectors.getAvatarOptions)
  const loaded = useSelector(selectors.getOptionsLoaded)

  useEffect(() => {
    if (open && !loaded) dispatch(fetchOptions())
  }, [open, loaded, dispatch])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[340px] rounded-2xl border border-jj-line bg-jj-paper p-5 shadow-hard">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="font-display text-lg">프로필 캐릭터</DialogTitle>
          <DialogDescription className="font-round text-[12px]">
            재판소에서 나를 대신할 캐릭터를 골라주세요
          </DialogDescription>
        </DialogHeader>

        {!loaded ? (
          <p className="py-8 text-center font-round text-sm text-jj-muted">불러오는 중…</p>
        ) : (
          <ul className="grid grid-cols-3 gap-2.5 pt-1">
            {avatars.map((a) => {
              const selected = a.key === current
              return (
                <li key={a.key}>
                  <button
                    type="button"
                    disabled={saving}
                    aria-pressed={selected}
                    onClick={() => onSelect(a.key)}
                    className={cn(
                      'relative flex w-full flex-col items-center gap-1.5 rounded-xl border p-2 transition-transform active:scale-95 disabled:opacity-60',
                      selected ? 'border-jj-violet bg-jj-violet-soft' : 'border-jj-line bg-white',
                    )}
                  >
                    <UserAvatar src={a.url} alt="" size="md" className="border-0 bg-transparent" />
                    <span className="font-round text-[11px]">{a.label}</span>
                    {selected && (
                      <Check
                        className="absolute right-1.5 top-1.5 h-4 w-4 rounded-full bg-jj-violet p-0.5 text-white"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
