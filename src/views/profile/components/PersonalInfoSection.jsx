import { useState } from 'react'
import { updateProfile } from '../../../services/authService'

export default function PersonalInfoSection({ user, refreshUser, setAlert }) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateProfile(formData.firstName, formData.lastName, formData.phoneNumber, null)
      await refreshUser()
      setAlert({ type: 'success', msg: 'Personal information updated!' })
    } catch (err) {
      setAlert({ type: 'error', msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-section-content animate-fadeIn">
      <div className="section-header">
        <h2>Identity</h2>
        <p>Refine your personal profile details.</p>
      </div>

      <form onSubmit={handleSubmit} className="personal-info-form">
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input 
              type="text" 
              value={formData.firstName} 
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input 
              type="text" 
              value={formData.lastName} 
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input type="email" value={user?.email} disabled className="disabled-input" />
          <span className="input-hint">Email cannot be changed for security.</span>
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input 
            type="tel" 
            value={formData.phoneNumber} 
            onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="e.g. +91 9876543210"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
