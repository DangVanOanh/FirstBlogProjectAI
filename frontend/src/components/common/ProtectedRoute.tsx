import { Navigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />
}
