import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-gray-800 shrink-0">My Blog</Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-sm">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </form>

        <div className="flex items-center gap-3 shrink-0">
          {isLoggedIn ? (
            <>
              <Link to="/admin" className="text-sm text-blue-600 hover:underline">Quản lý</Link>
              <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500">Đăng xuất</button>
            </>
          ) : (
            <Link to="/login" className="text-sm text-blue-600 hover:underline">Đăng nhập</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
