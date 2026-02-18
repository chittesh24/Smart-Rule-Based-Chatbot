/**
 * API Service for Chatbot Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const API_VERSION = '/api/v1'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
    throw new ApiError(error.detail || 'Request failed', response.status)
  }
  return response.json()
}

/**
 * Send a chat message
 */
export const sendMessage = async (message, sessionId = null) => {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      session_id: sessionId
    })
  })
  return handleResponse(response)
}

/**
 * Create a new session
 */
export const createSession = async () => {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return handleResponse(response)
}

/**
 * Get conversation history
 */
export const getHistory = async (sessionId, limit = 50) => {
  const response = await fetch(
    `${API_BASE_URL}${API_VERSION}/history/${sessionId}?limit=${limit}`
  )
  return handleResponse(response)
}

/**
 * Clear conversation history
 */
export const clearHistory = async (sessionId) => {
  const response = await fetch(
    `${API_BASE_URL}${API_VERSION}/history/${sessionId}`,
    {
      method: 'DELETE'
    }
  )
  if (!response.ok && response.status !== 204) {
    throw new ApiError('Failed to clear history', response.status)
  }
  return true
}

/**
 * Get analytics for a session
 */
export const getAnalytics = async (sessionId) => {
  const response = await fetch(
    `${API_BASE_URL}${API_VERSION}/analytics/${sessionId}`
  )
  return handleResponse(response)
}

/**
 * Get available intents
 */
export const getIntents = async () => {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/intents`)
  return handleResponse(response)
}

/**
 * Reload chatbot rules
 */
export const reloadRules = async () => {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/reload-rules`, {
    method: 'POST'
  })
  return handleResponse(response)
}

/**
 * Health check
 */
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/health`)
  return handleResponse(response)
}

export default {
  sendMessage,
  createSession,
  getHistory,
  clearHistory,
  getAnalytics,
  getIntents,
  reloadRules,
  healthCheck
}
