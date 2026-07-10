"use client";

import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";

const swatches = [
  { cls: "bg-jj-red", label: "검사·유죄·사지마" },
  { cls: "bg-jj-green", label: "변호·무죄·사도됨" },
  { cls: "bg-jj-violet", label: "중립·포인트" },
  { cls: "bg-jj-yellow", label: "브랜드·강조" },
  { cls: "bg-jj-ink", label: "잉크(텍스트·보더)" },
  { cls: "bg-jj-app", label: "앱 배경" },
];

export default function Home() {
  return (
    <Layout headerProps={{ subtitle: "디자인 시스템" }}>
      <section className="flex flex-col gap-6 p-5">
        <section>
          <h1 className="font-display text-3xl">지름신 재판소</h1>
          <p className="mt-1 text-sm font-semibold text-jj-muted">
            네오브루탈리즘 팝 법정 · 디자인 시스템 프리뷰
          </p>
          <p className="mt-2 font-round text-sm text-jj-muted">
            Jua 라운드체 · 캡션용
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg">컬러 토큰</h2>
          <ul className="grid grid-cols-2 gap-3">
            {swatches.map((s) => (
              <li
                key={s.cls}
                className="flex items-center gap-3 rounded-2xl border-[2.5px] border-jj-ink bg-jj-paper p-2.5 shadow-hard-sm"
              >
                <span
                  className={`block h-9 w-9 flex-none rounded-lg border-[2.5px] border-jj-ink ${s.cls}`}
                />
                <span className="text-xs font-bold leading-tight">
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg">버튼 · shadcn 래핑</h2>
          <div className="flex flex-col gap-3">
            <BrutalButton tone="red" className="w-full">
              기소하고 재판 시작
            </BrutalButton>
            <BrutalButton tone="ink" className="w-full">
              판결 요청
            </BrutalButton>
            <div className="flex gap-3">
              <BrutalButton tone="yellow" className="flex-1">
                링크 복사
              </BrutalButton>
              <BrutalButton tone="green" className="flex-1">
                무죄
              </BrutalButton>
            </div>
          </div>
        </section>
      </section>
    </Layout>
  );
}
