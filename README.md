# pelis.app

Aplicación full stack para gestionar un **catálogo de películas**. Cualquiera puede ver el catálogo,
buscar y filtrar; los usuarios con rol **admin** pueden crear, editar y eliminar películas y cambiar
el rol de otros usuarios.

Trabajo práctico de Programación Web Full Stack, basado en el repositorio de la materia
([T-Arias/mdw-2026](https://github.com/T-Arias/mdw-2026)).

## Links

| | URL |
|---|---|
| Frontend (Render Static Site) | https://pelis-app-v5d0.onrender.com |
| Backend (Render Web Service) | https://pelis-app-api.onrender.com |

> El backend está en el plan free de Render: si estuvo sin uso, el primer request tarda ~50 segundos.

## Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| admin | `admin@pelis.app` | `COMPLETAR` |
| user | `user@pelis.app` | `COMPLETAR` |

## La entidad: `Movie`

| Campo | Tipo | Reglas |
|---|---|---|
| `title` | texto | obligatorio, máx. 120 caracteres |
| `director` | texto | obligatorio, máx. 80 caracteres |
| `genre` | texto (enum) | uno de: Acción, Animación, Ciencia ficción, Comedia, Documental, Drama, Fantasía, Romance, Suspenso, Terror |
| `releaseDate` | fecha | obligatoria, formato `AAAA-MM-DD` |
| `durationMinutes` | número entero | 1 a 600 |
| `rating` | número | 0 a 10 |
| `isFeatured` | booleano | `false` por defecto |
| `synopsis` | texto | opcional, máx. 1000 caracteres |
| `posterUrl` | texto (URL) | opcional |

Además Mongo agrega `_id`, `createdAt` y `updatedAt`.

## Stack

- **Backend:** Node 22 · Express 5 · TypeScript · MongoDB (Atlas) + Mongoose · Zod · Better Auth (email/contraseña + GitHub + Google, plugin `admin` para roles)
- **Frontend:** React 19 · Vite · TypeScript · React Router 7 · Redux Toolkit + RTK Query · React Hook Form + Zod · Tailwind CSS 4
- **Deploy:** Render (backend como Web Service, frontend como Static Site)

## Estructura

```
backend/
  src/
    config/        conexión a Mongo
    constants/     géneros, límites y paginación
    controllers/   capa HTTP (req -> service -> status + JSON)
    lib/           Better Auth, helpers
    middlewares/   authMiddleware, requireRole, validateBody/validateQuery (Zod)
    models/        modelo Mongoose de Movie
    routes/        /api/movies
    schemas/       schemas de Zod (crear, editar, listar)
    services/      lógica de negocio y acceso a datos
  scripts/seed.ts  crea los usuarios de prueba y películas de ejemplo
frontend/
  src/
    components/    tarjetas, formulario de película, UI
    hooks/         sesión actual, filtros del catálogo en la URL
    lib/           cliente de Better Auth y axios
    pages/         catálogo, detalle, login, registro, admin
    router/        rutas y ProtectedRoute por rol
    schemas/       schemas de Zod de los formularios
    store/         RTK Query (películas)
```

## API

Base: `/api`. Los errores siempre tienen la forma
`{ "success": false, "error": { "message": "...", "details": { "campo": ["..."] } } }`.

### Películas

| Método | Ruta | Rol requerido | Respuestas |
|---|---|---|---|
| GET | `/api/movies` | público | 200 · 400 si los filtros no son válidos |
| GET | `/api/movies/:id` | público | 200 · 400 id inválido · 404 |
| POST | `/api/movies` | admin | 201 · 400 · 401 · 403 |
| PUT | `/api/movies/:id` | admin | 200 · 400 · 401 · 403 · 404 (body completo) |
| PATCH | `/api/movies/:id` | admin | 200 · 400 · 401 · 403 · 404 (body parcial) |
| DELETE | `/api/movies/:id` | admin | 204 · 401 · 403 · 404 |

Query params de `GET /api/movies` (todos opcionales):

| Param | Ejemplo | Descripción |
|---|---|---|
| `page` | `2` | página, desde 1 |
| `limit` | `12` | resultados por página (máx. 50) |
| `search` | `nolan` | busca en título y director |
| `genre` | `Drama` | filtra por género |
| `featured` | `true` | solo destacadas |
| `sortBy` | `rating` | `createdAt`, `title`, `releaseDate` o `rating` |
| `sortOrder` | `asc` | `asc` o `desc` |

Respuesta: `{ "data": [ ... ], "meta": { "total", "page", "limit", "totalPages" } }`.

### Autenticación (Better Auth)

| Método | Ruta | Rol requerido |
|---|---|---|
| POST | `/api/auth/sign-up/email` | público |
| POST | `/api/auth/sign-in/email` | público |
| POST | `/api/auth/sign-in/social` (GitHub o Google) | público |
| GET | `/api/auth/callback/github` | público |
| GET | `/api/auth/callback/google` | público |
| GET | `/api/auth/get-session` | sesión |
| POST | `/api/auth/sign-out` | sesión |
| GET | `/api/auth/admin/list-users` | admin |
| POST | `/api/auth/admin/set-role` | admin |

Todo usuario que se registra (por email, GitHub o Google) recibe el rol `user`.

## Correrlo en local

Requisitos: Node 22 y un cluster de MongoDB Atlas (o un Mongo local con replica set).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env    # completar las variables (ver tabla abajo)
npm run seed            # crea admin@pelis.app, user@pelis.app y 8 películas
npm run dev             # http://localhost:3000
```

| Variable | Descripción |
|---|---|
| `PORT` | puerto del backend (`3000`) |
| `NODE_ENV` | `development` o `production` |
| `MONGODB_URI` | URI de MongoDB Atlas |
| `BETTER_AUTH_SECRET` | secreto para firmar sesiones: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `BETTER_AUTH_URL` | URL pública **del front** (`http://localhost:5173` en local) |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | OAuth App de GitHub para local |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | opcional: OAuth client de Google (si faltan, el back arranca sin Google) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | usuario admin que crea `npm run seed` |
| `SEED_USER_EMAIL` / `SEED_USER_PASSWORD` | usuario común que crea `npm run seed` |

OAuth App de GitHub para local (GitHub → Settings → Developer settings → OAuth Apps):

- Homepage URL: `http://localhost:5173`
- Authorization callback URL: `http://localhost:5173/api/auth/callback/github`

OAuth client de Google ([Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → OAuth client ID → Web application). Uno solo sirve para local y producción:

- Authorized JavaScript origins: `http://localhost:5173` y `https://<front>.onrender.com`
- Authorized redirect URIs: `http://localhost:5173/api/auth/callback/google` y `https://<front>.onrender.com/api/auth/callback/google`
- En la pantalla de consentimiento, la app tiene que estar **publicada** (no en modo Testing) para que cualquiera pueda entrar.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

El frontend no necesita variables de entorno: llama a `/api` y Vite lo redirige al backend
(`vite.config.ts`), igual que hace el rewrite de Render en producción. Así la cookie de sesión es
del mismo dominio y no hace falta CORS.

## Deploy en Render

### Backend: Web Service

| Campo | Valor |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install --include=dev && npm run build` |
| Start Command | `npm start` |

Variables: `NODE_ENV=production`, `NODE_VERSION=22`, `MONGODB_URI`, `BETTER_AUTH_SECRET` (uno nuevo),
`BETTER_AUTH_URL=https://<front>.onrender.com`, y `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` de la
OAuth App **de producción** (callback `https://<front>.onrender.com/api/auth/callback/github`), y `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

En Atlas: Network Access → `0.0.0.0/0` (las IPs de Render cambian).

### Frontend: Static Site

| Campo | Valor |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Redirects/Rewrites, en este orden:

| Source | Destination | Action |
|---|---|---|
| `/api/*` | `https://<back>.onrender.com/api/*` | Rewrite |
| `/*` | `/index.html` | Rewrite |

## Funcionalidades

- Catálogo con búsqueda por título o director, filtro por género y destacadas, orden y paginación.
  Los filtros quedan en la URL, así que F5 o compartir el link mantiene la búsqueda.
- Detalle de cada película.
- Registro, login con email/contraseña, con GitHub y con Google, logout. La sesión se mantiene al recargar (`useSession()`).
- Panel de admin (`/admin`) con el ABM de películas, protegido por rol. Un usuario común ve "Sin permisos" y uno sin sesión va a `/login`.
- Página de admin para cambiar roles (`/admin/users`, usa `authClient.admin.setRole`).
- Validación con Zod en el front (React Hook Form) y en el back. Si el back rechaza un campo, el error se muestra en ese input.

### Opcionales implementados

- Paginación, filtros y búsqueda en el listado.
- Página de admin para cambiar roles.
- Login con Google, además de GitHub.
