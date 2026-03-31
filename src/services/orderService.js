import { getApiBaseUrl } from '../shared/config/api'

const BASE = getApiBaseUrl()

function authHeaders() {
  const token = localStorage.getItem('eckart_token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

/**
 * Create an order from the current user's cart.
 */
export async function createOrder(shippingAddress) {
  const res = await fetch(`${BASE}/api/v1/orders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ shippingAddress }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Failed to create order')
  }
  return res.json()
}

/**
 * Get order details by ID.
 */
export async function getOrder(orderId) {
  const res = await fetch(`${BASE}/api/v1/orders/${orderId}`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Order not found')
  return res.json()
}

/**
 * List orders for the authenticated user (paginated).
 */
export async function listOrders(page = 0, size = 10) {
  const res = await fetch(`${BASE}/api/v1/orders?page=${page}&size=${size}`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json()
}
