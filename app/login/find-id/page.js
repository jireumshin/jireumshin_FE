"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Layout from "@/components/common/Layout";
import AuthNav from "@/components/common/AuthNav";
import BrutalButton from "@/components/common/BrutalButton";
import { Input } from "@/components/ui/input";
import { fieldCls } from "@/lib/formStyles";

export default function FindIdPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const canSubmit = email.trim() !== "";

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: 백엔드 연동 (아이디 찾기)
    toast("가입한 이메일로 아이디를 보내드릴게요 🙏 (준비 중)");
  };

  return (
    <Layout headerProps={{ subtitle: "아이디 찾기", right: <AuthNav /> }}>
      <form onSubmit={onSubmit} className="flex min-h-full flex-col justify-center gap-5 px-5 py-8">
        <header className="text-center">
          <span className="text-4xl">🔍</span>
          <h1 className="mt-3 font-display text-2xl leading-tight">
            아이디 찾기
          </h1>
          <p className="mt-2 text-sm font-semibold text-jj-muted">
            가입할 때 등록한 이메일을 입력해주세요
          </p>
        </header>

        <fieldset className="min-w-0 rounded-2xl border-[2.5px] border-jj-ink bg-jj-paper p-4 shadow-hard">
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
        </fieldset>

        <BrutalButton
          tone="ink"
          type="submit"
          disabled={!canSubmit}
          className="w-full text-[17px]"
        >
          아이디 찾기
        </BrutalButton>

        <nav className="flex items-center justify-center gap-2.5 font-round text-xs text-jj-muted">
          <button
            type="button"
            onClick={() => router.push("/login/id")}
            className="underline underline-offset-2 hover:text-jj-ink"
          >
            로그인
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => router.push("/login/find-pw")}
            className="underline underline-offset-2 hover:text-jj-ink"
          >
            비밀번호 재설정
          </button>
        </nav>
      </form>
    </Layout>
  );
}
