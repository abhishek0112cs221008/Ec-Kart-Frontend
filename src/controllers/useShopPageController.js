import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { getJson } from '../shared/lib/httpClient'
import { searchProductsByQuery, searchProductsByCategory, fetchAllProducts } from '../services/productService'

export function useShopPageController() {
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  
  const location = useLocation()

  // Filter State
  const [activeCategory, setActiveCategory] = useState('All')
  const [priceRange, setPriceRange] = useState([0, 200000]) // Max 2L common for INR
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Sync Filters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    
    const q = params.get('search')
    if (q !== null) {
      setSearchQuery(q)
    }

    const cat = params.get('category')
    if (cat !== null) {
      setActiveCategory(cat)
    }
  }, [location.search])

  // Load initial data
  useEffect(() => {
    async function loadShopData() {
      setStatus('loading')
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchAllProducts(),
          getJson('/api/v1/categories')
        ])
        setAllProducts(productsData)
        setCategories(categoriesData)
        setStatus('success')
      } catch (err) {
        console.error('Failed to load shop data:', err)
        setError(err)
        setStatus('error')
      }
    }
    loadShopData()
  }, [])

  // Elasticsearch search effect
  const [searchResults, setSearchResults] = useState(null)
  const [searchStatus, setSearchStatus] = useState('idle')

  useEffect(() => {
    async function performSearch() {
      // No search or category filter
      if (!searchQuery.trim() && activeCategory === 'All') {
        setSearchResults(null)
        setSearchStatus('idle')
        return
      }

      setSearchStatus('loading')
      try {
        let results = []

        // If there's a search query, use Elasticsearch search
        if (searchQuery.trim()) {
          results = await searchProductsByQuery(searchQuery)
        } 
        // If there's a category filter, use the category search
        else if (activeCategory !== 'All') {
          const categoryId = categories.find(cat => cat.name === activeCategory)?.id
          if (categoryId) {
            results = await searchProductsByCategory(categoryId)
          }
        }

        setSearchResults(results)
        setSearchStatus('success')
      } catch (err) {
        console.error('Search error:', err)
        setSearchStatus('error')
      }
    }

    performSearch()
  }, [searchQuery, activeCategory, categories])

  const filteredProducts = useMemo(() => {
    let products = searchResults !== null ? searchResults : allProducts

    // Apply filters
    return products
      .filter(product => {
        const matchesCategory = activeCategory === 'All' || product.categoryName === activeCategory
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
        // Search filter is already applied by Elasticsearch if searchResults is not null
        const matchesSearch = searchResults !== null ? true : product.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesPrice && matchesSearch
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      })
  }, [allProducts, searchResults, activeCategory, priceRange, searchQuery, sortBy])

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen)
  
  const resetFilters = () => {
    setActiveCategory('All')
    setPriceRange([0, 200000])
    setSearchQuery('')
    setSortBy('newest')
  }

  const isLoading = status === 'loading' || searchStatus === 'loading'

  return {
    filteredProducts,
    categories,
    status,
    error,
    isSearching: searchStatus === 'loading',
    filters: {
      activeCategory,
      setActiveCategory,
      priceRange,
      setPriceRange,
      searchQuery,
      setSearchQuery,
      sortBy,
      setSortBy,
      isFilterOpen,
      toggleFilter,
      resetFilters
    }
  }
}
