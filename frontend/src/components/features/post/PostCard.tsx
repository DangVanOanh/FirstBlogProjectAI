import { Link } from 'react-router-dom'
import { formatDate } from '../../../utils/date'
import type { PostSummary } from '../../../types'

export default function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow p-5 flex gap-4">
      {post.thumbnail && (
        <img src={post.thumbnail} alt={post.title}
          className="w-28 h-20 object-cover rounded-lg shrink-0" />
      )}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <Link to={`/post/${post.slug}`}
          className="font-semibold text-gray-800 hover:text-blue-600 line-clamp-2">
          {post.title}
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          {post.tags.map(tag => (
            <Link key={tag} to={`/?tag=${tag}`}
              className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full hover:bg-blue-100">
              #{tag}
            </Link>
          ))}
        </div>
        <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
      </div>
    </article>
  )
}
