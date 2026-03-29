import { getApiBaseUrl } from '../shared/config/api'

const BASE = getApiBaseUrl()

function authHeaders() {
  const token = localStorage.getItem('eckart_token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

function authHeadersFormData() {
  const token = localStorage.getItem('eckart_token')
  return { Authorization: `Bearer ${token}` }
}

// Fetch seller's own products
export async function fetchMyProducts() {
  const res = await fetch(`${BASE}/api/v1/products/my`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to load products')
  return res.json()
}

// Fetch all categories (public)
export async function fetchCategories() {
  const res = await fetch(`${BASE}/api/v1/categories`)
  if (!res.ok) throw new Error('Failed to load categories')
  return res.json()
}

// Create a product (multipart)
export async function createProduct(fields, imageFile) {
  const form = new FormData()
  Object.entries(fields).forEach(([k, v]) => form.append(k, v))
  if (imageFile) form.append('file', imageFile)

  const res = await fetch(`${BASE}/api/v1/products`, {
    method: 'POST',
    headers: authHeadersFormData(),
    body: form,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to create product')
  return data
}

// Update a product (multipart)
export async function updateProduct(id, fields, imageFile) {
  const form = new FormData()
  Object.entries(fields).forEach(([k, v]) => { if (v !== '' && v != null) form.append(k, v) })
  if (imageFile) form.append('file', imageFile)

  const res = await fetch(`${BASE}/api/v1/products/${id}`, {
    method: 'PUT',
    headers: authHeadersFormData(),
    body: form,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to update product')
  return data
}

// Delete a product
export async function deleteProduct(id) {
  const res = await fetch(`${BASE}/api/v1/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to delete product')
  return res.json()
}
