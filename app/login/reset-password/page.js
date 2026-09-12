"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { fieldCls } from "@/lib/formStyles";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();

  const token = searchParams.get("token") ?? "";
  const [submitting, setSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const pwMismatch = confirm !== "" && password !== confirm;
  const canSubmit =
    password.trim() !== "" && confirm.trim() !== "" && !pwMismatch;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await resetPassword({ token, newPassword: password });
      toast("🔑 비밀번호가 변경됐어요. 새 비밀번호로 로그인해주세요.");
      router.replace("/login/id");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "재설정에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (token === "") {
    return (
      <section className="flex min-h-full flex-col justify-center gap-5 px-5 py-8 text-center">
        <span className="text-4xl">🚫</span>
        <h1 className="font-display text-2xl leading-tight">
          유효하지 않은 링크예요
        </h1>
        <p className="text-sm font-semibold text-jj-muted">
          재설정 링크가 올바르지 않아요. 다시 요청해주세요.
        </p>
        <BrutalButton
          tone="ink"
          onClick={() => router.replace("/login/find-pw")}
          className="w-full text-[17px]"
        >
          재설정 다시 요청하기
        </BrutalButton>
      </section>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex min-h-full flex-col justify-center gap-5 px-5 py-8"
    >
      <header className="text-center">
        <span className="text-4xl">🔓</span>
        <h1 className="mt-3 font-display text-2xl leading-tight">
          새 비밀번호 설정
        </h1>
        <p className="mt-2 text-sm font-semibold text-jj-muted">
          앞으로 사용할 비밀번호를 입력해주세요
        </p>
      </header>

      <fieldset className="min-w-0 space-y-4 rounded-2xl border border-jj-line bg-jj-paper p-4 shadow-hard">
        <label className="block">
          <span className="mb-2 block font-display text-sm">새 비밀번호</span>
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
            새 비밀번호 확인
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
        tone="ink"
        type="submit"
        disabled={!canSubmit || submitting}
        className="w-full text-[17px]"
      >
        {submitting ? "변경 중…" : "비밀번호 변경"}
      </BrutalButton>

      <p className="text-center font-round text-[11px] text-jj-muted">
        링크는 30분간만 유효하고 한 번만 사용할 수 있어요
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Layout headerProps={{ subtitle: "비밀번호 재설정" }}>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </Layout>
  );
}
