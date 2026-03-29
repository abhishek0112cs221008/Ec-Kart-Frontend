import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AboutPage() {
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

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

      <main className="pallet-main" style={{ padding: '0 2rem' }}>
        <section className="about-hero">
           <h1 className="hero-title">Beyond Transactions.</h1>
           <p className="hero-subtitle">Ec-Kart is a boutique marketplace dedicated to the art of curated commerce.</p>
        </section>

        <section className="about-section-grid">
           <div className="about-text">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Our Mission</h2>
              <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: '1.8' }}>
                At Ec-Kart, we believe that the objects we surround ourselves with matter. They are an extension of our identity and a testament to our values. Our mission is to bridge the gap between discerning customers and high-quality sellers who prioritize craftsmanship over mass production.
              </p>
           </div>
           <div 
             className="about-visual-placeholder" 
             style={{ background: '#f1f5f9', height: '400px', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
           >
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
           </div>
        </section>

        <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '3rem' }}>The Ec-Kart Promise</h2>
        <section className="about-values-grid">
           <div className="value-card">
              <span className="value-num">01</span>
              <h3>Uncompromised Quality</h3>
              <p>Every item on our platform undergoes a rigorous quality check to ensure it meets our standards.</p>
           </div>
           <div className="value-card">
              <span className="value-num">02</span>
              <h3>Curated Selection</h3>
              <p>We do not aim for the most products, but the best ones. Our catalog is hand-picked for the modern lifestyle.</p>
           </div>
           <div className="value-card">
              <span className="value-num">03</span>
              <h3>Community First</h3>
              <p>We empower independent sellers and creators, providing them with a platform that values their unique craft.</p>
           </div>
        </section>

        <section className="connect-section" style={{ background: '#1a1a1a', borderRadius: '32px', padding: '4rem', color: 'white', textAlign: 'center', marginBottom: '4rem' }}>
           <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Stay Inspired</h2>
           <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Join our newsletter for curated arrivals and exclusive brand stories.</p>
           <div style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                style={{ flex: 1, padding: '1rem 1.5rem', borderRadius: '12px', border: 'none', background: '#2d2d2d', color: 'white' }} 
              />
              <button className="btn-primary" style={{ background: 'white', color: '#1a1a1a' }}>Join</button>
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

export default AboutPage
