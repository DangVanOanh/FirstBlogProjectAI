import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { postsApi } from '../../api/posts.api'
import { tagsApi } from '../../api/tags.api'
import { useAuth } from '../../store/AuthContext'
import { formatDate } from '../../utils/date'
import type { PostSummary, Tag } from '../../types'

export default function AdminPage() {
  const [posts, setPosts] = useState<PostSummary[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [newTag, setNewTag] = useState('')
  const [tab, setTab] = useState<'posts' | 'tags'>('posts')
  const [tagError, setTagError] = useState('')
  const { logout } = useAuth()

  const loadPosts = () => postsApi.getAll(1, 100).then(r => setPosts(r.data))
  const loadTags = () => tagsApi.getAll().then(setTags)

  useEffect(() => { loadPosts(); loadTags() }, [])

  const handleDeletePost = async (id: number) => {
    if (!confirm('Xóa bài viết này?')) return
    await postsApi.delete(id)
    loadPosts()
  }

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    setTagError('')
    try {
      await tagsApi.create(newTag.trim())
      setNewTag('')
      loadTags()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setTagError(msg ?? 'Tạo tag thất bại.')
    }
  }

  const handleDeleteTag = async (id: number) => {
    if (!confirm('Xóa tag này?')) return
    await tagsApi.delete(id)
    loadTags()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Blog</h1>
        <div className="flex gap-3">
          <Link to="/admin/post/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            + Bài viết mới
          </Link>
          <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500">Đăng xuất</button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b">
        {(['posts', 'tags'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
            {t === 'posts' ? `Bài viết (${posts.length})` : `Tags (${tags.length})`}
          </button>
        ))}
      </div>

      {tab === 'posts' && (
        <div className="flex flex-col gap-3">
          {posts.length === 0 && <p className="text-gray-400 text-sm text-center py-8">Chưa có bài viết.</p>}
          {posts.map(post => (
            <div key={post.id} className="bg-white border rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{post.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(post.createdAt)}
                  {post.tags.length > 0 && ` · ${post.tags.map(t => '#' + t).join(' ')}`}
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link to={`/admin/post/${post.id}`} className="text-sm text-blue-600 hover:underline">Sửa</Link>
                <button onClick={() => handleDeletePost(post.id)} className="text-sm text-red-500 hover:underline">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'tags' && (
        <div>
          <form onSubmit={handleCreateTag} className="flex gap-2 mb-2">
            <input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Tên tag mới..."
              className="border rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">Thêm</button>
          </form>
          {tagError && <p className="text-xs text-red-500 mb-3">{tagError}</p>}
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map(tag => (
              <div key={tag.id} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                <span className="text-sm text-gray-700">#{tag.name}</span>
                <button onClick={() => handleDeleteTag(tag.id)} className="text-gray-400 hover:text-red-500 ml-1 text-xs">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
