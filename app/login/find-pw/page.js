"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";
import BrutalCard from "@/components/common/BrutalCard";
import BrutalIconButton from "@/components/common/BrutalIconButton";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { fieldCls } from "@/lib/formStyles";

export default function FindPwPage() {
  const router = useRouter();
  const { requestPasswordReset } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() === "" || submitting) return;
    setSubmitting(true);
    try {
      await requestPasswordReset(email.trim());
      setSentTo(email.trim());
    } catch (err) {
      toast.error(typeof err === "string" ? err : "요청에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeBtn = (
    <BrutalIconButton aria-label="닫기" onClick={() => router.back()}>
      <X className="h-4 w-4" strokeWidth={2.5} />
    </BrutalIconButton>
  );

  return (
    <Layout headerProps={{ subtitle: "비밀번호 재설정", right: closeBtn }}>
      {sentTo === "" ? (
        <form
          onSubmit={onSubmit}
          className="flex min-h-full flex-col justify-center gap-5 px-5 py-8"
        >
          <header className="text-center">
            <span className="text-4xl">🔑</span>
            <h1 className="mt-3 font-display text-2xl leading-tight">
              비밀번호 재설정
            </h1>
            <p className="mt-2 text-sm font-semibold text-jj-muted">
              가입한 이메일로 재설정 링크를 보내드려요
            </p>
          </header>

          <fieldset className="min-w-0 rounded-2xl border border-jj-line bg-jj-paper p-4 shadow-hard">
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
            disabled={email.trim() === "" || submitting}
            className="w-full text-[17px]"
          >
            {submitting ? "보내는 중…" : "재설정 링크 받기"}
          </BrutalButton>

          <nav className="text-center font-round text-xs text-jj-muted">
            <button
              type="button"
              onClick={() => router.push("/login/id")}
              className="underline underline-offset-2 hover:text-jj-ink"
            >
              로그인으로 돌아가기
            </button>
          </nav>
        </form>
      ) : (
        <section className="flex min-h-full flex-col justify-center gap-5 px-5 py-8">
          <header className="text-center">
            <span className="text-4xl">📮</span>
            <h1 className="mt-3 font-display text-2xl leading-tight">
              메일을 보냈어요
            </h1>
            <p className="mt-2 text-sm font-semibold text-jj-muted">
              <strong className="text-jj-ink">{sentTo}</strong> 으로
              <br />
              재설정 링크를 보냈어요. 메일함을 확인해주세요.
            </p>
          </header>

          <BrutalCard className="p-4 font-round text-xs leading-relaxed text-jj-muted">
            · 링크는 <strong className="text-jj-ink">30분간만</strong> 유효하고
            한 번만 사용할 수 있어요
            <br />· 메일이 안 보이면 스팸함도 확인해주세요
            <br />· 가입되지 않은 이메일에는 메일이 가지 않아요
          </BrutalCard>

          <BrutalButton
            tone="ink"
            onClick={() => router.replace("/login/id")}
            className="w-full text-[17px]"
          >
            로그인으로 돌아가기
          </BrutalButton>

          <nav className="text-center font-round text-xs text-jj-muted">
            <button
              type="button"
              onClick={() => setSentTo("")}
              className="underline underline-offset-2 hover:text-jj-ink"
            >
              다른 이메일로 다시 보내기
            </button>
          </nav>
        </section>
      )}
    </Layout>
  );
}
