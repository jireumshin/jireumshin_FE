"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Pencil, Check, LogOut, Gavel, ChevronRight } from "lucide-react";
import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { fieldCls } from "@/lib/formStyles";

const NICKNAME_RE = /^[a-zA-Z0-9가-힣_]{2,16}$/;

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

export default function MyPage() {
  const router = useRouter();
  const { user, initialized, updateNickname, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);

  // 세션 복원이 끝난 뒤 비로그인이면 로그인 화면으로
  useEffect(() => {
    if (initialized && !user) router.replace("/login");
  }, [initialized, user, router]);

  if (!initialized || !user) {
    return <Layout isLoading headerProps={{ subtitle: "마이페이지" }} />;
  }

  const isKakao = user.provider === "KAKAO";
  const trimmed = nickname.trim();
  const valid = NICKNAME_RE.test(trimmed);
  const changed = trimmed !== user.nickname;
  const canSave = valid && changed && !saving;

  const startEdit = () => {
    setNickname(user.nickname);
    setEditing(true);
  };

  const onSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const updated = await updateNickname(trimmed);
      toast(`✏️ 닉네임을 '${updated.nickname}'(으)로 바꿨어요`);
      setEditing(false);
    } catch (err) {
      toast.error(typeof err === "string" ? err : "닉네임 변경에 실패했어요.");
    } finally {
      setSaving(false);
    }
  };

  const onLogout = async () => {
    await logout();
    toast("로그아웃 됐어요");
    router.replace("/");
  };

  const closeBtn = (
    <button
      type="button"
      onClick={() => router.push("/")}
      aria-label="닫기"
      className="grid h-9 w-9 place-items-center rounded-lg border-[2.5px] border-jj-ink bg-jj-paper shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
    >
      <X className="h-4 w-4" strokeWidth={2.5} />
    </button>
  );

  return (
    <Layout headerProps={{ subtitle: "마이페이지", right: closeBtn }}>
      <section className="flex flex-col gap-5 px-5 pb-8 pt-7">
        <header className="text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-2xl border-[2.5px] border-jj-ink bg-jj-violet-soft text-4xl shadow-hard">
            👤
          </span>
          <h1 className="mt-3.5 font-display text-2xl leading-tight">
            {user.nickname}
          </h1>
          <span
            className={`mt-2 inline-block rounded-full border-2 border-jj-ink px-3 py-0.5 font-round text-[11px] shadow-hard-sm ${
              isKakao
                ? "bg-[#FEE500] text-[#3c1e1e]"
                : "bg-jj-violet text-white"
            }`}
          >
            {isKakao ? "카카오 로그인" : "이메일 로그인"}
          </span>
        </header>

        <div className="flex flex-col gap-4 rounded-2xl border-[2.5px] border-jj-ink bg-jj-paper p-4 shadow-hard">
          {/* 닉네임 (편집 가능) */}
          {editing ? (
            <div>
              <span className="mb-2 block font-round text-[11px] text-jj-muted">
                닉네임
              </span>
              <div className="flex items-center gap-2">
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={16}
                  autoFocus
                  placeholder="새 닉네임"
                  className={`${fieldCls} flex-1`}
                />
                <button
                  type="button"
                  onClick={onSave}
                  disabled={!canSave}
                  aria-label="저장"
                  className="grid h-11 w-11 flex-none place-items-center rounded-xl border-[2.5px] border-jj-ink bg-jj-green text-white shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-40"
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  aria-label="취소"
                  className="grid h-11 w-11 flex-none place-items-center rounded-xl border-[2.5px] border-jj-ink bg-jj-app shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <X className="h-4 w-4" strokeWidth={3} />
                </button>
              </div>
              {trimmed && !valid && (
                <p className="mt-1.5 font-round text-[11px] text-jj-red">
                  한글·영문·숫자·_ 2~16자로 지어주세요
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="block font-round text-[11px] text-jj-muted">
                  닉네임
                </span>
                <span className="block truncate font-display text-base">
                  {user.nickname}
                </span>
              </div>
              <button
                type="button"
                onClick={startEdit}
                aria-label="닉네임 변경"
                className="grid h-9 w-9 flex-none place-items-center rounded-lg border-2 border-jj-ink bg-jj-app shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            </div>
          )}

          <div className="h-px bg-jj-ink/15" />

          <InfoRow label="로그인 방식" value={isKakao ? "카카오" : "이메일"} />
          <InfoRow
            label="이메일"
            value={user.email || "미연동"}
            muted={!user.email}
          />
          <InfoRow label="가입일" value={formatDate(user.createdAt)} />
        </div>

        <button
          type="button"
          onClick={() => router.push("/records")}
          className="flex items-center gap-3 rounded-2xl border-[2.5px] border-jj-ink bg-jj-violet p-4 text-left text-white shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <span className="grid h-10 w-10 flex-none place-items-center rounded-xl border-2 border-jj-ink bg-white text-jj-ink">
            <Gavel className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="flex-1">
            <span className="block font-display text-base leading-tight">
              나의 판례
            </span>
            <span className="block font-round text-[11px] text-white/85">
              지금까지의 재판 기록 보기
            </span>
          </span>
          <ChevronRight className="h-5 w-5 flex-none" strokeWidth={2.5} />
        </button>

        <BrutalButton tone="ink" onClick={onLogout} className="w-full">
          <span className="inline-flex items-center gap-2">
            <LogOut className="h-4 w-4" strokeWidth={2.5} />
            로그아웃
          </span>
        </BrutalButton>
      </section>
    </Layout>
  );
}

function InfoRow({ label, value, muted = false }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="font-round text-[11px] text-jj-muted">{label}</span>
      <span
        className={`min-w-0 truncate font-display text-sm ${
          muted ? "text-jj-muted" : "text-jj-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
