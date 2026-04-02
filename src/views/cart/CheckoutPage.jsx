import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { fetchAddresses } from '../../services/addressService'
import { createOrder } from '../../services/orderService'
import { createCheckoutSession } from '../../services/paymentService'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './CheckoutPage.css'

export default function CheckoutPage() {
  const { cartItems, totalPrice, loading: cartLoading } = useCart()
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (cartItems.length === 0 && !cartLoading) {
      navigate('/cart')
    }
    loadAddresses()
  }, [cartItems, cartLoading, navigate])

  const loadAddresses = async () => {
    try {
      const data = await fetchAddresses()
      setAddresses(data)
      const defaultAddr = data.find(a => a.isDefault) || data[0]
      if (defaultAddr) setSelectedAddressId(defaultAddr.id)
    } catch (err) {
      console.error('Failed to load addresses:', err)
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select a shipping address')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const address = addresses.find(a => a.id === selectedAddressId)
      const addressString = `${address.streetAddress}, ${address.city}, ${address.state} - ${address.zipCode}, ${address.country}`
      
      // 1. Create Order
      const order = await createOrder(addressString)
      
      // 2. Create Payment Session
      const session = await createCheckoutSession(order.id)
      
      // 3. Redirect to Stripe
      window.location.href = session.url
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const tax = totalPrice * 0.18
  const shipping = totalPrice > 500 ? 0 : 49
  const grandTotal = totalPrice + tax + shipping

  if (cartItems.length === 0 && !cartLoading) return null

  return (
    <div className="pallet-shell">
      <Navbar />
      
      <main className="pallet-main checkout-container">
        <div className="checkout-header">
          <Link to="/cart" className="back-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Cart
          </Link>
          <h1 className="checkout-title">Secure Checkout</h1>
          <div className="checkout-steps">
            <div className="step active"><span>1</span> Address</div>
            <div className="step-sep"></div>
            <div className="step"><span>2</span> Review</div>
            <div className="step-sep"></div>
            <div className="step"><span>3</span> Payment</div>
          </div>
        </div>

        <div className="checkout-layout">
          {/* Left Column: Address Selection */}
          <div className="checkout-main-col">
            <section className="checkout-section">
              <div className="section-header">
                <h2>Shipping Address</h2>
                <Link to="/profile" className="btn-text">Manage Addresses</Link>
              </div>

              {addresses.length === 0 ? (
                <div className="no-address-card">
                  <p>No addresses found.</p>
                  <Link to="/profile" className="btn-outline">Add New Address</Link>
                </div>
              ) : (
                <div className="address-grid">
                  {addresses.map((addr) => (
                    <div 
                      key={addr.id} 
                      className={`address-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddressId(addr.id)}
                    >
                      <div className="address-card-header">
                        <span className="address-type">{addr.addressType || 'Home'}</span>
                        {selectedAddressId === addr.id && <span className="selected-badge">Selected</span>}
                      </div>
                      <p className="address-name">{addr.fullName || 'User'}</p>
                      <p className="address-details">
                        {addr.streetAddress}<br/>
                        {addr.city}, {addr.state} - {addr.zipCode}<br/>
                        {addr.country}
                      </p>
                      <p className="address-phone">{addr.phoneNumber}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="checkout-section">
              <div className="section-header">
                <h2>Review Items</h2>
              </div>
              <div className="checkout-items">
                {cartItems.map((item) => (
                  <div key={item.productId} className="checkout-item">
                    <img src={item.imageUrl} alt={item.productName} className="checkout-item-img" />
                    <div className="checkout-item-info">
                      <h3>{item.productName}</h3>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="checkout-item-price">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="checkout-sidebar">
            <div className="order-summary-card">
              <h3>Order Summary</h3>
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping Fee</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="summary-row">
                  <span>Estimated Tax (GST 18%)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>

              {error && <div className="checkout-error">{error}</div>}

              <button 
                className="btn-primary checkout-pay-btn"
                onClick={handlePlaceOrder}
                disabled={loading || addresses.length === 0}
              >
                {loading ? 'Processing...' : 'Place Order & Pay Now'}
                {!loading && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>}
              </button>

              <div className="checkout-security">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Secure 256-bit SSL encrypted payment
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
