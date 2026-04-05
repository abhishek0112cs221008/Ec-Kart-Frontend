import { getApiBaseUrl } from '../shared/config/api'

const BASE = getApiBaseUrl()

export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Login failed')
  return data // { token, refreshToken, ... }
}

export async function registerUser({ firstName, lastName, email, password, role }) {
  const form = new FormData()
  form.append('firstName', firstName)
  form.append('lastName', lastName)
  form.append('email', email)
  form.append('password', password)
  form.append('role', role)

  const res = await fetch(`${BASE}/api/v1/auth/register`, {
    method: 'POST',
    body: form,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Registration failed')
  return data
}

export async function fetchCurrentUser() {
  const token = localStorage.getItem('eckart_token')
  const res = await fetch(`${BASE}/api/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Failed to fetch user profile')
  return res.json()
}
export async function updateProfile(firstName, lastName, phoneNumber, file) {
  const token = localStorage.getItem('eckart_token')
  const formData = new FormData()
  if (firstName) formData.append('firstName', firstName)
  if (lastName) formData.append('lastName', lastName)
  if (phoneNumber) formData.append('phoneNumber', phoneNumber)
  if (file) formData.append('file', file)

  const res = await fetch(`${BASE}/api/v1/auth/update-profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to update profile')
  return data
}

export async function forgotPassword(email) {
  const res = await fetch(`${BASE}/api/v1/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Forgot password request failed')
  return data
}

export async function resetPassword({ email, otp, newPassword }) {
  const res = await fetch(`${BASE}/api/v1/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, newPassword }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Reset password failed')
  return data
}
