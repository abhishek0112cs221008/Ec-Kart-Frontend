import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useShopPageController } from '../../controllers/useShopPageController'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'
import logo from '../../assets/logo.png'

function FilterDrawer({ isOpen, toggle, filters, categories }) {
  return (
    <div className={`shop-filter-drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-overlay" onClick={toggle}></div>
      <div className="drawer-content glass-card">
        <div className="drawer-header">
           <h2>Filters</h2>
           <button className="close-drawer" onClick={toggle}>&times;</button>
        </div>

        <div className="filter-group">
           <h3>Categories</h3>
           <div className="category-list">
              <button 
                className={`filter-cat-link ${filters.activeCategory === 'All' ? 'active' : ''}`}
                onClick={() => filters.setActiveCategory('All')}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  className={`filter-cat-link ${filters.activeCategory === cat.name ? 'active' : ''}`}
                  onClick={() => filters.setActiveCategory(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
           </div>
        </div>

        <div className="filter-group">
           <h3>Price Range</h3>
           <div className="price-slider-container">
              <input 
                type="range" 
                min="0" 
                max="200000" 
                step="500"
                value={filters.priceRange[1]}
                onChange={(e) => filters.setPriceRange([0, parseInt(e.target.value)])}
                className="modern-range"
              />
              <div className="price-labels">
                 <span>₹0</span>
                 <span>₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
              </div>
           </div>
        </div>

        <div className="drawer-footer">
           <button className="btn-reset" onClick={filters.resetFilters}>Reset All</button>
           <button className="btn-apply" onClick={toggle}>Apply Filters</button>
        </div>
      </div>
    </div>
  )
}

function ShopPage() {
  const { filteredProducts, categories, status, error, filters } = useShopPageController()
  const { isLoggedIn } = useAuth()
  const isLoading = status === 'loading'

  return (
    <div className="pallet-shell-modern">
      <Navbar />

      <main className="shop-main-modern">
        {/* UNIQUE SHOP HERO */}
        <section className="shop-hero-vibrant">
           <div className="hero-blur-circle-1"></div>
           <div className="hero-blur-circle-2"></div>
           <div className="shop-hero-content">
              <h1>The Collection</h1>
              <p>Discover premium products curated for the modern lifestyle.</p>
           </div>
        </section>

        {/* STICKY GLASS FILTER BAR */}
        <div className="glass-action-bar sticky">
          <div className="action-bar-inner">
             <div className="search-box-glass">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input 
                  type="text" 
                  placeholder="Search masterpieces..." 
                  value={filters.searchQuery}
                  onChange={(e) => filters.setSearchQuery(e.target.value)}
                />
             </div>

             <div className="action-buttons">
                <button className="btn-glass-filter" onClick={filters.toggleFilter}>
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
                   <span>Filters</span>
                </button>

                <select 
                  className="glass-select" 
                  value={filters.sortBy} 
                  onChange={(e) => filters.setSortBy(e.target.value)}
                >
                   <option value="newest">Sort: Newest</option>
                   <option value="price-low">Price: Low to High</option>
                   <option value="price-high">Price: High to Low</option>
                   <option value="name">Name: A-Z</option>
                </select>
             </div>
          </div>
        </div>

        {/* ACTIVE FILTER CHIPS */}
        {(filters.activeCategory !== 'All' || filters.searchQuery !== '') && (
          <div className="active-chips">
             {filters.activeCategory !== 'All' && (
               <span className="filter-chip">
                 {filters.activeCategory}
                 <button onClick={() => filters.setActiveCategory('All')}>&times;</button>
               </span>
             )}
             {filters.searchQuery !== '' && (
               <span className="filter-chip">
                 " {filters.searchQuery} "
                 <button onClick={() => filters.setSearchQuery('')}>&times;</button>
               </span>
             )}
             <button className="clear-all-link" onClick={filters.resetFilters}>Clear all</button>
          </div>
        )}

        {/* MODERN PRODUCT GRID */}
        <section className="product-showcase-modern">
          {error && <div className="error-glass">Something went wrong. Please try again.</div>}
          
          {filteredProducts.length === 0 && !isLoading && (
            <div className="empty-glass-state">
               <img src={logo} alt="No results" className="empty-logo" />
               <h2>No items match your search</h2>
               <p>Try adjusting your filters or search query.</p>
               <button className="btn-signature" onClick={filters.resetFilters}>Reset All Filters</button>
            </div>
          )}

          <div className="modern-grid">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                 <div key={i} className="product-card skeleton" />
              ))
            ) : (
              filteredProducts.map(product => (
                <div key={product.id} className="modern-grid-item fade-in">
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </section>

        {/* BRAND SIGNATURE */}
        <div className="brand-signature">
           <img src={logo} alt="Ec-Kart Logo" className="signature-logo" />
           <p className="signature-text">Curated for Excellence</p>
        </div>
      </main>

      <FilterDrawer 
        isOpen={filters.isFilterOpen} 
        toggle={filters.toggleFilter} 
        filters={filters}
        categories={categories}
      />

      <Footer />
    </div>
  )
}

export default ShopPage
