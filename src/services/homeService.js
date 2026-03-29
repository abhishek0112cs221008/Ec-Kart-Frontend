import { normalizeCategory } from '../models/category'
import { normalizeProduct } from '../models/product'
import { getJson } from '../shared/lib/httpClient'

export async function getHomePageData(signal) {
  const [categoriesResponse, productsResponse] = await Promise.all([
    getJson('/api/v1/categories', { signal }),
    getJson('/api/v1/products', { signal }),
  ])

  const categories = Array.isArray(categoriesResponse)
    ? categoriesResponse.map((category, index) => normalizeCategory(category, index))
    : []

  const products = Array.isArray(productsResponse)
    ? productsResponse.map(normalizeProduct).filter((product) => product.active)
    : []

  return { categories, products }
}
