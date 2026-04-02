import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './CartPage.css'

export default function CartPage() {
  const { cartItems, totalPrice, loading, updateQuantity, removeFromCart, clearCart } = useCart()
  const { addToWishlist } = useWishlist()
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)
  const [removingId, setRemovingId] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleQtyChange = async (productId, newQty) => {
    if (newQty < 1) return
    await updateQuantity(productId, newQty)
  }

  const handleRemove = async (productId) => {
    setRemovingId(productId)
    await removeFromCart(productId)
    setRemovingId(null)
    showToast('Item removed from cart')
  }

  const handleSaveForLater = async (item) => {
    await addToWishlist(item.productId)
    await removeFromCart(item.productId)
    showToast(`${item.productName} saved to wishlist!`)
  }

  const handleClearCart = async () => {
    if (!window.confirm('Clear all items from cart?')) return
    await clearCart()
    showToast('Cart cleared')
  }

  const tax = totalPrice * 0.18
  const shipping = totalPrice > 500 ? 0 : 49
  const grandTotal = totalPrice + tax + shipping

  return (
    <div className="pallet-shell">
      <Navbar />

      {toast && (
        <div className={`detail-toast ${toast.type}`}>
          {toast.type === 'success'
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          }
          {toast.msg}
        </div>
      )}

      <main className="pallet-main">
        <div className="cart-page-wrapper">
          {/* Page header */}
          <div className="cart-page-header">
            <div className="cart-breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span>Shopping Cart</span>
            </div>
            <h1 className="cart-page-title">
              Your Cart
              {cartItems.length > 0 && <span className="cart-item-count">{cartItems.reduce((s, i) => s + i.quantity, 0)} items</span>}
            </h1>
          </div>

          {cartItems.length === 0 ? (
            /* Empty State */
            <div className="cart-empty-state">
              <div className="cart-empty-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added anything yet. Explore our collection!</p>
              <Link to="/shop" className="btn-primary cart-empty-cta">Browse Products</Link>
            </div>
          ) : (
            <div className="cart-layout">
              {/* Items column */}
              <div className="cart-items-col">
                <div className="cart-items-header">
                  <span>Product</span>
                  <button className="cart-clear-btn" onClick={handleClearCart} disabled={loading}>
                    Clear Cart
                  </button>
                </div>

                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className={`cart-item-card ${removingId === item.productId ? 'removing' : ''}`}
                    >
                      {/* Product image */}
                      <Link to={`/product/${item.productId}`} className="cart-item-img-link">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.productName} className="cart-item-img" />
                        ) : (
                          <div className="cart-item-img-placeholder">
                            {item.productName?.charAt(0)}
                          </div>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="cart-item-info">
                        <Link to={`/product/${item.productId}`} className="cart-item-name">
                          {item.productName}
                        </Link>
                        <p className="cart-item-unit-price">₹{Number(item.price).toLocaleString('en-IN')} / unit</p>
                        <div className="cart-item-actions">
                          <button
                            className="cart-action-link"
                            onClick={() => handleSaveForLater(item)}
                            disabled={loading}
                          >
                            Save for later
                          </button>
                          <span className="cart-action-sep">·</span>
                          <button
                            className="cart-action-link cart-action-remove"
                            onClick={() => handleRemove(item.productId)}
                            disabled={loading}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Qty stepper */}
                      <div className="cart-qty-stepper">
                        <button
                          onClick={() => handleQtyChange(item.productId, item.quantity - 1)}
                          disabled={loading || item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >−</button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQtyChange(item.productId, item.quantity + 1)}
                          disabled={loading}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>

                      {/* Line total */}
                      <div className="cart-item-total">
                        ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue shopping */}
                <Link to="/shop" className="cart-continue-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Continue Shopping
                </Link>
              </div>

              {/* Summary column */}
              <aside className="cart-summary-col">
                <div className="cart-summary-card">
                  <h2 className="cart-summary-title">Order Summary</h2>

                  <div className="cart-summary-rows">
                    <div className="cart-summary-row">
                      <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                      <span>₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="cart-summary-row">
                      <span>GST (18%)</span>
                      <span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="cart-summary-row">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'cart-free-ship' : ''}>
                        {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="cart-free-ship-hint">Add ₹{(500 - totalPrice).toLocaleString('en-IN', { maximumFractionDigits: 0 })} more for free shipping</p>
                    )}
                  </div>

                  <div className="cart-summary-divider" />

                  <div className="cart-summary-total">
                    <span>Total</span>
                    <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  <button
                    className="btn-primary cart-checkout-btn"
                    id="proceed-to-checkout-btn"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>

                  <p className="cart-secure-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Secure checkout · 256-bit SSL
                  </p>

                  <Link to="/wishlist" className="cart-wishlist-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    View Wishlist
                  </Link>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
