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
  { name: 'Mobiles', icon: '📱' },
  { name: 'Fashion', icon: '👔' },
  { name: 'Electronics', icon: '💻' },
  { name: 'Home', icon: '🏠' },
  { name: 'Travel', icon: '✈️' },
  { name: 'Appliances', icon: '🧺' },
  { name: 'Beauty', icon: '💄' }
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

function FilteredProductSection({ spotlightDeals, featuredProducts }) {
  const [activeTab, setActiveTab] = useState('Trending')
  
  const getFilteredItems = () => {
    switch(activeTab) {
      case 'Trending': return spotlightDeals.slice(0, 4)
      case 'Newest': return featuredProducts.slice(0, 4)
      case 'Recommended': return featuredProducts.slice(4, 8)
      default: return featuredProducts.slice(0, 4)
    }
  }

  const tabs = ['Trending', 'Newest', 'Recommended']
  const items = getFilteredItems()

  return (
    <section className="filtered-items-section">
      <div className="filtered-header">
        <div className="tabs-list">
          {tabs.map(tab => (
            <button 
              key={tab} 
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="deal-grid">
         {items.length > 0 ? items.map(product => (
           <ProductCard key={product.id} product={product} />
         )) : (
           <div className="empty-filter">No products in this collection currently.</div>
         )}
      </div>
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

        {/* 5. ITEMS NOT ALL ONLY FEW WITH FILTERING */}
        {!isLoading && (
          <FilteredProductSection 
            spotlightDeals={spotlightDeals} 
            featuredProducts={featuredProducts} 
          />
        )}

        {/* LOADING STATES */}
        {isLoading && Array(2).fill(0).map((_, i) => (
          <div key={i} className="skeleton-section-home">
            <div className="skeleton h-heading"></div>
            <div className="skeleton-row-home">
               {[1,2,3,4].map(j => <div key={j} className="skeleton h-card"></div>)}
            </div>
          </div>
        ))}

        {/* BRAND SIGNATURE BEFORE FOOTER */}
        <div className="brand-signature">
           <img src={logo} alt="Ec-Kart Logo" className="signature-logo" />
           <p className="signature-text">Premium Shopping Simplified</p>
           <Link to="/shop" className="btn-signature" style={{ marginTop: '2rem' }}>
              Shop All Collection
           </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
