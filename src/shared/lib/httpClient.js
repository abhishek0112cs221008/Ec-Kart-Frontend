import { getApiBaseUrl } from '../config/api'

/**
 * httpClient.js
 * Centralized fetch wrapper for consistent API interaction,
 * error handling, and automatic auth header injection.
 */

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

function getAuthHeaders() {
  const token = localStorage.getItem('eckart_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${path}`

  const headers = {
    Accept: 'application/json',
    ...getAuthHeaders(),
    ...options.headers,
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, { ...options, headers })
  const payload = await parseResponse(response)

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? payload.message
        : 'Request failed'
    throw new Error(message)
  }

  return payload
}

export const getJson = (path, init = {}) => request(path, { ...init, method: 'GET' })

export const postJson = (path, body, init = {}) => request(path, {
  ...init,
  method: 'POST',
  body: body instanceof FormData ? body : JSON.stringify(body)
})

export const putJson = (path, body, init = {}) => request(path, {
  ...init,
  method: 'PUT',
  body: body instanceof FormData ? body : JSON.stringify(body)
})

export const deleteJson = (path, init = {}) => request(path, { ...init, method: 'DELETE' })
