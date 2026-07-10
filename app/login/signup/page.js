"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";
import { Input } from "@/components/ui/input";
import { fieldCls } from "@/lib/formStyles";

export default function SignupPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");

  const pwMismatch = confirm !== "" && password !== confirm;
  const canSubmit =
    id.trim() !== "" &&
    password.trim() !== "" &&
    confirm.trim() !== "" &&
    email.trim() !== "" &&
    !pwMismatch;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: 백엔드 연동 (회원가입)
    toast("회원가입은 곧 열려요 🙏 (준비 중)");
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
            <span className="mb-2 block font-display text-sm">아이디</span>
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="사용할 아이디"
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
              아이디찾기·비밀번호 재설정에 사용돼요
            </span>
          </label>
        </fieldset>

        <BrutalButton
          tone="red"
          type="submit"
          disabled={!canSubmit}
          className="w-full text-[17px]"
        >
          가입하기
        </BrutalButton>

        <p className="text-center font-round text-xs text-jj-muted">
          이미 계정이 있나요?{" "}
          <button
            type="button"
            onClick={() => router.push("/login/id")}
            className="font-bold text-jj-violet underline underline-offset-2"
          >
            로그인
          </button>
        </p>
      </form>
    </Layout>
  );
}
