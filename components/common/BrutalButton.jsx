'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const tones = {
  red: 'bg-jj-red text-white hover:bg-jj-red',
  ink: 'bg-jj-navy text-white hover:bg-jj-navy',
  yellow: 'bg-jj-yellow text-jj-ink hover:bg-jj-yellow',
  green: 'bg-jj-green text-white hover:bg-jj-green',
  paper: 'bg-jj-paper text-jj-ink hover:bg-jj-paper',
}

export default function BrutalButton({ tone = 'red', className, children, ...props }) {
  return (
    <Button
      className={cn(
        'h-auto rounded-2xl py-3.5 font-display text-base shadow-hard',
        'transition-transform hover:-translate-y-px hover:scale-[1.02] active:scale-[.98]',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
