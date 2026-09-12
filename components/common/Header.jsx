"use client";

import Link from "next/link";

export default function Header({ subtitle = "새 사건 접수", right = null }) {
  return (
    <header className="flex items-center gap-2.5 border-b border-jj-line bg-jj-paper px-4 py-3">
      <Link
        href="/"
        aria-label="홈으로"
        className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
      >
        <img
          src="/assets/logo.png"
          alt="지름신 재판소"
          className="h-10 w-10 flex-none"
        />
        <span className="block leading-none">
          <span className="block font-display text-xl leading-none text-jj-ink">지름신 재판소</span>
          <span className="text-[11px] font-extrabold text-jj-muted">
            {subtitle}
          </span>
        </span>
      </Link>
      {right && <span className="ml-auto flex-none">{right}</span>}
    </header>
  );
}
