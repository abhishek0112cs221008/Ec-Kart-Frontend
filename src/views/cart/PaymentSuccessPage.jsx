import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { confirmPayment } from '../../services/paymentService'
import { useCart } from '../../context/CartContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './PaymentSuccessPage.css'

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')
  const { clearCart } = useCart()

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setMessage('No session ID found. Please contact support.')
      return
    }

    const verify = async () => {
      try {
        const res = await confirmPayment(sessionId)
        if (res.status === 'OK' || res.status === 'SUCCESS') {
          setStatus('success')
          clearCart() // Clear cart on success
        } else {
          setStatus('error')
          setMessage(res.message || 'Payment verification failed.')
        }
      } catch (err) {
        setStatus('error')
        setMessage(err.message || 'Error occurred while verifying payment.')
      }
    }

    verify()
  }, [sessionId, clearCart])

  return (
    <div className="pallet-shell">
      <Navbar />
      <main className="pallet-main success-page">
        <div className="success-card">
          {status === 'verifying' && (
            <div className="status-container">
              <div className="loading-spinner"></div>
              <h1>Verifying Payment...</h1>
              <p>Please wait while we confirm your transaction with Stripe.</p>
            </div>
          )}

          {status === 'success' && (
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
          )}

          {status === 'error' && (
            <div className="status-container error-state">
              <div className="error-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <h1>Payment Verification Failed</h1>
              <p>{message}</p>
              <div className="success-actions">
                <Link to="/cart" className="btn-primary">Return to Cart</Link>
                <Link to="/contact" className="btn-outline">Contact Support</Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
