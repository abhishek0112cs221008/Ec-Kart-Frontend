import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrder } from '../../services/orderService'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './OrderDetailsPage.css'

export default function OrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrderDetails()
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      const data = await getOrder(id)
      setOrder(data)
    } catch (err) {
      setError('Failed to load order details.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="pallet-shell">
      <Navbar />
      <div className="loader-container-full"><div className="spinner"></div></div>
      <Footer />
    </div>
  )

  if (error || !order) return (
    <div className="pallet-shell">
      <Navbar />
      <div className="error-container">
        <h3>{error || 'Order not found'}</h3>
        <Link to="/orders" className="back-btn">Back to Orders</Link>
      </div>
      <Footer />
    </div>
  )

  const steps = [
    { label: 'Ordered', status: ['CREATED', 'PENDING_PAYMENT', 'PAID', 'DELIVERED'] },
    { label: 'Paid', status: ['PAID', 'DELIVERED'] },
    { label: 'Shipped', status: ['SHIPPED', 'DELIVERED'] }, // Note: SHIPPED might not be in backend yet, but good for tracking
    { label: 'Delivered', status: ['DELIVERED'] }
  ]

  const getCurrentStepIndex = () => {
    if (order.status === 'CANCELLED' || order.status === 'FAILED') return -1
    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].status.includes(order.status)) return i
    }
    return 0
  }

  const currentStep = getCurrentStepIndex()

  return (
    <div className="pallet-shell">
      <Navbar />
      
      <main className="pallet-main">
        <div className="order-details-wrapper">
          <div className="order-details-container">
            {/* BREADCRUMB */}
            <div className="order-details-header-actions">
              <div className="order-details-breadcrumb">
                <Link to="/">Home</Link> <span>/</span> <Link to="/profile">My Account</Link> <span>/</span> <Link to="/orders">My Orders</Link> <span>/</span> Order #{order.id}
              </div>
            </div>

            <div className="order-details-card">
              {/* ADDRESS & SUMMARY HEADER */}
              <div className="order-header-info">
                 <div className="delivery-address-section">
                    <h3>Delivery Address</h3>
                    <p className="user-name">{order.user?.firstName} {order.user?.lastName}</p>
                    <p className="address-text">{order.shippingAddress}</p>
                 </div>
                 <div className="order-actions-section">
                    <h3>More Actions</h3>
                    <button className="invoice-btn">Download Invoice</button>
                 </div>
              </div>

              {/* TRACKING STEPPER */}
              <div className="tracking-section">
                 <h3>Order Tracking</h3>
                 {order.status === 'CANCELLED' ? (
                   <div className="cancelled-status">
                      <div className="cancel-icon">✕</div>
                      <p>This order was CANCELLED</p>
                   </div>
                 ) : (
                    <div className="stepper-container">
                      {steps.map((step, index) => (
                        <div key={index} className={`step ${index <= currentStep ? 'active' : ''}`}>
                          <div className="step-circle">
                            {index < currentStep ? '✓' : index + 1}
                          </div>
                          <div className="step-label">{step.label}</div>
                          {index < steps.length - 1 && <div className="step-line"></div>}
                        </div>
                      ))}
                    </div>
                 )}
              </div>

              {/* ITEMS LIST */}
              <div className="order-items-section">
                <h3>Items in this Order</h3>
                <div className="items-list">
                  {order.items.map(item => (
                    <div key={item.id} className="detail-item-card">
                       <div className="item-img">
                         <img src={item.imageUrl || 'https://via.placeholder.com/80'} alt={item.productName} />
                       </div>
                       <div className="item-info">
                          <Link to={`/product/${item.productId}`} className="item-name">{item.productName}</Link>
                          <p className="item-qty">Quantity: {item.quantity}</p>
                       </div>
                       <div className="item-price">
                          <p>${(item.priceAtPurchase * item.quantity).toFixed(2)}</p>
                          <span>(${item.priceAtPurchase.toFixed(2)} each)</span>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOTAL SUMMARY */}
              <div className="order-footer-summary">
                 <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                 </div>
                 <div className="summary-row">
                    <span>Shipping</span>
                    <span className="free">FREE</span>
                 </div>
                 <div className="summary-row total">
                    <span>Total Amount</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
