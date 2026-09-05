/* ==========================================================================
   Employee Payroll Management — app.js
   Semana 1: estructuras de control, eventos, try-catch
   Semana 2: operadores matematicos/asignacion, Math
   Semana 3: cadenas, regex, template literals (interpolacion)
   Semana 4: clases y objetos, arreglos, forEach/map/filter/find/reduce, JSON
   ========================================================================== */

/* ---------------------- CONFIGURACION (editable en Semana "Configuracion") ---------------------- */
const CONFIG_DEFAULT = {
  tasaAfp: 12,       // %
  tasaOnp: 13,       // %
  tasaSalud: 9,      // %
  valorHoraExtra: 10,// $ por hora
  tasaImpuesto: 5,   // % Impuesto a la Renta
  empresaNombre: "Mi Empresa S.A.C.",
  empresaRuc: "20123456789"
};

/* ---------------------- COLOR POR EMPLEADO (Semana 3: cadenas -> hash) ---------------------- */
function colorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 42%, 38%)`;
}

// Iniciales de la empresa para el "logo" de la boleta (Semana 3: metodos de cadenas)
function inicialesEmpresa(nombre) {
  return nombre
    .trim()
    .split(/\s+/)
    .filter(p => /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(p))
    .slice(0, 2)
    .map(p => p.charAt(0).toUpperCase())
    .join("") || "EM";
}

/* ---------------------- CLASES (Semana 4) ---------------------- */

class Empleado {
  constructor(nombre, dni, cargo, sueldoBase, horasExtra, regimen) {
    this.id = Date.now() + Math.floor(Math.random() * 1000); // id unico
    this.nombre = nombre;
    this.dni = dni;
    this.cargo = cargo;
    this.sueldoBase = Number(sueldoBase);
    this.horasExtra = Number(horasExtra);
    this.regimen = regimen; // 'AFP' | 'ONP'
  }

  // Semana 2: operadores matematicos y de asignacion
  calcularBruto(config) {
    let bruto = this.sueldoBase + this.horasExtra * config.valorHoraExtra;
    return Math.round(bruto * 100) / 100; // redondeo a 2 decimales
  }

  calcularDescuentos(config) {
    const bruto = this.calcularBruto(config);
    const tasaPension = this.regimen === "AFP" ? config.tasaAfp : config.tasaOnp;

    const descPension = Math.round(bruto * (tasaPension / 100) * 100) / 100;
    const descSalud = Math.round(bruto * (config.tasaSalud / 100) * 100) / 100;
    const descImpuesto = Math.round(bruto * (config.tasaImpuesto / 100) * 100) / 100;
    const total = descPension + descSalud + descImpuesto;

    return {
      pension: descPension,
      salud: descSalud,
      impuesto: descImpuesto,
      total: Math.round(total * 100) / 100
    };
  }

  calcularNeto(config) {
    const bruto = this.calcularBruto(config);
    const desc = this.calcularDescuentos(config);
    // Math.max evita que el sueldo neto sea negativo
    return Math.max(0, Math.round((bruto - desc.total) * 100) / 100);
  }

  iniciales() {
    // Semana 3: metodos de cadenas
    return this.nombre
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(p => p.charAt(0).toUpperCase())
      .join("");
  }

  // Foto consistente por empleado (misma persona = misma foto siempre)
  avatarUrl() {
    return `https://i.pravatar.cc/80?u=${this.dni || this.id}`;
  }
}

class Planilla {
  constructor() {
    this.empleados = []; // arreglo de instancias Empleado
  }

  agregar(empleado) {
    this.empleados.push(empleado);
  }

  eliminar(id) {
    // Semana 4: filter
    this.empleados = this.empleados.filter(e => e.id !== id);
  }

  obtener(id) {
    // Semana 4: find
    return this.empleados.find(e => e.id === id);
  }

  filtrar({ cargo, min, max, regimen }, config) {
    return this.empleados.filter(e => {
      const cargoOk = !cargo || e.cargo === cargo;
      const regimenOk = !regimen || e.regimen === regimen;
      const bruto = e.calcularBruto(config);
      const minOk = min === null || isNaN(min) ? true : bruto >= min;
      const maxOk = max === null || isNaN(max) ? true : bruto <= max;
      return cargoOk && regimenOk && minOk && maxOk;
    });
  }

  cargosUnicos() {
    // Semana 4: Map/Set para valores unicos
    return [...new Set(this.empleados.map(e => e.cargo))];
  }

  totales(config) {
    // Semana 4: reduce
    const bruto = this.empleados.reduce((acc, e) => acc + e.calcularBruto(config), 0);
    const descuentos = this.empleados.reduce((acc, e) => acc + e.calcularDescuentos(config).total, 0);
    const neto = this.empleados.reduce((acc, e) => acc + e.calcularNeto(config), 0);
    return {
      bruto: Math.round(bruto * 100) / 100,
      descuentos: Math.round(descuentos * 100) / 100,
      neto: Math.round(neto * 100) / 100
    };
  }

  conteoRegimen() {
    const total = this.empleados.length;
    if (total === 0) return { afp: 0, onp: 0 };
    const afp = this.empleados.filter(e => e.regimen === "AFP").length;
    const onp = total - afp;
    return {
      afp: Math.round((afp / total) * 100),
      onp: Math.round((onp / total) * 100)
    };
  }

  mayorSueldo(config) {
    if (this.empleados.length === 0) return null;
    // Semana 2: Math.max combinado con reduce
    return this.empleados.reduce((max, e) =>
      e.calcularNeto(config) > max.calcularNeto(config) ? e : max
    );
  }

  menorSueldo(config) {
    if (this.empleados.length === 0) return null;
    return this.empleados.reduce((min, e) =>
      e.calcularNeto(config) < min.calcularNeto(config) ? e : min
    );
  }

  // Semana 4: JSON.stringify / JSON.parse
  toJSON() {
    return JSON.stringify(this.empleados);
  }

  static fromJSON(json) {
    const planilla = new Planilla();
    try {
      const data = JSON.parse(json);
      data.forEach(d => {
        const emp = new Empleado(d.nombre, d.dni, d.cargo, d.sueldoBase, d.horasExtra, d.regimen);
        emp.id = d.id; // conservar id original
        planilla.agregar(emp);
      });
    } catch (error) {
      console.error("Error al parsear planilla:", error);
    }
    return planilla;
  }
}

/* ---------------------- ESTADO GLOBAL ---------------------- */
let config = cargarConfig();
let planilla = cargarPlanilla();
let empleadoSeleccionadoId = null;
let filtroRegimenActivo = null; // 'AFP' | 'ONP' | null

/* ---------------------- PERSISTENCIA (localStorage) ---------------------- */
function guardarPlanilla() {
  try {
    localStorage.setItem("planillaEmpleados", planilla.toJSON());
  } catch (error) {
    console.error("No se pudo guardar en localStorage:", error);
  }
}

function cargarPlanilla() {
  const json = localStorage.getItem("planillaEmpleados");
  if (!json) return new Planilla();
  return Planilla.fromJSON(json);
}

function guardarConfig() {
  localStorage.setItem("planillaConfig", JSON.stringify(config));
}

function cargarConfig() {
  const json = localStorage.getItem("planillaConfig");
  if (!json) return { ...CONFIG_DEFAULT };
  try {
    return { ...CONFIG_DEFAULT, ...JSON.parse(json) };
  } catch {
    return { ...CONFIG_DEFAULT };
  }
}

/* ---------------------- VALIDACIONES (Semana 3: regex + cadenas) ---------------------- */
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,60}$/;
const REGEX_DNI = /^\d{8}$/;

function validarNombre(valor) {
  const limpio = valor.trim();
  return REGEX_NOMBRE.test(limpio);
}

function validarDni(valor) {
  const limpio = valor.trim();
  return REGEX_DNI.test(limpio);
}

/* ---------------------- NAVEGACION LATERAL ---------------------- */
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");

function cerrarSidebar() {
  document.body.classList.remove("sidebar-open");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (backdrop) backdrop.hidden = true;
}

function abrirSidebar() {
  document.body.classList.add("sidebar-open");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (backdrop) backdrop.hidden = false;
}

const btnMenu = document.getElementById("btnMenu");
if (btnMenu) {
  btnMenu.addEventListener("click", () => {
    if (document.body.classList.contains("sidebar-open")) cerrarSidebar();
    else abrirSidebar();
  });
}
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
if (sidebarBackdrop) {
  sidebarBackdrop.addEventListener("click", cerrarSidebar);
}

navItems.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.view;

    navItems.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    views.forEach(v => v.hidden = true);
    document.getElementById(`view-${target}`).hidden = false;
    cerrarSidebar();

    // Siempre recalculamos todo al cambiar de vista, para asegurar
    // que ninguna seccion (incluido el Dashboard) muestre datos viejos.
    renderAll();
  });
});

/* ---------------------- FORMULARIO: REGISTRO ---------------------- */
const form = document.getElementById("formEmpleado");
const inputNombre = document.getElementById("nombre");
const inputDni = document.getElementById("dni");
const selectCargo = document.getElementById("cargo");
const inputSueldoBase = document.getElementById("sueldoBase");
const inputHorasExtra = document.getElementById("horasExtra");
const selectRegimen = document.getElementById("regimen");

const hintNombre = document.getElementById("hintNombre");
const hintDni = document.getElementById("hintDni");

// Validacion en vivo (Semana 1: eventos + estructuras de control)
inputNombre.addEventListener("input", () => {
  const ok = validarNombre(inputNombre.value);
  marcarCampo(inputNombre, hintNombre, ok, "Nombre inválido");
});

inputDni.addEventListener("input", () => {
  // solo digitos
  inputDni.value = inputDni.value.replace(/\D/g, "").slice(0, 8);
  const ok = validarDni(inputDni.value);
  marcarCampo(inputDni, hintDni, ok, "DNI inválido");
});

function marcarCampo(input, hintEl, esValido, mensajeError) {
  if (input.value.trim() === "") {
    input.classList.remove("valid", "invalid");
    hintEl.textContent = "";
    hintEl.className = "hint";
    return;
  }
  if (esValido) {
    input.classList.add("valid");
    input.classList.remove("invalid");
    hintEl.textContent = "";
    hintEl.className = "hint ok";
  } else {
    input.classList.add("invalid");
    input.classList.remove("valid");
    hintEl.textContent = mensajeError;
    hintEl.className = "hint error";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  try {
    const nombre = inputNombre.value.trim();
    const dni = inputDni.value.trim();
    const cargo = selectCargo.value;
    const sueldoBase = inputSueldoBase.value;
    const horasExtra = inputHorasExtra.value || 0;
    const regimen = selectRegimen.value;

    // Semana 1: if / else para validar antes de continuar
    if (!validarNombre(nombre)) {
      throw new Error("El nombre debe tener solo letras (mínimo 3 caracteres).");
    }
    if (!validarDni(dni)) {
      throw new Error("El DNI debe tener 8 dígitos.");
    }
    if (!cargo) {
      throw new Error("Selecciona un cargo.");
    }
    if (sueldoBase === "" || isNaN(sueldoBase) || Number(sueldoBase) <= 0) {
      throw new Error("Ingresa un sueldo base válido.");
    }
    if (horasExtra === "" || isNaN(horasExtra) || Number(horasExtra) < 0) {
      throw new Error("Ingresa un número válido de horas extra.");
    }
    if (!regimen) {
      throw new Error("Selecciona un régimen (AFP u ONP).");
    }

    const nuevoEmpleado = new Empleado(nombre, dni, cargo, sueldoBase, horasExtra, regimen);
    planilla.agregar(nuevoEmpleado);
    guardarPlanilla();

    form.reset();
    limpiarValidaciones();
    renderAll();

  } catch (error) {
    alert(error.message);
  }
});

// El boton "Guardar Empleado" de la cabecera del panel dispara el mismo submit del formulario
document.getElementById("btnGuardarTop").addEventListener("click", () => {
  form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event("submit", { cancelable: true }));
});

document.getElementById("btnLimpiar").addEventListener("click", () => {
  form.reset();
  limpiarValidaciones();
});

function limpiarValidaciones() {
  [inputNombre, inputDni].forEach(el => el.classList.remove("valid", "invalid"));
  hintNombre.textContent = "";
  hintDni.textContent = "";
}

/* ---------------------- RENDER: LISTA DE EMPLEADOS ---------------------- */
const employeeList = document.getElementById("employeeList");
const emptyMsg = document.getElementById("emptyMsg");
const filtroCargo = document.getElementById("filtroCargo");
const salMin = document.getElementById("salMin");
const salMax = document.getElementById("salMax");

const employeeList2 = document.getElementById("employeeList2");
const emptyMsg2 = document.getElementById("emptyMsg2");
const filtroCargo2 = document.getElementById("filtroCargo2");
const salMin2 = document.getElementById("salMin2");
const salMax2 = document.getElementById("salMax2");

function crearFilaEmpleado(emp) {
  const li = document.createElement("li");
  li.className = "emp-row";
  if (emp.id === empleadoSeleccionadoId) li.classList.add("emp-row-active");
  const bruto = emp.calcularBruto(config);

  // Semana 3: template literals / interpolacion
  li.innerHTML = `
    <div class="emp-avatar" data-initials="${emp.iniciales()}" style="background:${colorFromString(emp.nombre)}">
      <img src="${emp.avatarUrl()}" alt="${emp.nombre}" onerror="this.remove()">
    </div>
    <div class="emp-info">
      <p class="emp-name">${emp.nombre}</p>
      <p class="emp-role">${emp.cargo}</p>
    </div>
    <span class="emp-salary">$ ${bruto.toFixed(2)}</span>
    <div class="emp-actions">
      <button class="btn btn-primary btn-sm" data-action="ver" data-id="${emp.id}">Ver Boleta</button>
      <button class="btn btn-ghost btn-sm" data-action="editar" data-id="${emp.id}">Editar</button>
      <button class="btn btn-danger btn-sm" data-action="eliminar" data-id="${emp.id}">Eliminar</button>
    </div>
  `;
  return li;
}

function renderListaEn(container, emptyEl, lista) {
  container.innerHTML = "";
  if (lista.length === 0) {
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;
  // Semana 4: forEach
  lista.forEach(emp => container.appendChild(crearFilaEmpleado(emp)));
}

function obtenerFiltro(cargoSel, minInput, maxInput) {
  const cargo = cargoSel.value;
  const min = minInput.value === "" ? null : Number(minInput.value);
  const max = maxInput.value === "" ? null : Number(maxInput.value);
  return { cargo, min, max, regimen: filtroRegimenActivo };
}

function renderListaPrincipal() {
  const filtro = obtenerFiltro(filtroCargo, salMin, salMax);
  renderListaEn(employeeList, emptyMsg, planilla.filtrar(filtro, config));
  actualizarChipRegimen();
}

function renderLista() {
  const filtro = obtenerFiltro(filtroCargo2, salMin2, salMax2);
  renderListaEn(employeeList2, emptyMsg2, planilla.filtrar(filtro, config));
  actualizarChipRegimen();
}

function actualizarChipRegimen() {
  const chips = [
    { el: document.getElementById("chipRegimen1"), clear: "1" },
    { el: document.getElementById("chipRegimen2"), clear: "2" }
  ];
  chips.forEach(({ el }) => {
    if (!filtroRegimenActivo) {
      el.hidden = true;
    } else {
      el.hidden = false;
      el.querySelector("span").textContent = `Mostrando solo: ${filtroRegimenActivo}`;
    }
  });
  // resalta la barra activa en ambos dashboards (standalone y Home)
  ["rowAfp", "rowOnp", "rowAfpHome", "rowOnpHome"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const regimenBtn = el.dataset.regimen;
    el.classList.toggle("filter-active", filtroRegimenActivo === regimenBtn);
  });
}

document.querySelectorAll(".active-filter-chip button").forEach(btn => {
  btn.addEventListener("click", () => {
    filtroRegimenActivo = null;
    renderListaPrincipal();
    renderLista();
  });
});

function actualizarSelectsCargo() {
  const cargos = planilla.cargosUnicos();
  [filtroCargo, filtroCargo2].forEach(sel => {
    const valorActual = sel.value;
    sel.innerHTML = `<option value="">Filtrar por Cargo</option>` +
      cargos.map(c => `<option value="${c}">${c}</option>`).join("");
    sel.value = cargos.includes(valorActual) ? valorActual : "";
  });
}

[filtroCargo, salMin, salMax].forEach(el => el.addEventListener("input", renderListaPrincipal));
[filtroCargo2, salMin2, salMax2].forEach(el => el.addEventListener("input", renderLista));

// Delegacion de eventos: ver / editar / eliminar
[employeeList, employeeList2].forEach(container => {
  container.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const accion = btn.dataset.action;

    if (accion === "eliminar") {
      if (confirm("¿Eliminar este empleado?")) {
        if (empleadoSeleccionadoId === id) empleadoSeleccionadoId = null;
        planilla.eliminar(id);
        guardarPlanilla();
        renderAll();
      }
    } else if (accion === "ver") {
      empleadoSeleccionadoId = id;
      if (container === employeeList) {
        // Ya estamos en la vista principal: solo actualizamos la boleta ahi mismo, sin navegar
        renderPayslipHome();
        renderListaPrincipal(); // para resaltar la fila activa
      } else {
        // Lista standalone: navega a la vista de Boletas para verla en grande
        irABoleta(id);
      }
    } else if (accion === "editar") {
      cargarEnFormulario(id);
    }
  });
});

function cargarEnFormulario(id) {
  const emp = planilla.obtener(id);
  if (!emp) return;

  // cambia a la vista de registro
  navItems.forEach(b => b.classList.remove("active"));
  document.querySelector('.nav-item[data-view="registrar"]').classList.add("active");
  views.forEach(v => v.hidden = true);
  document.getElementById("view-registrar").hidden = false;

  inputNombre.value = emp.nombre;
  inputDni.value = emp.dni;
  selectCargo.value = emp.cargo;
  inputSueldoBase.value = emp.sueldoBase;
  inputHorasExtra.value = emp.horasExtra;
  selectRegimen.value = emp.regimen;

  // al guardar de nuevo, eliminamos el original y creamos uno nuevo (simplicidad)
  planilla.eliminar(id);
  guardarPlanilla();
  renderAll();
}

function irABoleta(id) {
  navItems.forEach(b => b.classList.remove("active"));
  document.querySelector('.nav-item[data-view="boletas"]').classList.add("active");
  views.forEach(v => v.hidden = true);
  document.getElementById("view-boletas").hidden = false;
  renderBoletas();
}

/* ---------------------- RENDER: BOLETAS DE PAGO ---------------------- */
const employeeListBoletas = document.getElementById("employeeListBoletas");
const emptyMsgBoletas = document.getElementById("emptyMsgBoletas");
const payslipEl = document.getElementById("payslip");

function renderBoletas() {
  employeeListBoletas.innerHTML = "";
  if (planilla.empleados.length === 0) {
    emptyMsgBoletas.hidden = false;
  } else {
    emptyMsgBoletas.hidden = true;
    planilla.empleados.forEach(emp => {
      const li = document.createElement("li");
      li.className = "emp-row";
      li.style.cursor = "pointer";
      li.innerHTML = `
        <div class="emp-avatar" data-initials="${emp.iniciales()}" style="background:${colorFromString(emp.nombre)}">
          <img src="${emp.avatarUrl()}" alt="${emp.nombre}" onerror="this.remove()">
        </div>
        <div class="emp-info">
          <p class="emp-name">${emp.nombre}</p>
          <p class="emp-role">${emp.cargo}</p>
        </div>
        <button class="btn btn-primary btn-sm" data-id="${emp.id}">Ver Boleta</button>
      `;
      if (emp.id === empleadoSeleccionadoId) li.classList.add("emp-row-active");
      li.querySelector("button").addEventListener("click", () => {
        empleadoSeleccionadoId = emp.id;
        renderPayslip(emp.id);
      });
      employeeListBoletas.appendChild(li);
    });
  }

  if (empleadoSeleccionadoId && planilla.obtener(empleadoSeleccionadoId)) {
    renderPayslip(empleadoSeleccionadoId);
  }
}

function renderPayslip(id, targetId = "payslip") {
  const target = document.getElementById(targetId);
  if (!target) return;
  const emp = planilla.obtener(id);
  if (!emp) {
    target.innerHTML = `<p class="payslip-placeholder">Selecciona un empleado de la lista para ver su boleta.</p>`;
    return;
  }

  const bruto = emp.calcularBruto(config);
  const desc = emp.calcularDescuentos(config);
  const neto = emp.calcularNeto(config);
  const fecha = new Date().toLocaleDateString("es-PE");
  const tasaPension = emp.regimen === "AFP" ? config.tasaAfp : config.tasaOnp;

  // Semana 3: template literals con interpolacion multilinea
  target.innerHTML = `
    <div class="payslip-company">
      <div class="payslip-company-logo">${inicialesEmpresa(config.empresaNombre)}</div>
      <div class="payslip-company-info">
        <p class="payslip-company-name">${config.empresaNombre}</p>
        <p class="payslip-company-ruc">RUC: ${config.empresaRuc}</p>
      </div>
    </div>

    <div class="payslip-header">
      <div class="payslip-avatar" data-initials="${emp.iniciales()}" style="background:${colorFromString(emp.nombre)}">
        <img src="${emp.avatarUrl()}" alt="${emp.nombre}" onerror="this.remove()">
      </div>
      <div>
        <h3>${emp.nombre}</h3>
        <p>${emp.cargo}</p>
      </div>
    </div>

    <div class="payslip-section">
      <h4>Información del Empleado</h4>
      <div class="payslip-line"><span>Nombre:</span><span>${emp.nombre}</span></div>
      <div class="payslip-line"><span>DNI:</span><span>${emp.dni}</span></div>
      <div class="payslip-line"><span>Fecha:</span><span>${fecha}</span></div>
    </div>

    <div class="payslip-section">
      <h4>Ingresos</h4>
      <div class="payslip-line"><span>Sueldo Base</span><span>$ ${emp.sueldoBase.toFixed(2)}</span></div>
      <div class="payslip-line"><span>Horas Extra (${emp.horasExtra}h)</span><span>$ ${(emp.horasExtra * config.valorHoraExtra).toFixed(2)}</span></div>
    </div>

    <div class="payslip-section">
      <h4>Descuentos</h4>
      <div class="payslip-line discount"><span>${emp.regimen} (${tasaPension}%)</span><span>$ ${desc.pension.toFixed(2)}</span></div>
      <div class="payslip-line discount"><span>EsSalud (${config.tasaSalud}%)</span><span>$ ${desc.salud.toFixed(2)}</span></div>
      <div class="payslip-line discount"><span>Impuestos (${config.tasaImpuesto}%)</span><span>$ ${desc.impuesto.toFixed(2)}</span></div>
    </div>

    <div class="payslip-neto">
      <span>Sueldo Neto</span>
      <span>$ ${neto.toFixed(2)}</span>
    </div>

    <button class="btn btn-primary payslip-print" id="btnImprimir${targetId}">Imprimir Boleta</button>
  `;

  document.getElementById(`btnImprimir${targetId}`).addEventListener("click", () => imprimirBoleta(targetId));
}

/* Aisla SOLO el contenido de la boleta para imprimir: clona el HTML del
   ticket (sin el boton de imprimir) dentro de #printArea, que es lo unico
   visible en @media print. Asi no sale nunca el resto de la pantalla
   (lista, dashboard, sidebar, etc). */
function imprimirBoleta(targetId) {
  const origen = document.getElementById(targetId);
  const printArea = document.getElementById("printArea");
  printArea.innerHTML = origen.innerHTML;
  const btnEnClon = printArea.querySelector(".payslip-print");
  if (btnEnClon) btnEnClon.remove();
  window.print();
}

/* Boleta que se muestra por defecto: el empleado seleccionado, o si no hay
   ninguno elegido aun, el ultimo registrado (para que la columna Home
   siempre muestre algo util, igual que en el diseño de referencia). */
function empleadoBoletaPorDefecto() {
  if (empleadoSeleccionadoId && planilla.obtener(empleadoSeleccionadoId)) {
    return planilla.obtener(empleadoSeleccionadoId);
  }
  return planilla.empleados.length ? planilla.empleados[planilla.empleados.length - 1] : null;
}

function renderPayslipHome() {
  const emp = empleadoBoletaPorDefecto();
  renderPayslip(emp ? emp.id : null, "payslipHome");
}

/* ---------------------- RENDER: DASHBOARD ----------------------
   suffix = '' para la vista standalone "Dashboard", 'Home' para la
   columna de la vista principal (Registrar Empleado). Misma logica,
   dos lugares donde se pinta, para que ambas queden reactivas. */
function renderDashboard(suffix = "") {
  const totales = planilla.totales(config);
  const statBruto = document.getElementById("statBruto" + suffix);
  const statDescuentos = document.getElementById("statDescuentos" + suffix);
  const statNeto = document.getElementById("statNeto" + suffix);
  if (!statBruto) return; // por si el suffix no existe en el DOM

  statBruto.textContent = `$ ${totales.bruto.toFixed(2)}`;
  statDescuentos.textContent = `$ ${totales.descuentos.toFixed(2)}`;
  statNeto.textContent = `$ ${totales.neto.toFixed(2)}`;

  // Barras de proporcion: bruto = 100% (referencia), descuentos y neto como % del bruto
  const propBruto = document.getElementById("propBruto" + suffix);
  const propDescuentos = document.getElementById("propDescuentos" + suffix);
  const propNeto = document.getElementById("propNeto" + suffix);
  if (totales.bruto > 0) {
    propBruto.style.width = "100%";
    propDescuentos.style.width = `${Math.round((totales.descuentos / totales.bruto) * 100)}%`;
    propNeto.style.width = `${Math.round((totales.neto / totales.bruto) * 100)}%`;
  } else {
    propBruto.style.width = "0%";
    propDescuentos.style.width = "0%";
    propNeto.style.width = "0%";
  }

  const regimen = planilla.conteoRegimen();
  document.getElementById("barAfp" + suffix).style.width = `${regimen.afp}%`;
  document.getElementById("barOnp" + suffix).style.width = `${regimen.onp}%`;

  const mayor = planilla.mayorSueldo(config);
  const menor = planilla.menorSueldo(config);
  pintarMiniCard("cardMayor" + suffix, mayor);
  pintarMiniCard("cardMenor" + suffix, menor);

  // Habilita/deshabilita las mini-cards clicables segun haya datos
  document.getElementById("cardMayor" + suffix).disabled = !mayor;
  document.getElementById("cardMenor" + suffix).disabled = !menor;
}

/* --- Interactividad del dashboard: clic en barras AFP/ONP filtra la lista --- */
document.querySelectorAll(".regimen-clickable").forEach(btn => {
  btn.addEventListener("click", () => {
    const r = btn.dataset.regimen;
    filtroRegimenActivo = (filtroRegimenActivo === r) ? null : r;
    // Llevamos al usuario a ver el resultado filtrado (el click en el nav ya recalcula todo)
    document.querySelector('.nav-item[data-view="lista"]').click();
  });
});

/* --- Interactividad: clic en "Empleado Mayor/Menor Sueldo" ---
   En la columna Home (dentro de "Registrar Empleado") actualiza la boleta ahi mismo,
   sin navegar, porque ya esta visible en pantalla. En el Dashboard standalone, navega
   a la vista de Boletas para verla en grande. */
document.querySelectorAll(".mini-card-clickable").forEach(btn => {
  btn.addEventListener("click", () => {
    const emp = btn.dataset.role === "mayor" ? planilla.mayorSueldo(config) : planilla.menorSueldo(config);
    if (!emp) return;
    empleadoSeleccionadoId = emp.id;
    if (btn.id.endsWith("Home")) {
      renderPayslipHome();
      renderBoletas();
    } else {
      irABoleta(emp.id);
    }
  });
});

function pintarMiniCard(cardId, emp) {
  const card = document.getElementById(cardId);
  const avatar = card.querySelector(".avatar-circle");
  const nombre = card.querySelector(".mini-name");
  const rol = card.querySelector(".mini-role");

  if (!emp) {
    avatar.innerHTML = "—";
    avatar.style.background = "";
    nombre.textContent = "—";
    rol.textContent = "—";
    return;
  }
  avatar.setAttribute("data-initials", emp.iniciales());
  avatar.style.background = colorFromString(emp.nombre);
  avatar.innerHTML = `<img src="${emp.avatarUrl()}" alt="${emp.nombre}" onerror="this.remove()">`;
  nombre.textContent = emp.nombre;
  rol.textContent = `${emp.cargo} · ${emp.regimen}`;
}

function conectarExportar(btnId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener("click", () => {
    const blob = new Blob([planilla.toJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "planilla.json";
    a.click();
    URL.revokeObjectURL(url);
  });
}
conectarExportar("btnExportar");
conectarExportar("btnExportarHome");

/* ---------------------- CONFIGURACION ---------------------- */
const cfgAfp = document.getElementById("cfgAfp");
const cfgOnp = document.getElementById("cfgOnp");
const cfgSalud = document.getElementById("cfgSalud");
const cfgHora = document.getElementById("cfgHora");
const cfgImpuesto = document.getElementById("cfgImpuesto");
const cfgEmpresa = document.getElementById("cfgEmpresa");
const cfgRuc = document.getElementById("cfgRuc");
const cfgMsg = document.getElementById("cfgMsg");

function cargarFormConfig() {
  cfgAfp.value = config.tasaAfp;
  cfgOnp.value = config.tasaOnp;
  cfgSalud.value = config.tasaSalud;
  cfgHora.value = config.valorHoraExtra;
  if (cfgImpuesto) cfgImpuesto.value = config.tasaImpuesto;
  if (cfgEmpresa) cfgEmpresa.value = config.empresaNombre;
  if (cfgRuc) cfgRuc.value = config.empresaRuc;
}

document.getElementById("btnGuardarConfig").addEventListener("click", () => {
  try {
    const afp = Number(cfgAfp.value);
    const onp = Number(cfgOnp.value);
    const salud = Number(cfgSalud.value);
    const hora = Number(cfgHora.value);
    const impuesto = cfgImpuesto ? Number(cfgImpuesto.value) : config.tasaImpuesto;
    const empresaNombre = cfgEmpresa && cfgEmpresa.value.trim() ? cfgEmpresa.value.trim() : config.empresaNombre;
    const empresaRuc = cfgRuc ? cfgRuc.value.trim() : config.empresaRuc;

    if ([afp, onp, salud, hora, impuesto].some(v => isNaN(v) || v < 0)) {
      throw new Error("Todos los valores deben ser números positivos.");
    }

    config = {
      tasaAfp: afp, tasaOnp: onp, tasaSalud: salud, valorHoraExtra: hora,
      tasaImpuesto: impuesto, empresaNombre, empresaRuc
    };
    guardarConfig();
    cfgMsg.textContent = "Configuración guardada correctamente.";
    cfgMsg.className = "hint ok";
    renderAll(); // recalcula sueldos, boletas y dashboard con las nuevas tasas
  } catch (error) {
    cfgMsg.textContent = error.message;
    cfgMsg.className = "hint error";
  }
});

document.getElementById("btnResetData").addEventListener("click", () => {
  if (confirm("Esto borrará todos los empleados guardados. ¿Continuar?")) {
    localStorage.removeItem("planillaEmpleados");
    planilla = new Planilla();
    empleadoSeleccionadoId = null;
    renderAll();
  }
});

/* ---------------------- RENDER GLOBAL (reactividad) ----------------------
   Se llama despues de CUALQUIER cambio en los datos (agregar, editar, eliminar
   empleado, cambiar configuracion, restaurar datos). Recalcula TODAS las
   secciones -- lista, boletas y dashboard -- para que estan siempre
   sincronizadas apenas se cumple la condicion (nuevo empleado, nuevo sueldo,
   nuevo regimen, etc.), sin importar cual vista este activa en ese momento. */
function renderAll() {
  actualizarSelectsCargo();
  renderListaPrincipal();
  renderLista();
  renderBoletas();
  renderPayslipHome();
  renderDashboard();       // vista standalone "Dashboard"
  renderDashboard("Home"); // columna Home dentro de "Registrar Empleado"
}

/* ---------------------- INICIALIZACION ---------------------- */
function init() {
  cargarFormConfig();
  renderAll();
}

init();
