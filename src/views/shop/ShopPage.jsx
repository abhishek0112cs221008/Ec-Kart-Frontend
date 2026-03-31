import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getJson } from '../../shared/lib/httpClient'
import { useHomePageController } from '../../controllers/useHomePageController'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'

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
      <Navbar />

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

      <Footer />
    </div>
  )
}

export default ShopPage
