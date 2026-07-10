'use client'

export default function Header({ subtitle = '새 사건 접수', right = null }) {
  return (
    <header className="flex items-center gap-2.5 border-b-[2.5px] border-jj-ink bg-jj-yellow px-4 py-3">
      <img src="/assets/logo.png" alt="지름신 재판소" className="h-10 w-10 flex-none" />
      <span className="block leading-none">
        <b className="block font-display text-xl leading-none">지름신 재판소</b>
        <span className="text-[11px] font-extrabold text-[#7a6a00]">{subtitle}</span>
      </span>
      {right && <span className="ml-auto flex-none">{right}</span>}
    </header>
  )
}
