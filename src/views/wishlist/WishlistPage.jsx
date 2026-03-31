import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './WishlistPage.css'

export default function WishlistPage() {
  const { wishlistItems, loading, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)
  const [movingId, setMovingId] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleRemove = async (productId, productName) => {
    await removeFromWishlist(productId)
    showToast(`${productName} removed from wishlist`)
  }

  const handleMoveToCart = async (item) => {
    setMovingId(item.id)
    const result = await addToCart(item.id, 1)
    if (result.success) {
      await removeFromWishlist(item.id)
      showToast(`${item.name} moved to cart!`)
    } else {
      showToast(result.message || 'Failed to move to cart', 'error')
    }
    setMovingId(null)
  }

  const handleClearAll = async () => {
    if (!window.confirm('Remove all items from wishlist?')) return
    await clearWishlist()
    showToast('Wishlist cleared')
  }

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
        <div className="wishlist-page-wrapper">
          {/* Header */}
          <div className="wishlist-page-header">
            <div className="cart-breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span>Wishlist</span>
            </div>
            <div className="wishlist-title-row">
              <h1 className="wishlist-page-title">
                My Wishlist
                {wishlistItems.length > 0 && (
                  <span className="cart-item-count">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}</span>
                )}
              </h1>
              {wishlistItems.length > 0 && (
                <button className="wishlist-clear-btn" onClick={handleClearAll} disabled={loading}>
                  Clear All
                </button>
              )}
            </div>
          </div>

          {wishlistItems.length === 0 ? (
            /* Empty State */
            <div className="wishlist-empty-state">
              <div className="wishlist-empty-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <h2>Your wishlist is empty</h2>
              <p>Save items you love and come back to them anytime.</p>
              <Link to="/shop" className="btn-primary wishlist-empty-cta">Explore Products</Link>
            </div>
          ) : (
            <>
              {/* Move all to cart */}
              <div className="wishlist-bulk-actions">
                <p className="wishlist-bulk-hint">You can move individual items to your cart or browse to add more.</p>
                <Link to="/cart" className="wishlist-view-cart-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  View Cart
                </Link>
              </div>

              {/* Grid */}
              <div className="wishlist-grid">
                {wishlistItems.map((item) => (
                  <div key={item.id} className={`wishlist-card ${movingId === item.id ? 'moving' : ''}`}>
                    {/* Remove heart button */}
                    <button
                      className="wishlist-heart-btn"
                      onClick={() => handleRemove(item.id, item.name)}
                      disabled={loading}
                      aria-label="Remove from wishlist"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#e11d48" stroke="#e11d48" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>

                    {/* Product image */}
                    <Link to={`/product/${item.id}`} className="wishlist-card-img-link">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="wishlist-card-img" />
                      ) : (
                        <div className="wishlist-card-placeholder">
                          {item.name?.charAt(0)}
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="wishlist-card-body">
                      <Link to={`/product/${item.id}`} className="wishlist-card-name">
                        {item.name}
                      </Link>
                      {item.description && (
                        <p className="wishlist-card-desc">{item.description}</p>
                      )}
                      <p className="wishlist-card-price">
                        ₹{Number(item.price).toLocaleString('en-IN')}
                      </p>

                      <button
                        className="wishlist-move-btn"
                        onClick={() => handleMoveToCart(item)}
                        disabled={loading || movingId === item.id}
                        id={`move-to-cart-${item.id}`}
                      >
                        {movingId === item.id ? (
                          'Moving…'
                        ) : (
                          <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                            Move to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/shop" className="cart-continue-link" style={{ marginTop: '2rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Continue Shopping
              </Link>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
