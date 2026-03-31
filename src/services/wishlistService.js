import { getApiBaseUrl } from '../shared/config/api'

const BASE = getApiBaseUrl()

function authHeaders() {
  const token = localStorage.getItem('eckart_token')
  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function getWishlist() {
  const res = await fetch(`${BASE}/api/v1/wishlist`, { headers: authHeaders() })
  if (!res.ok) throw new Error('Failed to fetch wishlist')
  return res.json()
}

export async function addToWishlist(productId) {
  const res = await fetch(`${BASE}/api/v1/wishlist/add/${productId}`, {
    method: 'POST',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to add to wishlist')
  return res.json()
}

export async function removeFromWishlist(productId) {
  const res = await fetch(`${BASE}/api/v1/wishlist/remove/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to remove from wishlist')
  return res.json()
}

export async function clearWishlist() {
  const res = await fetch(`${BASE}/api/v1/wishlist/clear`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to clear wishlist')
  return res.json()
}
