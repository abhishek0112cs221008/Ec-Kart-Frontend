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
