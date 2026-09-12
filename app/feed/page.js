"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Users } from "lucide-react";
import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";
import BrutalCard from "@/components/common/BrutalCard";
import FeedCard from "@/components/widgets/feed/FeedCard";
import { fetchFeed, toggleLike } from "@/stores/trialsSlice";
import { selectors } from "@/stores";
import { useAuth } from "@/contexts/AuthContext";

export default function FeedPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { requireAuth } = useAuth();
  const feed = useSelector(selectors.getFeed);
  const cursor = useSelector(selectors.getFeedCursor);
  const loading = useSelector(selectors.getFeedLoading);
  const loaded = useSelector(selectors.getFeedLoaded);
  const [likeBusyId, setLikeBusyId] = useState(null);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const onLike = async (id) => {
    if (!requireAuth()) return; // 비로그인 → 로그인 유도
    setLikeBusyId(id);
    try {
      await dispatch(toggleLike(id)).unwrap();
    } catch (e) {
      toast.error(typeof e === "string" ? e : "공감에 실패했어요");
    } finally {
      setLikeBusyId(null);
    }
  };

  const isEmpty = loaded && feed.length === 0;

  return (
    <Layout headerProps={{ subtitle: "판례 구경" }} allowScroll activeTab="feed">
      <section className="flex flex-col gap-3 px-5 pb-10 pt-6">
        <header className="mb-1">
          <h1 className="font-display text-2xl leading-tight">
            남들은 뭘 질렀나 👀
          </h1>
          <p className="mt-0.5 font-round text-xs text-jj-muted">
            공개된 지름 판례를 구경하고 공감해보세요
          </p>
        </header>

        {isEmpty ? (
          <EmptyState onStart={() => router.push("/")} />
        ) : (
          <>
            <div className="flex flex-col gap-2.5">
              {feed.map((t) => (
                <FeedCard
                  key={t.id}
                  trial={t}
                  likeBusy={likeBusyId === t.id}
                  onOpen={() => router.push(`/verdict/?id=${t.id}`)}
                  onLike={() => onLike(t.id)}
                />
              ))}
            </div>

            {cursor && (
              <BrutalButton
                tone="paper"
                onClick={() => dispatch(fetchFeed(cursor))}
                disabled={loading}
                className="mt-1"
              >
                {loading ? "불러오는 중…" : "더 보기"}
              </BrutalButton>
            )}

            {loading && feed.length === 0 && (
              <p className="py-10 text-center font-round text-sm text-jj-muted">
                불러오는 중…
              </p>
            )}
          </>
        )}
      </section>
    </Layout>
  );
}

function EmptyState({ onStart }) {
  return (
    <BrutalCard className="mt-6 flex flex-col items-center gap-4 px-6 py-10 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl border border-jj-line bg-jj-violet-soft text-3xl shadow-hard-sm">
        <Users className="h-8 w-8" strokeWidth={2} />
      </span>
      <div>
        <p className="font-display text-lg">아직 공개된 판례가 없어요</p>
        <p className="mt-1 font-round text-xs text-jj-muted">
          첫 판례를 공개해 피드를 열어보세요
        </p>
      </div>
      <BrutalButton tone="ink" onClick={onStart} className="w-full">
        지름신 기소하기
      </BrutalButton>
    </BrutalCard>
  );
}
