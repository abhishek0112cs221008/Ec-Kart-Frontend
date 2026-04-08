import { getJson } from '../shared/lib/httpClient'
import { normalizeProduct } from '../models/product'

/**
 * Fetch a single product's details by ID.
 * 
 * @param {string} id - The UUID of the product.
 * @returns {Promise<Object>} - Normalized product data.
 */
export async function fetchProductById(id) {
  const response = await getJson(`/api/v1/products/${id}`)
  return normalizeProduct(response)
}

/**
 * Fetch all products.
 * 
 * @returns {Promise<Array>} - Array of all products.
 */
export async function fetchAllProducts() {
  const response = await getJson('/api/v1/products')
  return response.map(normalizeProduct)
}

/**
 * Search products by name using Elasticsearch.
 * 
 * @param {string} name - The product name to search for.
 * @returns {Promise<Array>} - Array of matching products.
 */
export async function searchProductsByName(name) {
  if (!name || name.trim() === '') {
    return []
  }
  try {
    const response = await getJson(`/api/v1/products/search/name?name=${encodeURIComponent(name.trim())}`)
    return response.map(normalizeProduct)
  } catch (err) {
    console.error('Error searching by name:', err)
    return []
  }
}

/**
 * Search products by query (name or description) using Elasticsearch.
 * 
 * @param {string} query - The search query.
 * @returns {Promise<Array>} - Array of matching products.
 */
export async function searchProductsByQuery(query) {
  if (!query || query.trim() === '') {
    return []
  }
  try {
    const response = await getJson(`/api/v1/products/search/query?query=${encodeURIComponent(query.trim())}`)
    return response.map(normalizeProduct)
  } catch (err) {
    console.error('Error searching by query:', err)
    return []
  }
}

/**
 * Search products by category using Elasticsearch.
 * 
 * @param {number} categoryId - The category ID.
 * @returns {Promise<Array>} - Array of products in the category.
 */
export async function searchProductsByCategory(categoryId) {
  try {
    const response = await getJson(`/api/v1/products/search/category/${categoryId}`)
    return response.map(normalizeProduct)
  } catch (err) {
    console.error('Error searching by category:', err)
    return []
  }
}

/**
 * Search products by price range using Elasticsearch.
 * 
 * @param {number} minPrice - Minimum price.
 * @param {number} maxPrice - Maximum price.
 * @returns {Promise<Array>} - Array of products within price range.
 */
export async function searchProductsByPriceRange(minPrice, maxPrice) {
  try {
    const response = await getJson(`/api/v1/products/search/price?minPrice=${minPrice}&maxPrice=${maxPrice}`)
    return response.map(normalizeProduct)
  } catch (err) {
    console.error('Error searching by price range:', err)
    return []
  }
}

/**
 * Search products by target group using Elasticsearch.
 * 
 * @param {string} targetGroup - The target group (e.g., men, women, kids, unisex).
 * @returns {Promise<Array>} - Array of matching products.
 */
export async function searchProductsByTargetGroup(targetGroup) {
  if (!targetGroup || targetGroup.trim() === '') {
    return []
  }
  try {
    const response = await getJson(`/api/v1/products/search/target-group?targetGroup=${encodeURIComponent(targetGroup.trim())}`)
    return response.map(normalizeProduct)
  } catch (err) {
    console.error('Error searching by target group:', err)
    return []
  }
}

/**
 * Search products by minimum rating using Elasticsearch.
 * 
 * @param {number} minRating - Minimum rating (0-5).
 * @returns {Promise<Array>} - Array of products with rating >= minRating.
 */
export async function searchProductsByMinRating(minRating) {
  if (minRating === null || minRating === undefined || minRating < 0 || minRating > 5) {
    return []
  }
  try {
    const response = await getJson(`/api/v1/products/search/rating?minRating=${minRating}`)
    return response.map(normalizeProduct)
  } catch (err) {
    console.error('Error searching by rating:', err)
    return []
  }
}

/**
 * Advanced search with multiple filters using Elasticsearch.
 * 
 * @param {Object} filters - Filter object with optional properties.
 * @param {string} filters.query - Search query (optional).
 * @param {number} filters.categoryId - Category ID (optional).
 * @param {number} filters.minPrice - Minimum price (optional).
 * @param {number} filters.maxPrice - Maximum price (optional).
 * @param {string} filters.targetGroup - Target group (optional).
 * @returns {Promise<Array>} - Array of matching products.
 */
export async function searchProductsAdvanced(filters = {}) {
  try {
    const params = new URLSearchParams()
    
    if (filters.query) params.append('query', filters.query)
    if (filters.categoryId) params.append('categoryId', filters.categoryId)
    if (filters.minPrice !== undefined && filters.minPrice !== null) params.append('minPrice', filters.minPrice)
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) params.append('maxPrice', filters.maxPrice)
    if (filters.targetGroup) params.append('targetGroup', filters.targetGroup)

    const response = await getJson(`/api/v1/products/search/advanced?${params.toString()}`)
    return response.map(normalizeProduct)
  } catch (err) {
    console.error('Error in advanced search:', err)
    return []
  }
}
