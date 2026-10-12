# Nómina — Gestión de planillas · Presentación (Semanas 6 a 9)

> Versión en Markdown de la presentación final (30 diapositivas). Las imágenes están en `presentacion-img/`: son capturas de la aplicación compilada y reconstrucciones generadas con el código del proyecto.

---

## Diapositiva 1 — Carátula

**Nómina** — Gestión de planillas y calculadora de nómina  
Node.js · TypeScript · Angular 22 · Bootstrap

**Integrantes**

- Jesus Pantoja
- [Agregar integrante 2]
- [Agregar integrante 3]

Universidad Tecnológica del Perú · Curso: JavaScript Avanzado · Semanas 6 a 9

---

## Diapositiva 2 — Contexto y objetivo de la aplicación

### Contexto

- Calcular planillas a mano consume tiempo y genera errores.
- Unidad 1: versión en JavaScript puro, con datos solo en el navegador.
- Unidad 2: rediseño con API REST, base de datos y Angular.

### Objetivo y meta

- Registrar empleados, calcular pagos (quincena, fin de mes, gratificación y CTS) y emitir boletas.
- Meta: un producto escalable y seguro, listo para presentarse a un cliente.

### Arquitectura

`Angular 22` → `HttpClient + RxJS` → `Express + TypeScript (API REST)` → `SQLite`

---

## Diapositiva 3 — Estructura del proyecto

```text
calculadora_de_nomina_planilla/
├── backend/
│   ├── src/
│   │   ├── main.ts · app.ts · container.ts
│   │   ├── shared/  # config, errores, SQLite
│   │   └── modules/
│   │       ├── empleados/ · planilla/
│   │       └── configuracion/ · dashboard/
│   ├── tests/
│   └── data/nomina.db
├── frontend/
│   └── src/app/
│       ├── core/  # layout, HTTP, avisos
│       ├── shared/  # pipes, validadores, UI
│       └── features/
│           ├── empleados/ · planilla/
│           └── dashboard/ · configuracion/
└── docs/  # colección de Postman
```

**Imagen**

![Diagrama de la estructura del proyecto](presentacion-img/s_estructura.png)

> Estructura general: el frontend Angular se organiza en core, shared y features; el backend Express se divide en módulos con cuatro capas (presentation, application, domain, infrastructure) y guarda los datos en SQLite.

---

## Diapositiva 4 — Semana 6 · Node.js y TypeScript

### ✅ Lo que sí usamos

- Node.js como entorno del backend, ejecutado desde la consola
- npm: package.json, dependencias y scripts
- TypeScript con tipado estático (interfaces y tipos)
- tsconfig.json y compilación con tsc

### ❌ Lo que no usamos

- Calculadora de consola con process.argv
- Operaciones por línea de comandos (parseFloat, switch)
- CommonJS (require): usamos módulos ES (import)
- El tipo any: trabajamos en modo strict

---

## Diapositiva 5 — Node.js: proceso y consola

*Semana 6 · `backend/src/main.ts`*

```ts
const apagar = (senal: string) => {
  console.log(`${senal} recibido, cerrando servidor...`);
  servidor.close(() => {
    db.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 5000).unref();
};
process.on('SIGINT', () => apagar('SIGINT'));
process.on('SIGTERM', () => apagar('SIGTERM'));
```

**Resultado visual**

![Node.js: proceso y consola](presentacion-img/s6_dev.png)

> Node.js corre el backend desde la consola con npm run dev. El código usa las APIs del proceso (process.on, process.exit) para apagar el servidor de forma ordenada con Ctrl+C.

---

## Diapositiva 6 — npm: package.json y scripts

*Semana 6 · `backend/package.json`*

```json
"engines": { "node": ">=22.18.0" },
"scripts": {
  …
  "typecheck": "tsc --noEmit",
  "build": "tsc -p tsconfig.build.json",
  …
}
```

**Resultado visual**

![npm: package.json y scripts](presentacion-img/s6_npm.png)

> package.json declara la versión de Node requerida y los scripts. npm run lista todos los comandos disponibles: dev, build, start, test, seed, typecheck.

---

## Diapositiva 7 — TypeScript: tipado estático

*Semana 6 · `backend/src/modules/planilla/domain/pago.ts`*

```ts
export type Modalidad =
  'Mensual' | 'Quincena' | 'Gratificacion' | 'CTS';

export interface EntradaCalculo {
  sueldoBase: number;
  regimen: Regimen;
  tieneHijos: boolean;
  modalidad: Modalidad;
  …
  horasExtra25: number;
  …
  horasExtra35: number;
  …
  minutosTardanza: number;
  diasFalta: number;
  …
}
```

**Resultado visual**

![TypeScript: tipado estático](presentacion-img/s6_tests.png)

> Los tipos y las interfaces describen la entrada del cálculo de planilla (modalidades, horas extra al 25 % y 35 %, tardanzas y faltas). A la derecha, las 13 pruebas del cálculo ejecutadas con node:test.

---

## Diapositiva 8 — tsconfig.json y compilación con tsc

*Semana 6 · `backend/tsconfig.json`*

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "types": ["node"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src", "scripts", "tests"]
}
```

**Resultado visual**

![tsconfig.json y compilación con tsc](presentacion-img/s6_tsc.png)

> tsconfig.json define target, módulo y modo strict. tsc transpila los .ts a .js (la salida mostrada corresponde a los módulos de dominio).

---

## Diapositiva 9 — Semana 7 · Angular, directivas y Bootstrap

### ✅ Lo que sí usamos

- Componentes Angular standalone organizados por funcionalidad
- Directivas de atributo: [ngClass] y [ngStyle]
- Directiva de atributo propia: appEntrada
- Control flow moderno: @if, @for y @switch
- Bootstrap 5.3 instalado con npm y cargado en angular.json

### ❌ Lo que no usamos

- *ngIf, *ngFor y [ngSwitch] clásicos: los reemplaza el control flow
- NgModule y app.module.ts: usamos componentes standalone
- Angular CLI instalado globalmente (npm i -g)
- JavaScript de Bootstrap (modales, dropdowns): solo CSS y grid

---

## Diapositiva 10 — Componentes Angular

*Semana 7 · `frontend/src/app/features/empleados/components/empleado-form.component.ts`*

```ts
@Component({
  selector: 'app-empleado-form',
  imports: [
    ReactiveFormsModule, NgClass, EntradaDirective
  ],
  templateUrl: './empleado-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpleadoFormComponent {
  …
  readonly empleado = input<Empleado | null>(null);
  readonly guardando = input(false);
  readonly guardar = output<EmpleadoDto>();
  readonly cancelar = output<void>();
  …
}
```

**Resultado visual**

![Componentes Angular](presentacion-img/r_componentes.png)

> Cada componente tiene su clase, su plantilla y sus entradas/salidas. La captura es de la aplicación compilada: la página de empleados se compone de tres componentes (formulario, filtros y lista).

---

## Diapositiva 11 — Directivas de atributo: [ngClass]

*Semana 7 · `frontend/src/app/features/empleados/components/empleado-lista.component.ts`*

```html
<div class="text-end">
  <div class="fw-semibold">
    {{ e.sueldoBase
      | currency: 'PEN' : 'symbol' : '1.2-2' }}
  </div>
  <span class="badge"
    [ngClass]="e.regimen === 'AFP'
      ? 'text-bg-info' : 'text-bg-warning'">
    {{ e.regimen }}
  </span>
```

**Resultado visual**

![Directivas de atributo: [ngClass]](presentacion-img/r_lista.png)

> [ngClass] pinta la insignia de azul si el régimen es AFP y de amarillo si es ONP. Captura de la aplicación compilada.

---

## Diapositiva 12 — Directivas de atributo: [ngStyle]

*Semana 7 · `frontend/src/app/features/dashboard/pages/dashboard.page.html`*

```html
<div class="progress">
  <div class="progress-bar"
    [ngStyle]="{ 'width.%': r.regimen.afp,
                 background: 'var(--info)' }">
  </div>
</div>
…
<div class="progress">
  <div class="progress-bar"
    [ngStyle]="{ 'width.%': r.regimen.onp,
                 background: 'var(--accent)' }">
  </div>
</div>
```

**Resultado visual**

![Directivas de atributo: [ngStyle]](presentacion-img/r_dash_bars.png)

> [ngStyle] calcula el ancho de cada barra a partir del porcentaje de empleados en AFP y ONP. Captura de la aplicación compilada.

---

## Diapositiva 13 — Directiva propia: appEntrada

*Semana 7 · `frontend/src/app/shared/ui/entrada.directive.ts`*

```ts
@Directive({
  selector: 'input[appEntrada]',
  host: {
    '(beforeinput)': 'bloquear($event)',
    '(input)': 'limpiar()',
  },
})
export class EntradaDirective {
  readonly tipo =
    input.required<TipoEntrada>({ alias: 'appEntrada' });
  …
  protected bloquear(event: InputEvent): void {
  …
}
```

**Resultado visual**

![Directiva propia: appEntrada](presentacion-img/s7_entrada.png)

> Directiva de atributo propia: impide escribir o pegar caracteres que no corresponden al campo (por ejemplo, letras en el DNI) y convierte la coma decimal en punto. La imagen es una reconstrucción del comportamiento descrito en el código.

---

## Diapositiva 14 — Control flow: @if y @for

*Semana 7 · `frontend/src/app/features/planilla/pages/boletas.page.html`*

```html
@for (p of store.items(); track p.id) {
  <div class="row-item clickable"
       [class.selected]="store.seleccionada()?.id === p.id"
       (click)="store.seleccionar(p)">
    …
  </div>
} @empty {
  <p class="empty">
    No hay boletas que coincidan con los filtros.
  </p>
}
```

**Resultado visual**

![Control flow: @if y @for](presentacion-img/r_boletas_lista.png)

> @for recorre las boletas con track y @empty muestra el mensaje cuando no hay resultados. Captura de la aplicación compilada.

---

## Diapositiva 15 — Control flow: @switch

*Semana 7 · `frontend/src/app/features/planilla/components/boleta.component.html`*

```html
@switch (b.modalidad) {
  @case ('Quincena') {
    …
  }
  @case ('Gratificacion') {
    …
  }
  @case ('CTS') {
    …
  }
  @default {
    …
  }
}
```

**Resultado visual**

![Control flow: @switch](presentacion-img/r_boleta_quincena.png)

> @switch elige qué bloque de la boleta mostrar según la modalidad. La captura muestra la rama Quincena (adelanto quincenal).

---

## Diapositiva 16 — Bootstrap en Angular

*Semana 7 · `frontend/angular.json`*

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  …
  "src/styles/index.css"
]
```

**Resultado visual**

![Bootstrap en Angular](presentacion-img/r_form_vacio.png)

> Bootstrap se instala con npm install bootstrap y se carga en angular.json; luego sus variables se re-tematizan con la paleta del proyecto. La captura es el formulario de la aplicación compilada (grid, controles y botones de Bootstrap con la paleta del proyecto).

---

## Diapositiva 17 — Semana 8 · Rutas, pipes y formularios

### ✅ Lo que sí usamos

- Rutas SPA con carga diferida (loadChildren)
- routerLink, routerLinkActive y <router-outlet>
- Pipes: currency, date, percent, uppercase, titlecase y propios
- Formularios reactivos con FormBuilder y Validators
- Validador personalizado de grupo

### ❌ Lo que no usamos

- AppRoutingModule con RouterModule.forRoot: usamos provideRouter
- Formularios por plantilla ([(ngModel)] y FormsModule)
- Pipes lowercase y json (solo sirven para depuración)
- Pipe date con hora (HH:mm): solo dd/MM/yyyy

---

## Diapositiva 18 — Rutas con carga diferida

*Semana 8 · `frontend/src/app/app.routes.ts`*

```ts
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'empleados' },
  …
  {
    path: 'planilla',
    loadChildren: () =>
      import('./features/planilla/planilla.routes')
        .then((m) => m.PLANILLA_ROUTES)
  },
  …
  {
    path: '**',
    …
  },
];
```

**Resultado visual**

![Rutas con carga diferida](presentacion-img/r_boletas_page.png)

> Cada funcionalidad define sus rutas y se carga bajo demanda. La captura muestra la ruta /planilla/boletas; la ruta comodín ** muestra la página 404.

---

## Diapositiva 19 — routerLink y routerLinkActive

*Semana 8 · `frontend/src/app/core/layout/sidebar.component.ts`*

```html
@for (item of operacion; track item.ruta) {
  <a class="nav-item"
     [routerLink]="item.ruta"
     routerLinkActive="active"
     (click)="navegar.emit()">
    <span class="nav-icon">
      <app-icon [nombre]="item.icono" />
    </span>{{ item.etiqueta }}
  </a>
}
```

**Resultado visual**

![routerLink y routerLinkActive](presentacion-img/r_sidebar.png)

> routerLink navega sin recargar la página y routerLinkActive marca el enlace de la ruta activa (Boletas de pago en la imagen).

---

## Diapositiva 20 — Pipes nativos y propios

*Semana 8 · `frontend/src/app/features/planilla/components/boleta.component.html`*

```html
<span class="badge text-bg-warning mb-3">
  {{ b.modalidad | modalidadLabel }} ·
  {{ b.fechaPago | date: 'dd/MM/yyyy' }}
</span>
…
<div class="linea"><span>Nombre</span>
  <span>{{ b.nombre | uppercase }}</span></div>
<div class="linea"><span>DNI</span>
  <span>{{ b.dni | enmascararDni }}</span></div>
…
<div class="linea"><span>Sueldo básico</span>
  <span>{{ b.sueldoBase
    | currency: 'PEN' : 'symbol' : '1.2-2' }}</span></div>
```

**Resultado visual**

![Pipes nativos y propios](presentacion-img/r_boleta_mensual.png)

> La boleta usa pipes nativos (date, uppercase, currency en soles) y pipes propios (modalidadLabel y enmascararDni). Captura de la boleta real de la aplicación compilada.

---

## Diapositiva 21 — Formularios reactivos

*Semana 8 · `frontend/src/app/features/empleados/components/empleado-form.component.ts`*

```ts
protected readonly form = this.fb.group({
  dni: ['', [Validators.required, dniValidator]],
  nombre: ['', [Validators.required, nombreValidator]],
  cargo: ['', Validators.required],
  sueldoBase: [null as number | null, [
    Validators.required, Validators.min(0.01),
    Validators.max(1_000_000)]],
  regimen: ['' as Regimen | '', Validators.required],
  tieneHijos: [false],
});
```

**Resultado visual**

![Formularios reactivos](presentacion-img/r_form_validacion.png)

> FormBuilder y Validators definen las reglas en la clase. La captura es la aplicación compilada mostrando los estados válido e inválido de los campos.

---

## Diapositiva 22 — Validador personalizado de grupo

*Semana 8 · `frontend/src/app/shared/validators/formularios.ts`*

```ts
/** Validador de grupo: el mínimo no puede superar al máximo. */
export const rangoSalarialValidator: ValidatorFn =
  (grupo: AbstractControl): ValidationErrors | null => {
    const min = aNumero(grupo.get('min')?.value);
    const max = aNumero(grupo.get('max')?.value);
    return min !== null && max !== null && min > max
      ? { rangoInvalido: true } : null;
  };
```

**Resultado visual**

![Validador personalizado de grupo](presentacion-img/r_filtros_panel.png)

> El validador compara dos controles del mismo grupo; si el mínimo supera al máximo, el filtro muestra el error (captura de la aplicación compilada).

---

## Diapositiva 23 — Semana 9 · API REST y servicios HTTP

### ✅ Lo que sí usamos

- API REST con Express: GET, POST, PUT y DELETE en JSON
- CORS restringido y express.json() con límite de tamaño
- Servicios Angular con HttpClient y Observables
- RxJS: switchMap, debounceTime y catchError
- Interceptor funcional de errores HTTP

### ❌ Lo que no usamos

- server.js en un solo archivo con un arreglo en memoria
- app.use(cors()) abierto a cualquier origen
- Componentes que llaman a HttpClient directamente
- ng generate service: los servicios se escribieron a mano

---

## Diapositiva 24 — API REST con Express

*Semana 9 · `backend/src/modules/empleados/presentation/empleado.routes.ts`*

```ts
export function crearEmpleadoRouter(
  servicio: EmpleadoService
): Router {
  const c = crearEmpleadoController(servicio);
  const router = Router();
  router.get('/', c.listar);
  router.get('/:id', c.obtener);
  router.post('/', c.crear);
  router.put('/:id', c.actualizar);
  router.delete('/:id', c.eliminar);
  return router;
}
```

**Resultado visual**

![API REST con Express](presentacion-img/s9_rest.png)

> Los cuatro métodos REST sobre /empleados. La respuesta mostrada es la del servicio al crear un empleado (201 Created), con datos reales generados por el código del proyecto.

---

## Diapositiva 25 — JSON y CORS en el servidor

*Semana 9 · `backend/src/app.ts`*

```ts
app.use(
  cors({
    origin: (origin, cb) =>
      cb(null, !origin || origenesPermitidos.includes(origin)),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    maxAge: 600,
  }),
);
…
app.use(express.json({ limit: '10kb' }));
```

**Resultado visual**

![JSON y CORS en el servidor](presentacion-img/s9_json.png)

> CORS solo permite los orígenes configurados y express.json() interpreta el cuerpo con un límite de 10 kB. La respuesta es el JSON del dashboard con datos de la base.

---

## Diapositiva 26 — Servicio con HttpClient

*Semana 9 · `frontend/src/app/features/empleados/data-access/empleados.api.ts`*

```ts
@Injectable({ providedIn: 'root' })
export class EmpleadosApi {
  private readonly http = inject(HttpClient);
  private readonly url =
    `${inject(API_BASE_URL)}/empleados`;
  …
  listar(filtro: FiltroEmpleados = {}):
      Observable<Empleado[]> {
    …
    return this.http
      .get<ApiResponse<Empleado[]>>(this.url, { params })
      .pipe(map((r) => r.data));
  }
```

**Resultado visual**

![Servicio con HttpClient](presentacion-img/r_httpclient.png)

> El servicio devuelve Observables. La captura muestra la lista que llega desde GET /api/v1/empleados.

---

## Diapositiva 27 — RxJS: vista previa en vivo

*Semana 9 · `frontend/src/app/features/planilla/pages/procesar-pago.page.ts`*

```ts
this.vista$
  .pipe(
    switchMap((dto) => (dto
      ? this.pagosApi.simular(dto)
          .pipe(catchError(() => of(null)))
      : of(null))),
    takeUntilDestroyed(),
  )
  .subscribe((b) => this.vistaPrevia.set(b));
```

**Resultado visual**

![RxJS: vista previa en vivo](presentacion-img/r_preview.png)

> Cada cambio válido del formulario llama a POST /pagos/simular; switchMap descarta las respuestas obsoletas y catchError evita romper el flujo. La captura es la vista previa de la aplicación compilada.

---

## Diapositiva 28 — Interceptor de errores HTTP

*Semana 9 · `frontend/src/app/core/http/http-error.interceptor.ts`*

```ts
export const httpErrorInterceptor: HttpInterceptorFn =
  (req, next) => {
    const toast = inject(ToastService);
    return next(req).pipe(
      catchError((err: HttpErrorResponse) => {
        toast.error(mensajeDe(err));
        return throwError(() => err);
      }),
    );
  };
```

**Resultado visual**

![Interceptor de errores HTTP](presentacion-img/r_toast.png)

> El interceptor atrapa cualquier error HTTP y muestra un aviso al usuario; la captura es el aviso real que muestra la aplicación cuando el backend está apagado.

---

## Diapositiva 29 — Conclusiones

1. **Del proyecto antiguo al nuevo.** Pasamos de una página en JavaScript puro con datos en el navegador a una aplicación con Angular 22, API REST en Express + TypeScript y base de datos SQLite.

2. **Escalamiento.** La arquitectura por módulos y capas permite sumar funciones, como autenticación, roles o PostgreSQL, sin reescribir lo que ya funciona.

3. **Lo aprendido en las semanas 6 a 9.** Node.js y TypeScript, componentes y directivas, rutas, pipes y formularios, y servicios REST con HttpClient y RxJS se integraron en un producto funcional.

**Imagen**

![Escalamiento del proyecto](presentacion-img/s_escalamiento.png)

> Tres conclusiones: la evolución del proyecto antiguo al nuevo, el escalamiento por módulos y lo aprendido en las semanas 6 a 9. La imagen muestra dos escalones logrados (Unidad 1 y Unidad 2) y dos próximos pasos sugeridos.

---

## Diapositiva 30 — GRACIAS

**Nómina — Gestión de planillas**

Tecnologías usadas: TypeScript · JavaScript · Node.js · Angular · Express · Bootstrap · RxJS · SQLite · HTML5 · CSS3
