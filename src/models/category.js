const CATEGORY_EMOJIS = [
  '🛍️',
  '📱',
  '💻',
  '👗',
  '🏠',
  '🎧',
  '⌚',
  '🧴',
]

function pickCategoryVisual(index) {
  return CATEGORY_EMOJIS[index % CATEGORY_EMOJIS.length]
}

export function normalizeCategory(category, index = 0) {
  return {
    id: category.id,
    name: category.name || 'Category',
    description: category.description || 'Explore curated picks in this section.',
    icon: pickCategoryVisual(index),
    productCount: Array.isArray(category.products) ? category.products.length : 0,
    subCategories: Array.isArray(category.subCategories)
      ? category.subCategories.map((item, nestedIndex) =>
          normalizeCategory(item, index + nestedIndex + 1),
        )
      : [],
  }
}
