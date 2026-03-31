import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useHomePageController } from '../../controllers/useHomePageController'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'

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
      <Navbar />

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
            <Link to="/shop" className="btn-primary" style={{ textDecoration: 'none' }}>
              Shop Collection
            </Link>
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

      <Footer />
    </div>
  )
}

export default HomePage
