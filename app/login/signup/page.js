"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";
import BrutalIconButton from "@/components/common/BrutalIconButton";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { fieldCls } from "@/lib/formStyles";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const pwMismatch = confirm !== "" && password !== confirm;
  const canSubmit =
    email.trim() !== "" &&
    nickname.trim() !== "" &&
    password.trim() !== "" &&
    confirm.trim() !== "" &&
    !pwMismatch;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || isLoading) return;
    try {
      const user = await signup({
        email: email.trim(),
        nickname: nickname.trim(),
        password,
      });
      toast(`✍️ ${user.nickname}님, 재판소에 등록됐어요!`);
      const r = new URLSearchParams(window.location.search).get("redirect");
      router.replace(r || "/");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "회원가입에 실패했어요.");
    }
  };

  const goLogin = () => {
    const r = new URLSearchParams(window.location.search).get("redirect");
    router.push(`/login/id${r ? `?redirect=${encodeURIComponent(r)}` : ""}`);
  };

  const closeBtn = (
    <BrutalIconButton aria-label="닫기" onClick={() => router.back()}>
      <X className="h-4 w-4" strokeWidth={2.5} />
    </BrutalIconButton>
  );

  return (
    <Layout headerProps={{ subtitle: "회원가입", right: closeBtn }}>
      <form onSubmit={onSubmit} className="flex flex-col gap-5 px-5 pb-8 pt-8">
        <header className="text-center">
          <span className="text-4xl">✍️</span>
          <h1 className="mt-3 font-display text-2xl leading-tight">
            재판소 등록
          </h1>
          <p className="mt-2 text-sm font-semibold text-jj-muted">
            계정을 만들고 판례를 영구 보관하세요
          </p>
        </header>

        <fieldset className="min-w-0 space-y-4 rounded-2xl border-[2.5px] border-jj-ink bg-jj-paper p-4 shadow-hard">
          <label className="block">
            <span className="mb-2 block font-display text-sm">이메일</span>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
              className={fieldCls}
            />
            <span className="mt-1.5 block font-round text-[11px] text-jj-muted">
              로그인 아이디로 사용돼요
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block font-display text-sm">닉네임</span>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={16}
              placeholder="재판소에서 쓸 이름"
              autoComplete="nickname"
              className={fieldCls}
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-display text-sm">비밀번호</span>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상"
              autoComplete="new-password"
              className={fieldCls}
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-display text-sm">
              비밀번호 확인
            </span>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="비밀번호 다시 입력"
              autoComplete="new-password"
              className={fieldCls}
            />
            {pwMismatch && (
              <p className="mt-1.5 font-round text-[11px] text-jj-red">
                비밀번호가 일치하지 않아요
              </p>
            )}
          </label>
        </fieldset>

        <BrutalButton
          tone="red"
          type="submit"
          disabled={!canSubmit || isLoading}
          className="w-full text-[17px]"
        >
          {isLoading ? "가입 중…" : "가입하기"}
        </BrutalButton>

        <p className="text-center font-round text-xs text-jj-muted">
          이미 계정이 있나요?{" "}
          <button
            type="button"
            onClick={goLogin}
            className="font-bold text-jj-violet underline underline-offset-2"
          >
            로그인
          </button>
        </p>
      </form>
    </Layout>
  );
}
