import { getApiBaseUrl } from '../shared/config/api'

const BASE = getApiBaseUrl()

function getHeaders() {
  const token = localStorage.getItem('eckart_token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

// Seller Requests
export async function fetchPendingSellerRequests() {
  const res = await fetch(`${BASE}/api/v1/seller/seller-requests`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error('Failed to load seller requests')
  return res.json()
}

export async function approveSellerRequest(id) {
  const res = await fetch(`${BASE}/api/v1/seller/approve/${id}`, {
    method: 'POST',
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error('Failed to approve request')
  return res.json()
}

export async function rejectSellerRequest(id, reason) {
  const url = `${BASE}/api/v1/seller/reject/${id}${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error('Failed to reject request')
  return res.json()
}

// Category Management
export async function createCategory(categoryData) {
  const res = await fetch(`${BASE}/api/v1/categories`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(categoryData),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to create category')
  return data
}

export async function updateCategory(id, categoryData) {
  const res = await fetch(`${BASE}/api/v1/categories/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(categoryData),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to update category')
  return data
}

export async function deleteCategory(id) {
  const res = await fetch(`${BASE}/api/v1/categories/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to delete category')
  return data
}

// User Management
export async function fetchAllUsers() {
  const res = await fetch(`${BASE}/api/v1/auth/dev/users`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error('Failed to load user list')
  return res.json()
}
