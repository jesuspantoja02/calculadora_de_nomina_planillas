# Despliegue en Render (plan Free) — Nómina Unidad 2

Guía paso a paso para publicar este monorepo en [Render](https://render.com) usando el **plan gratuito**:

- **Web Service** → API Node.js (`backend/`)
- **Static Site** → aplicación Angular (`frontend/`)

Así se replica en la nube lo que haces en local con `npm run dev:backend` y `npm run dev:frontend`, pero con dos URLs distintas y configuración de **CORS** y **URL de la API**.

---

## Tabla de contenidos

1. [Qué vas a obtener](#1-qué-vas-a-obtener)
2. [Requisitos previos](#2-requisitos-previos)
3. [Limitaciones del plan Free (léelas antes)](#3-limitaciones-del-plan-free-léelas-antes)
4. [Arquitectura en Render](#4-arquitectura-en-render)
5. [Preparar el código (obligatorio)](#5-preparar-el-código-obligatorio)
6. [Subir el proyecto a GitHub](#6-subir-el-proyecto-a-github)
7. [Crear cuenta y conectar GitHub en Render](#7-crear-cuenta-y-conectar-github-en-render)
8. [Desplegar la API (Web Service)](#8-desplegar-la-api-web-service)
9. [Comprobar que la API funciona](#9-comprobar-que-la-api-funciona)
10. [Datos de demostración (opcional)](#10-datos-de-demostración-opcional)
11. [Desplegar el frontend (Static Site)](#11-desplegar-el-frontend-static-site)
12. [Ajustar CORS con la URL final del frontend](#12-ajustar-cors-con-la-url-final-del-frontend)
13. [Prueba final de la aplicación](#13-prueba-final-de-la-aplicación)
14. [Variables de entorno (referencia)](#14-variables-de-entorno-referencia)
15. [Solución de problemas](#15-solución-de-problemas)
16. [Mantenimiento y redespliegues](#16-mantenimiento-y-redespliegues)

---

## 1. Qué vas a obtener

| Servicio en Render | Carpeta del repo | URL ejemplo |
|--------------------|------------------|-------------|
| Web Service (API) | `backend/` | `https://nomina-api-xxxx.onrender.com` |
| Static Site (SPA) | `frontend/` | `https://nomina-web-xxxx.onrender.com` |

El navegador carga la SPA desde el Static Site y las peticiones HTTP van a la API (`/api/v1/...`) en el Web Service.

---

## 2. Requisitos previos

- Cuenta en **GitHub** con el repositorio actualizado (rama `main` con `backend/` y `frontend/`).
- Cuenta en **Render** (registro con GitHub es lo más cómodo).
- En tu PC (para probar antes de subir):
  - **Node.js ≥ 22.18** (igual que `backend/package.json` → `engines.node`).
  - Haber ejecutado al menos una vez:
    ```bash
    npm run install:all
    npm run dev:backend
    npm run dev:frontend
    ```
    y confirmar que la app funciona en `http://localhost:4200`.

**No subas a GitHub:**

- `node_modules/`
- `backend/data/nomina.db` y archivos `*.db-wal` / `*.db-shm`
- `.env` con secretos (sí puedes subir `backend/.env.example`)

Eso ya está cubierto por el `.gitignore` del repositorio.

---

## 3. Limitaciones del plan Free (léelas antes)

| Tema | Comportamiento |
|------|----------------|
| **Inactividad** | El Web Service se **apaga** tras ~15 minutos sin tráfico. La primera visita después puede tardar **30–90 segundos** (cold start). |
| **SQLite** | La base `data/nomina.db` se guarda en el **disco del contenedor**. En el plan Free, al **redesplegar** o en algunos reinicios **puedes perder los datos**. Para una exposición: usa datos de prueba o vuelve a ejecutar el seed (sección 10). |
| **Dos dominios** | El frontend y la API no comparten origen; debes configurar **CORS** y la **URL absoluta** de la API en Angular (sección 5). |
| **HTTPS** | Render provee HTTPS; las URLs deben usarse con `https://` en CORS y en `apiUrl`. |

Para un proyecto de curso y demo ante el docente, estas limitaciones suelen ser aceptables.

---

## 4. Arquitectura en Render

```text
Usuario
   │
   ▼
┌─────────────────────────────────────┐
│  Static Site (Angular compilado)     │  https://nomina-web-xxxx.onrender.com
│  HTML / JS / CSS                     │
└─────────────────────────────────────┘
   │  fetch → https://nomina-api-xxxx.onrender.com/api/v1/...
   ▼
┌─────────────────────────────────────┐
│  Web Service (Node + Express)        │  https://nomina-api-xxxx.onrender.com
│  SQLite: backend/data/nomina.db      │
└─────────────────────────────────────┘
```

En **desarrollo local**, Angular usa `proxy.conf.json` y `apiUrl: '/api/v1'`. En **producción en Render**, el proxy no existe: la SPA debe conocer la URL completa de la API.

---

## 5. Preparar el código (obligatorio)

El repositorio ya incluye:

- `frontend/src/environments/environment.ts` — desarrollo (`apiUrl: '/api/v1'` + proxy).
- `frontend/src/environments/environment.production.ts` — producción (URL absoluta de Render).
- `fileReplacements` en `frontend/angular.json` para que `npm run build` use el entorno de producción.

### 5.1 Poner la URL real de tu API

Edita `frontend/src/environments/environment.production.ts` y sustituye el placeholder:

```typescript
apiUrl: 'https://nomina-api-xxxx.onrender.com/api/v1',
```

por la URL que Render te muestre al crear el **Web Service** (sin barra final).

> **Orden recomendado:** despliega primero la API (sección 8), copia la URL, actualiza este archivo, commit + push, y luego crea el Static Site (sección 11).

### 5.2 Verificar el build en local

```bash
cd frontend
npm install
npm run build
```

Comprueba que existe la carpeta de salida (Angular 22):

```text
frontend/dist/nomina-web/browser/
```

Ahí deben aparecer `index.html` y los bundles `.js` con hash.

### 5.3 Commit y push (cuando tengas la URL de la API)

```bash
git add frontend/src/environments/environment.production.ts
git commit -m "Apunta el frontend a la API de Render en producción."
git push origin main
```

---

## 6. Subir el proyecto a GitHub

Si ya tienes `main` en GitHub con la Unidad 2, solo asegúrate de que el último commit incluya los cambios de la sección 5.

Repositorio de referencia del proyecto:

```text
https://github.com/jesuspantoja02/calculadora_de_nomina_planillas
```

Render leerá el código desde esa rama (normalmente `main`).

---

## 7. Crear cuenta y conectar GitHub en Render

1. Entra en [https://dashboard.render.com](https://dashboard.render.com).
2. Regístrate o inicia sesión (botón **Get Started** / **Sign In**).
3. Conecta tu cuenta de **GitHub** cuando Render lo pida.
4. En GitHub, autoriza a Render para acceder al repositorio `calculadora_de_nomina_planillas` (puedes limitar solo a ese repo).

---

## 8. Desplegar la API (Web Service)

### 8.1 Crear el servicio

1. En el dashboard: **New +** → **Web Service**.
2. Selecciona el repositorio **calculadora_de_nomina_planillas**.
3. Si te pregunta por la rama, elige **`main`**.

### 8.2 Configuración del formulario

Completa los campos así:

| Campo | Valor |
|--------|--------|
| **Name** | `nomina-api` (o el nombre que quieras; define el subdominio `.onrender.com`) |
| **Region** | El más cercano a Perú suele ser **Oregon (US West)** |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | **Node** |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

### 8.3 Variables de entorno (primera pasada)

En **Environment** → **Add Environment Variable**:

| Key | Value (ejemplo) | Notas |
|-----|-----------------|--------|
| `NODE_ENV` | `production` | Activa logs de acceso en la API |
| `NODE_VERSION` | `22.18.0` | Alineado con `engines` del backend |
| `CORS_ORIGINS` | `http://localhost:4200` | **Temporal**; lo actualizarás en la sección 12 |
| `DATABASE_FILE` | `data/nomina.db` | Ruta relativa dentro de `backend/` |
| `RATE_LIMIT_MAX` | `300` | Opcional; valor por defecto del proyecto |

**No definas `PORT`:** Render inyecta `PORT` automáticamente y tu API lo lee en `backend/src/shared/config/env.ts`.

### 8.4 Health check (opcional pero recomendado)

Si el formulario muestra **Health Check Path**, usa:

```text
/api/v1/health
```

### 8.5 Crear el servicio

Pulsa **Create Web Service**. Render clonará el repo, instalará dependencias, compilará TypeScript (`dist/`) y arrancará `node dist/main.js`.

El primer deploy puede tardar varios minutos. Espera estado **Live** (verde).

### 8.6 Copiar la URL de la API

En la parte superior del servicio verás algo como:

```text
https://nomina-api-xxxx.onrender.com
```

Guárdala: la necesitas para `environment.production.ts` y para CORS.

---

## 9. Comprobar que la API funciona

Abre en el navegador o con curl:

```text
https://TU-SERVICIO-API.onrender.com/api/v1/health
```

Respuesta esperada (JSON):

```json
{
  "data": {
    "estado": "ok",
    "hora": "2026-..."
  }
}
```

Si falla:

- Revisa **Logs** en el dashboard del Web Service (errores de build, Node, o variables de entorno).
- Confirma **Root Directory** = `backend`.
- Confirma **Start Command** = `npm start`.

---

## 10. Datos de demostración (opcional)

El script `backend/scripts/seed.ts` crea tres empleados de ejemplo.

En el plan Free, la forma más simple es usar la **Shell** de Render (si está disponible en tu servicio):

1. Abre el Web Service → pestaña **Shell**.
2. Ejecuta:

```bash
npm run seed
```

Si la shell no está disponible o el contenedor no tiene el código fuente del seed en producción, puedes cargar empleados manualmente desde la UI una vez desplegado el frontend.

**Recuerda:** tras un redeploy, la base SQLite puede quedar vacía otra vez.

---

## 11. Desplegar el frontend (Static Site)

### 11.1 Actualizar la URL de la API en el código

Antes de desplegar el Static Site, en `environment.production.ts` pon la URL real:

```typescript
apiUrl: 'https://nomina-api-xxxx.onrender.com/api/v1',
```

Commit y push a `main`.

### 11.2 Crear el Static Site

1. **New +** → **Static Site**.
2. Mismo repositorio y rama **`main`**.

| Campo | Valor |
|--------|--------|
| **Name** | `nomina-web` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist/nomina-web/browser` |

### 11.3 Regla para rutas de Angular (SPA)

Sin esto, al refrescar una ruta como `/empleados` verás **404**.

En el Static Site → **Redirects/Rewrites** → **Add Rule**:

| Tipo | Source | Destination |
|------|--------|-------------|
| **Rewrite** | `/*` | `/index.html` |

(En la UI de Render suele describirse como “rewrite all paths to index.html” con status **200**.)

### 11.4 Desplegar

**Create Static Site**. Cuando termine, copia la URL pública, por ejemplo:

```text
https://nomina-web-xxxx.onrender.com
```

---

## 12. Ajustar CORS con la URL final del frontend

La API solo acepta orígenes listados en `CORS_ORIGINS` (ver `backend/src/app.ts` y `env.ts`).

1. Ve al Web Service **nomina-api** → **Environment**.
2. Edita `CORS_ORIGINS` a la URL **exacta** del Static Site, **sin** barra final:

```text
https://nomina-web-xxxx.onrender.com
```

3. Si también pruebas en local, puedes separar con coma:

```text
http://localhost:4200,https://nomina-web-xxxx.onrender.com
```

4. Guarda. Render **redesplegará** la API automáticamente.

---

## 13. Prueba final de la aplicación

1. Abre `https://nomina-web-xxxx.onrender.com`.
2. Espera si la API estaba dormida (pantalla en blanco o errores al inicio → espera y recarga).
3. Abre **DevTools** (F12) → pestaña **Network**:
   - Las peticiones deben ir a `https://nomina-api-xxxx.onrender.com/api/v1/...`
   - Status **200** (o **201** en altas).
4. Prueba flujos clave:
   - Listar / crear empleado
   - Procesar pago
   - Ver boleta
   - Dashboard y configuración

### Errores típicos en esta fase

| Síntoma | Causa probable |
|---------|----------------|
| Error CORS en consola | `CORS_ORIGINS` no coincide exactamente con la URL del Static Site |
| `404` en `/api/...` desde el dominio del **frontend** | `apiUrl` mal configurado; debe ser la URL del **Web Service**, no `/api/v1` relativo |
| API no responde tras minutos sin uso | Cold start del plan Free; espera y reintenta |
| Lista de empleados vacía tras redeploy | SQLite efímero; ejecuta seed o crea datos de nuevo |

---

## 14. Variables de entorno (referencia)

Definidas en `backend/.env.example` y validadas con Zod en `backend/src/shared/config/env.ts`:

| Variable | Obligatoria en Render | Descripción |
|----------|------------------------|-------------|
| `NODE_ENV` | Recomendada | `production` |
| `PORT` | No (Render la define) | Puerto de escucha |
| `CORS_ORIGINS` | **Sí** | Orígenes del frontend, separados por coma |
| `DATABASE_FILE` | Recomendada | Ruta del archivo SQLite |
| `RATE_LIMIT_MAX` | Opcional | Límite de peticiones por IP / 15 min |
| `NODE_VERSION` | Recomendada | `22.18.0` o superior compatible |

El frontend **no** usa variables de entorno en Render para la API: la URL va en `environment.production.ts` (compilada en el build).

---

## 15. Solución de problemas

### Build del backend falla

- Log: `tsc` o TypeScript → ejecuta en local `cd backend && npm run build`.
- Log: versión de Node → sube `NODE_VERSION` a `22.18.0`.
- Log: **`TS2688: Cannot find type definition file for 'node'`** → Render instala sin `devDependencies` si `NODE_ENV=production` durante el build. El repo ya incluye `typescript` y `@types/*` en `dependencies` del backend; haz **push** de ese cambio y **Manual Deploy**. Si persiste, usa **Build Command**: `npm install --include=dev && npm run build`.

### Build del frontend falla

- Ejecuta en local `cd frontend && npm run build`.
- Si fallan budgets de tamaño, revisa el log; en producción Angular aplica límites en `angular.json`.

### `Publish directory does not exist`

- Confirma que el build genera `dist/nomina-web/browser`.
- Si tu versión de Angular cambiara la ruta, ajusta **Publish Directory** al path real tras un build local.

### La API responde pero el front no carga datos

1. Comprueba `/api/v1/health` en el navegador.
2. Comprueba CORS (consola del navegador).
3. Comprueba que `environment.production.ts` tiene la URL correcta y que volviste a desplegar el Static Site después del commit.

### Desplegar solo un cambio en backend o frontend

Render redeploya automáticamente en cada **push** a la rama conectada (`main`), o puedes usar **Manual Deploy** → **Deploy latest commit** en cada servicio.

---

## 16. Mantenimiento y redespliegues

| Acción | Qué hacer |
|--------|-----------|
| Cambio solo en API | Push a `main` → redeploy del Web Service |
| Cambio solo en Angular | Push a `main` → redeploy del Static Site |
| Cambiar URL de API | Editar `environment.production.ts` + redeploy frontend |
| Cambiar dominio del front | Actualizar `CORS_ORIGINS` + redeploy API |
| Evitar sleep (no Free) | Plan de pago en Render o aceptar cold start en demo |

### Colección Postman

En el repo: `docs/nomina-api.postman_collection.json`. Sustituye la URL base por tu `https://nomina-api-xxxx.onrender.com/api/v1` para probar la API sin el frontend.

---

## Resumen rápido (checklist)

- [ ] Cambios de producción en Angular (`environment.production.ts` + `angular.json`)
- [ ] Código en GitHub (`main`)
- [ ] Web Service `backend/` con variables de entorno
- [ ] `/api/v1/health` responde OK
- [ ] Static Site `frontend/` con publish `dist/nomina-web/browser`
- [ ] Rewrite SPA `/*` → `/index.html`
- [ ] `CORS_ORIGINS` = URL del Static Site
- [ ] Prueba completa en el navegador

---

**Autor del proyecto:** Jesús Pantoja — curso JavaScript Avanzado (UTP).  
Si necesitas automatizar ambos servicios con un solo archivo, Render soporta **Blueprints** (`render.yaml` en la raíz); esta guía usa el asistente visual del dashboard, que es más claro la primera vez.
