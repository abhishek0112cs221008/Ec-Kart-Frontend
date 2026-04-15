import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../services/authService'
import PersonalInfoSection from './components/PersonalInfoSection'
import AddressSection from './components/AddressSection'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('personal-info')
  const [alert, setAlert] = useState({ type: null, msg: '' })
  const [imgLoading, setImgLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImgLoading(true)
    try {
      await updateProfile(null, null, null, file)
      await refreshUser()
      setAlert({ type: 'success', msg: 'Profile picture updated successfully!' })
    } catch (err) {
      setAlert({ type: 'error', msg: 'Failed to update profile picture.' })
    } finally {
      setImgLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="profile-page-wrapper">
      <Navbar />
      
      <main className="profile-page-main">
        <div className="profile-header">
          <div className="header-content">
            <div className="header-title">
              <nav className="breadcrumb">
                <Link to="/">Home</Link> <span>/</span> <span className="active">My Account</span>
              </nav>
              <h1>My Account</h1>
              <p>Tailored settings for your unique profile.</p>
            </div>
            <Link to="/shop" className="back-button">
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="profile-content-wrapper">
          <div className="profile-grid">
            {/* SIDEBAR */}
            <aside className="profile-sidebar">
              <div className="profile-card user-card">
                <div className="avatar-section">
                  <div className="avatar-wrapper" onClick={() => fileInputRef.current?.click()}>
                    <img 
                      src={user?.profileImageUrl || 'https://via.placeholder.com/120'} 
                      alt={`${user?.firstName} ${user?.lastName}`}
                      className="avatar-image"
                    />
                    {imgLoading && (
                      <div className="avatar-overlay">
                        <div className="spinner-dot"></div>
                      </div>
                    )}
                    <div className="avatar-hover-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      Change
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange} 
                    accept="image/*" 
                    hidden 
                  />
                </div>
                <div className="user-info">
                  <h2 className="user-name">{user?.firstName} {user?.lastName}</h2>
                  <p className="user-email">{user?.email}</p>
                </div>
              </div>

              {/* NAVIGATION */}
              <nav className="profile-nav">
                <div className="nav-section">
                  <div className="nav-label">Account</div>
                  <div className="nav-items">
                    <button 
                      className={`nav-item ${activeTab === 'personal-info' ? 'active' : ''}`}
                      onClick={() => setActiveTab('personal-info')}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <span>Personal Information</span>
                    </button>
                    <button 
                      className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                      onClick={() => setActiveTab('addresses')}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>Addresses</span>
                    </button>
                  </div>
                </div>

                <div className="nav-section">
                  <div className="nav-label">Shopping</div>
                  <div className="nav-items">
                    <Link to="/orders" className="nav-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      <span>Order History</span>
                    </Link>
                    <Link to="/cart" className="nav-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      <span>My Cart</span>
                    </Link>
                    <Link to="/wishlist" className="nav-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      <span>Wishlist</span>
                    </Link>
                  </div>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  <span>Logout</span>
                </button>
              </nav>
            </aside>

            {/* MAIN CONTENT */}
            <div className="profile-main">
              {alert.type && (
                <div className={`alert ${alert.type}`} role="alert">
                  <div className="alert-content">
                    <div className="alert-message">{alert.msg}</div>
                    <button 
                      className="alert-close"
                      onClick={() => setAlert({ type: null, msg: '' })}
                      aria-label="Close alert"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <div className="content-section">
                {activeTab === 'personal-info' && (
                  <PersonalInfoSection user={user} refreshUser={refreshUser} setAlert={setAlert} />
                )}
                {activeTab === 'addresses' && (
                  <AddressSection setAlert={setAlert} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}