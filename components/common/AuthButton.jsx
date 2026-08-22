"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

const btnCls =
  "rounded-lg border border-jj-line bg-jj-paper px-3 py-2 font-display text-xs shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";

export default function AuthButton() {
  const router = useRouter();
  const { isAuthenticated, initialized, user, logout } = useAuth();

  if (!initialized) return null;

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => router.push("/login")}
        className={btnCls}
      >
        로그인
      </button>
    );
  }

  const onLogout = async () => {
    await logout();
    toast("로그아웃 됐어요");
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => router.push("/mypage")}
        aria-label="마이페이지"
        className="max-w-24 truncate rounded-lg border border-jj-line bg-jj-violet px-2.5 py-2 font-display text-xs text-white shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
      >
        👤 {user.nickname}
      </button>
      <button
        type="button"
        onClick={onLogout}
        aria-label="로그아웃"
        className={`${btnCls} grid place-items-center`}
      >
        <LogOut className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
