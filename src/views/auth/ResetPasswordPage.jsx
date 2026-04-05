import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { resetPassword } from '../../services/authService'
import './AuthPage.css'

function ResetPasswordPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!formData.email) {
      // If someone lands here directly without coming from forgot-password, redirect back
      navigate('/forgot-password')
    }
  }, [formData.email, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      await resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      })
      setSuccess('Password reset successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2500)
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
          <h2>Secure Password Reset</h2>
          <p>
            Almost there! Please enter the 6-digit verification code we sent to your
            email and choose a strong new password for your account.
          </p>
        </div>
        <div className="blob-3"></div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Reset Password</h1>
            <p>Verify your OTP and set a new password</p>
          </div>

          {error && <div className="auth-error"><span>⚠️</span> {error}</div>}
          {success && <div className="auth-success"><span>✅</span> {success}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Email (Readonly) */}
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-slate-50"
                  readOnly
                />
                <span className="input-icon" style={{ opacity: 0.5 }}>✉️</span>
              </div>
            </div>

            {/* OTP Field */}
            <div className="form-group">
              <label htmlFor="otp">Verification OTP</label>
              <div className="input-wrapper">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
                <span className="input-icon">🔑</span>
              </div>
            </div>

            {/* New Password */}
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <span className="input-icon">🔒</span>
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span className="input-icon">🔒</span>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Resetting Password...' : 'Reset Password'}
              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="auth-switch">
             <Link to="/login" className="auth-link">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
