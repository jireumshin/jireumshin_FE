"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatWon } from "@/lib/trial";
import ProductThumb from "@/components/common/ProductThumb";
import BrutalCard from "@/components/common/BrutalCard";
import VerdictChip from "@/components/widgets/trials/VerdictChip";

export default function FeedCard({ trial, onOpen, onLike, likeBusy }) {
  const versus = trial.mode === "VERSUS";
  const versusLabel = versus
    ? trial.versusResult === "A"
      ? "🅰 승"
      : trial.versusResult === "B"
        ? "🅱 승"
        : "둘 다 별로"
    : undefined;
  const liked = trial.likedByMe;

  return (
    <BrutalCard className="flex flex-col gap-2.5 rounded-2xl p-3.5 transition-transform hover:scale-[1.01]">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full flex-col gap-2.5 text-left"
      >
        <div className="flex items-center gap-2.5">
          <ProductThumb
            imageUrl={versus ? undefined : trial.imageUrl}
            name={trial.itemName}
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-sm leading-tight">
              {versus
                ? `${trial.itemName} vs ${trial.itemNameB}`
                : trial.itemName}
            </span>
            <span className="mt-0.5 block font-round text-[10.5px] text-jj-muted">
              {versus
                ? `${formatWon(trial.price)} · ${formatWon(trial.priceB)}`
                : formatWon(trial.price)}
            </span>
          </span>
          <VerdictChip
            verdict={trial.verdict}
            jury={trial.jury || []}
            label={versusLabel}
          />
        </div>

        {trial.summary && (
          <p className="line-clamp-2 font-round text-[12px] leading-snug text-jj-ink">
            {trial.summary}
          </p>
        )}
      </button>

      <div className="flex items-center justify-end border-t-2 border-dashed border-jj-ink/15 pt-2">
        <button
          type="button"
          onClick={onLike}
          disabled={likeBusy}
          aria-pressed={liked}
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-jj-line px-3 py-1 font-round text-[12px] shadow-hard-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-50",
            liked ? "bg-jj-red text-white" : "bg-jj-paper",
          )}
        >
          <Heart
            className="h-3.5 w-3.5"
            strokeWidth={2.5}
            fill={liked ? "currentColor" : "none"}
          />
          {trial.likeCount > 0 ? trial.likeCount : "공감"}
        </button>
      </div>
    </BrutalCard>
  );
}
