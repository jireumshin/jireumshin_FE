"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Layout from "@/components/common/Layout";
import AuthNav from "@/components/common/AuthNav";
import BrutalButton from "@/components/common/BrutalButton";
import { Input } from "@/components/ui/input";
import { fieldCls } from "@/lib/formStyles";

export default function IdLoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = id.trim() !== "" && password.trim() !== "";

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: 백엔드 연동 (일반 로그인 인증)
    toast("로그인 기능은 곧 열려요 🙏 (준비 중)");
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

        <fieldset className="min-w-0 space-y-4 rounded-2xl border-[2.5px] border-jj-ink bg-jj-paper p-4 shadow-hard">
          <label className="block">
            <span className="mb-2 block font-display text-sm">아이디</span>
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디"
              autoComplete="username"
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
          disabled={!canSubmit}
          className="w-full text-[17px]"
        >
          로그인
        </BrutalButton>

        <nav className="flex items-center justify-center gap-2.5 font-round text-xs text-jj-muted">
          <button
            type="button"
            onClick={() => router.push("/login/find-id")}
            className="underline underline-offset-2 hover:text-jj-ink"
          >
            아이디 찾기
          </button>
          <span>·</span>
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
            onClick={() => router.push("/login/signup")}
            className="font-bold text-jj-violet underline underline-offset-2"
          >
            회원가입
          </button>
        </nav>
      </form>
    </Layout>
  );
}
