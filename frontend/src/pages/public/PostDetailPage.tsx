import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CommentSection from '../../components/features/comment/CommentSection'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { postsApi } from '../../api/posts.api'
import { formatDate } from '../../utils/date'
import type { PostDetail } from '../../types'

export default function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<PostDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    postsApi.getBySlug(slug)
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <LoadingSpinner />
  if (notFound || !post) return (
    <div className="text-center py-20">
      <p className="text-gray-500 mb-4">Bài viết không tồn tại.</p>
      <Link to="/" className="text-blue-600 hover:underline">Về trang chủ</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">← Về trang chủ</Link>

      {post.thumbnail && (
        <img src={post.thumbnail} alt={post.title} className="w-full h-56 object-cover rounded-xl mb-6" />
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-3">{post.title}</h1>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-sm text-gray-400">{formatDate(post.createdAt)}</span>
        {post.tags.map(tag => (
          <Link key={tag} to={`/?tag=${tag}`}
            className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full hover:bg-blue-100">
            #{tag}
          </Link>
        ))}
      </div>

      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-10">{post.content}</div>

      <CommentSection postId={post.id} />
    </div>
  )
}
