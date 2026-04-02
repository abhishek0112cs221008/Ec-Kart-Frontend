import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './PaymentSuccessPage.css'

export default function PaymentSuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear cart immediately on successful landing
    clearCart()
  }, [clearCart])

  return (
    <div className="pallet-shell">
      <Navbar />
      <main className="pallet-main success-page">
        <div className="success-card">
          <div className="status-container success-state">
            <div className="check-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h1 className="success-title">Order Successful!</h1>
            <p className="success-msg">Thank you for your purchase. Your order has been placed successfully and is being processed.</p>
            <div className="success-actions">
              <Link to="/orders" className="btn-primary">View My Orders</Link>
              <Link to="/shop" className="btn-outline">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
