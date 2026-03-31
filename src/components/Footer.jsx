import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="pallet-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <img src={logo} alt="Ec-Kart Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <span className="brand-name" style={{ marginBottom: 0 }}>Ec-Kart</span>
          </div>
          <p>Your premium destination for everyday masterpieces.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/shop">Shop All</Link>
            <Link to="/categories">Categories</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/profile">My Profile</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/wishlist">My Wishlist</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Ec-Kart. All rights reserved.</p>
      </div>
    </footer>
  )
}
