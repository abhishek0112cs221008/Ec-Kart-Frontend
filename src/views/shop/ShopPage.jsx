import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useShopPageController } from '../../controllers/useShopPageController'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'
import './ShopPage.css'

function ShopPage() {
  const { filteredProducts, categories, status, error, filters } = useShopPageController()
  const { isLoggedIn } = useAuth()
  const isLoading = status === 'loading'

  return (
    <div className="shop-layout-shell">
      <Navbar />

      <main className="shop-container">
        {/* SIDEBAR: Categories & Basic Filters */}
        <aside className="shop-sidebar">
          <div className="sidebar-section">
            <h3>Categories</h3>
            <div className="category-list">
              <button 
                className={`category-btn ${filters.activeCategory === 'All' ? 'active' : ''}`}
                onClick={() => filters.setActiveCategory('All')}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  className={`category-btn ${filters.activeCategory === cat.name ? 'active' : ''}`}
                  onClick={() => filters.setActiveCategory(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Filter by Price</h3>
            <div className="price-filter">
              <input 
                type="range" 
                min="0" 
                max="200000" 
                step="500"
                value={filters.priceRange[1]}
                onChange={(e) => filters.setPriceRange([0, parseInt(e.target.value)])}
                className="price-slider"
              />
              <div className="price-values">
                <span>₹0</span>
                <span>₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {(filters.activeCategory !== 'All' || filters.searchQuery !== '') && (
             <button className="category-btn reset-btn" onClick={filters.resetFilters}>
                &times; Clear All Filters
             </button>
          )}
        </aside>

        {/* MAIN CONTENT: Header + Grid */}
        <section className="shop-content">
          <header className="shop-header">
             <div className="shop-title">
                <h2>{filters.activeCategory === 'All' ? 'All Products' : filters.activeCategory}</h2>
             </div>

             <div className="shop-controls">
                <div className="search-wrapper">
                   <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                   <input 
                      type="text" 
                      className="search-input"
                      placeholder="Search products..." 
                      value={filters.searchQuery}
                      onChange={(e) => filters.setSearchQuery(e.target.value)}
                   />
                </div>

                <select 
                   className="sort-dropdown" 
                   value={filters.sortBy} 
                   onChange={(e) => filters.setSortBy(e.target.value)}
                >
                   <option value="newest">Sort: Newest</option>
                   <option value="price-low">Price: Low to High</option>
                   <option value="price-high">Price: High to Low</option>
                   <option value="name">Name: A-Z</option>
                </select>
             </div>
          </header>

          {error && <div className="error-alert">Failed to load products. please check your connection.</div>}
          
          <div className="shop-grid">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                 <div key={i} className="product-shop-card skeleton-loading" />
              ))
            ) : (
              filteredProducts.length === 0 ? (
                <div className="no-results-box">
                   <h3>No products found</h3>
                   <p>Try adjusting your search or filters.</p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              )
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ShopPage

