import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function PaymentCancelPage() {
  return (
    <div className="pallet-shell">
      <Navbar />
      <main className="pallet-main success-page">
        <div className="success-card">
          <div className="status-container">
            <div className="error-icon" style={{ backgroundColor: '#fff7ed' }}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h1 style={{ color: '#ea580c' }}>Payment Cancelled</h1>
            <p>You have cancelled the payment process. Don't worry, your items are still safe in your cart.</p>
            <div className="success-actions" style={{ width: '100%', marginTop: '20px' }}>
              <Link to="/checkout" className="btn-primary" style={{ backgroundColor: '#101828' }}>Try Again</Link>
              <Link to="/cart" className="btn-outline">Return to Cart</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
