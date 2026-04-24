import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PostCard from '../../components/features/post/PostCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { postsApi } from '../../api/posts.api'
import type { PostSummary } from '../../types'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const [results, setResults] = useState<PostSummary[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    postsApi.search(q).then(setResults).finally(() => setLoading(false))
  }, [q])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-800 mb-6">
        Kết quả: <span className="text-blue-600">"{q}"</span>
      </h1>
      {loading ? <LoadingSpinner text="Đang tìm kiếm..." /> : results.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Không tìm thấy bài viết nào.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {results.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
}
