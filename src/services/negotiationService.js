import { postJson, getJson } from '../shared/lib/httpClient'

export const negotiatePrice = async (productId, message, history = []) => {
    try {
        return await postJson('/api/negotiation/chat', {
            productId,
            message,
            history
        })
    } catch (error) {
        console.error('Negotiation error:', error)
        throw error.message || 'Negotiation failed'
    }
}

export const fetchActiveOffers = async () => {
    try {
        return await getJson('/api/negotiation/active-offers')
    } catch (error) {
        console.error('Error fetching active offers:', error)
        return []
    }
}
