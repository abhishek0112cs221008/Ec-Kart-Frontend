import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { getJson } from '../shared/lib/httpClient'

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

  useEffect(() => {
    async function loadShopData() {
      setStatus('loading')
      try {
        const [productsData, categoriesData] = await Promise.all([
          getJson('/api/v1/products'),
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

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter(product => {
        const matchesCategory = activeCategory === 'All' || product.categoryName === activeCategory
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesPrice && matchesSearch
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      })
  }, [allProducts, activeCategory, priceRange, searchQuery, sortBy])

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen)
  
  const resetFilters = () => {
    setActiveCategory('All')
    setPriceRange([0, 200000])
    setSearchQuery('')
    setSortBy('newest')
  }

  return {
    filteredProducts,
    categories,
    status,
    error,
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
