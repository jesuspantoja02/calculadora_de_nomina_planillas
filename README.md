# Nómina — Gestión de Planillas

Calculadora y gestión de planillas para el curso **JavaScript Avanzado** (UTP). El mismo producto de negocio — empleados,
pagos y boletas — se desarrolla en **dos unidades** para mostrar cómo escala de un prototipo en el navegador a un sistema
**full stack** mantenible.

| Unidad | Rol en el curso | Stack resumido |
|---|---|---|
| **Unidad 1** | Fundamentos de JavaScript, DOM y persistencia local | HTML, CSS, JavaScript (sin frameworks) |
| **Unidad 2** | Semanas 6–9: Node.js, TypeScript, Angular y API REST | Node ≥ 22.18, Express 5, TS, Angular 22, SQLite, Bootstrap 5.3 |

En el árbol actual del repositorio (rama de trabajo con la Unidad 2 completa) vive **`backend/`** y **`frontend/`**.
La Unidad 1 se conserva en el **historial de git** (commit `dda68cd` en `main`) y se puede recuperar cuando quieras comparar
versiones.

### Evolución por unidad (qué se gana en cada paso)

| Aspecto | Unidad 1 | Unidad 2 |
|---|---|---|
| **Ejecución** | Abrir `index.html` en el navegador | API en Node + SPA Angular (`npm run dev` / `npm start`) |
| **Datos** | `localStorage` (solo ese equipo/navegador) | SQLite + API REST (`/api/v1`) |
| **Código** | Un solo `js/app.js` (+ HTML/CSS) | Módulos hexagonal (backend) y features (frontend) |
| **Cálculo de planilla** | Tasas simplificadas en clases JS | Normativa peruana (oct. 2026) en `calculo-planilla.ts` + pruebas |
| **Validación** | En el DOM al escribir | Zod (API) + Reactive Forms + directiva `appEntrada` |
| **Navegación** | Vistas con `data-view` y JS | Rutas Angular con lazy loading |
| **Menú (misma idea de negocio)** | Registrar · Pago · Boletas · Dashboard · Configuración | Empleados · Procesar pago · Boletas · Dashboard · Configuración |
| **Identidad visual** | Ink + ámbar (`#0a0c11`, `#e0b04a`) | Mismos tokens en `frontend/src/styles/tokens.css` |

---

## 🔹 Unidad 1 — JavaScript en el navegador

**Objetivo:** demostrar lógica de nómina, interfaz y manejo de estado **sin frameworks**, como base del dominio que luego se
refina en la Unidad 2.

### Estructura (commit de referencia `dda68cd`)

```
calculadora_de_nomina_planillas/   ← Unidad 1 en git (no en el árbol actual de la Unidad 2)
├── index.html                     SPA: sidebar + área de contenido + zona de impresión
├── css/style.css                  Estilos (tema Ink + ámbar)
└── js/app.js                      Toda la lógica: modelos, vistas, localStorage, cálculos
```

### Pantallas (equivalentes funcionales a la Unidad 2)

| Vista (`data-view`) | Función |
|---|---|
| `registrar` | Alta de empleados (DNI, nombre, cargo, sueldo, AFP/ONP), lista, filtros por cargo y rango salarial |
| `pago` | Procesar pago y emitir boleta (adelanto quincenal y fin de mes) |
| `boletas` | Historial de boletas con filtros por fecha y búsqueda |
| `dashboard` | Totales, distribución AFP/ONP, mayor y menor sueldo |
| `configuracion` | Tasas (AFP, ONP, etc.), datos de empresa, exportar/importar `.json` |

### Persistencia y modelo

- Claves en **`localStorage`**: empleados, boletas y configuración (`CONFIG_DEFAULT` editable desde la UI).
- Clase **`Empleado`**: sueldo base, régimen, métodos `calcularDescuentos` / `calcularNeto` con porcentajes de configuración
  (modelo didáctico, no la normativa completa de la Unidad 2).

### Conceptos de JavaScript aplicados

Tipos y control de flujo, `Math`, cadenas y expresiones regulares, **clases**, arreglos (`map`, `filter`, `reduce`),
`Map`/`Set`, `JSON`, eventos del DOM y manipulación de nodos sin recargar la página.

### Cómo ver o recuperar la Unidad 1

```bash
# Solo lectura de un archivo histórico
git show dda68cd:index.html

# Copiar la Unidad 1 al directorio de trabajo (crea index.html, css/, js/)
git checkout dda68cd -- index.html css js
# Abrir index.html en el navegador (o servir la carpeta con un servidor estático ligero)
```

### Límites que motivan la Unidad 2

Sin servidor ni base de datos no hay API compartida, respaldo centralizado ni reglas legales detalladas; el cálculo y la
seguridad dependen solo del cliente. La Unidad 2 resuelve eso manteniendo el mismo flujo de pantallas y la misma marca visual.

---

## 🔹 Unidad 2 — Node.js, TypeScript y Angular

**Logro:** escalar la Unidad 1 a una solución web integral (temario semanas 6–9 / proyecto integrador): persistencia,
API REST, tipado, pruebas y normativa laboral peruana en el dominio.

| | Tecnología |
|---|---|
| Backend | Node.js ≥ 22.18, Express 5, TypeScript 6, Zod 4, Helmet 8, SQLite (`node:sqlite`, sin dependencias nativas) |
| Frontend | Angular 22 (standalone components, signals, control flow), RxJS 7.8, Bootstrap 5.3, tipografías Manrope y Source Serif 4 |
| Pruebas | `node:test` (backend) y Vitest vía `ng test` (frontend) |

### Flujo de usuario (continuidad con la Unidad 1)

| Ruta Angular | Equivalente Unidad 1 |
|---|---|
| `/empleados` | Vista `registrar` |
| `/planilla/procesar-pago` | Vista `pago` |
| `/planilla/boletas` | Vista `boletas` |
| `/dashboard` | Vista `dashboard` |
| `/configuracion` | Vista `configuracion` |

### Estructura del repositorio

```
calculadora_de_nomina_planillas/
├── backend/                         API REST
│   ├── src/
│   │   ├── main.ts                  Arranque (config, BD, servidor, apagado ordenado)
│   │   ├── app.ts                   Fábrica de Express: seguridad, rutas, errores
│   │   ├── container.ts             Raíz de composición (conecta puertos con adaptadores)
│   │   ├── shared/                  Núcleo compartido: config, errores, HTTP, SQLite, utilidades
│   │   └── modules/
│   │       ├── empleados/           ┐
│   │       ├── planilla/            │  cada módulo = 4 capas:
│   │       ├── configuracion/       │  domain · application · infrastructure · presentation
│   │       └── dashboard/           ┘
│   ├── tests/                       Pruebas
│   └── scripts/seed.ts              Datos de ejemplo
├── frontend/                        SPA Angular
│   └── src/
│       ├── styles/                  Tokens de diseño, tema de Bootstrap, layout, componentes, impresión
│       └── app/
│           ├── core/                Infraestructura única: layout, interceptor HTTP, toasts, token de API
│           ├── shared/              Reutilizable y sin lógica de negocio: ui, pipes, validadores, tipos
│           └── features/            Una carpeta por funcionalidad (carga diferida)
│               └── <feature>/       data-access · components · pages · <feature>.routes.ts
└── docs/nomina-api.postman_collection.json
```

### Backend — arquitectura hexagonal (puertos y adaptadores)

```
presentation  →  application  →  domain  ←  infrastructure
(HTTP, rutas)    (casos de uso,   (reglas,    (SQLite)
                  DTOs Zod)        puertos)
```

- **domain**: entidades y reglas de negocio puras (por ejemplo `calculo-planilla.ts`) y los *puertos* (`*.repository.ts`, interfaces). No importa Express, Zod ni la base de datos.
- **application**: casos de uso (`*.service.ts`) y validación de entradas (`*.dto.ts`, esquemas Zod). Dependen solo de los puertos.
- **infrastructure**: adaptadores que implementan los puertos (`sqlite-*.repository.ts`).
- **presentation**: controladores y rutas Express; traducen HTTP ↔ casos de uso.
- `container.ts` es el único lugar donde se instancian los adaptadores: **cambiar de SQLite a PostgreSQL implica escribir nuevos repositorios y modificar esa sola función**.
- Las migraciones de esquema están versionadas (`shared/infrastructure/sqlite/migraciones.ts`, `PRAGMA user_version`): para evolucionar la base de datos se agrega un elemento nuevo, sin editar los anteriores.

**Cómo agregar un módulo nuevo (por ejemplo «asistencia»)**

1. Crear `backend/src/modules/asistencia/{domain,application,infrastructure,presentation}`.
2. Definir la entidad y el puerto en `domain`, el caso de uso y los DTOs en `application`, el adaptador SQLite en `infrastructure` y el router en `presentation`.
3. Agregar la migración (tabla) en `migraciones.ts`, instanciarlo en `container.ts` y montar su router en `app.ts`.

### Frontend — arquitectura por funcionalidades

- **`core/`** se carga una vez (shell, interceptor, notificaciones). **`shared/`** contiene piezas genéricas sin conocimiento del dominio. **`features/`** agrupa todo lo de una funcionalidad.
- Cada feature se divide en: `data-access/` (modelos, cliente HTTP `*.api.ts` y **store con signals** `*.store.ts`), `components/` (presentación: reciben `input()` y emiten `output()`), `pages/` (contenedores que orquestan) y `*.routes.ts` (rutas con *lazy loading*; el store se provee a nivel de ruta).
- **Reglas de dependencia:** `shared` no importa de `features`; una feature solo puede usar el `data-access` de otra (p. ej. `planilla` consulta empleados a través de `EmpleadosApi`); nunca sus componentes.
- La URL de la API se inyecta mediante el token `API_BASE_URL`, y el estado de servidor vive en los stores, no en los componentes.

### Diseño visual

Se conservan los colores y las tipografías de la primera versión: paneles `#12161f` sobre fondo `#0a0c11`, acento ámbar `#e0b04a`,
éxito `#3dbe8c`, peligro `#e86b5a`; títulos en *Source Serif 4* y texto en *Manrope* (autoalojadas con `@fontsource`, sin pedir nada a
Google). Los tokens están en `frontend/src/styles/tokens.css` y se mapean a las variables de Bootstrap en `bootstrap-theme.css`,
de modo que cambiar la marca para un cliente implica editar un solo archivo.

### Cumplimiento del temario

| Tema | Dónde se aplica |
|---|---|
| Node.js (concepto, instalación, ejecución por consola) | `backend/`: `npm run dev` / `npm start`; Node ≥ 22.18 |
| TypeScript | Backend y frontend en modo `strict`; compilación con `tsc` (`npm run build`); `tsconfig` con `nodenext` |
| Angular: proyecto modular | `frontend/` con componentes *standalone* por feature, carga diferida con `loadChildren` / `loadComponent` |
| Directivas de atributo | `[ngClass]` (validación, badges, estados) y `[ngStyle]` (barras del dashboard) |
| Directivas estructurales | `@if / @for / @switch` en plantillas y layout |
| Bootstrap | 5.3 (última estable; Bootstrap 6 sigue en alfa): grid, formularios, botones, badges, progress, re-tematizado con tokens |
| Navegación / rutas | `provideRouter`, `loadChildren`, `routerLink`, `routerLinkActive`, `<router-outlet>`, `title` por ruta, comodín `**`, query params enlazados a inputs (`/empleados?regimen=AFP`) |
| Componentes | `shell`, `sidebar`, `page-header`, `icon`, `boleta`, `empleado-form/filtros/lista`, `pago-form` … |
| Pipes | Nativos: `currency` (PEN), `date`, `percent`, `uppercase`, `titlecase`. Propios: `iniciales`, `enmascararDni`, `modalidadLabel` (con pruebas). Locale `es-PE` |
| Formularios | *Reactive Forms* tipados (`NonNullableFormBuilder`), validadores, validador de grupo, mensajes por campo |
| Back-end REST en JSON | Express 5 con `GET/POST/PUT/DELETE`, `{ "data": … }` / `{ "error": … }`, códigos 200/201/204/400/404/409 |
| Herramientas de prueba | `docs/nomina-api.postman_collection.json` (Postman / Insomnia) |
| Servicios + HttpClient + RxJS | Clientes `*.api.ts`, stores con `toObservable` + `switchMap`, `debounceTime`, `combineLatest`, `catchError`, `finalize`; interceptor funcional de errores |
| Integración | «Procesar pago»: formulario reactivo + vista previa en vivo (`POST /pagos/simular`) + boleta + rutas |

### Reglas de negocio

Cálculo en `backend/src/modules/planilla/domain/calculo-planilla.ts`, con la normativa vigente en octubre de 2026.
Los parámetros (RMV, UIT, tasas AFP, tope asegurable) se editan en *Configuración*.

| Concepto | Regla |
|---|---|
| Hora ordinaria | `(sueldo + asignación familiar) / 30 / 8` |
| Hora extra 25 % / 35 % | D.S. 007-2002-TR: 125 % las dos primeras horas del día y 135 % desde la tercera |
| Descanso o feriado | Sobretasa del 100 %; el día ya está incluido en el sueldo mensual |
| Tardanza / falta | Minuto = ordinaria / 60. Falta = un treintavo. Reducen la base de pensión |
| Asignación familiar | Ley 25129: 10 % de la RMV (S/ 1 230 desde el 1 de octubre de 2026) si tiene hijos |
| AFP | 10 % de aporte + prima 1,37 % + comisión por flujo, hasta la remuneración máxima asegurable (S/ 12 732,70). La comisión sobre saldo no sale del sueldo |
| ONP | 13 % de la remuneración, sin ese tope |
| EsSalud | 9 % a cargo del empleador. No se descuenta al trabajador |
| Adelanto quincenal | Porcentaje de la empresa (por defecto 40 %). La ley no lo fija y no lleva descuentos |
| Gratificación | Ley 27735: `(sueldo + asignación) × meses/6`, sin AFP ni ONP. Bonificación Ley 30334: 9 %, o 6,75 % si está en EPS |
| CTS | `(básico + asignación + un sexto de la gratificación) × meses/12`, más el treintavo diario. Es un depósito |
| 5.ª categoría | 12 remuneraciones + 2 gratificaciones − 7 UIT (UIT 2026 = S/ 5 500) − aporte obligatorio a la pensión. Tramos 8/14/17/20/30 %. Retención = impuesto anual / 12 |

### API REST (`/api/v1`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Estado del servicio |
| GET · POST | `/empleados` | Listar (filtros `cargo`, `regimen`, `min`, `max`) · Crear (201) |
| GET · PUT · DELETE | `/empleados/:id` | Detalle · Actualizar · Eliminar (204) |
| GET · POST | `/pagos` | Historial (`fecha`, `q`) · Calcular y emitir boleta (201) |
| POST | `/pagos/simular` | Calcular sin guardar |
| GET · DELETE | `/pagos/:id` | Detalle · Eliminar boleta (204) |
| GET · PUT | `/configuracion` | Leer · Actualizar tasas y datos de empresa |
| GET | `/dashboard` | Totales, distribución por régimen, mayor/menor sueldo |
| DELETE | `/datos` | Borra empleados y boletas (204) |

Errores: `{ "error": { "code": "VALIDACION", "message": "…", "details": [{ "campo": "dni", "mensaje": "…" }] } }`.

### Seguridad y calidad

- **Entradas:** Zod con `strictObject` (rechaza campos desconocidos; valida tipos, rangos, UUID y fechas ISO) y sanitización de texto libre.
- **SQL:** consultas parametrizadas (nunca se concatenan datos del usuario); comodines de `LIKE` escapados; restricciones `CHECK`/`UNIQUE` en la base.
- **Errores:** manejador central; los errores inesperados devuelven un mensaje genérico y el detalle solo se registra en el servidor.
- **HTTP:** Helmet, `x-powered-by` desactivado, CORS con lista de orígenes, límite de peticiones por IP, cuerpo JSON ≤ 10 kB, log de accesos sin query string.
- **Datos:** SQLite en modo WAL con `busy_timeout`, transacciones para operaciones multi-tabla, apagado ordenado que cierra la base.
- **Frontend:** Angular escapa toda interpolación; el DNI se muestra enmascarado; no hay secretos en el cliente.
- **Dependencias:** versiones estables recientes con rangos `^`; verifica con `npm audit` y `npm outdated` antes de cada entrega.

### Instalación y ejecución

**Requisitos:** Node.js ≥ 22.18 (Angular 22 exige Node 22, 24 o 26 y TypeScript 6) y npm.

```bash
# 1) Dependencias (desde la raíz)
npm run install:all

# 2) Backend — terminal 1
cd backend
cp .env.example .env            # Windows: copy .env.example .env
npm run seed                    # opcional: 3 empleados de ejemplo
npm run dev                     # http://localhost:3000/api/v1/health

# 3) Frontend — terminal 2
cd frontend
npm start                       # http://localhost:4200  (ng serve con proxy /api → :3000)
```

Producción:

```bash
cd backend  && npm run build && npm start     # compila a dist/ y ejecuta
cd frontend && npm run build                  # genera dist/ para un servidor estático
```

Sirve el frontend y la API bajo el mismo dominio (proxy inverso), o cambia `apiUrl` en `frontend/src/environments/environment.ts`
y agrega el origen en `CORS_ORIGINS`. La base de datos es el archivo `backend/data/nomina.db` (respáldalo con `.backup` de SQLite o copiando el archivo con el servidor detenido).

**Pruebas y auditoría**

```bash
cd backend  && npm test && npm run typecheck && npm run audit:prod
cd frontend && npm test -- --watch=false && npm run audit:prod
```

**Probar la API:** importa `docs/nomina-api.postman_collection.json` en Postman o Insomnia (`baseUrl = http://localhost:3000/api/v1`).

### Próximos pasos sugeridos para escalar

Autenticación y roles (JWT + guards de rutas en Angular), multiempresa, migración a PostgreSQL (nuevos adaptadores de repositorio),
documentación OpenAPI, CI con `npm audit` y pruebas, y despliegue con contenedores.
