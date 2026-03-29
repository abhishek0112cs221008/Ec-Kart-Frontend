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
