import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useHomePageController } from '../../controllers/useHomePageController'
import { useAuth } from '../../context/AuthContext'

function FannedCard({ product, index, total }) {
  const middle = Math.floor(total / 2)
  const offset = index - middle 
  
  const rotateDeg = offset * 8 
  const translateY = Math.abs(offset) * 15
  const translateX = offset * 60

  return (
    <div 
      className="fanned-card"
      style={{
        transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotateDeg}deg)`,
        zIndex: total - Math.abs(offset)
      }}
    >
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} />
      ) : (
        <div className="card-placeholder" style={{ background: `hsl(${offset * 40 + 210}, 60%, 55%)` }}>
          {product.categoryName?.slice(0, 1) || 'P'}
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="product-card">
        <div className="product-media">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="product-placeholder">
              {product.categoryName?.slice(0, 1) || 'P'}
            </div>
          )}
        </div>
        <div className="product-copy">
          <h3>{product.name}</h3>
          <p className="product-cat">{product.categoryName}</p>
          <div className="product-price">₹{product.price}</div>
        </div>
      </article>
    </Link>
  )
}

function HomePage() {
  const { featuredProducts, spotlightDeals, showcaseSections, status, error } = useHomePageController()
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isLoading = status === 'loading'
  const isError = status === 'error'

  const heroCards = isLoading ? Array(5).fill({}) : featuredProducts.slice(0, 5)
  while (heroCards.length > 0 && heroCards.length < 5) {
    heroCards.push({ id: `pad-${heroCards.length}`, name: 'Coming Soon', categoryName: 'New' })
  }

  return (
    <div className="pallet-shell">
      {/* HEADER */}
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
          <button className="icon-btn" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button className="icon-btn" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </button>
          {isLoggedIn ? (
            <div className="header-user">
              <span className="user-greeting">Hi, {user?.firstName || 'User'}</span>
              <button className="btn-logout" onClick={() => { logout(); navigate('/') }}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn-login">Sign in</Link>
          )}
        </div>
      </header>

      {/* BODY */}
      <main className="pallet-main">
        {isError && (
          <div className="error-banner">Backend connection failed. Cannot load live products.</div>
        )}

        {/* HERO SECTION */}
        <section className="hero">
          <h1 className="hero-title">
            Discover your next <br/> favorite thing.
          </h1>

          <div className="fanned-showcase">
            <div className="card-deck">
              {heroCards.map((product, idx) => (
                <FannedCard key={product.id || idx} product={product} index={idx} total={heroCards.length} />
              ))}
            </div>
          </div>

          <p className="hero-subtitle">
            Explore our curated collection of premium products across fashion, electronics, and home essentials.
          </p>

          <div className="hero-cta">
            <button className="btn-primary">Shop Collection</button>
          </div>
        </section>

        {/* DYNAMIC CATEGORY SECTIONS (Flipkart Style Scrolls) */}
        {!isLoading && showcaseSections.map(section => (
          <section key={section.id} className="horizontal-scroll-section">
            <div className="scroll-header">
              <h2>{section.title}</h2>
              <Link to="/shop" className="view-all">View All &rarr;</Link>
            </div>
            <div className="scroll-container">
              {section.products.map(product => (
                <div key={product.id} className="scroll-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* LOADING STATE FOR SCROLLS */}
        {isLoading && (
          <section className="horizontal-scroll-section">
            <div className="scroll-header">
              <div style={{ background: '#e2e8f0', width: '200px', height: '24px', borderRadius: '4px' }} className="skeleton" />
            </div>
            <div className="scroll-container">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="scroll-item">
                  <div className="product-card skeleton" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
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

export default HomePage
