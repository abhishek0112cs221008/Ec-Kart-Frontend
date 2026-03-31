import { getApiBaseUrl } from '../shared/config/api'

const BASE = getApiBaseUrl()

function authHeaders() {
  const token = localStorage.getItem('eckart_token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function getCart() {
  const res = await fetch(`${BASE}/api/v1/cart`, { headers: authHeaders() })
  if (!res.ok) throw new Error('Failed to fetch cart')
  return res.json()
}

export async function addToCart(productId, quantity = 1) {
  const res = await fetch(`${BASE}/api/v1/cart/add`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ productId, quantity }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Failed to add to cart')
  }
  return res.json()
}

export async function updateCartItem(productId, quantity) {
  const res = await fetch(`${BASE}/api/v1/cart/update`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ productId, quantity }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Failed to update cart')
  }
  return res.json()
}

export async function removeFromCart(productId) {
  const res = await fetch(`${BASE}/api/v1/cart/remove/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to remove from cart')
  return res.json()
}

export async function clearCart() {
  const res = await fetch(`${BASE}/api/v1/cart/clear`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to clear cart')
  return res.json()
}
