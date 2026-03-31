import { getApiBaseUrl } from '../shared/config/api'

const BASE = getApiBaseUrl()

export async function fetchAddresses() {
  const token = localStorage.getItem('eckart_token')
  const res = await fetch(`${BASE}/api/v1/addresses`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch addresses')
  return res.json()
}

export async function addAddress(addressData) {
  const token = localStorage.getItem('eckart_token')
  const res = await fetch(`${BASE}/api/v1/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  })
  if (!res.ok) throw new Error('Failed to add address')
  return res.json()
}

export async function updateAddress(id, addressData) {
  const token = localStorage.getItem('eckart_token')
  const res = await fetch(`${BASE}/api/v1/addresses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  })
  if (!res.ok) throw new Error('Failed to update address')
  return res.json()
}

export async function deleteAddress(id) {
  const token = localStorage.getItem('eckart_token')
  const res = await fetch(`${BASE}/api/v1/addresses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to delete address')
  return res.json()
}

export async function setDefaultAddress(id) {
  const token = localStorage.getItem('eckart_token')
  const res = await fetch(`${BASE}/api/v1/addresses/${id}/default`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to set default address')
  return res.json()
}
