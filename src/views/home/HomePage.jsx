import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useHomePageController } from '../../controllers/useHomePageController'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'
import logo from '../../assets/logo.png'
import hero_electronics from '../../assets/hero_electronics.png'
import hero_fashion from '../../assets/hero_fashion.png'

const BANNERS = [
  {
    id: 1,
    title: "The Future of Tech",
    subtitle: "Explore our latest electronics collection",
    image: hero_electronics,
    bgColor: "#e2f1ff",
    link: "/shop?category=Electronics"
  },
  {
    id: 2,
    title: "Elevate Your Style",
    subtitle: "Curated fashion for the modern individual",
    image: hero_fashion,
    bgColor: "#fff0f3",
    link: "/shop?category=Fashion"
  }
]

const CATEGORIES = [
  { name: 'For You', icon: '👜' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Mobiles', icon: '📱' },
  { name: 'Beauty', icon: '🧴' },
  { name: 'Electronics', icon: '💻' },
  { name: 'Home', icon: '🏠' },
  { name: 'Appliances', icon: '📺' },
  { name: 'Toys, ba...', icon: '🧸' },
  { name: 'Food & H...', icon: '🥫' },
  { name: 'Auto Acc...', icon: '🚕' },
  { name: '2 Wheele...', icon: '🛵' },
  { name: 'Sports & ...', icon: '🏏' },
  { name: 'Books & ...', icon: '📚' },
  { name: 'Furniture', icon: '🪑' }
]

function CategoryBar() {
  return (
    <div className="category-bar">
      <div className="category-bar-inner">
        {CATEGORIES.map(cat => (
          <Link key={cat.name} to={`/shop?category=${cat.name}`} className="category-item">
            <div className="cat-icon-circle">{cat.icon}</div>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

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

function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % BANNERS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hero-carousel">
      {BANNERS.map((banner, idx) => (
        <div 
          key={banner.id} 
          className={`carousel-slide ${idx === current ? 'active' : ''}`}
          style={{ backgroundColor: banner.bgColor }}
        >
          <div className="slide-content">
            <div className="slide-text">
              <h1>{banner.title}</h1>
              <p>{banner.subtitle}</p>
              <Link to={banner.link} className="btn-primary">Shop Now</Link>
            </div>
            <div className="slide-image">
              <img src={banner.image} alt={banner.title} />
            </div>
          </div>
        </div>
      ))}
      <div className="carousel-dots">
        {BANNERS.map((_, idx) => (
          <button 
            key={idx} 
            className={`dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  )
}

function Pagination() {
  return (
    <div className="pagination-container">
      <div className="pagination-inner">
        <div className="page-numbers">
          <span className="page-num active">1</span>
          <span className="page-num">2</span>
          <span className="page-num">3</span>
          <span className="page-num">...</span>
          <span className="page-num">n</span>
        </div>
        <div className="page-arrows">
          <button className="square-arrow-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
            </svg>
          </button>
          <button className="square-arrow-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function ProductGridSection({ products, isLoading }) {
  // Ensure we show 6 items for the 3x2 grid, placeholders if loading or few products
  const displayProducts = isLoading 
    ? Array(6).fill(null) 
    : [...products, ...Array(6)].slice(0, 6)

  return (
    <section className="product-grid-refined">
      <div className="grid-container-3x2">
        {displayProducts.map((product, idx) => (
          <div key={product?.id || idx} className="product-card-wrapper-refined">
            {product ? (
              <ProductCard product={product} />
            ) : (
              <div className="product-placeholder-card">
                <div className="gray-box"></div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Pagination />
    </section>
  )
}

function HomePage() {
  const { featuredProducts, spotlightDeals, showcaseSections, status, error } = useHomePageController()
  const { isLoggedIn } = useAuth()
  const isLoading = status === 'loading'
  const isError = status === 'error'

  const heroCards = isLoading ? Array(5).fill({}) : featuredProducts.slice(0, 5)
  while (heroCards.length > 0 && heroCards.length < 5) {
    heroCards.push({ id: `pad-${heroCards.length}`, name: 'Coming Soon', categoryName: 'New' })
  }

  return (
    <div className="pallet-shell">
      <Navbar />

      {/* 2. OLD HERO SECTION */}
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

      {/* 3. CATEGORIES ICONS */}
      <CategoryBar />

      {/* 4. NEW HERO SECTION */}
      <section className="hero-section-new" style={{ marginTop: '2rem' }}>
        <HeroCarousel />
      </section>

      <main className="pallet-main">
        {isError && (
          <div className="error-banner">Backend connection failed. Cannot load live products.</div>
        )}

        <ProductGridSection products={featuredProducts} isLoading={isLoading} />

        {/* BRAND SIGNATURE BEFORE FOOTER */}
        <div className="brand-signature-large">
           <img src={logo} alt="Ec-Kart Logo" className="large-logo" />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
