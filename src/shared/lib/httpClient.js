import { getApiBaseUrl } from '../config/api'

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export async function getJson(path, init = {}) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...init.headers,
    },
    ...init,
  })

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
