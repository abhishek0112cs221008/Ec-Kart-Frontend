import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../../services/authService'
import './AuthPage.css'

const ROLES = [
  { value: 'ROLE_USER', label: 'Customer — I want to shop' },
  { value: 'ROLE_SELLER', label: 'Seller — I want to sell' },
]

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: 'ROLE_USER',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please fill in all required fields.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      await registerUser(form)
      setSuccess('Account created! Please check your email to verify your account.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      {/* Left Panel */}
      <div className="auth-left">
        <Link to="/" className="auth-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          Ec-Kart
        </Link>

        <div className="auth-left-content">
          <h2>Join Ec-Kart today</h2>
          <p>Create your account and start shopping or selling — it only takes a minute.</p>

          <div className="auth-left-features">
            <div className="feature-item">
              <span className="feature-icon">🎉</span>
              <span>Free to join, always</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📦</span>
              <span>Sell or buy with ease</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌐</span>
              <span>Reach millions of customers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Create your account</h1>
            <p>Fill in the details below to get started</p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success" role="status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
              {success}
            </div>
          )}

          {!success && (
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First name</label>
                  <div className="input-wrapper">
                    <input id="firstName" name="firstName" type="text" placeholder="John" value={form.firstName} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last name</label>
                  <div className="input-wrapper">
                    <input id="lastName" name="lastName" type="text" placeholder="Doe" value={form.lastName} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input id="reg-email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input id="reg-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={handleChange} />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword(p => !p)} aria-label="Toggle password">
                    {showPassword
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>I am a…</label>
                <div className="role-picker">
                  {ROLES.map(r => (
                    <label key={r.value} className={`role-option ${form.role === r.value ? 'selected' : ''}`}>
                      <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={handleChange} />
                      {r.label}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading
                  ? <><span className="spinner" /> Creating account…</>
                  : 'Create account'
                }
              </button>
            </form>
          )}

          <p className="auth-switch">
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
