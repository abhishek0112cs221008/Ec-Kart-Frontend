import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { fetchProductById } from '../../services/productService'
import { useAuth } from '../../context/AuthContext'

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, user, logout } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        const data = await fetchProductById(id)
        setProduct(data)
      } catch (err) {
        setError(err.message || 'Product not found')
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  if (loading) {
    return (
      <div className="pallet-shell">
        <header className="pallet-header">
          <Link to="/" className="brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brand-logo">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span className="brand-name">Ec-Kart</span>
          </Link>
        </header>
        <main className="pallet-main">
          <div className="skeleton-detail">
            <div className="skeleton-left"></div>
            <div className="skeleton-right"></div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="pallet-shell">
        <main className="pallet-main">
          <div className="error-banner">{error || 'Product not found'}</div>
          <button className="btn-primary" onClick={() => navigate('/')}>Return Home</button>
        </main>
      </div>
    )
  }

  return (
    <div className="pallet-shell">
      {/* HEADER (Pallet Theme) */}
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
              <span className="user-greeting">Hi, {user?.firstName}</span>
              <button className="btn-logout" onClick={() => { logout(); navigate('/') }}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn-login">Sign in</Link>
          )}
        </div>
      </header>

      <main className="pallet-main">
        <div className="product-pallet-detail">
          <section className="detail-visuals">
            <div className="pallet-image-box">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className="pallet-placeholder-img">{product.categoryName?.slice(0, 1)}</div>
              )}
            </div>
            <div className="pallet-action-group">
              <button className="btn-primary">Add to Bag</button>
              <button className="btn-secondary">Wishlist</button>
            </div>
          </section>

          <section className="detail-content">
            <nav className="pallet-breadcrumbs">
              <Link to="/">Home</Link> / <span>{product.categoryName}</span>
            </nav>
            
            <h1 className="pallet-product-title">{product.name}</h1>
            <p className="pallet-seller-tag">Curated by {product.sellerName || 'Ec-Kart Brand'}</p>

            <div className="pallet-price-box">
               <span className="pallet-price">₹{product.price}</span>
            </div>

            <div className="pallet-divider" />

            <div className="pallet-description">
               <h3>About this piece</h3>
               <p>{product.description || 'No description provided for this premium item.'}</p>
            </div>

            <div className="pallet-metadata">
               <div className="metadata-item">
                  <strong>Stock</strong>
                  <span>{product.stock} units available</span>
               </div>
               <div className="metadata-item">
                  <strong>Category</strong>
                  <span>{product.categoryName}</span>
               </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER (Pallet Theme) */}
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

export default ProductDetailPage
