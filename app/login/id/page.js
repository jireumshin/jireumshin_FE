"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Layout from "@/components/common/Layout";
import AuthNav from "@/components/common/AuthNav";
import BrutalButton from "@/components/common/BrutalButton";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { fieldCls } from "@/lib/formStyles";

export default function IdLoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = email.trim() !== "" && password.trim() !== "";

  // 로그인 후 돌아갈 경로 (?redirect=). 익명 판례 저장 흐름 등에서 사용.
  const redirectAfter = () => {
    const r = new URLSearchParams(window.location.search).get("redirect");
    return r || "/";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || isLoading) return;
    try {
      const user = await login({ email: email.trim(), password });
      toast(`⚖️ ${user.nickname}님, 다시 오셨네요!`);
      router.replace(redirectAfter());
    } catch (err) {
      toast.error(typeof err === "string" ? err : "로그인에 실패했어요.");
    }
  };

  const goSignup = () => {
    const r = new URLSearchParams(window.location.search).get("redirect");
    router.push(`/login/signup${r ? `?redirect=${encodeURIComponent(r)}` : ""}`);
  };

  return (
    <Layout headerProps={{ subtitle: "일반 로그인", right: <AuthNav /> }}>
      <form
        onSubmit={onSubmit}
        className="flex min-h-full flex-col justify-center gap-5 px-5 py-8"
      >
        <header className="text-center">
          <span className="text-4xl">🔨</span>
          <h1 className="mt-3 font-display text-2xl leading-tight">
            다시 오셨네요
          </h1>
          <p className="mt-2 text-sm font-semibold text-jj-muted">
            아이디로 로그인하고 내 판례를 이어가세요
          </p>
        </header>

        <fieldset className="min-w-0 space-y-4 rounded-2xl border border-jj-line bg-jj-paper p-4 shadow-hard">
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
          </label>
          <label className="block">
            <span className="mb-2 block font-display text-sm">비밀번호</span>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
              className={fieldCls}
            />
          </label>
        </fieldset>

        <BrutalButton
          tone="ink"
          type="submit"
          disabled={!canSubmit || isLoading}
          className="w-full text-[17px]"
        >
          {isLoading ? "로그인 중…" : "로그인"}
        </BrutalButton>

        <nav className="flex items-center justify-center gap-2.5 font-round text-xs text-jj-muted">
          <button
            type="button"
            onClick={() => router.push("/login/find-pw")}
            className="underline underline-offset-2 hover:text-jj-ink"
          >
            비밀번호 재설정
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={goSignup}
            className="font-bold text-jj-violet underline underline-offset-2"
          >
            회원가입
          </button>
        </nav>
      </form>
    </Layout>
  );
}
