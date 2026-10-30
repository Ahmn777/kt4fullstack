import { create } from 'zustand'
import type { Task } from '../types'
import * as taskApi from '../api/tasks'

type TaskState = {
  tasks: Task[]
  loading: boolean
  error: string
  loadTasks: () => Promise<void>
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>
  editTask: (id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>
  removeTask: (id: string) => Promise<void>
}
export const useTaskStore = create<TaskState>((set) => ({
  tasks: [], loading: false, error: '',
  loadTasks: async () => {
    set({ loading: true, error: '' })
    try { set({ tasks: await taskApi.getTasks(), loading: false }) }
    catch { set({ loading: false, error: 'Не удалось загрузить данные. Проверьте Backend API.' }) }
  },
  addTask: async (task) => {
    try { const created = await taskApi.createTask(task); set((state) => ({ tasks: [created, ...state.tasks], error: '' })) }
    catch { set({ error: 'Не удалось создать задачу.' }); throw new Error('create failed') }
  },
  editTask: async (id, changes) => {
    try { const updated = await taskApi.updateTask(id, changes); set((state) => ({ tasks: state.tasks.map((t) => t.id === id ? updated : t), error: '' })) }
    catch { set({ error: 'Не удалось обновить задачу.' }); throw new Error('update failed') }
  },
  removeTask: async (id) => {
    try { await taskApi.deleteTask(id); set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id), error: '' })) }
    catch { set({ error: 'Не удалось удалить задачу.' }); throw new Error('delete failed') }
  },
}))
