import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { searchProductsByQuery } from '../services/productService'
import './SearchSuggestions.css'

export default function SearchSuggestions({ query, onClose }) {
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const suggestionsRef = useRef(null)
  const navigate = useNavigate()

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        performSearch()
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const performSearch = async () => {
    setIsLoading(true)
    setHighlightedIndex(-1)
    try {
      const results = await searchProductsByQuery(query)
      setSuggestions(results.slice(0, 8)) // Limit to 8 suggestions
    } catch (err) {
      console.error('Search error:', err)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleProductClick = (productId, productName) => {
    navigate(`/product/${productId}`)
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault()
      const product = suggestions[highlightedIndex]
      handleProductClick(product.id, product.name)
    }
  }

  if (!query.trim()) {
    return null
  }

  return (
    <div 
      className="search-suggestions"
      ref={suggestionsRef}
      onKeyDown={handleKeyDown}
    >
      {isLoading && (
        <div className="suggestions-loading">
          <div className="spinner"></div>
          <span>Searching...</span>
        </div>
      )}

      {!isLoading && suggestions.length > 0 && (
        <div className="suggestions-list">
          {suggestions.map((product, index) => (
            <div
              key={product.id}
              className={`suggestion-item ${highlightedIndex === index ? 'highlighted' : ''}`}
              onClick={() => handleProductClick(product.id, product.name)}
            >
              <div className="suggestion-image">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="suggestion-content">
                <div className="suggestion-name">{product.name}</div>
                <div className="suggestion-meta">
                  <span className="suggestion-category">{product.categoryName}</span>
                  <span className="suggestion-price">₹{product.price?.toLocaleString('en-IN')}</span>
                </div>
                {product.averageRating > 0 && (
                  <div className="suggestion-rating">
                    <span className="stars">★</span>
                    <span className="rating-value">{product.averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="suggestion-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
          ))}
          <Link 
            to={`/shop?search=${encodeURIComponent(query.trim())}`}
            className="suggestions-view-all"
            onClick={onClose}
          >
            View all results for "{query}"
          </Link>
        </div>
      )}

      {!isLoading && suggestions.length === 0 && query.trim().length > 0 && (
        <div className="suggestions-empty">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p>No products found for "{query}"</p>
          <Link 
            to={`/shop?search=${encodeURIComponent(query.trim())}`}
            className="suggestions-search-link"
            onClick={onClose}
          >
            Search in all products
          </Link>
        </div>
      )}
    </div>
  )
}
