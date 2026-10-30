import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { CheckCircle2, LockKeyhole, ListTodo, Sparkles } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const { login, loading, error, isAuthenticated, clearError } = useAuthStore()
  const [email, setEmail] = useState('student@example.com')
  const [password, setPassword] = useState('123456')
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  async function submit(e: FormEvent) {
    e.preventDefault()
    await login(email, password)
  }
  return (
    <main className="min-h-screen bg-[#f6f7fb] p-4 flex items-center justify-center">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[30px] bg-white shadow-xl shadow-slate-200/70 md:grid-cols-2">
        <section className="hidden min-h-[600px] flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-10 text-white md:flex">
          <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/15 p-3"><ListTodo size={25}/></div><span className="text-xl font-bold tracking-tight">TaskFlow</span></div>
          <div><div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm"><Sparkles size={15}/> Пространство для продуктивности</div><h1 className="max-w-md text-4xl font-bold leading-tight">Планы становятся результатами.</h1><p className="mt-4 max-w-sm text-base leading-7 text-indigo-100">Управляйте задачами, отслеживайте прогресс и держите важное под контролем.</p><div className="mt-8 space-y-3 text-sm text-indigo-50"><p className="flex items-center gap-2"><CheckCircle2 size={17}/> Все задачи в одном месте</p><p className="flex items-center gap-2"><CheckCircle2 size={17}/> Понятные статусы и приоритеты</p><p className="flex items-center gap-2"><CheckCircle2 size={17}/> Доступ с любого устройства</p></div></div>
          <p className="text-xs text-indigo-200">КТ 4 · Fullstack Frontend · Учебный проект</p>
        </section>
        <section className="flex items-center px-6 py-10 sm:px-12 md:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-8 flex items-center gap-3 md:hidden"><div className="rounded-xl bg-indigo-600 p-2.5 text-white"><ListTodo size={22}/></div><span className="text-xl font-bold">TaskFlow</span></div>
            <div className="mb-8"><p className="text-sm font-semibold text-indigo-600">С возвращением!</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Войти в аккаунт</h2><p className="mt-2 text-sm leading-6 text-slate-500">Введите данные, чтобы продолжить работу с задачами.</p></div>
            <form onSubmit={submit} className="space-y-5">
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Email</span><input required type="email" value={email} onChange={e=>{setEmail(e.target.value);clearError()}} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100" placeholder="you@example.com"/></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Пароль</span><div className="relative"><LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input required type="password" value={password} onChange={e=>{setPassword(e.target.value);clearError()}} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100" placeholder="Введите пароль"/></div></label>
              {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
              <button disabled={loading} className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-70">{loading ? 'Входим…' : 'Войти в систему'}</button>
            </form>
            <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4"><p className="text-xs font-bold uppercase tracking-wider text-indigo-700">Данные для демо-входа</p><p className="mt-2 text-sm text-slate-700">Email: <b>student@example.com</b></p><p className="mt-1 text-sm text-slate-700">Пароль: <b>123456</b></p></div>
            <p className="mt-7 text-center text-xs text-slate-400">Учебный проект · КТ 4</p>
          </div>
        </section>
      </div>
    </main>
  )
}
