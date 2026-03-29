import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { isLoggedIn, user } = useAuth()

  if (!isLoggedIn) {
    // Not logged in -> Redirect to login
    return <Navigate to="/login" replace />
  }

  if (role && user?.role !== role) {
    // Logged in but wrong role -> Redirect to home
    return <Navigate to="/" replace />
  }

  return children
}
