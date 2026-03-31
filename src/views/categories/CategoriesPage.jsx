import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getJson } from '../../shared/lib/httpClient'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import logo from '../../assets/logo.png'

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
          <img src={logo} alt="Category Icon" style={{ width: '24px', height: '24px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
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
      <Navbar />

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

      <Footer />
    </div>
  )
}

export default CategoriesPage
