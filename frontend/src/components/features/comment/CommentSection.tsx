import { useEffect, useState } from 'react'
import { commentsApi } from '../../../api/comments.api'
import { formatDate } from '../../../utils/date'
import type { Comment } from '../../../types'

export default function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    commentsApi.getByPost(postId).then(setComments)
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const newComment = await commentsApi.create(postId, authorName.trim(), content.trim())
      setComments(prev => [newComment, ...prev])
      setContent('')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Gửi bình luận thất bại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Bình luận ({comments.length})</h2>

      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-3">
        <input value={authorName} onChange={e => setAuthorName(e.target.value)}
          placeholder="Tên của bạn" required
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <textarea value={content} onChange={e => setContent(e.target.value)}
          placeholder="Nội dung bình luận..." rows={3} required
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button type="submit" disabled={submitting}
          className="self-end bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
          {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
        </button>
      </form>

      <div className="flex flex-col gap-4">
        {comments.map(c => (
          <div key={c.id} className="border-b pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-gray-800">{c.authorName}</span>
              <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-600">{c.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">Chưa có bình luận nào.</p>
        )}
      </div>
    </section>
  )
}
