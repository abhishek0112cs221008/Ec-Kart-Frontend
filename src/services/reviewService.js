import { getJson, postJson, putJson } from '../shared/lib/httpClient'

/**
 * reviewService.js
 * Handles all product review and rating API interactions.
 */

export const getReviewsByProduct = async (productId) => {
  try {
    return await getJson(`/api/v1/reviews/${productId}`)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

export const postReview = async (productId, rating, comment) => {
  try {
    return await postJson(`/api/v1/reviews/${productId}`, { rating, comment })
  } catch (error) {
    console.error('Error posting review:', error)
    throw error
  }
}

export const updateReview = async (reviewId, rating, comment) => {
  try {
    return await putJson(`/api/v1/reviews/${reviewId}`, { rating, comment })
  } catch (error) {
    console.error('Error updating review:', error)
    throw error
  }
}
