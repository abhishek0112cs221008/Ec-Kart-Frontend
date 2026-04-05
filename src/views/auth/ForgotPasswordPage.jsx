import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword } from '../../services/authService'
import './AuthPage.css'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await forgotPassword(email)
      setSuccess('OTP sent successfully! Redirecting to reset password...')
      setTimeout(() => {
        navigate('/reset-password', { state: { email } })
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-left">
        <Link to="/" className="auth-brand">
          <span className="brand-icon">🛒</span>
          Ec-Kart
        </Link>
        <div className="auth-left-content">
          <h2>Secure Account Recovery</h2>
          <p>
            Lost your password? No worries. Enter your email address and we'll send you
            a 6-digit code to reset it securely.
          </p>
        </div>
        <div className="blob-3"></div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Forgot Password</h1>
            <p>Enter your email to receive a reset code</p>
          </div>

          {error && <div className="auth-error"><span>⚠️</span> {error}</div>}
          {success && <div className="auth-success"><span>✅</span> {success}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="input-icon">✉️</span>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Reset Code'}
              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="auth-switch">
            Remembered your password? <Link to="/login" className="auth-link">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
