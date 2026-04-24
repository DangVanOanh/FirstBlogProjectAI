import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { postsApi } from '../../api/posts.api'
import { tagsApi } from '../../api/tags.api'
import { formatDate } from '../../utils/date'
import type { PostSummary, Tag } from '../../types'

const PAGE_SIZE = 10

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tag = searchParams.get('tag') ?? undefined
  const page = Number(searchParams.get('page') ?? 1)

  const [posts, setPosts] = useState<PostSummary[]>([])
  const [total, setTotal] = useState(0)
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { tagsApi.getAll().then(setTags) }, [])

  useEffect(() => {
    setLoading(true)
    setError('')
    postsApi.getAll(page, PAGE_SIZE, tag)
      .then(res => { setPosts(res.data); setTotal(res.totalCount) })
      .catch(() => setError('Không thể tải danh sách bài viết.'))
      .finally(() => setLoading(false))
  }, [page, tag])

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const setPage = (p: number) => setSearchParams(prev => { prev.set('page', String(p)); return prev })

  const featuredPost = posts[0]
  const secondaryPosts = posts.slice(1, 3)
  const sidebarPosts = posts.slice(0, 4)
  const recentPosts = posts.slice(3)

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Category filter bar */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-6 mb-6 border-b border-gray-300 pb-4">
            <Link
              to="/"
              className={`text-xs font-bold uppercase tracking-widest pb-1 ${!tag ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Tất cả
            </Link>
            {tags.map(t => (
              <Link
                key={t.id}
                to={`/?tag=${t.slug}`}
                className={`text-xs font-bold uppercase tracking-widest pb-1 ${tag === t.slug ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
              >
                {t.name}
              </Link>
            ))}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-center text-red-400 py-10">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400 py-10">Không có bài viết nào.</p>
        ) : (
          <>
            {/* Hero grid: featured | 2 stacked | sidebar */}
            <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_0.8fr] gap-4 mb-8">

              {/* Featured post — large left */}
              {featuredPost && (
                <div className="bg-white">
                  {featuredPost.thumbnail ? (
                    <Link to={`/post/${featuredPost.slug}`}>
                      <img
                        src={featuredPost.thumbnail}
                        alt={featuredPost.title}
                        className="w-full h-72 object-cover"
                      />
                    </Link>
                  ) : (
                    <div className="w-full h-72 bg-gray-200" />
                  )}
                  <div className="p-5">
                    {featuredPost.tags.length > 0 && (
                      <div className="flex gap-2 mb-2">
                        {featuredPost.tags.map(t => (
                          <Link
                            key={t}
                            to={`/?tag=${t}`}
                            className="text-xs text-blue-500 uppercase font-semibold tracking-wide hover:underline"
                          >
                            {t}
                          </Link>
                        ))}
                      </div>
                    )}
                    <Link
                      to={`/post/${featuredPost.slug}`}
                      className="block text-2xl font-bold text-gray-900 hover:text-gray-600 leading-snug mb-3"
                    >
                      {featuredPost.title}
                    </Link>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">
                      {formatDate(featuredPost.createdAt)}
                    </p>
                  </div>
                </div>
              )}

              {/* 2 stacked secondary posts — center */}
              <div className="flex flex-col gap-4">
                {secondaryPosts.map(post => (
                  <div key={post.id} className="bg-white flex flex-col">
                    {post.thumbnail ? (
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-36 object-cover"
                        />
                      </Link>
                    ) : (
                      <div className="w-full h-36 bg-gray-200" />
                    )}
                    <div className="p-3 flex flex-col gap-1">
                      <Link
                        to={`/post/${post.slug}`}
                        className="font-bold text-gray-900 hover:text-gray-600 text-sm leading-snug"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar — right */}
              <aside className="hidden md:flex flex-col gap-4">

                {/* Recent Posts widget */}
                <div className="bg-white p-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-3">
                    Recent Posts
                  </h3>

                  {/* First sidebar post: image with text overlay */}
                  {sidebarPosts[0] && (
                    <Link to={`/post/${sidebarPosts[0].slug}`} className="block mb-3">
                      <div className="relative">
                        {sidebarPosts[0].thumbnail ? (
                          <img
                            src={sidebarPosts[0].thumbnail}
                            alt={sidebarPosts[0].title}
                            className="w-full h-28 object-cover"
                          />
                        ) : (
                          <div className="w-full h-28 bg-gray-200" />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
                            {sidebarPosts[0].title}
                          </p>
                          <p className="text-gray-300 text-xs uppercase mt-0.5">
                            {formatDate(sidebarPosts[0].createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )}

                  {/* Remaining sidebar posts: text only */}
                  <div className="flex flex-col">
                    {sidebarPosts.slice(1).map((post, i) => (
                      <div
                        key={post.id}
                        className={`py-2 ${i < sidebarPosts.slice(1).length - 1 ? 'border-b border-gray-100' : ''}`}
                      >
                        <Link
                          to={`/post/${post.slug}`}
                          className="text-xs font-semibold text-gray-800 hover:text-gray-500 leading-snug block mb-0.5"
                        >
                          {post.title}
                        </Link>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Follow Us widget */}
                <div className="bg-white p-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-3">
                    Follow Us
                  </h3>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-blue-600 text-white text-xs font-bold flex items-center justify-center">f</span>
                      <span className="text-xs font-semibold uppercase tracking-wide">Facebook</span>
                    </div>
                    <span className="text-xs text-gray-400 uppercase">Like</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-sky-400 text-white text-xs font-bold flex items-center justify-center">t</span>
                      <span className="text-xs font-semibold uppercase tracking-wide">Twitter</span>
                    </div>
                    <span className="text-xs text-gray-400 uppercase">Follow</span>
                  </div>
                </div>

              </aside>
            </div>

            {/* Recent Posts section below hero */}
            {recentPosts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">
                  Recent Posts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {recentPosts.map(post => (
                    <div key={post.id} className="bg-white">
                      {post.thumbnail ? (
                        <Link to={`/post/${post.slug}`}>
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-40 object-cover"
                          />
                        </Link>
                      ) : (
                        <div className="w-full h-40 bg-gray-200" />
                      )}
                      <div className="p-3">
                        {post.tags.length > 0 && (
                          <div className="flex gap-1 mb-1">
                            {post.tags.slice(0, 2).map(t => (
                              <Link
                                key={t}
                                to={`/?tag=${t}`}
                                className="text-xs text-blue-500 uppercase font-semibold hover:underline"
                              >
                                {t}
                              </Link>
                            ))}
                          </div>
                        )}
                        <Link
                          to={`/post/${post.slug}`}
                          className="font-bold text-gray-900 hover:text-gray-600 text-sm leading-snug block mb-1"
                        >
                          {post.title}
                        </Link>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 text-sm font-medium ${p === page ? 'bg-black text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
