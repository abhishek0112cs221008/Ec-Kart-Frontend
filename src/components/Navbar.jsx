import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import logo from '../assets/logo.png'

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth()
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()

const [searchQuery, setSearchQuery] = useState('')

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
    setSearchQuery('')
  }

  return (
    <header className="pallet-header">
      <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
        <img src={logo} alt="Ec-Kart Logo" className="brand-logo" style={{ width: '62px', height: '62px', objectFit: 'contain' }} />
      </Link>

      <nav className="header-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>Shop</Link>
        <Link to="/categories" className={location.pathname === '/categories' ? 'active' : ''}>Categories</Link>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
      </nav>

      <div className="header-actions">
        <form className="nav-search-form" onSubmit={handleSearchSubmit}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Wishlist icon with badge */}
        <Link to="/wishlist" className="icon-btn nav-icon-link" aria-label="Wishlist" style={{ textDecoration: 'none', position: 'relative' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlistCount > 0 ? '#e11d48' : 'none'} stroke={wishlistCount > 0 ? '#e11d48' : 'currentColor'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {isLoggedIn && wishlistCount > 0 && (
            <span className="nav-badge" aria-label={`${wishlistCount} items in wishlist`}>{wishlistCount > 99 ? '99+' : wishlistCount}</span>
          )}
        </Link>

        {/* Cart icon with badge */}
        <Link to="/cart" className="icon-btn nav-icon-link" aria-label="Cart" style={{ textDecoration: 'none', position: 'relative' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
          {isLoggedIn && cartCount > 0 && (
            <span className="nav-badge" aria-label={`${cartCount} items in cart`}>{cartCount > 99 ? '99+' : cartCount}</span>
          )}
        </Link>

        {isLoggedIn ? (
          <div className="header-user">
            <Link to="/profile" className="user-profile-link" title="My Profile">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="Profile" className="nav-avatar" />
              ) : (
                <div className="nav-avatar-placeholder">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
              )}
              <span className="user-greeting">Hi, {user?.firstName || 'User'}</span>
            </Link>
            <button className="btn-logout" onClick={() => { logout(); navigate('/') }}>Logout</button>
          </div>
        ) : (
          <Link to="/login" className="btn-login">Sign in</Link>
        )}
      </div>
    </header>
  )
}
