import { useEffect, useMemo, useState } from 'react'
import { getHomePageData } from '../services/homeService'

function buildShowcaseSections(products, categories) {
  const groupedProducts = products.reduce((sections, product) => {
    const key = product.categoryName
    if (!sections.has(key)) {
      sections.set(key, [])
    }

    sections.get(key).push(product)
    return sections
  }, new Map())

  return categories
    .map((category) => ({
      id: category.id,
      title: category.name,
      description: category.description,
      products: (groupedProducts.get(category.name) || []).slice(0, 4),
    }))
    .filter((section) => section.products.length > 0)
}

export function useHomePageController() {
  const [state, setState] = useState({
    categories: [],
    products: [],
    status: 'loading',
    error: '',
  })

  useEffect(() => {
    const controller = new AbortController()

    async function loadHomePage() {
      try {
        const data = await getHomePageData(controller.signal)
        setState({
          ...data,
          status: 'ready',
          error: '',
        })
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setState({
          categories: [],
          products: [],
          status: 'error',
          error:
            error.message ||
            'Unable to load the storefront right now. Please check the backend server.',
        })
      }
    }

    loadHomePage()

    return () => controller.abort()
  }, [])

  const viewModel = useMemo(() => {
    const featuredProducts = state.products.slice(0, 5)
    const spotlightDeals = [...state.products]
      .sort((left, right) => left.price - right.price)
      .slice(0, 8)
    const showcaseSections = buildShowcaseSections(state.products, state.categories)

    return {
      ...state,
      featuredProducts,
      spotlightDeals,
      showcaseSections,
      stats: {
        categoryCount: state.categories.length,
        productCount: state.products.length,
      },
    }
  }, [state])

  return viewModel
}
