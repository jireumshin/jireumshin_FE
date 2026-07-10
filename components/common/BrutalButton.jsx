'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const tones = {
  red: 'bg-jj-red text-white hover:bg-jj-red',
  ink: 'bg-jj-ink text-jj-yellow hover:bg-jj-ink',
  yellow: 'bg-jj-yellow text-jj-ink hover:bg-jj-yellow',
  green: 'bg-jj-green text-white hover:bg-jj-green',
}

export default function BrutalButton({ tone = 'red', className, children, ...props }) {
  return (
    <Button
      className={cn(
        'h-auto rounded-2xl border-[2.5px] border-jj-ink py-3.5 font-display text-base shadow-hard',
        'transition-transform hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_var(--jj-ink)]',
        'active:translate-x-1 active:translate-y-1 active:shadow-none',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
