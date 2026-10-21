"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Pencil, Check, LogOut, Gavel, ChevronRight } from "lucide-react";
import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";
import BrutalCard from "@/components/common/BrutalCard";
import BrutalIconButton from "@/components/common/BrutalIconButton";
import UserAvatar from "@/components/common/UserAvatar";
import AvatarPickerDialog from "@/components/dialog/profile/AvatarPickerDialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  const { user, initialized, updateNickname, updateAvatar, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);

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

  const onSelectAvatar = async (key) => {
    if (key === user.avatar) {
      setPickerOpen(false);
      return;
    }
    setAvatarSaving(true);
    try {
      await updateAvatar(key);
      toast("🎭 프로필 캐릭터를 바꿨어요");
      setPickerOpen(false);
    } catch (err) {
      toast.error(typeof err === "string" ? err : "캐릭터 변경에 실패했어요.");
    } finally {
      setAvatarSaving(false);
    }
  };

  const onLogout = async () => {
    await logout();
    toast("로그아웃 됐어요");
    router.replace("/");
  };

  return (
    <Layout headerProps={{ subtitle: "마이페이지" }} activeTab="mypage" allowScroll>
      <section className="flex flex-col gap-5 px-5 pb-8 pt-7">
        <header className="text-center">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            aria-label="프로필 캐릭터 변경"
            className="relative mx-auto block transition-transform active:scale-95"
          >
            <UserAvatar src={user.avatarUrl} size="xl" className="shadow-hard" />
            <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border border-jj-line bg-white shadow-hard-sm">
              <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
          </button>
          <h1 className="mt-3.5 font-display text-2xl leading-tight">
            {user.nickname}
          </h1>
          <Badge
            className={`mt-2 border border-jj-line px-3 py-0.5 font-round text-[11px] shadow-hard-sm ${
              isKakao ? "bg-[#FEE500] text-[#3c1e1e]" : "bg-jj-violet text-white"
            }`}
          >
            {isKakao ? "카카오 로그인" : "이메일 로그인"}
          </Badge>
        </header>

        <BrutalCard className="flex flex-col gap-4 p-4">
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
                <BrutalIconButton
                  tone="green"
                  size="md"
                  onClick={onSave}
                  disabled={!canSave}
                  aria-label="저장"
                  className="flex-none"
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </BrutalIconButton>
                <BrutalIconButton
                  tone="app"
                  size="md"
                  onClick={() => setEditing(false)}
                  aria-label="취소"
                  className="flex-none"
                >
                  <X className="h-4 w-4" strokeWidth={3} />
                </BrutalIconButton>
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
              <BrutalIconButton
                tone="app"
                onClick={startEdit}
                aria-label="닉네임 변경"
                className="flex-none"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
              </BrutalIconButton>
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
        </BrutalCard>

        <button
          type="button"
          onClick={() => router.push("/records")}
          className="flex items-center gap-3 rounded-2xl border border-jj-line bg-jj-violet p-4 text-left text-white shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <span className="grid h-10 w-10 flex-none place-items-center rounded-xl border border-jj-line bg-white text-jj-ink">
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

      <AvatarPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        current={user.avatar}
        onSelect={onSelectAvatar}
        saving={avatarSaving}
      />
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
