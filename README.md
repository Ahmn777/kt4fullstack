# КТ 4 — TaskFlow (Fullstack Frontend)

Готовый учебный React + TypeScript проект для пробного демо-экзамена.

## Запуск
1. Установите Node.js LTS (если ещё не установлен).
2. Распакуйте архив и откройте папку `KT4_Fullstack_Exam` в VS Code.
3. Откройте терминал VS Code и выполните:
   ```bash
   npm install
   npm start
   ```
4. Откройте адрес, который покажет терминал (обычно `http://localhost:5173`).

## Демонстрационный вход
- Email: `student@example.com`
- Пароль: `123456`

В демо-режиме приложение запускается без backend-сервера. Задачи сохраняются в браузере, доступны создание, редактирование, удаление, поиск, фильтрация и выход из аккаунта.

## Подключение реального Backend API
В корне проекта создайте файл `.env` на основе `.env.example`:
```env
VITE_DEMO_MODE=false
VITE_API_URL=http://localhost:3000/api
```
Замените URL на адрес, выданный преподавателем, и перезапустите `npm start`.

Ожидаемые маршруты по умолчанию:
- `POST /auth/login` — `{ email, password }`, ответ `{ accessToken, user }`
- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

Если преподаватель выдал другие маршруты или поля, измените их в `src/api/client.ts` и `src/api/tasks.ts`. Точное соответствие индивидуальному ТЗ возможно только после получения адреса API и его документации.

## Что реализовано
- React Router: страницы входа и защищённая панель
- Axios-клиент с JWT Bearer token interceptor и обработкой 401
- PrivateRoute
- Zustand для состояния авторизации и CRUD-задач
- Адаптивная стилизация Tailwind CSS
- Демо-режим с локальным сохранением данных
