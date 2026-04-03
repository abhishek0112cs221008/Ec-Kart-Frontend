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
      className="product-shop-card-link"
      aria-label={product.name}
    >
      <article className="product-shop-card">
        <div className="product-shop-media">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="product-shop-img" />
          ) : (
            <div className="product-shop-placeholder">
              {product.categoryName?.slice(0, 1) || 'P'}
            </div>
          )}
          
          <button
            className={`product-shop-wish-btn ${inWishlist ? 'active' : ''}`}
            onClick={handleWishlistToggle}
            disabled={wishBusy}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? '#e11d48' : 'none'} stroke={inWishlist ? '#e11d48' : 'currentColor'} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        <div className="product-shop-body">
          <h3 className="product-shop-name">{product.name}</h3>
          
          <div className="product-shop-rating">
            <StarRating rating={product.averageRating || 0} size="xs" />
            <span className="product-shop-review-count">
              ({product.reviewCount || 0} Reviews)
            </span>
          </div>

          <div className="product-shop-price-row">
            <span className="product-shop-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="product-shop-stock-low">Only {product.stock} left!</span>
            )}
          </div>

          <button
            className="product-shop-add-btn"
            onClick={handleAddToCart}
            disabled={cartBusy || product.stock === 0}
          >
            {cartBusy ? <span className="loader-sm" /> : (product.stock === 0 ? 'Out of Stock' : 'Add to Cart')}
          </button>
        </div>

        {flashMsg && (
          <div className="product-shop-flash">{flashMsg}</div>
        )}
      </article>
    </Link>

  )
}
