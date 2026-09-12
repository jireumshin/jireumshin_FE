"use client";

import JurorAvatar from "@/components/common/JurorAvatar";

export default function ChatBubble({ role, juror, emoji, content }) {
  if (role === "USER") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-jj-navy px-3.5 py-2 font-round text-[12.5px] leading-relaxed text-white shadow-hard-sm">
          {content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2">
      <JurorAvatar name={juror} emoji={emoji} size="sm" />
      <div className="max-w-[80%]">
        <div className="mb-0.5 font-display text-[11px] text-jj-ink/70">
          {juror}
        </div>
        <div className="rounded-2xl rounded-tl-sm border border-jj-line bg-jj-paper px-3.5 py-2 font-round text-[12.5px] leading-relaxed text-jj-ink/90 shadow-hard-sm">
          {content}
        </div>
      </div>
    </div>
  );
}
