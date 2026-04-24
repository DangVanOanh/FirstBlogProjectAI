import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { postsApi } from '../../api/posts.api'
import { tagsApi } from '../../api/tags.api'
import type { Tag } from '../../types'

export default function PostFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id && id !== 'new'
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [postId, setPostId] = useState<number | null>(null)

  useEffect(() => {
    tagsApi.getAll().then(setTags)
    if (isEdit) {
      postsApi.getAll(1, 100).then(res => {
        const post = res.data.find(p => p.id === Number(id))
        if (post) { setTitle(post.title); setThumbnail(post.thumbnail ?? ''); setPostId(post.id) }
      })
    }
  }, [id, isEdit])

  const toggleTag = (tagId: number) =>
    setSelectedTagIds(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = { title: title.trim(), content: content.trim(), thumbnail: thumbnail.trim(), tagIds: selectedTagIds }
      if (isEdit && postId) {
        await postsApi.update(postId, payload)
      } else {
        await postsApi.create(payload)
      }
      navigate('/admin')
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; errors?: string[] } } })?.response?.data
      setError(data?.errors?.join(', ') ?? data?.message ?? 'Lưu bài viết thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Sửa bài viết' : 'Viết bài mới'}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh bìa (tùy chọn)</label>
          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center gap-2 cursor-pointer w-fit bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-blue-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {thumbnail ? 'Đổi ảnh' : 'Chọn ảnh từ máy tính'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = ev => setThumbnail(ev.target?.result as string)
                  reader.readAsDataURL(file)
                }}
              />
            </label>
            {thumbnail && (
              <div className="relative w-fit">
                <img src={thumbnail} alt="preview" className="h-36 rounded-lg object-cover border" />
                <button
                  type="button"
                  onClick={() => setThumbnail('')}
                  className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={14} required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none font-mono text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedTagIds.includes(tag.id) ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-600 border-gray-300 hover:border-blue-400'}`}>
                #{tag.name}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Đăng bài'}
          </button>
          <button type="button" onClick={() => navigate('/admin')}
            className="px-6 py-2 rounded-lg border text-gray-600 hover:bg-gray-50">
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}
