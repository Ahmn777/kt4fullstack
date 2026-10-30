export type User = { id: string; name: string; email: string }
export type TaskStatus = 'В работе' | 'Готово' | 'Запланировано'
export type TaskPriority = 'Высокий' | 'Средний' | 'Низкий'
export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  createdAt: string
}
