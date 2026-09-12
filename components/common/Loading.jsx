'use client'

import { useState, useEffect } from 'react'

export default function Loading({ message = '로딩 중', messages }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (!messages) return
    const t = setInterval(() => setI((v) => (v + 1) % messages.length), 1600)
    return () => clearInterval(t)
  }, [messages])

  const text = messages ? messages[i] : message

  return (
    <output
      aria-live="polite"
      className="flex h-full w-full flex-col items-center justify-center gap-9 bg-jj-app px-6"
    >
      <figure className="jj-shake m-0 h-40 w-40">
        <img
          src="/assets/judge.png"
          alt=""
          className="h-full w-full object-contain"
        />
      </figure>
      <p className="min-h-7 text-center font-display text-lg text-jj-ink">
        {text}
        <span className="jj-dots" />
      </p>
    </output>
  )
}
