import { api, DEMO_MODE } from './client'
import type { Task } from '../types'

const KEY = 'kt4_tasks'
const seed: Task[] = [
  { id: 't1', title: 'Подключить API-клиент', description: 'Настроить Axios и обработку ошибок сервера.', status: 'Готово', priority: 'Высокий', dueDate: '2026-10-27', createdAt: '2026-10-20' },
  { id: 't2', title: 'Реализовать авторизацию', description: 'Вход, JWT-токен и защищённый маршрут.', status: 'В работе', priority: 'Высокий', dueDate: '2026-10-28', createdAt: '2026-10-21' },
  { id: 't3', title: 'Проверить мобильную версию', description: 'Убедиться, что интерфейс удобен на телефоне.', status: 'Запланировано', priority: 'Средний', dueDate: '2026-10-30', createdAt: '2026-10-22' },
]

function readDemo(): Task[] {
  const saved = localStorage.getItem(KEY)
  if (!saved) { localStorage.setItem(KEY, JSON.stringify(seed)); return seed }
  try { return JSON.parse(saved) as Task[] } catch { return seed }
}
function saveDemo(tasks: Task[]) { localStorage.setItem(KEY, JSON.stringify(tasks)) }

export async function getTasks(): Promise<Task[]> {
  if (DEMO_MODE) return readDemo()
  const { data } = await api.get<Task[]>('/tasks')
  return data
}
export async function createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  if (!DEMO_MODE) { const { data } = await api.post<Task>('/tasks', task); return data }
  const created: Task = { ...task, id: crypto.randomUUID(), createdAt: new Date().toISOString().slice(0, 10) }
  saveDemo([created, ...readDemo()])
  return created
}
export async function updateTask(id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> {
  if (!DEMO_MODE) { const { data } = await api.patch<Task>(`/tasks/${id}`, changes); return data }
  const updated = readDemo().map((task) => task.id === id ? { ...task, ...changes } : task)
  saveDemo(updated)
  const result = updated.find((task) => task.id === id)
  if (!result) throw new Error('Задача не найдена')
  return result
}
export async function deleteTask(id: string): Promise<void> {
  if (!DEMO_MODE) { await api.delete(`/tasks/${id}`); return }
  saveDemo(readDemo().filter((task) => task.id !== id))
}
