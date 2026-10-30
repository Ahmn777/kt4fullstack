import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Check, CirclePlus, ClipboardList, Clock3, LogOut, Search, SlidersHorizontal, Trash2, Pencil, X, ListTodo, CalendarDays, Sparkles } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTaskStore } from '../store/taskStore'
import { DEMO_MODE } from '../api/client'
import type { Task, TaskPriority, TaskStatus } from '../types'

const emptyForm = { title: '', description: '', status: 'Запланировано' as TaskStatus, priority: 'Средний' as TaskPriority, dueDate: '' }
const statusStyle: Record<TaskStatus, string> = {
  'Готово': 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  'В работе': 'bg-blue-50 text-blue-700 ring-blue-600/10',
  'Запланировано': 'bg-slate-100 text-slate-600 ring-slate-500/10',
}
const priorityStyle: Record<TaskPriority, string> = {
  'Высокий': 'bg-rose-50 text-rose-700',
  'Средний': 'bg-amber-50 text-amber-700',
  'Низкий': 'bg-teal-50 text-teal-700',
}
export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const { tasks, loading, error, loadTasks, addTask, editTask, removeTask } = useTaskStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Все')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { void loadTasks() }, [loadTasks])
  const filtered = useMemo(() => tasks.filter(t => (filter === 'Все' || t.status === filter) && `${t.title} ${t.description}`.toLowerCase().includes(search.toLowerCase())), [tasks, filter, search])
  const completed = tasks.filter(t => t.status === 'Готово').length
  const inProgress = tasks.filter(t => t.status === 'В работе').length
  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormError(''); setModal(true) }
  const openEdit = (task: Task) => { setEditing(task); setForm({ title: task.title, description: task.description, status: task.status, priority: task.priority, dueDate: task.dueDate }); setFormError(''); setModal(true) }
  async function submit(e: FormEvent) {
    e.preventDefault(); setFormError('')
    if (!form.title.trim()) { setFormError('Введите название задачи.'); return }
    setSaving(true)
    try {
      const payload = { ...form, title: form.title.trim(), description: form.description.trim() }
      if (editing) await editTask(editing.id, payload); else await addTask(payload)
      setModal(false)
    } catch { setFormError('Не удалось сохранить. Попробуйте ещё раз.') }
    finally { setSaving(false) }
  }
  async function remove(task: Task) {
    if (window.confirm(`Удалить задачу «${task.title}»?`)) await removeTask(task.id)
  }
  async function toggleDone(task: Task) {
    await editTask(task.id, { status: task.status === 'Готово' ? 'В работе' : 'Готово' })
  }
  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-indigo-600 p-2.5 text-white shadow-md shadow-indigo-200"><ListTodo size={22}/></div><div><p className="text-lg font-bold tracking-tight text-slate-900">TaskFlow</p><p className="hidden text-xs text-slate-500 sm:block">Управление задачами</p></div></div>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-slate-800">{user?.name || 'Студент'}</p><p className="text-xs text-slate-500">{user?.email}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">{(user?.name || 'С').slice(0,1).toUpperCase()}</div><button onClick={logout} title="Выйти" className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"><LogOut size={18}/></button></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600"><Sparkles size={16}/> Ваш рабочий день</div><h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Мои задачи</h1><p className="mt-2 text-sm text-slate-500">Планируйте, выполняйте и отмечайте результат.</p></div><button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"><CirclePlus size={19}/> Новая задача</button></div>
        {DEMO_MODE && <div className="mb-6 flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4 text-sm text-indigo-900"><div className="rounded-lg bg-white p-2 text-indigo-600"><Check size={18}/></div><div><p className="font-semibold">Демонстрационный режим активен</p><p className="mt-1 leading-5 text-indigo-800">Все CRUD-операции работают и сохраняются в этом браузере. Для подключения сервера настройте файл .env — инструкция есть в README.</p></div></div>}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat title="Всего задач" value={tasks.length} note="В вашем списке" icon={<ClipboardList size={20}/>} tint="indigo"/>
          <Stat title="В работе" value={inProgress} note="Требуют внимания" icon={<Clock3 size={20}/>} tint="blue"/>
          <Stat title="Завершено" value={completed} note={tasks.length ? `${Math.round(completed / tasks.length * 100)}% от всех задач` : 'Пока нет завершённых'} icon={<Check size={20}/>} tint="green"/>
          <Stat title="Запланировано" value={tasks.filter(t=>t.status==='Запланировано').length} note="Следующие шаги" icon={<CalendarDays size={20}/>} tint="amber"/>
        </section>
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-lg font-bold text-slate-900">Список задач</h2><p className="mt-1 text-sm text-slate-500">Найдено: {filtered.length}</p></div><div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1 sm:min-w-64"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск по задачам..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"/></div><div className="relative"><SlidersHorizontal size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><select value={filter} onChange={e=>setFilter(e.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm font-medium outline-none focus:border-indigo-400 sm:w-auto"><option>Все</option><option>Запланировано</option><option>В работе</option><option>Готово</option></select></div></div></div>
          {error && <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          {loading ? <div className="py-16 text-center text-sm text-slate-500">Загружаем задачи…</div> : filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"><ClipboardList size={22}/></div><p className="font-semibold text-slate-800">Задачи не найдены</p><p className="mt-1 text-sm text-slate-500">Измените фильтр или создайте новую задачу.</p><button onClick={openCreate} className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800">+ Создать задачу</button></div> :
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map(task => <article key={task.id} className="group flex min-h-[220px] flex-col rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/50">
            <div className="flex items-start justify-between gap-3"><div className="flex flex-wrap gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyle[task.status]}`}>{task.status}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyle[task.priority]}`}>{task.priority} приоритет</span></div><div className="flex gap-1 opacity-100 transition sm:opacity-70 sm:group-hover:opacity-100"><button onClick={()=>openEdit(task)} title="Редактировать" className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"><Pencil size={16}/></button><button onClick={()=>void remove(task)} title="Удалить" className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={16}/></button></div></div>
            <h3 className={`mt-4 text-base font-bold ${task.status==='Готово'?'text-slate-400 line-through':'text-slate-900'}`}>{task.title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{task.description || 'Описание не добавлено.'}</p>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-xs text-slate-400">{task.dueDate ? `Срок: ${new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('ru-RU')}` : 'Без срока'}</span><button onClick={()=>void toggleDone(task)} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${task.status==='Готово'?'bg-slate-100 text-slate-600 hover:bg-slate-200':'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>{task.status==='Готово'?'Вернуть в работу':<><Check size={14}/> Завершить</>}</button></div>
          </article>)}</div>}
        </section>
        <footer className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-slate-400 sm:flex-row"><span>TaskFlow · КТ 4 · Fullstack Frontend</span><span>React · TypeScript · Axios · Zustand · Tailwind CSS</span></footer>
      </main>
      {modal && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="my-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"><div className="mb-6 flex items-start justify-between"><div><p className="text-sm font-semibold text-indigo-600">{editing?'Изменение задачи':'Новая запись'}</p><h2 id="modal-title" className="mt-1 text-2xl font-bold text-slate-900">{editing?'Редактировать задачу':'Создать задачу'}</h2></div><button onClick={()=>setModal(false)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={20}/></button></div>
        <form onSubmit={submit} className="space-y-4"><label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Название *</span><input autoFocus required maxLength={100} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Например, подготовить отчёт" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"/></label><label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Описание</span><textarea rows={3} maxLength={500} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Кратко опишите задачу..." className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"/></label><div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Статус</span><select value={form.status} onChange={e=>setForm({...form,status:e.target.value as TaskStatus})} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-400"><option>Запланировано</option><option>В работе</option><option>Готово</option></select></label><label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Приоритет</span><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value as TaskPriority})} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-400"><option>Высокий</option><option>Средний</option><option>Низкий</option></select></label></div><label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Срок выполнения</span><input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400"/></label>{formError && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{formError}</p>}<div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={()=>setModal(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Отмена</button><button disabled={saving} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">{saving?'Сохраняем…':editing?'Сохранить изменения':'Создать задачу'}</button></div></form>
      </div></div>}
    </div>
  )
}
function Stat({title,value,note,icon,tint}:{title:string;value:number;note:string;icon:React.ReactNode;tint:'indigo'|'blue'|'green'|'amber'}) {
  const styles = {indigo:'bg-indigo-50 text-indigo-600',blue:'bg-blue-50 text-blue-600',green:'bg-emerald-50 text-emerald-600',amber:'bg-amber-50 text-amber-600'}
  return <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">{title}</p><div className={`rounded-xl p-2.5 ${styles[tint]}`}>{icon}</div></div><p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-400">{note}</p></div>
}
