import { create } from 'zustand'
import type { User } from '../types'
import { loginRequest } from '../api/auth'

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}
const savedUser = localStorage.getItem('kt4_user')
const hasToken = Boolean(localStorage.getItem('kt4_access_token'))
let parsedUser: User | null = null
try { parsedUser = savedUser ? JSON.parse(savedUser) as User : null } catch { parsedUser = null }

export const useAuthStore = create<AuthState>((set) => ({
  user: hasToken ? parsedUser : null,
  isAuthenticated: hasToken && Boolean(parsedUser),
  loading: false,
  error: '',
  login: async (email, password) => {
    set({ loading: true, error: '' })
    try {
      const result = await loginRequest(email, password)
      localStorage.setItem('kt4_access_token', result.accessToken)
      localStorage.setItem('kt4_user', JSON.stringify(result.user))
      set({ user: result.user, isAuthenticated: true, loading: false, error: '' })
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Не удалось войти' })
    }
  },
  logout: () => {
    localStorage.removeItem('kt4_access_token')
    localStorage.removeItem('kt4_user')
    set({ user: null, isAuthenticated: false, error: '' })
  },
  clearError: () => set({ error: '' }),
}))

window.addEventListener('kt4:unauthorized', () => {
  localStorage.removeItem('kt4_user')
  useAuthStore.getState().logout()
})
