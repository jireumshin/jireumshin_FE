import { toast } from "sonner";

import { claimTrial } from "@/stores/trialsSlice";

const claimed = new Set();

export async function claimAllPending(dispatch) {
  if (typeof window === "undefined") return;
  const ids = Object.keys(sessionStorage)
    .filter((k) => k.startsWith("claim:"))
    .map((k) => k.slice("claim:".length));

  for (const id of ids) {
    if (claimed.has(id)) continue;
    claimed.add(id);
    sessionStorage.removeItem(`claim:${id}`);
    try {
      await dispatch(claimTrial(id)).unwrap();
      toast("🔖 이 판례를 내 판례로 저장했어요");
    } catch {
      // 이미 다른 사람 소유 등 — 조용히 무시
    }
  }
}
