"use client";

import EmojiThumb from "@/components/common/EmojiThumb";

export default function ChatBubble({ role, juror, emoji, content }) {
  if (role === "USER") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm border-[2.5px] border-jj-ink bg-jj-yellow px-3.5 py-2 font-round text-[12.5px] leading-relaxed text-jj-ink shadow-hard-sm">
          {content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2">
      <EmojiThumb size="sm" className="bg-jj-app">
        {emoji}
      </EmojiThumb>
      <div className="max-w-[80%]">
        <div className="mb-0.5 font-display text-[11px] text-jj-ink/70">
          {juror}
        </div>
        <div className="rounded-2xl rounded-tl-sm border-[2.5px] border-jj-ink bg-jj-paper px-3.5 py-2 font-round text-[12.5px] leading-relaxed text-jj-ink/90 shadow-hard-sm">
          {content}
        </div>
      </div>
    </div>
  );
}
