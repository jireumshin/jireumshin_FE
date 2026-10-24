'use client'

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { Send, Trash2 } from 'lucide-react'

import BrutalButton from '@/components/common/BrutalButton'
import BrutalCard from '@/components/common/BrutalCard'
import UserAvatar from '@/components/common/UserAvatar'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import { createComment, deleteComment, fetchComments } from '@/stores/trialsSlice'
import { relativeDay } from '@/lib/trial'

// 공개 판례 댓글 — 읽기는 누구나, 작성은 로그인, 삭제는 작성자·판례 주인
export default function CommentSection({ trialId }) {
  const dispatch = useDispatch()
  const { user, requireAuth } = useAuth()
  const [comments, setComments] = useState(null)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let alive = true
    dispatch(fetchComments(trialId))
      .unwrap()
      .then((list) => alive && setComments(list))
      .catch(() => alive && setComments([]))
    return () => {
      alive = false
    }
  }, [trialId, dispatch])

  const onSubmit = async (e) => {
    e.preventDefault()
    const content = text.trim()
    if (!content || sending) return
    setSending(true)
    try {
      const c = await dispatch(createComment({ id: trialId, content })).unwrap()
      setComments((prev) => [...(prev ?? []), c])
      setText('')
    } catch (err) {
      toast.error(typeof err === 'string' ? err : '댓글 등록에 실패했어요')
    } finally {
      setSending(false)
    }
  }

  const onDelete = async (commentId) => {
    try {
      await dispatch(deleteComment({ id: trialId, commentId })).unwrap()
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      toast.error(typeof err === 'string' ? err : '삭제에 실패했어요')
    }
  }

  return (
    <section aria-labelledby="comments" className="flex w-full flex-col gap-2.5">
      <h2 id="comments" className="font-display text-[15px] text-jj-ink">
        방청석 의견{comments?.length ? ` · ${comments.length}` : ''}
      </h2>

      <BrutalCard shadow="sm" className="flex flex-col gap-3 p-3.5">
        {comments === null ? (
          <p className="py-3 text-center font-round text-[12px] text-jj-muted">불러오는 중…</p>
        ) : comments.length === 0 ? (
          <p className="py-3 text-center font-round text-[12px] text-jj-muted">
            아직 의견이 없어요. 첫 의견을 남겨보세요
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {comments.map((c) => (
              <li key={c.id} className="flex items-start gap-2.5">
                <UserAvatar src={c.authorAvatarUrl} alt="" size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-baseline gap-1.5">
                    <span className="truncate font-display text-[12px] text-jj-ink">
                      {c.authorNickname}
                    </span>
                    <time dateTime={c.createdAt} className="flex-none font-round text-[10.5px] text-jj-muted">
                      {relativeDay(c.createdAt)}
                    </time>
                  </p>
                  <p className="mt-0.5 whitespace-pre-wrap break-words font-round text-[12.5px] leading-relaxed text-jj-ink/90">
                    {c.content}
                  </p>
                </div>
                {c.canDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(c.id)}
                    aria-label="댓글 삭제"
                    className="grid h-7 w-7 flex-none place-items-center rounded-full text-jj-muted transition-transform hover:text-jj-red active:scale-90"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {user ? (
          <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-jj-line pt-3">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={1}
              maxLength={300}
              disabled={sending}
              aria-label="댓글"
              placeholder="이 판결, 어떻게 생각해요?"
              className="max-h-24 min-h-10 flex-1 resize-none rounded-xl border border-jj-line bg-jj-paper font-round text-[12.5px] shadow-none focus-visible:ring-0"
            />
            <BrutalButton
              type="submit"
              tone="ink"
              disabled={sending || !text.trim()}
              aria-label="댓글 등록"
              className="flex-none px-3.5 py-2.5 disabled:opacity-50"
            >
              <Send className="h-4 w-4" strokeWidth={2.5} />
            </BrutalButton>
          </form>
        ) : (
          <BrutalButton
            tone="paper"
            onClick={() => requireAuth(`/login?redirect=${encodeURIComponent(`/verdict/?id=${trialId}`)}`)}
            className="w-full border border-jj-line py-2.5 text-[13px] shadow-none"
          >
            로그인하고 의견 남기기
          </BrutalButton>
        )}
      </BrutalCard>
    </section>
  )
}
