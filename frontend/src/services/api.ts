import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_PAYLOAD_URL || 'http://localhost:3000'
const API_PATH = import.meta.env.VITE_API_PATH || import.meta.env.VITE_PAYLOAD_API_PATH || '/api'

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

function ensureLeadingSlash(value: string): string {
  return value.startsWith('/') ? value : `/${value}`
}

function buildApiBaseURL(url: string, apiPath: string): string {
  const normalizedPath = ensureLeadingSlash(trimTrailingSlash(apiPath))

  if (!url.trim()) return normalizedPath

  return `${trimTrailingSlash(url)}${normalizedPath}`
}

const api = axios.create({
  baseURL: buildApiBaseURL(API_URL, API_PATH),
})

export { API_URL }
export default api
