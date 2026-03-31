import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import StarRating from './StarRating'

/**
 * Shared ProductCard used on HomePage and ShopPage.
 * Equal-size rectangle cards with hover overlay for cart / wishlist actions.
 */
export default function ProductCard({ product }) {
  const { isLoggedIn } = useAuth()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const navigate = useNavigate()
  const [cartBusy, setCartBusy] = useState(false)
  const [wishBusy, setWishBusy] = useState(false)
  const [flashMsg, setFlashMsg] = useState(null)

  const inWishlist = isInWishlist(product.id)

  const flash = (msg) => {
    setFlashMsg(msg)
    setTimeout(() => setFlashMsg(null), 1800)
  }

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) { navigate('/login'); return }
    setCartBusy(true)
    const result = await addToCart(product.id, 1)
    setCartBusy(false)
    flash(result.success ? 'Added to cart!' : (result.message || 'Out of stock'))
  }

  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) { navigate('/login'); return }
    setWishBusy(true)
    if (inWishlist) {
      await removeFromWishlist(product.id)
      flash('Removed from wishlist')
    } else {
      await addToWishlist(product.id)
      flash('Saved to wishlist!')
    }
    setWishBusy(false)
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="pc-link"
      aria-label={product.name}
    >
      <article className="pc-card">
        {/* Image area */}
        <div className="pc-media">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="pc-img" />
          ) : (
            <div className="pc-placeholder">
              {product.categoryName?.slice(0, 1) || 'P'}
            </div>
          )}

          {/* Hover overlay with action buttons */}
          <div className="pc-overlay">
            <button
              className="pc-action-btn pc-cart-btn"
              onClick={handleAddToCart}
              disabled={cartBusy || product.stock === 0}
              aria-label="Add to cart"
              title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
            >
              {cartBusy ? (
                <span className="pc-spinner" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              )}
              <span className="pc-action-label">
                {product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
              </span>
            </button>

            <button
              className={`pc-action-btn pc-wish-btn ${inWishlist ? 'active' : ''}`}
              onClick={handleWishlistToggle}
              disabled={wishBusy}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {wishBusy ? (
                <span className="pc-spinner" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? '#e11d48' : 'none'} stroke={inWishlist ? '#e11d48' : 'currentColor'} strokeWidth="2.2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              )}
            </button>
          </div>

          {/* Flash feedback */}
          {flashMsg && (
            <div className="pc-flash">{flashMsg}</div>
          )}
        </div>

        {/* Info */}
        <div className="pc-body">
          <p className="pc-category">{product.categoryName}</p>
          <h3 className="pc-name">{product.name}</h3>
          <div className="pc-rating-summary">
            <StarRating rating={product.averageRating || 0} size="sm" />
            {product.reviewCount > 0 && <span className="pc-rating-count">({product.reviewCount})</span>}
          </div>
          <div className="pc-price-row">
            <span className="pc-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
            {inWishlist && (
              <span className="pc-wish-dot" title="In your wishlist" aria-label="In wishlist">♥</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
