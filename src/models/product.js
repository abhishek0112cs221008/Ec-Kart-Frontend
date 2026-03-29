function toNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function inferProductBadge(product) {
  if (product.stock === 0) {
    return 'Out of stock'
  }

  if (product.stock <= 5) {
    return 'Selling fast'
  }

  return 'In stock'
}

export function normalizeProduct(product) {
  const priceValue = toNumber(product.price)
  const originalPrice = Math.round(priceValue * 1.18)

  return {
    id: product.id,
    name: product.name || 'Untitled product',
    description: product.description || 'No product description available.',
    price: priceValue,
    originalPrice,
    imageUrl: product.imageUrl || '',
    categoryId: product.categoryId,
    categoryName: product.categoryName || 'Trending picks',
    stock: product.stock ?? 0,
    active: product.active !== false,
    badge: inferProductBadge(product),
    sellerName: product.sellerName || '',
    sellerEmail: product.sellerEmail || '',
  }
}
