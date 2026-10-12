# <span style="color:#0284c7;">Nómina · Guía Maestra de Exposición Oral</span>
## <span style="color:#475569;">Defensa Técnica Diapositiva por Diapositiva + Banco de 20 Preguntas Clave</span>

> **Documento optimizado para estudio y exportación a PDF.**  
> Basado en la presentación de 30 diapositivas: `Presentacion_Nomina_Mejorado_Semanas_6-9.md`.  
> Contiene el guion verbal exacto, glosario técnico resaltado y respuestas rigurosas para la evaluación del docente.

---

### <span style="color:#0f766e;">📌 Ficha y Estrategia de Sustentación</span>

<div style="background-color:#f8fafc; border-left:4px solid #0284c7; padding:12px 16px; margin-bottom:16px; border-radius:4px;">

- **⏱️ Tiempo Objetivo:** 15 a 20 minutos (promedio de 35 a 45 segundos por diapositiva).
- **🎯 Postura:** Profesional de ingeniería de software. Fundamentar cada decisión en **escalabilidad, integridad de datos, desacoplamiento y normativa legal**.
- **💡 Mensaje Central:** La evolución de la **Unidad 1** a la **Unidad 2** representó un cambio de paradigma: pasamos de un script monolítico en el cliente con datos en memoria volátil (`localStorage`) a una solución empresarial desacoplada con **arquitectura hexagonal**, backend tipado en **Node/TypeScript + SQLite**, y una SPA reactiva moderna en **Angular 22**.

</div>

---

# <span style="color:#1e3a8a;">BLOQUE 1: Introducción y Arquitectura General</span>
### <span style="color:#64748b;">(Diapositivas 1 a 3 · Semanas 6 a 9)</span>

---

### <span style="color:#0369a1;">Diapositiva 1 — Carátula</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«Buenos días profesor y compañeros. Hoy presentamos nuestro proyecto integrador del curso JavaScript Avanzado: <b>Nómina</b>, una plataforma web para la gestión integral de planillas y emisión de boletas de pago conforme a la normativa laboral peruana vigente. El proyecto integra un backend robusto en Node.js, Express y TypeScript con base de datos SQLite, y un frontend reactivo desarrollado en Angular 22 con Bootstrap 5.3.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Full Stack Monorepo:</b></code> Organización de código donde el cliente (<code>frontend/</code>) y el servidor (<code>backend/</code>) residen en un mismo repositorio pero con entornos de ejecución, dependencias y procesos de compilación totalmente aislados.</li>
  <li><code style="color:#0f766e;"><b>Tipado Estático:</b></code> Sistema de tipos donde la verificación y validación de variables se produce durante la compilación y no en tiempo de ejecución, previniendo errores de tipo antes de desplegar.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 2 — Contexto y objetivo de la aplicación</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En la Unidad 1 construimos una primera versión en JavaScript puro que almacenaba los datos en el navegador (<code>localStorage</code>). Aunque cumplía las funciones básicas, presentaba limitaciones críticas: si el usuario borraba la memoria caché o cambiaba de equipo, los datos se perdían, y la lógica de cálculo estaba expuesta sin validaciones de servidor. En la Unidad 2 rediseñamos el sistema completo: creamos una API REST en Express con SQLite para persistencia real y desacoplamos la interfaz con Angular 22 y RxJS, permitiendo calcular pagos mensuales, adelantos de quincena, gratificaciones y CTS con validación bidireccional.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Desacoplamiento (Decoupling):</b></code> Separación de responsabilidades donde el cliente ignora cómo el servidor persiste la información y el servidor desconoce qué interfaz gráfica consume sus endpoints.</li>
  <li><code style="color:#0f766e;"><b>Persistencia ACID:</b></code> Propiedades de transaccionalidad de bases de datos relacionales (Atomicidad, Consistencia, Aislamiento y Durabilidad) que superan las limitaciones de almacenamiento plano de <code>localStorage</code>.</li>
  <li><code style="color:#0f766e;"><b>Arquitectura Cliente-Servidor:</b></code> Modelo distribuido donde los clientes envían peticiones asíncronas sobre HTTP hacia un servidor centralizado encargado de procesar la lógica de negocio.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 3 — Estructura del proyecto</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«Aquí observamos la organización del repositorio. En el backend implementamos una arquitectura hexagonal organizada por módulos de negocio: <code>empleados</code>, <code>planilla</code>, <code>configuracion</code> y <code>dashboard</code>. Cada módulo se divide en cuatro capas: presentation (controladores y rutas), application (servicios y casos de uso), domain (entidades y reglas puras) e infrastructure (adaptadores de SQLite). En el frontend, Angular se divide en core para infraestructura única (interceptores y layout), shared para componentes y utilidades reutilizables, y features con carga perezosa (<code>lazy loading</code>) para cada funcionalidad.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Arquitectura Hexagonal (Ports & Adapters):</b></code> Patrón de diseño donde el núcleo del negocio (dominio) no depende de frameworks ni de bases de datos; la infraestructura se conecta al dominio mediante interfaces (puertos).</li>
  <li><code style="color:#0f766e;"><b>Modularidad por Features:</b></code> Agrupación vertical del código donde cada carpeta contiene la vista, la lógica y el acceso a datos de un caso de uso particular, facilitando el mantenimiento y la escalabilidad.</li>
  <li><code style="color:#0f766e;"><b>Lazy Loading (Carga bajo demanda):</b></code> Técnica de optimización que descarga los fragmentos de código JavaScript (<code>bundles</code>) únicamente cuando el usuario navega a la ruta correspondiente.</li>
</ul>
</div>

---

# <span style="color:#1e3a8a;">BLOQUE 2: Semana 6 · Node.js y TypeScript</span>
### <span style="color:#64748b;">(Diapositivas 4 a 8)</span>

---

### <span style="color:#0369a1;">Diapositiva 4 — Semana 6 · Lo que sí y lo que no usamos</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«Para cumplir los objetivos de la Semana 6, utilizamos Node.js como runtime de servidor, npm para la orquestación de dependencias y scripts, y TypeScript bajo modo estricto. Decidimos no quedarnos en el laboratorio básico de una calculadora por consola con <code>process.argv</code> y menús <code>switch</code>, ni en scripts CommonJS con <code>require</code>. En su lugar, construimos un backend profesional con módulos ES nativos (<code>import</code>/<code>export</code>), tipos estrictos y cero uso del tipo <code>any</code>, garantizando seguridad de tipos en todo el ciclo de vida del dato.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Runtime de Ejecución:</b></code> Entorno que provee las APIs del sistema operativo (redes, archivos, procesos) para ejecutar código JavaScript fuera del navegador sobre el motor V8.</li>
  <li><code style="color:#0f766e;"><b>ES Modules (ESM) vs CommonJS (CJS):</b></code> ESM es el estándar oficial moderno de JavaScript (<code>import/export</code>) con análisis estático de dependencias, reemplazando a la sintaxis heredada <code>require()</code>.</li>
  <li><code style="color:#0f766e;"><b>Strict Mode de TypeScript:</b></code> Conjunto de directivas del compilador que prohíben variables sin tipo declarado, deshabilitan conversiones implícitas y fuerzan el manejo seguro de <code>null</code> y <code>undefined</code>.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 5 — Node.js: proceso y consola</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En <code>backend/src/main.ts</code> gestionamos el ciclo de vida del proceso de Node.js mediante el objeto global <code>process</code>. Escuchamos las señales del sistema operativo <code>SIGINT</code> (generada al pulsar Ctrl+C) y <code>SIGTERM</code> para ejecutar un apagado ordenado o graceful shutdown. Esto asegura que el servidor deje de admitir nuevas conexiones HTTP y cierre correctamente la conexión a SQLite antes de invocar <code>process.exit(0)</code>. Además, añadimos un temporizador de escape con <code>.unref()</code> que fuerza la salida si el cierre tarda más de 5 segundos, evitando que el proceso quede colgado.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Señales POSIX (<code>SIGINT</code>, <code>SIGTERM</code>):</b></code> Notificaciones asíncronas enviadas por el sistema operativo a un proceso para solicitar su terminación ordenada.</li>
  <li><code style="color:#0f766e;"><b>Graceful Shutdown:</b></code> Práctica recomendada de liberar sockets de red, confirmar escrituras en disco y cerrar conexiones de base de datos antes de apagar la aplicación.</li>
  <li><code style="color:#0f766e;"><b>Event Loop & <code>.unref()</code>:</b></code> Método que excluye un temporizador del bucle de eventos, permitiendo que Node finalice si no existen otras tareas pendientes de I/O.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 6 — npm: package.json y scripts</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En <code>backend/package.json</code> definimos la restricción de motor <code>engines</code> exigiendo Node 22 o superior, necesaria para las características de TypeScript 6 y el soporte nativo de SQLite. Configuramos scripts npm automatizados: <code>dev</code> para desarrollo con recarga en caliente usando <code>tsx watch</code>, <code>typecheck</code> para verificar tipos sin emitir JavaScript (<code>tsc --noEmit</code>), <code>build</code> para transpilar el código a producción y <code>test</code> para correr las pruebas unitarias con el ejecutor nativo de Node.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Orquestación de Scripts:</b></code> Uso del CLI de npm como interfaz estándar de automatización de tareas en entornos de Integración Continua (CI/CD).</li>
  <li><code style="color:#0f766e;"><b>Hot Reloading / Watcher:</b></code> Monitoreo en memoria del árbol de archivos que reinicia el servidor de inmediato al detectar modificaciones en el código fuente.</li>
  <li><code style="color:#0f766e;"><b>No-Emit Compilation:</b></code> Comprobación estricta de coherencia de tipos que no genera archivos físicos, acelerando las pruebas de validación previas al empaquetado.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 7 — TypeScript: tipado estático</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En <code>backend/src/modules/planilla/domain/pago.ts</code> modelamos el dominio mediante tipos de unión (<code>Union Types</code>) como <code>Modalidad</code> ('Mensual', 'Quincena', 'Gratificacion', 'CTS') e interfaces estrictas como <code>EntradaCalculo</code>. Cada parámetro legal —horas extra al 25% y 35%, minutos de tardanza, días de falta y meses computables— tiene un tipo asignado que impide ingresar valores incongruentes. La validez matemática y legal de estas fórmulas está respaldada por 13 pruebas automatizadas ejecutadas con <code>node:test</code>.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Union Types:</b></code> Tipos en TypeScript que restringen el valor de una variable a un conjunto finito y predefinido de literales válidos.</li>
  <li><code style="color:#0f766e;"><b>Domain Modeling:</b></code> Técnica de diseño orientada al dominio (DDD) donde las interfaces del código reflejan exactamente los conceptos y restricciones de la ley laboral.</li>
  <li><code style="color:#0f766e;"><b>Pruebas de Regresión:</b></code> Pruebas unitarias que garantizan que una modificación en un cálculo (por ejemplo, el porcentaje de quinta categoría) no altere el resultado de los demás conceptos.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 8 — tsconfig.json y compilación con tsc</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En <code>backend/tsconfig.json</code> configuramos el compilador de TypeScript con las opciones más exigentes del estándar moderno: target y lib <code>ES2023</code>, resolución de módulos <code>nodenext</code> compatible con el runtime de Node, y reglas como <code>noUncheckedIndexedAccess</code> para evitar accesos inseguros a arrays u objetos. Usamos <code>verbatimModuleSyntax</code> para asegurar que las importaciones de solo tipos no generen código muerto en JavaScript y compilamos mediante <code>tsc -p tsconfig.build.json</code> hacia la carpeta <code>dist/</code> para producción.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Transpilación:</b></code> Proceso de traducción de código fuente de un lenguaje tipado de alto nivel (TypeScript) a código ejecutable estándar (JavaScript ECMAScript).</li>
  <li><code style="color:#0f766e;"><b>Tree Shaking & Type-Only Imports:</b></code> Eliminación de interfaces y declaraciones de tipos durante la compilación para que el bundle de JavaScript resultante sea ligero y sin dependencias fantasma.</li>
  <li><code style="color:#0f766e;"><b>Index Signature Safety (<code>noUncheckedIndexedAccess</code>):</b></code> Regla que obliga a verificar si un elemento existe al acceder por clave dinámica o índice numérico (<code>Type | undefined</code>).</li>
</ul>
</div>

---

# <span style="color:#1e3a8a;">BLOQUE 3: Semana 7 · Angular, Directivas y Bootstrap</span>
### <span style="color:#64748b;">(Diapositivas 9 a 16)</span>

---

### <span style="color:#0369a1;">Diapositiva 9 — Semana 7 · Lo que sí y lo que no usamos</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En la Semana 7 entramos a Angular. Implementamos componentes standalone organizados por características, directivas de atributo nativas como <code>[ngClass]</code> y <code>[ngStyle]</code>, creamos una directiva de atributo personalizada llamada <code>appEntrada</code>, y adoptamos el control flow moderno de Angular (<code>@if</code>, <code>@for</code>, <code>@switch</code>). Prescindimos de <code>NgModule</code>, eliminamos las directivas estructurales antiguas (<code>*ngIf</code>, <code>*ngFor</code>) por estar en desuso desde Angular 17/20, y cargamos Bootstrap 5.3 exclusivamente a nivel de estilos CSS en <code>angular.json</code>, sin scripts de jQuery ni componentes de Bootstrap JS.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Standalone Components:</b></code> Arquitectura moderna de Angular que elimina los módulos intermedios (<code>@NgModule</code>), reduciendo la complejidad y facilitando la inyección directa de dependencias.</li>
  <li><code style="color:#0f766e;"><b>Built-in Control Flow:</b></code> Sintaxis declarativa integrada en el compilador de Angular 17+ que sustituye las directivas estructurales con micro-sintaxis en plantilla, optimizando el rendimiento.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 10 — Componentes Angular</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«Aquí vemos <code>EmpleadoFormComponent</code>. Aplicamos las APIs reactivas modernas de Angular: las señales <code>input()</code> y <code>output()</code> en lugar de los decoradores <code>@Input()</code> y <code>@Output()</code>. Configuramos <code>ChangeDetectionStrategy.OnPush</code>, lo que significa que Angular solo verificará y redibujará este componente cuando sus entradas por señal cambien o cuando ocurra un evento emitido dentro de él. La página se compone de tres piezas reutilizables: el formulario de alta, el panel de filtros salariales y la lista reactiva.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Detección de Cambios <code>OnPush</code>:</b></code> Estrategia de optimización que desactiva el escaneo continuo del árbol de componentes, activándose únicamente por inmutabilidad o emisión de señales.</li>
  <li><code style="color:#0f766e;"><b>Signals (<code>input()</code>, <code>output()</code>):</b></code> Primitivas reactivas con seguimiento granular de dependencias, base del nuevo motor de reactividad sin Zone.js de Angular.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 11 — Directivas de atributo: [ngClass]</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«La directiva de atributo <code>[ngClass]</code> altera las clases CSS del elemento sin modificar la estructura del DOM. En <code>empleado-lista.component.ts</code> evaluamos el valor del régimen previsional: si el empleado pertenece a AFP, vinculamos dinámicamente la clase <code>text-bg-info</code> (azul); si pertenece a ONP, vinculamos <code>text-bg-warning</code> (amarillo). También la utilizamos en los formularios para vincular <code>is-invalid</code> e <code>is-valid</code> de Bootstrap según el estado de validación del control.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Directiva de Atributo:</b></code> Instrucción que altera la apariencia, clases o comportamiento de un nodo del DOM ya existente.</li>
  <li><code style="color:#0f766e;"><b>Property Binding:</b></code> Enlace unidireccional de datos que proyecta el resultado de una expresión del componente en una propiedad del DOM (<code>[propiedad]="expresion"</code>).</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 12 — Directivas de atributo: [ngStyle]</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En <code>dashboard.page.html</code> utilizamos <code>[ngStyle]</code> para calcular dinámicamente los estilos en línea de las barras de progreso. Calculamos la proporción porcentual de empleados en AFP y ONP respecto al total, y pasamos esa propiedad como <code>'width.%'</code>. Asimismo, inyectamos variables de color CSS personalizadas como <code>var(--info)</code> y <code>var(--accent)</code>, permitiendo que el gráfico estadístico refleje en tiempo real los datos provenientes de la base de datos sin depender de librerías externas de gráficos pesadas.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>CSS Custom Properties (Variables CSS):</b></code> Variables nativas del navegador (<code>var(--nombre)</code>) utilizadas para centralizar la paleta de colores y temas.</li>
  <li><code style="color:#0f766e;"><b>Dimensiones Dinámicas:</b></code> Asignación computada de magnitudes porcentuales en tiempo real mediante directivas reactivas.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 13 — Directiva propia: appEntrada</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«Como aporte técnico propio del proyecto, desarrollamos la directiva de atributo <code>appEntrada</code> (<code>entrada.directive.ts</code>). Esta directiva intercepta el evento nativo <code>beforeinput</code> a nivel del host. Si el usuario intenta tipear o pegar un carácter no permitido para el tipo configurado (por ejemplo letras en un campo DNI o RUC, o caracteres extraños en un sueldo decimal), la directiva invoca <code>event.preventDefault()</code> antes de que el texto llegue al input. Además, normaliza la coma decimal a punto, protegiendo al backend de recibir datos malformados.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Host Listener & <code>beforeinput</code>:</b></code> Captura del evento de bajo nivel del DOM previo a la mutación del valor del control, permitiendo cancelación segura de la entrada.</li>
  <li><code style="color:#0f766e;"><b>Defensive UI Programming:</b></code> Filosofía de diseño de interfaz donde se imposibilita el ingreso de errores en lugar de limitarse a advertir al usuario después de que falló.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 14 — Control flow: @if y @for</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En <code>boletas.page.html</code> aplicamos el control flow moderno de Angular. El bloque <code>@for</code> itera la lista reactiva proveniente de <code>store.items()</code>. Exige la cláusula <code>track p.id</code>, lo que permite al motor de renderizado reutilizar los nodos del DOM cuando la lista cambia en lugar de destruirlos y recrearlos todos. Además, el bloque <code>@empty</code> integrado maneja de forma declarativa el estado en que la búsqueda o filtro no arroja resultados, reemplazando la necesidad de directivas estructurales anidadas.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Reconciliation & <code>track by</code>:</b></code> Algoritmo que compara la identidad única de los elementos para minimizar las operaciones de manipulación del DOM, optimizando la tasa de refresco a 60 FPS.</li>
  <li><code style="color:#0f766e;"><b>Cláusula <code>@empty</code>:</b></code> Estructura declarativa del compilador de Angular que renderiza contenido alternativo cuando la colección iterada tiene longitud cero.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 15 — Control flow: @switch</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En <code>boleta.component.html</code> usamos <code>@switch</code> para adaptar la estructura de la boleta según la modalidad de pago elegida: Quincena, Gratificación, CTS o Fin de Mes regular. En cada rama <code>@case</code> se renderizan los conceptos pertinentes: por ejemplo, en Quincena solo se muestra el porcentaje de adelanto sin deducción de pensión; en Gratificación se presentan los meses computables y la bonificación extraordinaria de la Ley 30334; y en CTS se detalla el promedio semestral. Esto garantiza que la boleta impresa contenga únicamente los rubros legales que corresponden al cálculo.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Renderizado Condicional Exhaustivo:</b></code> Evaluación de múltiples ramas mutuamente excluyentes donde solo se añade al DOM el árbol correspondiente a la condición activa.</li>
  <li><code style="color:#0f766e;"><b>Especialización de Vistas:</b></code> Técnica para reutilizar un componente contenedor variando su layout interno según el discriminador de estado.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 16 — Bootstrap en Angular</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«Integramos Bootstrap 5.3 instalando el paquete oficial vía npm e incluyendo su hoja de estilos minificada en el arreglo <code>styles</code> de <code>angular.json</code>. Para mantener la identidad visual del proyecto —el tema oscuro 'Ink + amber ledger'— no usamos los colores por defecto de Bootstrap, sino que mapeamos sus variables en <code>bootstrap-theme.css</code> hacia nuestros propios tokens definidos en <code>tokens.css</code>. Utilizamos el sistema de grid responsive, los botones, insignias y utilidades de espaciado, manteniendo un diseño limpio y accesible sin sobrecargar la aplicación con dependencias de JavaScript externas.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>CSS Cascading & Token Mapping:</b></code> Mapeo de tokens de diseño semánticos a las variables del framework para personalizar la estética sin perder la estructura de clases del framework.</li>
  <li><code style="color:#0f766e;"><b>Grid System Flexbox:</b></code> Sistema de maquetación en doce columnas responsive basado en cajas flexibles para adaptarse a dispositivos móviles y escritorios.</li>
</ul>
</div>

---

# <span style="color:#1e3a8a;">BLOQUE 4: Semana 8 · Rutas, Pipes y Formularios</span>
### <span style="color:#64748b;">(Diapositivas 17 a 22)</span>

---

### <span style="color:#0369a1;">Diapositiva 17 — Semana 8 · Lo que sí y lo que no usamos</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En la Semana 8 implementamos la navegación SPA con rutas cargadas bajo demanda mediante <code>loadChildren</code>, directivas <code>routerLink</code> y <code>routerLinkActive</code>, pipes nativos y personalizados, y formularios reactivos con validaciones avanzadas de grupo. Como buenas prácticas contemporáneas, prescindimos de <code>AppRoutingModule</code> a favor de <code>provideRouter</code> en la configuración de la aplicación, evitamos formularios por plantilla con <code>ngModel</code>, y nos enfocamos en pipes funcionales para el formateo contable en moneda peruana y enmascaramiento seguro de documentos de identidad.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Single Page Application (SPA):</b></code> Aplicación web que carga un único documento HTML y actualiza dinámicamente las vistas mediante manipulación del historial del navegador (History API) sin recargar la página.</li>
  <li><code style="color:#0f766e;"><b>Reactive Forms vs Template-Driven:</b></code> Los formularios reactivos se definen de manera programática en la clase TypeScript, ofreciendo inmutabilidad, control estricto de tipos y facilidad para pruebas unitarias.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 18 — Rutas con carga diferida</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En <code>frontend/src/app/app.routes.ts</code> definimos la tabla de enrutamiento principal. Empleamos <code>loadChildren</code> con funciones de importación dinámica <code>import()</code>. Esto significa que el código de la feature <code>planilla</code> no se descarga cuando el usuario abre la pantalla de inicio; se transfiere únicamente cuando el usuario navega a esa sección. Configuramos una redirección automática de la ruta raíz a <code>/empleados</code> y una ruta comodín <code>**</code> que captura cualquier dirección inexistente y carga el componente <code>NotFoundPage</code> con código HTTP 404 semántico.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Dynamic Imports (<code>import()</code>):</b></code> Estándar de ECMAScript que permite la partición de código (<code>Code Splitting</code>) en múltiples chunks descargables bajo demanda vía HTTP.</li>
  <li><code style="color:#0f766e;"><b>Wildcard Route (<code>**</code>):</b></code> Ruta de escape que actúa como resolvedor de páginas no encontradas, interceptando peticiones huérfanas en el cliente.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 19 — routerLink y routerLinkActive</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En el sidebar de navegación (<code>sidebar.component.ts</code>) iteramos la lista de opciones con un <code>@for</code>. La directiva <code>routerLink</code> intercepta los clics del usuario para actualizar la URL mediante el enrutador de Angular sin provocar un refresco del navegador. Complementariamente, <code>routerLinkActive="active"</code> escucha activamente la URL actual y aplica automáticamente la clase CSS <code>active</code> al enlace correspondiente —en este caso, 'Boletas de pago'—, proporcionando retroalimentación visual inmediata al usuario sobre su ubicación en el sistema.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Client-Side Routing:</b></code> Enrutamiento gestionado en memoria por JavaScript mediante la manipulación del <code>pushState</code> del navegador, preservando el estado de la aplicación.</li>
  <li><code style="color:#0f766e;"><b>Active State Synchronization:</b></code> Sincronización automática entre el árbol de rutas activo y los atributos visuales del menú de navegación.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 20 — Pipes nativos y propios</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En la boleta de pago combinamos pipes nativos de Angular con pipes puros desarrollados por nosotros. Usamos el pipe <code>currency</code> configurado con el código ISO <code>'PEN'</code> para formatear los sueldos en soles peruanos con símbolo y dos decimales fijos; el pipe <code>date</code> con máscara <code>'dd/MM/yyyy'</code>; y <code>uppercase</code> para el nombre del trabajador. Adicionalmente, creamos el pipe propio <code>enmascararDni</code> que oculta los primeros dígitos sensibles del DNI mostrando solo los últimos cuatro por protección de datos personales, y <code>modalidadLabel</code> que traduce los identificadores técnicos a texto legible.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Pure Pipes (Pipes Puros):</b></code> Funciones de transformación de datos puras que no tienen efectos secundarios y que Angular solo reevalúa si detecta un cambio por valor primitivo o referencia de memoria.</li>
  <li><code style="color:#0f766e;"><b>Formateo Internacional (i18n):</b></code> Adaptación de monedas, fechas y números a la localización geográfica y normativa del país objetivo (<code>es-PE</code>).</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 21 — Formularios reactivos</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En <code>empleado-form.component.ts</code> construimos el formulario mediante <code>FormBuilder.group</code> con tipado estricto. Cada campo cuenta con una serie de validadores sincrónicos: el DNI requiere longitud exacta de 8 dígitos numéricos mediante una expresión regular personalizada (<code>dniValidator</code>); el nombre exige caracteres alfabéticos válidos; y el sueldo básico tiene validaciones de rango numérico entre 0.01 y 1 millón de soles. En la vista vinculamos los estados de control <code>invalid</code> y <code>touched</code> para desplegar mensajes de error específicos únicamente cuando el usuario ha interactuado con el campo.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>FormControl State:</b></code> Máquina de estados que rastrea si un control fue tocado (<code>touched</code>), modificado (<code>dirty</code>), o si contiene errores de validación (<code>errors</code>).</li>
  <li><code style="color:#0f766e;"><b>Custom Synchronous Validators:</b></code> Funciones puras que reciben un <code>AbstractControl</code> y retornan un objeto de error <code>{ [key: string]: any }</code> o <code>null</code> si el valor es válido.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 22 — Validador personalizado de grupo</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En <code>formularios.ts</code> creamos <code>rangoSalarialValidator</code>, un validador de grupo o validación cruzada (<code>cross-field validation</code>). A diferencia de los validadores individuales, este se asocia al <code>FormGroup</code> completo para comparar dos controles dependientes: el sueldo mínimo y el sueldo máximo en los filtros de búsqueda. Si ambos campos contienen valores numéricos pero el mínimo supera al máximo, el validador emite el error <code>{ rangoInvalido: true }</code>. Esto desactiva el botón de búsqueda y alerta visualmente en la interfaz, impidiendo consultas incoherentes a la base de datos.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Cross-Field Validation:</b></code> Validación donde la validez de un campo depende dinámicamente del valor presente en otro campo dentro del mismo formulario.</li>
  <li><code style="color:#0f766e;"><b>Group-Level Errors:</b></code> Errores asociados a la raíz del formulario que permiten aplicar estilos y bloqueos globales independientemente de que los campos individuales tengan formato numérico correcto.</li>
</ul>
</div>

---

# <span style="color:#1e3a8a;">BLOQUE 5: Semana 9 · API REST y Servicios HTTP</span>
### <span style="color:#64748b;">(Diapositivas 23 a 28)</span>

---

### <span style="color:#0369a1;">Diapositiva 23 — Semana 9 · Lo que sí y lo que no usamos</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En la Semana 9 consolidamos la integración full stack. Construimos una API REST completa en Express con los verbos estándar (GET, POST, PUT, DELETE) respondiendo bajo el estándar JSON, con control estricto de CORS y límite de tamaño en el payload. En el cliente creamos servicios dedicados con <code>HttpClient</code>, manejamos el flujo de datos asíncrono con operadores reactivos de RxJS como <code>switchMap</code> y <code>catchError</code>, e implementamos un interceptor funcional para capturar errores de red. No usamos un <code>server.js</code> monolítico con arrays en memoria, ni dejamos CORS abierto indiscriminadamente a cualquier origen.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>API RESTful:</b></code> Interfaz de comunicación orientada a recursos donde cada entidad se accede mediante una URI única y se manipula usando verbos HTTP semánticos.</li>
  <li><code style="color:#0f766e;"><b>Reactive Programming (RxJS):</b></code> Paradigma asíncrono basado en flujos de datos observables que reaccionan a eventos en tiempo real.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 24 — API REST con Express</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En <code>backend/src/modules/empleados/presentation/empleado.routes.ts</code> definimos el enrutador de Express que vincula cada ruta con su método del controlador: GET para listar y obtener detalle, POST para crear (retornando código 201 Created), PUT para actualizar y DELETE para eliminar (retornando 204 No Content). Las entradas que envía el cliente son sanitizadas contra inyección y validadas con esquemas estrictos de Zod en la capa de aplicación antes de tocar la base de datos, garantizando integridad referencial y devolviendo códigos 400 descriptivos ante errores.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Códigos de Estado HTTP:</b></code> Respuestas estandarizadas del protocolo (200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found, 500 Internal Error).</li>
  <li><code style="color:#0f766e;"><b>Inyección de Dependencias:</b></code> El router recibe el servicio como argumento (<code>crearEmpleadoRouter(servicio)</code>), facilitando el testeo unitario mediante mocks sin levantar servidores reales.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 25 — JSON y CORS en el servidor</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En <code>backend/src/app.ts</code> configuramos la seguridad HTTP del servidor. Aplicamos el middleware <code>cors</code> con una función de validación de orígenes: solo permitimos peticiones provenientes de dominios explícitamente autorizados (como <code>http://localhost:4200</code> en desarrollo), rechazando llamadas de páginas externas no deseadas. Adicionalmente, limitamos el analizador de cuerpo JSON con <code>express.json({ limit: '10kb' })</code>. Esto actúa como escudo contra ataques de denegación de servicio (DoS) por saturación de memoria, ya que ninguna boleta o empleado requiere transferir payloads gigantescos.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Cross-Origin Resource Sharing (CORS):</b></code> Mecanismo de seguridad de los navegadores que bloquea peticiones AJAX/Fetch hacia servidores con un dominio o puerto distinto, a menos que el servidor devuelva encabezados de autorización.</li>
  <li><code style="color:#0f766e;"><b>Payload Size Limiting:</b></code> Mitigación de seguridad que trunca peticiones excesivamente grandes antes de parsearlas, previniendo el agotamiento de memoria del hilo de Node.js.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 26 — Servicio con HttpClient</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En <code>frontend/src/app/features/empleados/data-access/empleados.api.ts</code> encapsulamos las peticiones HTTP del módulo en una clase inyectable con <code>providedIn: 'root'</code>. Inyectamos <code>HttpClient</code> y la constante de configuración <code>API_BASE_URL</code>. El método <code>listar()` serializa los filtros como parámetros de consulta (<code>HttpParams</code>) y retorna un <code>Observable<Empleado[]></code>. Mediante el operador <code>map</code> extraemos la propiedad <code>data</code> del sobre JSON estandarizado, entregando a los componentes un flujo de datos limpio y estrictamente tipado.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>HttpClient de Angular:</b></code> Cliente HTTP reactivo integrado que envuelve las peticiones en Observables fríos con soporte de cancelación y tipado genérico.</li>
  <li><code style="color:#0f766e;"><b>Envelope Pattern (<code>{ data, error }</code>):</b></code> Práctica arquitectónica de encapsular todas las respuestas de la API en una estructura consistente para simplificar el parseo en el cliente.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 27 — RxJS: vista previa en vivo</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«Esta diapositiva ilustra la reactividad del proyecto en <code>procesar-pago.page.ts</code>. Conforme el usuario escribe horas extra o tardanzas, el formulario emite cambios en el observable <code>vista$</code>. Usamos el operador <code>switchMap</code>: si el usuario sigue tipeando rápido y se emite un nuevo cálculo, <code>switchMap</code> cancela automáticamente la petición HTTP previa en tránsito y suscribe únicamente a la más reciente, evitando condiciones de carrera (<code>race conditions</code>). Con <code>catchError(() => of(null))</code> evitamos que un fallo de red destruya el observable, y con <code>takeUntilDestroyed()</code> prevenimos fugas de memoria al destruir la página.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Race Conditions (Condiciones de Carrera):</b></code> Problema donde peticiones concurrentes llegan desordenadas al cliente, mostrando datos viejos si una petición previa tardó más en responder.</li>
  <li><code style="color:#0f766e;"><b><code>switchMap</code> Operator:</b></code> Operador de proyección de orden superior que cancela la suscripción anterior tan pronto como recibe una nueva emisión, ideal para vistas previas en tiempo real.</li>
  <li><code style="color:#0f766e;"><b>Memory Leaks & Unsubscription:</b></code> Acumulación de escuchadores no recolectados en memoria; se resuelve limpiando suscripciones con el ciclo de vida del componente (<code>takeUntilDestroyed</code>).</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 28 — Interceptor de errores HTTP</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«En <code>http-error.interceptor.ts</code> implementamos un interceptor funcional mediante <code>HttpInterceptorFn</code>. Este middleware intercepta todas las respuestas salientes del cliente. Si una petición genera un error —por ejemplo, si el backend está apagado (código 0), si hay una violación de validación (código 400) o un registro inexistente (código 404)—, el interceptor extrae el mensaje de error legible del payload o del protocolo, lo despacha al servicio global de notificaciones <code>ToastService</code> para alertar al usuario en pantalla, y retransmite el error con <code>throwError</code> para que los servicios que lo necesiten puedan ejecutar lógica de contingencia.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Functional HTTP Interceptor:</b></code> Función que actúa como tubería intermedia para inspeccionar, mutar o gestionar reintentos y errores de todas las peticiones HTTP sin tocar los componentes individuales.</li>
  <li><code style="color:#0f766e;"><b>Global Error Handling:</b></code> Patrón centralizado que desacopla la lógica de visualización de errores de la lógica de negocio de cada vista.</li>
</ul>
</div>

---

# <span style="color:#1e3a8a;">BLOQUE 6: Conclusiones y Cierre</span>
### <span style="color:#64748b;">(Diapositivas 29 y 30)</span>

---

### <span style="color:#0369a1;">Diapositiva 29 — Conclusiones</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; margin-bottom:12px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«Para concluir nuestra exposición, destacamos tres logros fundamentales:<br>
1. <b>Evolución del sistema:</b> Demostramos la capacidad de transformar un prototipo rudimentario de la Unidad 1 en una solución full stack escalable, con arquitectura profesional y persistencia relacional.<br>
2. <b>Escalamiento arquitectónico:</b> Gracias a la arquitectura hexagonal en el backend y a los módulos por features en el frontend, el sistema está listo para evolucionar a bases de datos empresariales como PostgreSQL o incorporar autenticación JWT sin rehacer el núcleo del software.<br>
3. <b>Integración integral del temario:</b> Todos los contenidos de las semanas 6 a 9 —desde el Event Loop de Node y el tipado de TypeScript hasta el control flow de Angular 22, los formularios reactivos y la reactividad con RxJS— fueron aplicados con propósito práctico en una herramienta contable real.»</i>
</div>

<div style="background-color:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px;">
<b>📚 Conceptos técnicos clave:</b>
<ul>
  <li><code style="color:#0f766e;"><b>Escalabilidad Horizontal y Vertical:</b></code> Capacidad del diseño de software para soportar mayor carga y nuevas funcionalidades con mínimo refactor.</li>
  <li><code style="color:#0f766e;"><b>Continuidad de Negocio:</b></code> Preservar las reglas de cálculo y la identidad visual de una versión previa al migrar hacia una plataforma tecnológica superior.</li>
</ul>
</div>

---

### <span style="color:#0369a1;">Diapositiva 30 — Agradecimiento</span>

<div style="background-color:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; border-radius:4px;">
<b>🎙️ Qué decir al público:</b><br>
<i>«Agradecemos su atención. Quedamos a disposición del profesor para la ronda de preguntas y para la demostración en vivo de la aplicación en ejecución.»</i>
</div>

---

# <span style="color:#7c2d12; border-bottom: 2px solid #ea580c; padding-bottom: 6px;">BANCO DE 20 PREGUNTAS Y RESPUESTAS PARA LA EVALUACIÓN DEL PROFESOR</span>

Este banco recopila las 20 preguntas más probables y de alto nivel técnico que un docente de programación web avanzada suele realizar durante la sustentación.

---

### <span style="color:#c2410c;">1. ¿Por qué decidieron usar SQLite (`node:sqlite`) en lugar de almacenar datos en un archivo JSON plano o en memoria con un array?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«Un archivo JSON o un array en memoria carece de propiedades <b>ACID</b>: si el servidor se interrumpe durante una escritura con <code>fs.writeFile</code>, el archivo puede corromperse por escrituras incompletas. Además, no soporta concurrencia ni consultas indexadas. Con SQLite aprovechamos el motor relacional integrado nativamente en Node 22 mediante <code>node:sqlite</code>, que opera en modo <b>WAL (Write-Ahead Logging)</b>, admite transacciones atómicas, aplica restricciones <code>CHECK</code> y <code>UNIQUE</code> a nivel de base de datos, y nos permite migrar a PostgreSQL en el futuro simplemente implementando las mismas interfaces de repositorio.»</i>
</div>

---

### <span style="color:#c2410c;">2. En Angular 22 usaron `@if`, `@for` y `@switch` en lugar de `*ngIf`, `*ngFor` y `*ngSwitch`. ¿Cuál es la diferencia a nivel interno del compilador?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«Las directivas clásicas con asterisco son directivas estructurales basadas en micro-sintaxis que obligan a Angular a instanciar un <code>&lt;ng-template&gt;</code> y un <code>ViewContainerRef</code> por cada elemento condicional en tiempo de ejecución. El nuevo control flow (<code>@if/@for/@switch</code>) está integrado directamente en la gramática del compilador de plantillas; genera instrucciones de renderizado nativas mucho más directas, reduce el tamaño del bundle final y elimina la sobrecarga de instanciación de vistas embebidas, mejorando el rendimiento de detección de cambios.»</i>
</div>

---

### <span style="color:#c2410c;">3. ¿Para qué sirve el `track` obligatorio dentro del bloque `@for`? ¿Qué ocurre si no se usa un identificador único?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«El <code>track</code> le proporciona al algoritmo de reconciliación de Angular una clave de identidad inmutable para cada elemento de la colección (en nuestro caso <code>track p.id</code>). Cuando la lista cambia (por ejemplo al filtrar o agregar un registro), Angular compara las claves para saber con exactitud qué nodos se añadieron, eliminaron o movieron. Si usáramos un identificador ambiguo o no existiera, Angular tendría que destruir y reconstruir todos los elementos del DOM en cada refresco, degradando drásticamente el rendimiento.»</i>
</div>

---

### <span style="color:#c2410c;">4. En el backend tienen un archivo `container.ts`. ¿Qué patrón de diseño implementa y qué ventaja aporta al proyecto?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«<code>container.ts</code> actúa como la Raíz de Composición (<b>Composition Root</b>) e implementa el principio de Inversión de Dependencias (la 'D' de SOLID). En él se instancian los adaptadores de infraestructura (<code>SqliteEmpleadoRepository</code>, <code>SqlitePagoRepository</code>) y se inyectan en los servicios de aplicación (<code>EmpleadoService</code>, <code>PagoService</code>). La gran ventaja es que desacopla por completo los casos de uso de la tecnología de persistencia: si mañana decidimos cambiar SQLite por MongoDB o PostgreSQL, solo cambiamos la instanciación en <code>container.ts</code> sin alterar una sola línea de lógica en los servicios ni en el dominio.»</i>
</div>

---

### <span style="color:#c2410c;">5. En el frontend usaron `ChangeDetectionStrategy.OnPush`. ¿Por qué no dejaron la estrategia por defecto (`Default`)?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«La estrategia <code>Default</code> de Angular utiliza Zone.js para recorrer y re-evaluar todo el árbol de componentes ante cualquier evento asíncrono en la página (un click, un timer o una respuesta HTTP). Con <code>OnPush</code>, le indicamos a Angular que este componente es puro: solo debe re-evaluar su plantilla cuando sus entradas por señal (<code>input()</code>) cambien de referencia o valor, o cuando se emita un evento desde su propia vista. Esto reduce drásticamente los ciclos de renderizado innecesarios en formularios y tablas con muchos datos.»</i>
</div>

---

### <span style="color:#c2410c;">6. ¿Por qué crearon una directiva propia `appEntrada` si ya tenían validadores en el Reactive Form?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«Porque resuelven dos momentos distintos del ciclo de vida del dato:<br>
1. Los validadores de Angular actúan <b>después</b> de que el valor ya ingresó al input; muestran un mensaje de error cuando el usuario ya se equivocó.<br>
2. La directiva <code>appEntrada</code> actúa <b>antes</b>, interceptando el evento nativo <code>beforeinput</code>. Si el usuario intenta presionar una letra en el DNI o pegar un texto no numérico, la directiva cancela el evento con <code>preventDefault()</code>. Esto previene la entrada errónea en origen y normaliza caracteres (como cambiar coma decimal por punto), ofreciendo una experiencia de usuario mucho más fluida.»</i>
</div>

---

### <span style="color:#c2410c;">7. En `procesar-pago.page.ts` usan `switchMap` para la simulación en vivo. ¿Qué pasaría si en su lugar usaran `mergeMap` o `concatMap`?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«Se generaría una condición de carrera (<b>race condition</b>). Si el usuario tipea rápidamente varias horas extra, <code>mergeMap</code> lanzaría todas las peticiones en paralelo; si la petición 1 tarda 200 ms y la petición 2 tarda 50 ms por latencia de red, la respuesta de la petición 1 llegaría última y sobreescribiría la pantalla con un cálculo viejo. <code>concatMap</code> las pondría en cola, provocando demoras acumuladas. <code>switchMap</code> es el operador correcto porque cancela la petición HTTP anterior tan pronto como se emite un nuevo valor, garantizando que siempre se muestre el cálculo del último estado del formulario.»</i>
</div>

---

### <span style="color:#c2410c;">8. ¿Cómo manejan el apagado del servidor Node.js y por qué es importante en SQLite?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«En <code>main.ts</code> registramos manejadores para las señales <code>SIGINT</code> y <code>SIGTERM</code> con <code>process.on</code>. Cuando se recibe la orden de terminación, ejecutamos una secuencia ordenada: primero cerramos el servidor HTTP con <code>servidor.close()</code> para no recibir nuevas peticiones, luego cerramos la base de datos con <code>db.close()</code>, y finalmente terminamos el proceso con <code>process.exit(0)</code>. En SQLite esto es crítico porque trabaja con archivos de registro auxiliar (<code>.db-wal</code> y <code>.db-shm</code>); un apagado brusco podría dejar transacciones a medio escribir y corromper el archivo de base de datos.»</i>
</div>

---

### <span style="color:#c2410c;">9. ¿Cuál es la diferencia entre los decoradores `@Input()` / `@Output()` y las nuevas funciones `input()` / `output()` de Angular 22?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«Las funciones <code>input()</code> y <code>output()</code> forman parte de la reactividad basada en señales (<b>Signals API</b>) introducida en Angular 17+ y estandarizada en Angular 22. Mientras que <code>@Input()</code> dependía de la mutación de propiedades y requería que Zone.js detectara cambios sucios en el componente, <code>input()</code> devuelve un <code>Signal</code> de solo lectura que permite un seguimiento fino y reactivo de dependencias. Además, <code>output()</code> elimina la necesidad de instanciar un <code>EventEmitter</code> manual con RxJS, reduciendo consumo de memoria.»</i>
</div>

---

### <span style="color:#c2410c;">10. ¿Por qué configuraron `express.json({ limit: '10kb' })` en el backend?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«Por seguridad defensiva contra ataques de denegación de servicio (<b>DoS</b>) a nivel de aplicación. Por defecto, muchas configuraciones permiten cuerpos de petición de 1 MB o más. Dado que en nuestro sistema un empleado o una boleta son objetos JSON pequeños de menos de 1 KB, permitir payloads ilimitados abriría la puerta a que un atacante envíe peticiones con strings gigantescos para saturar la memoria RAM y el hilo principal del Event Loop de Node.js. Al fijar 10 kB, Express rechaza de inmediato cualquier cuerpo anómalo con un código <b>413 Payload Too Large</b>.»</i>
</div>

---

### <span style="color:#c2410c;">11. ¿Qué es un validador de grupo (`cross-field validator`) y en qué parte de su código lo implementaron?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«Es un validador sincrónico que no se asocia a un control individual, sino al <code>FormGroup</code> completo para validar la coherencia lógica entre dos o más campos relacionados. Lo implementamos en <code>shared/validators/formularios.ts</code> con la función <code>rangoSalarialValidator</code>. Este validador extrae los valores de <code>min</code> y <code>max</code> en el panel de filtros de empleados; si el sueldo mínimo ingresado es mayor al máximo, emite el error <code>{ rangoInvalido: true }</code> a nivel de grupo, impidiendo que el formulario sea considerado válido.»</i>
</div>

---

### <span style="color:#c2410c;">12. ¿Cómo garantiza el backend que un usuario no inyecte campos desconocidos o maliciosos en una petición POST?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«Utilizamos la librería de validación estricta <b>Zod</b> en la capa de aplicación (<code>empleado.dto.ts</code> y <code>pago.dto.ts</code>). Definimos esquemas con <code>z.strictObject()</code>, lo que significa que si el cliente envía propiedades adicionales que no están en el contrato (por ejemplo <code>{ "id": "hack", "admin": true }</code>), Zod rechaza automáticamente la petición con un error de validación 400. Además, combinamos esto con funciones de sanitización que limpian etiquetas HTML para prevenir ataques XSS.»</i>
</div>

---

### <span style="color:#c2410c;">13. ¿Por qué en el cálculo de planilla peruana la gratificación no lleva descuentos de AFP u ONP?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«Porque lo estipula expresamente la <b>Ley N.° 27735</b> y la <b>Ley N.° 30334</b> de desgravación permanente de gratificaciones. Esta ley establece que las gratificaciones de Fiestas Patrias y Navidad se pagan íntegras al trabajador sin deducciones de pensión (AFP u ONP). Además, el 9 % que el empleador hubiera aportado a EsSalud no se pierde, sino que se le abona directamente al trabajador como una <b>'Bonificación Extraordinaria'</b> (o 6.75 % si está afiliado a una EPS). Esto está implementado en la función <code>calcularGratificacion()</code> de <code>calculo-planilla.ts</code>.»</i>
</div>

---

### <span style="color:#c2410c;">14. En `backend/tsconfig.json` tienen `verbatimModuleSyntax: true`. ¿Para qué sirve esa opción?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«Es una regla que obliga al desarrollador a ser explícito con las importaciones: exige usar <code>import type { ... }</code> cuando solo se importan tipos o interfaces, e <code>import { ... }</code> cuando se importa código ejecutable real. Esto le permite al transpilador <code>tsc</code> y a los empaquetadores eliminar completamente las importaciones de tipos durante la compilación a JavaScript, evitando que Node intente cargar en tiempo de ejecución archivos o módulos que solo existían como definiciones conceptuales.»</i>
</div>

---

### <span style="color:#c2410c;">15. ¿Qué problema resuelve el `HttpErrorInterceptor` en el frontend?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«Centraliza y desacopla el manejo de errores HTTP. Sin el interceptor, cada uno de los componentes o servicios tendría que envolver sus llamadas en bloques <code>catch</code> o <code>subscribe({ error })</code>, duplicando código y mostrando alertas inconsistentes. El interceptor captura cualquier respuesta de error (400, 404, 500 o fallo de conexión código 0), traduce el error a un mensaje amigable para el usuario mediante el servicio <code>ToastService</code>, y luego retransmite el error hacia el flujo para que el estado de la aplicación no quede bloqueado en 'guardando'.»</i>
</div>

---

### <span style="color:#c2410c;">16. ¿Cómo protegieron la base de datos SQLite contra inyecciones SQL?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«En toda la capa de infraestructura (<code>sqlite-*.repository.ts</code>) empleamos exclusivamente <b>consultas parametrizadas</b> a través del método <code>db.prepare(sql).run(params)</code> de <code>node:sqlite</code>. Nunca concatenamos variables del usuario directamente en la cadena SQL con template literals (<code>${var}</code>). Los parámetros se envían como tuplas de valores ligadas que el motor de SQLite interpreta estrictamente como datos literales, haciendo imposible que caracteres como comillas o comandos <code>DROP TABLE</code> modifiquen la sintaxis de la consulta.»</i>
</div>

---

### <span style="color:#c2410c;">17. ¿Por qué eliminaron el archivo `server.js` que se enseñó en la Semana 9 y qué pusieron en su lugar?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«El <code>server.js</code> del temario inicial era un ejemplo didáctico introductorio en un solo archivo con CommonJS (<code>require</code>), sin base de datos (array en memoria) y sin tipado. En su lugar, construimos una solución profesional: <code>main.ts</code> para el arranque y ciclo de vida, <code>app.ts</code> como fábrica de Express con middlewares de seguridad (CORS, Helmet, límites de payload), enrutadores modulares por feature, y repositorios que interactúan con SQLite a través de interfaces, garantizando mantenibilidad y escalabilidad empresarial.»</i>
</div>

---

### <span style="color:#c2410c;">18. ¿Qué es un Pure Pipe en Angular y por qué su pipe `enmascararDni` califica como tal?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«Un Pure Pipe (pipe puro) es una función de transformación en plantilla que cumple con la propiedad de pureza referencial: para los mismos argumentos de entrada, siempre retorna el mismo resultado visual y no tiene efectos secundarios externos. Angular optimiza los pipes puros ejecutándolos únicamente cuando la referencia del valor de entrada cambia en memoria. <code>enmascararDni</code> es puro porque solo recibe un string numérico de 8 dígitos y retorna una cadena formateada (ej. <code>****1234</code>) sin alterar variables globales ni hacer llamadas asíncronas.»</i>
</div>

---

### <span style="color:#c2410c;">19. ¿Cómo se calculan las horas extras según el Decreto Supremo 007-2002-TR implementado en su código?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«Primero determinamos la remuneración ordinaria (sueldo básico más asignación familiar si corresponde). El valor de la hora ordinaria se obtiene dividiendo entre 30 días y luego entre 8 horas de la jornada diaria (<code>remuneracion / 240</code>). Conforme a ley:<br>
- Las dos primeras horas extras del día se pagan con una sobretasa del <b>25 %</b> sobre el valor hora ordinaria (<code>valorHora * 1.25</code>).<br>
- A partir de la tercera hora extra en adelante, se pagan con una sobretasa del <b>35 %</b> (<code>valorHora * 1.35</code>).<br>
Ambos tramos se calculan de manera diferenciada en la función <code>calcularHorasExtra()</code> de nuestro dominio.»</i>
</div>

---

### <span style="color:#c2410c;">20. Si el día de mañana la empresa contrata a 10,000 empleados y la base de datos se traslada a PostgreSQL en la nube, ¿qué partes del código habría que reescribir?</span>

<div style="background-color:#fff7ed; border-left:4px solid #ea580c; padding:12px 16px; border-radius:4px;">
<b>💡 Respuesta técnica del estudiante:</b><br>
<i>«Gracias a la arquitectura hexagonal, el impacto es mínimo:<br>
1. El <b>dominio</b> (<code>calculo-planilla.ts</code>, entidades, interfaces de repositorio) queda <b>100 % intacto</b>, porque no depende de la base de datos.<br>
2. Los <b>casos de uso y controladores</b> de Express quedan <b>100 % intactos</b>, porque interactúan con las abstracciones de los puertos.<br>
3. El <b>frontend</b> de Angular queda <b>100 % intacto</b>, porque consume la misma especificación de API REST.<br>
Lo <b>único</b> que se reescribiría serían los adaptadores de infraestructura (<code>sqlite-*.repository.ts</code> pasarían a ser <code>postgres-*.repository.ts</code> usando un cliente como <code>pg</code> o un pool de conexiones) y se cambiaría la instanciación en <code>container.ts</code>. Esa es la mayor fortaleza del diseño implementado en la Unidad 2.»</i>
</div>
