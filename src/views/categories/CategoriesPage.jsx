import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getJson } from '../../shared/lib/httpClient'
import { useAuth } from '../../context/AuthContext'

function CategoryBubble({ category, index }) {
  const navigate = useNavigate();
  const productCount = category.products?.length || 0;
  
  // Define a set of vibrant Adobe-style colors
  const colors = [
    '#ff0000', // Adobe Red
    '#2196f3', // Blue
    '#4caf50', // Green
    '#1a1a1a', // Black
    '#ff9800', // Orange
    '#673ab7', // Deep Purple
    '#00bcd4'  // Cyan
  ];
  
  const bgColor = colors[index % colors.length];
  const sizeClass = index % 3 === 0 ? 'large' : index % 3 === 1 ? 'medium' : 'small';
  const animDelay = `${(index * 0.4).toFixed(1)}s`;
  const bobDuration = `${(7 + (index % 5)).toFixed(1)}s`;

  return (
    <div 
      className={`category-bubble ${sizeClass} fade-in`}
      style={{ 
        backgroundColor: bgColor, 
        animationDelay: animDelay,
        '--bob-duration': bobDuration
      }}
      onClick={() => navigate(`/shop?category=${category.name}`)}
    >
      <div className="bubble-inner">
        <div className="bubble-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h3 className="bubble-title">{category.name}</h3>
        <span className="bubble-badge">{category.id}</span>
      </div>
    </div>
  )
}

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    async function load() {
      try {
        const data = await getJson('/api/v1/categories')
        setCategories(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="pallet-shell fade-in">
      <header className="pallet-header">
        <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brand-logo">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="brand-name">Ec-Kart</span>
        </Link>
        <nav className="header-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>Shop</Link>
          <Link to="/categories" className={location.pathname === '/categories' ? 'active' : ''}>Categories</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
        </nav>
        <div className="header-actions">
           {isLoggedIn ? (
            <div className="header-user">
              <span className="user-greeting">Hi, {user?.firstName}</span>
              <button className="btn-logout" onClick={() => { logout(); navigate('/') }}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn-login">Sign in</Link>
          )}
        </div>
      </header>

      <main className="pallet-main" style={{ display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        <section className="shop-hero">
           <h1 className="hero-title">Experience Categories</h1>
           <p className="hero-subtitle">Interactive curated collections bobbing for your attention.</p>
        </section>

        <section className="bubble-scene-container">
          <div className="bubble-scene">
            {loading && Array.from({ length: 6 }).map((_, i) => (
               <div key={i} className="bubble-placeholder" />
            ))}
            {!loading && categories.map((cat, i) => (
              <CategoryBubble key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </section>
      </main>

      <footer className="pallet-footer">
        <div className="footer-content">
          <div className="footer-brand">
             <span className="brand-name">Ec-Kart</span>
             <p>Your premium destination for everyday masterpices.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Shop</h4>
              <a href="#">New Arrivals</a>
              <a href="#">Best Sellers</a>
              <a href="#">Sale</a>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <a href="#">FAQ</a>
              <a href="#">Shipping</a>
              <a href="#">Returns</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Ec-Kart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default CategoriesPage
