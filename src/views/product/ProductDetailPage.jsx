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
import AiAssistant from '../../components/AiAssistant'
import PriceNegotiator from '../../components/PriceNegotiator'
import { fetchActiveOffers } from '../../services/negotiationService'
import './ProductDetailPage.css'

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
  const [isNegotiatorOpen, setIsNegotiatorOpen] = useState(false)
  const [negotiatedPrice, setNegotiatedPrice] = useState(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        const data = await fetchProductById(id)
        setProduct(data)

        // Load active negotiated offers if logged in
        if (isLoggedIn) {
          const offers = await fetchActiveOffers()
          if (Array.isArray(offers)) {
            const activeOffer = offers.find(o => o.product?.id == id)
            if (activeOffer) {
              setNegotiatedPrice(activeOffer.negotiatedPrice)
            }
          }
        }

        loadReviews()
      } catch (err) {
        setError(err.message || 'Product not found')
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id, isLoggedIn])

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

  const inWishlist = product && id ? isInWishlist(id) : false
  const getStarDistribution = () => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    if (Array.isArray(reviews)) {
      reviews.forEach(r => {
        if (dist[r.rating] !== undefined) dist[r.rating]++
      })
    }
    return dist
  }

  const starDist = getStarDistribution()

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

  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 4

  const totalReviewsArray = Array.isArray(reviews) ? reviews : []
  const totalPages = Math.ceil(totalReviewsArray.length / reviewsPerPage)
  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = totalReviewsArray.slice(indexOfFirstReview, indexOfLastReview)

  const scrollToAssistant = () => {
    const el = document.getElementById('ai-assistant-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
          )}
          {toast.msg}
        </div>
      )}

      <main className="pallet-main">
        <article className="pallet-single-plate animate-fadeIn">
          {/* VISUALS: Smaller and Integrated */}
          <div className="plate-visuals">
            <div className="plate-image-box">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className="plate-placeholder-img">{product.categoryName?.slice(0, 1)}</div>
              )}
            </div>

            <div className="plate-trust-row">
              <div className="trust-pill small" title="Identity Verified">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <span>Verified</span>
              </div>
              <div className="trust-pill small" title="Carbon Neutral">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                <span>Neutral</span>
              </div>
            </div>
          </div>

          {/* CONTENT: High-Density Text */}
          <div className="plate-content">
            <nav className="plate-breadcrumbs">
              <Link to="/shop">Shop</Link> <span>/</span> <span className="active">{product.categoryName}</span>
            </nav>

            <h2 className="plate-product-title">{product.name}</h2>

            <div className="plate-rating-row">
              <StarRating rating={product.averageRating || 0} size="sm" count={product.reviewCount || 0} />
            </div>

            <div className="plate-price-stack">
              {negotiatedPrice ? (
                <div className="price-deal">
                  <span className="price-old">₹{product.price?.toLocaleString('en-IN')}</span>
                  <span className="price-current">₹{negotiatedPrice?.toLocaleString('en-IN')}</span>
                  <span className="price-badge">AI Deal</span>
                </div>
              ) : (
                <span className="price-current">₹{product.price?.toLocaleString('en-IN')}</span>
              )}
            </div>

            <div className="plate-seller-mini">
              <div className="seller-avatar-sm">{product.sellerName?.slice(0, 1) || 'E'}</div>
              <span className="seller-label">By <strong>{product.sellerName || 'Ec-Kart'}</strong></span>
            </div>

            <p className="plate-desc-compact">{product.description || 'Premium lifestyle selection.'}</p>

            <div className="plate-actions-compact">
              <div className="qty-stepper-mini">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1 || product.stock === 0}>−</button>
                <span>{product.stock === 0 ? 0 : quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))} disabled={product.stock === 0 || quantity >= (product.stock || 99)}>+</button>
              </div>

              <button
                className={`btn-wishlist-mini-glass ${inWishlist ? 'active' : ''}`}
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                style={{ background: 'white', border: '1px solid #000' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? '#000000' : 'none'} stroke="#000000" strokeWidth="2.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </article>

        {/* NEW 3-TIER CUSTOMER EXPERIENCE (REVIEWS) */}
        <section className="product-reviews-section">
          <div className="section-header">
            <h2 className="title-modern">Customer Experience</h2>
          </div>

          <div className="reviews-custom-grid">
            {/* TIER 1: Visual Rating Graph (Distribution) */}
            <div className="graph-reviews-tier animate-fadeInUp">
              <h3>Rating Distribution</h3>
              <div className="rating-bars-container">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = starDist[star] || 0
                  const percent = totalReviewsArray.length > 0 ? (count / totalReviewsArray.length) * 100 : 0
                  return (
                    <div key={star} className="rating-bar-row">
                      <span className="star-label">{star} ★</span>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="count-label">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* TIER 2: AI Summarizer + Post Form (Side-by-Side Flex) */}
            <div className="middle-flex-tier animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="ai-summary-block">
                <AiAssistant reviews={reviews} />
              </div>

              <div className="post-review-block">
                <div className="add-review-box-compact">
                  <h3>Post Your Review</h3>
                  {isLoggedIn ? (
                    <form className="add-review-form-compact" onSubmit={handlePostReview}>
                      <StarRating
                        rating={newReview.rating}
                        editable={true}
                        size="sm"
                        onRate={(r) => setNewReview(prev => ({ ...prev, rating: r }))}
                      />
                      <textarea
                        placeholder="What's your story?"
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        required
                      />
                      <button type="submit" className="btn-primary-compact" disabled={submittingReview}>
                        {submittingReview ? 'Posting...' : 'Share Experience'}
                      </button>
                    </form>
                  ) : (
                    <div className="login-to-post">
                      <p>Sign in to contribute</p>
                      <Link to="/login" className="btn-text">Log In</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TIER 3: Paged Comments */}
            <div className="bottom-comments-tier animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="list-header">
                <h3>Customer Comments <span>({reviews.length})</span></h3>
              </div>

              <div className="reviews-list-paged">
                {reviewsLoading ? (
                  <div className="reviews-empty">Loading testimonials...</div>
                ) : currentReviews.length > 0 ? (
                  currentReviews.map(rev => (
                    <div key={rev.id} className="review-item-minimal">
                      <div className="review-meta-compact">
                        <span className="reviewer-name">{rev.userFullName} {isLoggedIn && currentUser?.id === rev.userId && " (You)"}</span>
                        <div className="review-meta-right">
                          <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                          {isLoggedIn && currentUser?.id === rev.userId && (
                            <button className="btn-edit-minimal" onClick={() => startEditing(rev)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                            </button>
                          )}
                        </div>
                      </div>

                      {editingId === rev.id ? (
                        <form className="edit-review-form-minimal" onSubmit={handleUpdateReview}>
                          <StarRating
                            rating={editForm.rating}
                            editable={true}
                            size="sm"
                            onRate={(r) => setEditForm(prev => ({ ...prev, rating: r }))}
                          />
                          <textarea
                            value={editForm.comment}
                            onChange={(e) => setEditForm(prev => ({ ...prev, comment: e.target.value }))}
                            required
                          />
                          <div className="edit-actions">
                            <button type="submit" className="btn-save-minimal" disabled={submittingUpdate}>
                              {submittingUpdate ? 'Saving...' : 'Save'}
                            </button>
                            <button type="button" className="btn-cancel-minimal" onClick={() => setEditingId(null)}>Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <StarRating rating={rev.rating} size="sm" />
                          <p className="review-text">{rev.comment}</p>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="reviews-empty-minimal">No commentary yet.</div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="review-pagination">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn-page"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>
                  <span className="page-indicator">{currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="btn-page"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom Action Bar */}
      <div className="product-bottom-bar animate-slideInUp">
        <div className="bottom-bar-content">
          <div className="bottom-bar-left">
            <button className="btn-bottom-icon" title="Summarize Reviews" onClick={scrollToAssistant}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
              <span>AI</span>
            </button>
            <button className="btn-bottom-icon" title="Price Negotiation" onClick={() => setIsNegotiatorOpen(true)} disabled={product.stock === 0}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M12 11h.01M8 11h.01M16 11h.01" />
              </svg>
              <span>Deal</span>
            </button>
            <button className={`btn-bottom-icon ${inWishlist ? 'active' : ''}`} title="Add to Wishlist" onClick={handleWishlistToggle} disabled={wishlistLoading}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? '#000000' : 'none'} stroke="#000000" strokeWidth="3">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>Like</span>
            </button>
          </div>

          <div className="bottom-bar-divider" />

          <div className="bottom-bar-right">
            <div className="bottom-price-info">
              <span className="bottom-price-val">₹{(negotiatedPrice || product.price)?.toLocaleString('en-IN')}</span>
              <span className="bottom-price-label">{negotiatedPrice ? 'Negotiated Deal' : 'Listed Price'}</span>
            </div>
            <button
              className="btn-bottom-primary monochrome-btn"
              onClick={handleAddToCart}
              disabled={cartLoading || product.stock === 0}
              title={product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
            >
              {cartLoading ? (
                <span className="btn-loader-mini" />
              ) : product.stock === 0 ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <Footer />

      <PriceNegotiator
        isOpen={isNegotiatorOpen}
        onClose={() => setIsNegotiatorOpen(false)}
        product={product}
        onAcceptPrice={(price) => {
          setNegotiatedPrice(price)
          // Show some feedback - this depends on whether you have a toast system
          alert(`Deal Accepted! Negotiated Price: ₹${price.toLocaleString('en-IN')}`)
        }}
      />
    </div>
  )
}

export default ProductDetailPage
