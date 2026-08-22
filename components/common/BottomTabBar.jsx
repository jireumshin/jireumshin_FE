"use client";

import { useRouter } from "next/navigation";
import { Home, Users, ClipboardList, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const LEFT = [
  { key: "home", label: "홈", icon: Home, href: "/" },
  { key: "feed", label: "피드", icon: Users, href: "/feed" },
];
const RIGHT = [
  { key: "records", label: "내 판례", icon: ClipboardList, href: "/records" },
  { key: "mypage", label: "마이", icon: User, href: "/mypage" },
];

function Tab({ tab, active, onClick }) {
  const on = active === tab.key;
  const Icon = tab.icon;
  return (
    <button
      type="button"
      aria-current={on ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-1 py-1.5 font-round text-[10.5px] transition-transform hover:scale-110",
        on ? "text-jj-ink" : "text-jj-muted",
      )}
    >
      <Icon className="h-5.5 w-5.5" strokeWidth={on ? 2.5 : 2} />
      {tab.label}
    </button>
  );
}

export default function BottomTabBar({ active }) {
  const router = useRouter();
  return (
    <nav className="flex items-start border-t border-[#E7E2F5] bg-jj-paper px-1.5 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2">
      {LEFT.map((tab) => (
        <Tab
          key={tab.key}
          tab={tab}
          active={active}
          onClick={() => router.push(tab.href)}
        />
      ))}

      {/* 정중앙 새 재판 FAB */}
      <button
        type="button"
        aria-label="새 재판"
        onClick={() => router.push("/new")}
        className="group flex flex-1 flex-col items-center gap-1 py-1.5 font-round text-[10.5px] text-jj-muted"
      >
        <span
          className="-mt-6 grid h-11.5 w-11.5 place-items-center rounded-2xl bg-jj-red text-white transition-transform group-hover:scale-110"
          style={{ boxShadow: "0 6px 16px rgba(255,91,91,.4)" }}
        >
          <Plus className="h-6 w-6" strokeWidth={2.75} />
        </span>
        새 재판
      </button>

      {RIGHT.map((tab) => (
        <Tab
          key={tab.key}
          tab={tab}
          active={active}
          onClick={() => router.push(tab.href)}
        />
      ))}
    </nav>
  );
}
