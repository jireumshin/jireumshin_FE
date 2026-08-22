"use client";

import EmojiThumb from "@/components/common/EmojiThumb";
import { guessEmoji } from "@/lib/trial";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "h-9 w-9 rounded-lg",
  md: "h-11 w-11 rounded-xl",
  lg: "h-12 w-12 rounded-xl",
};

// 상품 썸네일
export default function ProductThumb({
  imageUrl,
  name = "",
  size = "md",
  className,
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name || "상품 사진"}
        crossOrigin="anonymous"
        className={cn(
          "flex-none border border-jj-line object-cover",
          sizes[size],
          className,
        )}
      />
    );
  }
  return (
    <EmojiThumb size={size} className={className}>
      {guessEmoji(name)}
    </EmojiThumb>
  );
}
