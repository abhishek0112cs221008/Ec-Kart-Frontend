import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchProductById } from '../../services/productService'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import StarRating from '../../components/StarRating'
import { getReviewsByProduct, postReview, updateReview } from '../../services/reviewService'

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, user: currentUser } = useAuth()
  const { addToCart, loading: cartLoading } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist, loading: wishlistLoading } = useWishlist()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' })
  const [submittingUpdate, setSubmittingUpdate] = useState(false)

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        const data = await fetchProductById(id)
        setProduct(data)
        loadReviews()
      } catch (err) {
        setError(err.message || 'Product not found')
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  const loadReviews = async () => {
    setReviewsLoading(true)
    try {
      const data = await getReviewsByProduct(id)
      setReviews(data)
    } catch (err) {
      console.error(err)
    } finally {
      setReviewsLoading(false)
    }
  }

  const handlePostReview = async (e) => {
    e.preventDefault()
    if (!newReview.comment.trim()) return
    setSubmittingReview(true)
    try {
      await postReview(id, newReview.rating, newReview.comment)
      showToast('Review posted successfully!')
      setNewReview({ rating: 5, comment: '' })
      loadReviews()
      // Optional: Refresh product to update average rating
      const updatedProduct = await fetchProductById(id)
      setProduct(updatedProduct)
    } catch (err) {
      showToast(err.message || 'Failed to post review', 'error')
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleUpdateReview = async (e) => {
    e.preventDefault()
    if (!editForm.comment.trim()) return
    setSubmittingUpdate(true)
    try {
      await updateReview(editingId, editForm.rating, editForm.comment)
      showToast('Review updated!')
      setEditingId(null)
      loadReviews()
      const updatedProduct = await fetchProductById(id)
      setProduct(updatedProduct)
    } catch (err) {
      showToast(err.message || 'Failed to update', 'error')
    } finally {
      setSubmittingUpdate(false)
    }
  }

  const startEditing = (review) => {
    setEditingId(review.id)
    setEditForm({ rating: review.rating, comment: review.comment })
  }

  const getStarDistribution = () => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(r => {
      if (dist[r.rating] !== undefined) dist[r.rating]++
    })
    return dist
  }

  const starDist = getStarDistribution()
  const totalReviews = reviews.length

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const handleAddToCart = async () => {
    if (!isLoggedIn) { navigate('/login'); return }
    const result = await addToCart(id, quantity)
    if (result.success) showToast('Added to cart!')
    else showToast(result.message || 'Failed to add', 'error')
  }

  const handleWishlistToggle = async () => {
    if (!isLoggedIn) { navigate('/login'); return }
    const inWishlist = isInWishlist(id)
    const result = inWishlist ? await removeFromWishlist(id) : await addToWishlist(id)
    if (result.success) showToast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!')
    else showToast(result.message || 'Failed', 'error')
  }

  const inWishlist = product ? isInWishlist(id) : false

  if (loading) {
    return (
      <div className="pallet-shell">
        <Navbar />
        <main className="pallet-main">
          <div className="skeleton-detail">
            <div className="skeleton-left"></div>
            <div className="skeleton-right"></div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="pallet-shell">
        <main className="pallet-main">
          <div className="error-banner">{error || 'Product not found'}</div>
          <button className="btn-primary" onClick={() => navigate('/')}>Return Home</button>
        </main>
      </div>
    )
  }

  return (
    <div className="pallet-shell">
      <Navbar />

      {/* Toast notification */}
      {toast && (
        <div className={`detail-toast ${toast.type}`}>
          {toast.type === 'success' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          )}
          {toast.msg}
        </div>
      )}

      <main className="pallet-main">
        <div className="product-pallet-detail">
          <section className="detail-visuals">
            <div className="pallet-image-box">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className="pallet-placeholder-img">{product.categoryName?.slice(0, 1)}</div>
              )}
            </div>

            {/* Quantity selector */}
            <div className="detail-qty-row">
              <span className="detail-qty-label">Quantity</span>
              <div className="detail-qty-stepper">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))} disabled={quantity >= (product.stock || 99)}>+</button>
              </div>
            </div>

            <div className="pallet-action-group">
              <button
                className="btn-primary"
                style={{ flex: 2 }}
                onClick={handleAddToCart}
                disabled={cartLoading || product.stock === 0}
                id="add-to-cart-btn"
              >
                {cartLoading ? 'Adding…' : product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
              </button>
              <button
                className={`btn-wishlist-toggle ${inWishlist ? 'in-wishlist' : ''}`}
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                id="wishlist-toggle-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? '#e11d48' : 'none'} stroke={inWishlist ? '#e11d48' : 'currentColor'} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
          </section>

          <section className="detail-content">
            <nav className="pallet-breadcrumbs">
              <Link to="/">Home</Link> / <span>{product.categoryName}</span>
            </nav>
            
            <h1 className="pallet-product-title">{product.name}</h1>
            <div className="pallet-rating-header">
              <StarRating rating={product.averageRating || 0} count={product.reviewCount || 0} />
            </div>
            <p className="pallet-seller-tag">
              Curated by <strong>{product.sellerName || 'Ec-Kart Brand'}</strong>
              <span className="seller-rating-badge">
                <StarRating rating={product.sellerRating || 0} size="sm" />
              </span>
            </p>

            <div className="pallet-price-box">
               <span className="pallet-price">₹{product.price?.toLocaleString('en-IN')}</span>
            </div>

            <div className="pallet-divider" />

            <div className="pallet-description">
               <h3>About this piece</h3>
               <p>{product.description || 'No description provided for this premium item.'}</p>
            </div>

            <div className="pallet-metadata">
               <div className="metadata-item">
                  <strong>Stock</strong>
                  <span className={product.stock <= 5 ? 'stock-low' : ''}>{product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}</span>
               </div>
               <div className="metadata-item">
                  <strong>Category</strong>
                  <span>{product.categoryName}</span>
               </div>
            </div>

            {/* Quick links */}
            {isLoggedIn && (
              <div className="detail-quick-links">
                <Link to="/cart" className="detail-ql-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  View Cart
                </Link>
                <Link to="/wishlist" className="detail-ql-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  My Wishlist
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* Reviews Section */}
        <section className="product-reviews-section">
          <div className="section-header">
            <h2>Customer Reviews</h2>
            <div className="pallet-divider" />
          </div>

          <div className="reviews-summary-wrapper">
             <div className="reviews-summary-main">
                 <div className="overall-rating-card-premium">
                    <div className="overall-circle-wrapper">
                       <svg className="overall-ring-svg" width="140" height="140" viewBox="0 0 140 140">
                          <circle className="overall-ring-bg" cx="70" cy="70" r="62" />
                          <circle 
                            className={`overall-ring-fill level-${Math.round(product.averageRating || 0)}`} 
                            cx="70" cy="70" r="62" 
                            strokeDasharray={2 * Math.PI * 62}
                            strokeDashoffset={(2 * Math.PI * 62) - ((product.averageRating || 0) / 5) * (2 * Math.PI * 62)}
                          />
                       </svg>
                       <div className="overall-content">
                          <span className="big-rating-number">{(product.averageRating || 0).toFixed(1)}</span>
                          <StarRating rating={product.averageRating || 0} size="sm" />
                       </div>
                    </div>
                    <p className="overall-based-on">Based on <strong>{totalReviews}</strong> verified reviews</p>
                 </div>
                
                <div className="rating-distribution-circles">
                    {[5, 4, 3, 2, 1].map(star => {
                       const count = starDist[star] || 0
                       const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                       const labels = { 5: 'Excellent', 4: 'Good', 3: 'Average', 2: 'Below Average', 1: 'Poor' }
                       
                       // SVG Circle properties
                       const radius = 32
                       const circumference = 2 * Math.PI * radius
                       const offset = circumference - (percent / 100) * circumference

                       return (
                         <div key={star} className="rating-circle-item">
                            <div className="circle-container">
                               <svg className="rating-svg" width="76" height="76" viewBox="0 0 80 80">
                                  <circle 
                                    className="rating-circle-bg" 
                                    cx="40" cy="40" r={radius} 
                                  />
                                  <circle 
                                    className={`rating-circle-fill level-${star}`} 
                                    cx="40" cy="40" r={radius} 
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                  />
                               </svg>
                               <div className="circle-content">
                                  <span className="star-val">{star}</span>
                                  <span className="star-icon">★</span>
                               </div>
                            </div>
                            <div className="circle-info">
                               <p className="circle-label">{labels[star]}</p>
                               <span className="circle-count">{count} {count === 1 ? 'review' : 'reviews'} ({percent.toFixed(0)}%)</span>
                            </div>
                         </div>
                       )
                    })}
                 </div>
             </div>
          </div>

          <div className="reviews-grid">
            {/* Review List */}
            <div className="reviews-list">
              {reviewsLoading ? (
                <div className="reviews-empty">Loading reviews...</div>
              ) : reviews.length > 0 ? (
                reviews.map(rev => (
                  <div key={rev.id} className="review-item">
                    {editingId === rev.id ? (
                      <form className="edit-review-form" onSubmit={handleUpdateReview}>
                        <StarRating 
                          rating={editForm.rating} 
                          editable={true} 
                          size="sm"
                          onRate={(r) => setEditForm(prev => ({...prev, rating: r}))} 
                        />
                        <textarea 
                          value={editForm.comment}
                          onChange={(e) => setEditForm(prev => ({...prev, comment: e.target.value}))}
                          required
                        />
                        <div className="edit-actions">
                          <button type="button" className="btn-text" onClick={() => setEditingId(null)}>Cancel</button>
                          <button type="submit" className="btn-primary-sm" disabled={submittingUpdate}>
                            {submittingUpdate ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="review-meta">
                          <div className="review-author-info">
                            <strong>{rev.userFullName}</strong>
                            {isLoggedIn && (currentUser?.id === rev.userId || currentUser?.email === rev.userEmail) && (
                              <div className="own-review-container">
                                <span className="own-badge-dot" />
                                <span className="own-badge-text">Your Review</span>
                              </div>
                            )}
                          </div>
                          <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="review-stars-row">
                           <StarRating rating={rev.rating} size="sm" />
                           {isLoggedIn && (currentUser?.id === rev.userId || currentUser?.email === rev.userEmail) && (
                             <button className="btn-edit-premium" onClick={() => startEditing(rev)} aria-label="Edit Review">
                               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                 <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                 <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                               </svg>
                               <span>Edit</span>
                             </button>
                           )}
                        </div>
                        <p className="review-comment">{rev.comment}</p>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="reviews-empty">No reviews yet. Be the first to share your thoughts!</div>
              )}
            </div>

            {/* Add Review Post Section */}
            <div className="add-review-box">
              <h3>Share your experience</h3>
              {isLoggedIn ? (
                <form className="add-review-form" onSubmit={handlePostReview}>
                  <div className="form-group">
                    <label>Rating</label>
                    <StarRating 
                      rating={newReview.rating} 
                      editable={true} 
                      onRate={(r) => setNewReview(prev => ({...prev, rating: r}))} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Comment</label>
                    <textarea 
                      placeholder="What did you like or dislike about this product?" 
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({...prev, comment: e.target.value}))}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={submittingReview}
                  >
                    {submittingReview ? 'Posting...' : 'Post Review'}
                  </button>
                </form>
              ) : (
                <div className="login-to-review">
                  <p>Please log in to write a review.</p>
                  <Link to="/login" className="btn-secondary">Sign In</Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ProductDetailPage
