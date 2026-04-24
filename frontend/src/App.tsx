import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import HomePage from './pages/public/HomePage'
import PostDetailPage from './pages/public/PostDetailPage'
import SearchPage from './pages/public/SearchPage'
import LoginPage from './pages/auth/LoginPage'
import AdminPage from './pages/admin/AdminPage'
import PostFormPage from './pages/admin/PostFormPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:slug" element={<PostDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="/admin/post/:id" element={<ProtectedRoute><PostFormPage /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}
