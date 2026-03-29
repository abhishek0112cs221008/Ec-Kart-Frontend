import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useHomePageController } from '../../controllers/useHomePageController'
import { useAuth } from '../../context/AuthContext'

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

function ShopPage() {
  const { featuredProducts, spotlightDeals, status } = useHomePageController()
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isLoading = status === 'loading'

  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    async function loadCats() {
      try {
        const data = await getJson('/api/v1/categories')
        setCategories(data)
      } catch (err) { console.error(err) }
    }
    loadCats()
  }, [])

  // Combine products for a full "Shop" experience
  const allProducts = [...featuredProducts, ...spotlightDeals]

  // Filter and Sort Logic
  const filteredProducts = allProducts
    .filter(p => activeCategory === 'All' || p.categoryName === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0 // default: newest (order of appearance)
    })

  return (
    <div className="pallet-shell fade-in">
      <header className="pallet-header">
        <Link to="/" className="brand">
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
           <button className="icon-btn" aria-label="Search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>
           <button className="icon-btn" aria-label="Cart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></button>
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
        <section className="shop-hero">
           <h1 className="hero-title">Shop All Collections</h1>
           <p className="hero-subtitle">Explore our full catalog of premium items curated for you.</p>
        </section>

        <section className="filter-bar">
          <div className="filter-pills">
             <button 
               className={`filter-pill ${activeCategory === 'All' ? 'active' : ''}`}
               onClick={() => setActiveCategory('All')}
             >
               All
             </button>
             {categories.map(cat => (
               <button 
                 key={cat.id} 
                 className={`filter-pill ${activeCategory === cat.name ? 'active' : ''}`}
                 onClick={() => setActiveCategory(cat.name)}
               >
                 {cat.name}
               </button>
             ))}
          </div>

          <div className="sort-group">
             <select 
               className="sort-select" 
               value={sortBy} 
               onChange={(e) => setSortBy(e.target.value)}
             >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
             </select>
          </div>
        </section>

        <section className="product-grid-section">
          {filteredProducts.length === 0 && !isLoading && (
            <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 0' }}>
               <h2 style={{ color: '#94a3b8' }}>No products found in this category.</h2>
            </div>
          )}
          
          <div className="product-grid">
            {isLoading && Array.from({ length: 8 }).map((_, i) => (
               <div key={i} className="product-card skeleton" />
            ))}
            {!isLoading && filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
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

export default ShopPage
