import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import SearchSuggestions from './SearchSuggestions'
import logo from '../assets/logo.png'

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth()
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()

  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1/categories`)
      .then(res => res.json())
      .then(data => {
        // Data is hierarchical from backend
        setCategories(data)
      })
      .catch(err => console.error('Failed to fetch categories:', err))
  }, [])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
    setSearchQuery('')
    setShowSuggestions(false)
  }

  const handleSearchInputChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowSuggestions(value.trim().length > 0)
  }

  const closeSuggestions = () => {
    setShowSuggestions(false)
    setSearchQuery('')
  }

  return (
    <header className="pallet-header">
      <Link to="/" className="brand">
        <img src={logo} alt="Ec-Kart Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
        <span className="brand-name">Ec-Kart</span>
      </Link>

      <div className="header-center">
        <nav className="header-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>Shop</Link>
          
          <div className="nav-dropdown">
            <div className="nav-dropdown-trigger">
              Categories
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
            <div className="dropdown-mega">
              <div className="mega-grid">
                {categories.length > 0 ? (
                  categories.map(rootCat => (
                    <div key={rootCat.id} className="mega-column">
                      <Link to={`/shop?category=${rootCat.name}`} className="mega-title">
                        {rootCat.name}
                      </Link>
                      <div className="mega-list">
                        {rootCat.subCategories && rootCat.subCategories.length > 0 ? (
                          rootCat.subCategories.map(sub => (
                            <Link key={sub.id} to={`/shop?category=${sub.name}`} className="mega-link">
                              {sub.name}
                            </Link>
                          ))
                        ) : (
                          <span className="mega-empty">Explore Collection</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mega-loading">Loading Collections...</div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Integrated Search Bar */}
        <form className="header-search-form" onSubmit={handleSearchSubmit} ref={searchRef}>
          <div className="search-input-wrapper">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => searchQuery.trim().length > 0 && setShowSuggestions(true)}
              className="header-search-input"
            />
            <button type="submit" className="search-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </button>
            {showSuggestions && (
              <SearchSuggestions 
                query={searchQuery} 
                onClose={closeSuggestions}
              />
            )}
          </div>
        </form>
      </div>

      <div className="header-actions">
        {/* Wishlist */}
        <Link to="/wishlist" className="action-icon wishlist-btn" title="Wishlist">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {wishlistCount > 0 && <span className="icon-count">{wishlistCount}</span>}
        </Link>

        {/* Cart */}
        <Link to="/cart" className="action-icon cart-btn" title="Shopping Cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {cartCount > 0 && <span className="icon-count">{cartCount}</span>}
        </Link>

        <div className="v-separator" />

        {/* Profile */}
        <Link to="/profile" className="action-icon profile-btn" title="My Account">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </Link>

        {/* Logout */}
        {isLoggedIn && (
          <button className="action-icon logout-btn" onClick={() => { logout(); navigate('/') }} title="Logout">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        )}
      </div>
    </header>
  )
}
