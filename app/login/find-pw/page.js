"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";
import { Input } from "@/components/ui/input";
import { fieldCls } from "@/lib/formStyles";

export default function FindPwPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");

  const canSubmit = id.trim() !== "" && email.trim() !== "";

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: 백엔드 연동 (비밀번호 재설정)
    toast("재설정 링크를 이메일로 보내드릴게요 🙏 (준비 중)");
  };

  const closeBtn = (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="닫기"
      className="grid h-9 w-9 place-items-center rounded-lg border-[2.5px] border-jj-ink bg-jj-paper shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
    >
      <X className="h-4 w-4" strokeWidth={2.5} />
    </button>
  );

  return (
    <Layout headerProps={{ subtitle: "비밀번호 재설정", right: closeBtn }}>
      <form onSubmit={onSubmit} className="flex flex-col gap-5 px-5 pb-8 pt-8">
        <header className="text-center">
          <span className="text-4xl">🔑</span>
          <h1 className="mt-3 font-display text-2xl leading-tight">
            비밀번호 재설정
          </h1>
          <p className="mt-2 text-sm font-semibold text-jj-muted">
            아이디와 가입 이메일을 입력하면 재설정 링크를 보내드려요
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
          재설정 링크 받기
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
            onClick={() => router.push("/login/find-id")}
            className="underline underline-offset-2 hover:text-jj-ink"
          >
            아이디 찾기
          </button>
        </nav>
      </form>
    </Layout>
  );
}
