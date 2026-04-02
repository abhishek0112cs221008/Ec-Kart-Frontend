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
 * Create a Razorpay order for a specific order.
 * @param {number} orderId - The ID of the order to pay.
 * @returns {Promise<{razorpayOrderId: string, amount: number, currency: string, keyId: string}>}
 */
export async function createRazorpayOrder(orderId) {
  const res = await fetch(`${BASE}/api/v1/payments/create/${orderId}`, {
    method: 'POST',
    headers: authHeaders(),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Failed to initiate payment')
  }
  return res.json()
}

/**
 * Confirm the payment status of a Razorpay payment via signature verification.
 * @param {object} paymentData - {razorpayPaymentId, razorpayOrderId, razorpaySignature}
 * @returns {Promise<{status: string, message: string}>} - Confirmation result.
 */
export async function confirmPayment(paymentData) {
  const res = await fetch(`${BASE}/api/v1/payments/confirm`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(paymentData),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Failed to confirm payment')
  }
  return res.json()
}

/**
 * Request a refund for a paid order.
 */
export async function refundOrder(orderId, amount = null) {
  const res = await fetch(`${BASE}/api/v1/payments/refund`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ orderId, amount }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Refund request failed')
  }
  return res.json()
}
