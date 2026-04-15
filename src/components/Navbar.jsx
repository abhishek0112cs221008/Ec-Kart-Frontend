import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useTheme } from '../context/ThemeContext'
import SearchSuggestions from './SearchSuggestions'
import logo from '../assets/logo.png'

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth()
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className={`pallet-header ${isMenuOpen ? 'menu-open' : ''}`}>
      {/* Mobile Toggle & Brand (Desktop/Mobile Dual Role) */}
      <div className="header-left">
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
        
        <Link to="/" className="brand desktop-only" onClick={() => setIsMenuOpen(false)}>
          <img src={logo} alt="Ec-Kart Logo" className="brand-img" />
          <span className="brand-name">Ec-Kart</span>
        </Link>
      </div>

      {/* Main Center Area: Desktop Nav + Universal Search */}
      <div className="header-center-area">
        <nav className="header-links desktop-only">
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

      {/* Desktop/Mobile Common Actions */}
      <div className="header-right">
        <div className="header-actions desktop-only">
          <Link to="/wishlist" className="action-icon wishlist-btn" title="Wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && <span className="icon-count">{wishlistCount}</span>}
          </Link>

          <Link to="/cart" className="action-icon cart-btn" title="Shopping Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && <span className="icon-count">{cartCount}</span>}
          </Link>

          <div className="v-separator" />
          
          <button className="action-icon theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><path d="M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
            )}
          </button>

          <div className="v-separator" />

          <Link to="/profile" className="action-icon profile-btn" title="My Account">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>

          {isLoggedIn && (
            <button className="action-icon logout-btn" onClick={() => { logout(); navigate('/') }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          )}
        </div>

        {/* No action icons on mobile header as per user request */}
      </div>

      {/* Side Slider Menu (Modern Drawer) */}
      <div className={`side-drawer-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)} />
      
      <div className={`side-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="brand drawer-brand">
            <img src={logo} alt="Logo" className="brand-img" />
            <span className="brand-name">Ec-Kart</span>
          </div>
          <button className="close-drawer" onClick={() => setIsMenuOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="drawer-body">
          <div className="drawer-section">
            <h4>Menu</h4>
            <div className="drawer-nav">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <div className="link-with-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Home
                </div>
              </Link>
              <Link to="/shop" onClick={() => setIsMenuOpen(false)}>
                <div className="link-with-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  Shop
                </div>
              </Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <div className="link-with-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  My Account
                </div>
              </Link>
              <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                <div className="link-with-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  Wishlist
                </div>
                {wishlistCount > 0 && <span className="drawer-badge">{wishlistCount}</span>}
              </Link>
              <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                <div className="link-with-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  My Cart
                </div>
                {cartCount > 0 && <span className="drawer-badge">{cartCount}</span>}
              </Link>
            </div>
          </div>

          <div className="drawer-section">
            <h4>Collections</h4>
            <div className="drawer-categories">
              {categories.slice(0, 8).map(cat => (
                <Link key={cat.id} to={`/shop?category=${cat.name}`} className="category-pill-link" onClick={() => setIsMenuOpen(false)}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="drawer-section theme-section-modern">
            <div className="theme-toggle-modern" onClick={toggleTheme}>
              <div className="theme-info">
                <div className="theme-icon">
                  {theme === 'light' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                  )}
                </div>
                <span>Theme Mode</span>
              </div>
              <div className="theme-switch-status">{theme}</div>
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          {isLoggedIn ? (
            <button className="drawer-logout-btn" onClick={() => { logout(); setIsMenuOpen(false); navigate('/') }}>
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="drawer-login-btn" onClick={() => setIsMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}