import { postJson } from '../shared/lib/httpClient'

/**
 * aiService.js
 * Handles AI-powered features like review summarization.
 */

export const summarizeReviews = async (reviews) => {
  if (!reviews || reviews.length === 0) return null
  
  try {
    // Collect all review comments to send to AI
    const reviewTexts = reviews.map(r => r.comment).filter(Boolean)
    if (reviewTexts.length === 0) return null
    
    return await postJson('/api/v1/ai/summarize-reviews', { reviews: reviewTexts })
  } catch (error) {
    console.error('Error summarizing reviews:', error)
    // Return null so the UI can gracefully skip the summary card
    return null
  }
}
