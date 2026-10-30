import axios from 'axios'

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false'
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kt4_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kt4_access_token')
      window.dispatchEvent(new Event('kt4:unauthorized'))
    }
    return Promise.reject(error)
  },
)
