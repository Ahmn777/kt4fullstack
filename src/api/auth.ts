import { api, DEMO_MODE } from './client'
import type { User } from '../types'

type LoginResponse = { accessToken: string; user: User }
const DEMO_USER: User = { id: 'student-1', name: 'Студент', email: 'student@example.com' }

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  if (DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 350))
    if (email.trim().toLowerCase() !== 'student@example.com' || password !== '123456') {
      throw new Error('Неверный email или пароль. Используйте данные для демо-входа.')
    }
    return { accessToken: 'demo-jwt-token', user: DEMO_USER }
  }
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password })
  return data
}
