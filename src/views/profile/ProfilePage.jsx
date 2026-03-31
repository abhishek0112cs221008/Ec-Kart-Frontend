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
  const [activeTab, setActiveTab] = useState('personal-info') // 'personal-info' or 'addresses'
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
      setAlert({ type: 'success', msg: 'Profile picture updated!' })
    } catch (err) {
      setAlert({ type: 'error', msg: 'Image upload failed.' })
    } finally {
      setImgLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="pallet-shell">
      <Navbar />
      
      <main className="pallet-main">
        <div className="profile-wrapper">
          <div className="profile-container">
            {/* BREADCRUMB & BACK ACTION */}
            <div className="profile-header-actions">
              <div className="profile-breadcrumb">
                <Link to="/">Home</Link> <span>/</span> My Account
              </div>
              <Link to="/shop" className="back-to-shop-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Back to Shopping
              </Link>
            </div>

            <div className="profile-layout">
              {/* SIDEBAR */}
              <aside className="profile-sidebar">
                <div className="user-profile-header">
                  <div className="avatar-preview-wrapper" onClick={() => fileInputRef.current?.click()}>
                    <img src={user?.profileImageUrl || 'https://via.placeholder.com/100'} alt="Avatar" />
                    <div className={`avatar-loader ${imgLoading ? 'block' : ''}`}>
                       <div className="spinner"></div>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" hidden />
                  <div className="user-header-text">
                    <p>Hello,</p>
                    <h3>{user?.firstName} {user?.lastName}</h3>
                  </div>
                </div>

                <nav className="profile-nav">
                  <div className="nav-group">
                    <div className="nav-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      ACCOUNT SETTINGS
                    </div>
                    <div className="nav-links">
                      <button className={`nav-link ${activeTab === 'personal-info' ? 'active' : ''}`} onClick={() => setActiveTab('personal-info')}>
                        Personal Information
                      </button>
                      <button className={`nav-link ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>
                        Manage Addresses
                      </button>
                    </div>
                  </div>

                  <div className="nav-group">
                    <div className="nav-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polyline points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                      MY ORDERS
                    </div>
                    <div className="nav-links">
                      <Link to="/orders" className="nav-link">Order History</Link>
                    </div>
                  </div>

                  <div className="nav-group">
                    <div className="nav-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                      SHOPPING
                    </div>
                    <div className="nav-links">
                      <Link to="/cart" className="nav-link">My Cart</Link>
                      <Link to="/wishlist" className="nav-link">My Wishlist</Link>
                    </div>
                  </div>

                  <div className="nav-group">
                    <button className="logout-nav-btn" onClick={handleLogout}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Logout
                    </button>
                  </div>
                </nav>
              </aside>

              {/* CONTENT SECTION */}
              <div className="profile-content">
                {alert.type && (
                  <div className={`alert-banner ${alert.type}`}>
                    {alert.msg}
                    <button onClick={() => setAlert({ type: null, msg: '' })}>✕</button>
                  </div>
                )}

                {activeTab === 'personal-info' && <PersonalInfoSection user={user} refreshUser={refreshUser} setAlert={setAlert} />}
                {activeTab === 'addresses' && <AddressSection setAlert={setAlert} />}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
