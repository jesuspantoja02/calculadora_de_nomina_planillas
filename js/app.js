/* ==========================================================================
   Employee Payroll Management — app.js
   Módulo 1: Registrar Empleado (alta + lista con eliminar)
   Módulo 2: Procesar Pago (cálculo y emisión inmediata de boleta)
   Módulo 3: Boletas de Pago (historial con filtros por fecha / nombre-DNI)
   ========================================================================== */

/* ---------------------- CONFIGURACION (editable en "Configuración") ---------------------- */
const CONFIG_DEFAULT = {
  tasaAfp: 12,       // %
  tasaOnp: 13,       // %
  tasaSalud: 9,      // %
  valorHoraExtra: 10,// S/ por hora
  tasaImpuesto: 5,   // % Impuesto a la Renta
  empresaNombre: "Mi Empresa S.A.C.",
  empresaRuc: "20123456789"
};

/* ---------------------- COLOR / INICIALES ---------------------- */
function colorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 42%, 38%)`;
}

function inicialesEmpresa(nombre) {
  return nombre
    .trim()
    .split(/\s+/)
    .filter(p => /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(p))
    .slice(0, 2)
    .map(p => p.charAt(0).toUpperCase())
    .join("") || "EM";
}

function iniciales(nombre) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(p => p.charAt(0).toUpperCase())
    .join("");
}

function avatarUrl(dniOrId) {
  return `https://i.pravatar.cc/80?u=${dniOrId}`;
}

/* ---------------------- MODELO: EMPLEADO ----------------------
   Datos de alta del Módulo 1 (Registrar Empleado). Ya no incluye horas
   extra, fecha ni modalidad de pago: eso se define por cada pago
   individual en el Módulo 2 (Procesar Pago). */
class Empleado {
  constructor(dni, nombre, cargo, sueldoBase, regimen) {
    this.id = Date.now() + Math.floor(Math.random() * 1000);
    this.dni = dni;
    this.nombre = nombre;
    this.cargo = cargo;
    this.sueldoBase = Number(sueldoBase);
    this.regimen = regimen; // 'AFP' | 'ONP'
  }

  calcularDescuentos(config) {
    const tasaPension = this.regimen === "AFP" ? config.tasaAfp : config.tasaOnp;
    const pension = Math.round(this.sueldoBase * (tasaPension / 100) * 100) / 100;
    const salud = Math.round(this.sueldoBase * (config.tasaSalud / 100) * 100) / 100;
    const impuesto = Math.round(this.sueldoBase * (config.tasaImpuesto / 100) * 100) / 100;
    const total = Math.round((pension + salud + impuesto) * 100) / 100;
    return { pension, salud, impuesto, total };
  }

  calcularNeto(config) {
    const desc = this.calcularDescuentos(config);
    return Math.max(0, Math.round((this.sueldoBase - desc.total) * 100) / 100);
  }

  iniciales() { return iniciales(this.nombre); }
  avatarUrl() { return avatarUrl(this.dni || this.id); }
}

class Planilla {
  constructor() {
    this.empleados = [];
  }

  agregar(empleado) { this.empleados.push(empleado); }

  eliminar(id) { this.empleados = this.empleados.filter(e => e.id !== id); }

  obtener(id) { return this.empleados.find(e => e.id === id); }

  obtenerPorDni(dni) { return this.empleados.find(e => e.dni === dni); }

  filtrar({ cargo, min, max, regimen }, config) {
    return this.empleados.filter(e => {
      const cargoOk = !cargo || e.cargo === cargo;
      const regimenOk = !regimen || e.regimen === regimen;
      const bruto = e.sueldoBase;
      const minOk = min === null || isNaN(min) ? true : bruto >= min;
      const maxOk = max === null || isNaN(max) ? true : bruto <= max;
      return cargoOk && regimenOk && minOk && maxOk;
    });
  }

  cargosUnicos() { return [...new Set(this.empleados.map(e => e.cargo))]; }

  totales(config) {
    const bruto = this.empleados.reduce((acc, e) => acc + e.sueldoBase, 0);
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
    return { afp: Math.round((afp / total) * 100), onp: Math.round((onp / total) * 100) };
  }

  mayorSueldo(config) {
    if (this.empleados.length === 0) return null;
    return this.empleados.reduce((max, e) => (e.calcularNeto(config) > max.calcularNeto(config) ? e : max));
  }

  menorSueldo(config) {
    if (this.empleados.length === 0) return null;
    return this.empleados.reduce((min, e) => (e.calcularNeto(config) < min.calcularNeto(config) ? e : min));
  }

  toJSON() { return JSON.stringify(this.empleados); }

  static fromJSON(json) {
    const planilla = new Planilla();
    try {
      const data = JSON.parse(json);
      data.forEach(d => {
        const emp = new Empleado(d.dni, d.nombre, d.cargo, d.sueldoBase, d.regimen);
        emp.id = d.id;
        planilla.agregar(emp);
      });
    } catch (error) {
      console.error("Error al parsear planilla:", error);
    }
    return planilla;
  }
}

/* ---------------------- MODELO: PAGO (boleta emitida) ----------------------
   Cada registro es una "fotografía" del cálculo al momento de procesar el
   pago: aunque luego cambien las tasas en Configuración, la boleta ya
   emitida conserva los montos con los que se generó. */
class Pago {
  constructor({ empleadoId, dni, nombre, cargo, sueldoBase, regimen, fechaPago, modalidadPago, horasExtra, tardanzas }, config) {
    this.id = Date.now() + Math.floor(Math.random() * 1000);
    this.empleadoId = empleadoId;
    this.dni = dni;
    this.nombre = nombre;
    this.cargo = cargo;
    this.sueldoBase = Number(sueldoBase);
    this.regimen = regimen;
    this.fechaPago = fechaPago;
    this.modalidadPago = modalidadPago; // 'Quincena' | 'Mensual'
    this.horasExtra = Number(horasExtra) || 0;
    this.tardanzas = Number(tardanzas) || 0;
    this.valorHoraExtra = config.valorHoraExtra;
    this.tasaPension = regimen === "AFP" ? config.tasaAfp : config.tasaOnp;

    const calculo = calcularMontosPago(this);
    this.ingresoExtra = calculo.ingresoExtra;
    this.bruto = calculo.bruto;
    this.adelanto = calculo.adelanto;
    this.pension = calculo.pension;
    this.totalDescuentos = calculo.totalDescuentos;
    this.neto = calculo.neto;
  }

  iniciales() { return iniciales(this.nombre); }
  avatarUrl() { return avatarUrl(this.dni || this.id); }
}

/* Lógica de cálculo (sección 5 de las especificaciones):
   - Adelanto Quincenal (40%): únicamente 40% del sueldo básico, sin
     descuentos de ley, sin horas extra y sin tardanzas/faltas.
   - Fin de Mes: Bruto = Sueldo Básico + Horas Extra.
     Neto = Bruto - Adelanto Quincenal (40%) - AFP/ONP (~13%) - Tardanzas/Faltas. */
function calcularMontosPago(datos) {
  const esQuincena = datos.modalidadPago === "Quincena";
  const adelanto = Math.round(datos.sueldoBase * 0.40 * 100) / 100;

  if (esQuincena) {
    return { ingresoExtra: 0, bruto: datos.sueldoBase, adelanto: 0, pension: 0, totalDescuentos: 0, neto: adelanto };
  }

  const ingresoExtra = Math.round(datos.horasExtra * datos.valorHoraExtra * 100) / 100;
  const bruto = Math.round((datos.sueldoBase + ingresoExtra) * 100) / 100;
  const pension = Math.round(bruto * (datos.tasaPension / 100) * 100) / 100;
  const tardanzas = Math.round(datos.tardanzas * 100) / 100;
  const totalDescuentos = Math.round((adelanto + pension + tardanzas) * 100) / 100;
  const neto = Math.max(0, Math.round((bruto - totalDescuentos) * 100) / 100);

  return { ingresoExtra, bruto, adelanto, pension, totalDescuentos, neto };
}

class HistorialPagos {
  constructor() { this.pagos = []; }

  agregar(pago) { this.pagos.unshift(pago); } // el más reciente primero

  obtener(id) { return this.pagos.find(p => p.id === id); }

  filtrar({ fecha, texto }) {
    const t = (texto || "").trim().toLowerCase();
    return this.pagos.filter(p => {
      const fechaOk = !fecha || p.fechaPago === fecha;
      const textoOk = !t || p.nombre.toLowerCase().includes(t) || p.dni.toLowerCase().includes(t);
      return fechaOk && textoOk;
    });
  }

  toJSON() { return JSON.stringify(this.pagos); }

  static fromJSON(json) {
    const historial = new HistorialPagos();
    try {
      const data = JSON.parse(json);
      data.forEach(d => {
        const pago = Object.assign(Object.create(Pago.prototype), d);
        historial.pagos.push(pago);
      });
    } catch (error) {
      console.error("Error al parsear historial de pagos:", error);
    }
    return historial;
  }
}

/* ---------------------- ESTADO GLOBAL ---------------------- */
let config = cargarConfig();
let planilla = cargarPlanilla();
let historial = cargarHistorial();
let filtroRegimenActivo = null; // 'AFP' | 'ONP' | null
let pagoEmpleadoSeleccionado = null; // Empleado elegido en Procesar Pago
let boletaSeleccionadaId = null; // id de Pago mostrado en Boletas de Pago

/* ---------------------- PERSISTENCIA (localStorage) ---------------------- */
function guardarPlanilla() {
  try { localStorage.setItem("planillaEmpleados", planilla.toJSON()); }
  catch (error) { console.error("No se pudo guardar en localStorage:", error); }
}

function cargarPlanilla() {
  const json = localStorage.getItem("planillaEmpleados");
  if (!json) return new Planilla();
  return Planilla.fromJSON(json);
}

function guardarHistorial() {
  try { localStorage.setItem("planillaPagos", historial.toJSON()); }
  catch (error) { console.error("No se pudo guardar el historial de pagos:", error); }
}

function cargarHistorial() {
  const json = localStorage.getItem("planillaPagos");
  if (!json) return new HistorialPagos();
  return HistorialPagos.fromJSON(json);
}

function guardarConfig() { localStorage.setItem("planillaConfig", JSON.stringify(config)); }

function cargarConfig() {
  const json = localStorage.getItem("planillaConfig");
  if (!json) return { ...CONFIG_DEFAULT };
  try { return { ...CONFIG_DEFAULT, ...JSON.parse(json) }; }
  catch { return { ...CONFIG_DEFAULT }; }
}

/* ---------------------- VALIDACIONES ---------------------- */
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,60}$/;
const REGEX_DNI = /^\d{8}$/;

function validarNombre(valor) { return REGEX_NOMBRE.test(valor.trim()); }
function validarDni(valor) { return REGEX_DNI.test(valor.trim()); }

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
if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", cerrarSidebar);

function irAVista(viewName) {
  navItems.forEach(b => b.classList.remove("active"));
  const btn = document.querySelector(`.nav-item[data-view="${viewName}"]`);
  if (btn) btn.classList.add("active");
  views.forEach(v => v.hidden = true);
  document.getElementById(`view-${viewName}`).hidden = false;
  cerrarSidebar();
  renderAll();
}

navItems.forEach(btn => {
  btn.addEventListener("click", () => irAVista(btn.dataset.view));
});

/* ==========================================================================
   MODULO 1: REGISTRAR EMPLEADO
   ========================================================================== */
const form = document.getElementById("formEmpleado");
const inputDni = document.getElementById("dni");
const inputNombre = document.getElementById("nombre");
const selectCargo = document.getElementById("cargo");
const inputSueldoBase = document.getElementById("sueldoBase");
const selectRegimen = document.getElementById("regimen");
const hintNombre = document.getElementById("hintNombre");
const hintDni = document.getElementById("hintDni");

inputNombre.addEventListener("input", () => {
  marcarCampo(inputNombre, hintNombre, validarNombre(inputNombre.value), "Nombre inválido");
});

inputDni.addEventListener("input", () => {
  inputDni.value = inputDni.value.replace(/\D/g, "").slice(0, 8);
  const ok = validarDni(inputDni.value);
  marcarCampo(inputDni, hintDni, ok, "DNI inválido");
  if (ok && planilla.obtenerPorDni(inputDni.value)) {
    hintDni.textContent = "Ya existe un empleado registrado con este DNI.";
    hintDni.className = "hint error";
    inputDni.classList.add("invalid");
    inputDni.classList.remove("valid");
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    const dni = inputDni.value.trim();
    const nombre = inputNombre.value.trim();
    const cargo = selectCargo.value;
    const sueldoBase = inputSueldoBase.value;
    const regimen = selectRegimen.value;

    if (!validarDni(dni)) throw new Error("El DNI debe tener 8 dígitos.");
    if (planilla.obtenerPorDni(dni)) throw new Error("Ya existe un empleado registrado con este DNI.");
    if (!validarNombre(nombre)) throw new Error("El nombre debe tener solo letras (mínimo 3 caracteres).");
    if (!cargo) throw new Error("Selecciona un cargo.");
    if (sueldoBase === "" || isNaN(sueldoBase) || Number(sueldoBase) <= 0) throw new Error("Ingresa un sueldo básico válido.");
    if (!regimen) throw new Error("Selecciona un sistema de pensiones (AFP u ONP).");

    planilla.agregar(new Empleado(dni, nombre, cargo, sueldoBase, regimen));
    guardarPlanilla();

    form.reset();
    limpiarValidacionesEmpleado();
    renderAll();
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("btnGuardarTop").addEventListener("click", () => {
  form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event("submit", { cancelable: true }));
});

document.getElementById("btnLimpiar").addEventListener("click", () => {
  form.reset();
  limpiarValidacionesEmpleado();
});

function limpiarValidacionesEmpleado() {
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

function crearFilaEmpleado(emp) {
  const li = document.createElement("li");
  li.className = "emp-row";
  const neto = emp.calcularNeto(config);

  li.innerHTML = `
    <div class="emp-avatar" data-initials="${emp.iniciales()}" style="background:${colorFromString(emp.nombre)}">
      <img src="${emp.avatarUrl()}" alt="${emp.nombre}" onerror="this.remove()">
    </div>
    <div class="emp-info">
      <p class="emp-name">${emp.nombre}</p>
      <p class="emp-role">${emp.cargo} · DNI ${emp.dni}</p>
    </div>
    <div class="emp-salary-block">
      <span class="emp-salary">S/ ${neto.toFixed(2)}</span>
      <span class="badge-modalidad">${emp.regimen}</span>
    </div>
    <div class="emp-actions">
      <button class="btn btn-danger btn-sm" data-action="eliminar" data-id="${emp.id}">Eliminar</button>
    </div>
  `;
  return li;
}

function renderListaPrincipal() {
  const filtro = obtenerFiltro(filtroCargo, salMin, salMax);
  const lista = planilla.filtrar(filtro, config);
  employeeList.innerHTML = "";
  if (lista.length === 0) {
    emptyMsg.hidden = false;
  } else {
    emptyMsg.hidden = true;
    lista.forEach(emp => employeeList.appendChild(crearFilaEmpleado(emp)));
  }
  actualizarChipRegimen();
}

function obtenerFiltro(cargoSel, minInput, maxInput) {
  const cargo = cargoSel.value;
  const min = minInput.value === "" ? null : Number(minInput.value);
  const max = maxInput.value === "" ? null : Number(maxInput.value);
  return { cargo, min, max, regimen: filtroRegimenActivo };
}

function actualizarChipRegimen() {
  const chip = document.getElementById("chipRegimen1");
  if (!filtroRegimenActivo) {
    chip.hidden = true;
  } else {
    chip.hidden = false;
    chip.querySelector("span").textContent = `Mostrando solo: ${filtroRegimenActivo}`;
  }
  ["rowAfp", "rowOnp"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle("filter-active", filtroRegimenActivo === el.dataset.regimen);
  });
}

document.querySelectorAll(".active-filter-chip button").forEach(btn => {
  btn.addEventListener("click", () => {
    filtroRegimenActivo = null;
    renderListaPrincipal();
  });
});

function actualizarSelectCargo() {
  const cargos = planilla.cargosUnicos();
  const valorActual = filtroCargo.value;
  filtroCargo.innerHTML = `<option value="">Filtrar por cargo</option>` +
    cargos.map(c => `<option value="${c}">${c}</option>`).join("");
  filtroCargo.value = cargos.includes(valorActual) ? valorActual : "";
}

[filtroCargo, salMin, salMax].forEach(el => el.addEventListener("input", renderListaPrincipal));

employeeList.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.action === "eliminar") {
    if (confirm("¿Eliminar este empleado?")) {
      planilla.eliminar(id);
      guardarPlanilla();
      renderAll();
    }
  }
});

/* ==========================================================================
   MODULO 2: PROCESAR PAGO
   ========================================================================== */
const formPago = document.getElementById("formPago");
const inputBuscarPago = document.getElementById("buscarPago");
const listaEmpleadosPago = document.getElementById("listaEmpleadosPago");
const hintPagoEmpleado = document.getElementById("hintPagoEmpleado");
const inputFechaPago = document.getElementById("fechaPago");
const selectModalidadPago = document.getElementById("modalidadPago");
const inputHorasExtra = document.getElementById("horasExtra");
const inputTardanzasPago = document.getElementById("tardanzas");
const fieldTardanzas = document.getElementById("fieldTardanzas");
const hintModalidad = document.getElementById("hintModalidad");
const btnProcesarPago = document.getElementById("btnProcesarPago");
const btnLimpiarPago = document.getElementById("btnLimpiarPago");
const btnNuevoPago = document.getElementById("btnNuevoPago");
const payslipPago = document.getElementById("payslipPago");

inputFechaPago.value = new Date().toISOString().slice(0, 10);

function actualizarListaDatalistPago() {
  listaEmpleadosPago.innerHTML = planilla.empleados
    .map(e => `<option value="${e.dni} — ${e.nombre}"></option>`)
    .join("");
}

function buscarEmpleadoDesdeTexto(texto) {
  const limpio = texto.trim();
  if (!limpio) return null;
  const matchDni = limpio.match(/^(\d{8})/);
  if (matchDni) return planilla.obtenerPorDni(matchDni[1]);
  const porDniExacto = planilla.obtenerPorDni(limpio);
  if (porDniExacto) return porDniExacto;
  const porNombreExacto = planilla.empleados.find(e => e.nombre.toLowerCase() === limpio.toLowerCase());
  if (porNombreExacto) return porNombreExacto;
  return planilla.empleados.find(e => e.nombre.toLowerCase().includes(limpio.toLowerCase())) || null;
}

function actualizarVisibilidadModalidadPago() {
  const esQuincena = selectModalidadPago.value === "Quincena";
  fieldTardanzas.hidden = esQuincena;
  document.getElementById("horasExtra").closest(".field").hidden = esQuincena;
  if (esQuincena) {
    hintModalidad.textContent = "Adelanto quincenal: 40% del sueldo básico, sin descuentos de ley.";
    hintModalidad.className = "hint ok";
  } else {
    hintModalidad.textContent = "Pago de fin de mes: se descuenta el adelanto quincenal (40%) y las retenciones de ley.";
    hintModalidad.className = "hint";
  }
}
selectModalidadPago.addEventListener("change", actualizarVisibilidadModalidadPago);
actualizarVisibilidadModalidadPago();

inputBuscarPago.addEventListener("input", () => {
  const emp = buscarEmpleadoDesdeTexto(inputBuscarPago.value);
  if (emp) {
    pagoEmpleadoSeleccionado = emp;
    hintPagoEmpleado.textContent = `✓ ${emp.nombre} · ${emp.cargo} · Sueldo básico S/ ${emp.sueldoBase.toFixed(2)} · ${emp.regimen}`;
    hintPagoEmpleado.className = "hint ok";
  } else {
    pagoEmpleadoSeleccionado = null;
    hintPagoEmpleado.textContent = inputBuscarPago.value.trim() ? "Empleado no encontrado." : "";
    hintPagoEmpleado.className = inputBuscarPago.value.trim() ? "hint error" : "hint";
  }
});

const CAMPOS_BLOQUEABLES_PAGO = [inputBuscarPago, inputFechaPago, selectModalidadPago, inputHorasExtra, inputTardanzasPago];

function bloquearFormularioPago(bloquear) {
  CAMPOS_BLOQUEABLES_PAGO.forEach(el => el.disabled = bloquear);
  btnProcesarPago.disabled = bloquear;
  btnLimpiarPago.disabled = bloquear;
}

formPago.addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    if (!pagoEmpleadoSeleccionado) throw new Error("Busca y selecciona un empleado válido (por DNI o nombre).");
    const fechaPago = inputFechaPago.value;
    const modalidadPago = selectModalidadPago.value;
    const horasExtra = inputHorasExtra.value || 0;
    const tardanzas = modalidadPago === "Quincena" ? 0 : (inputTardanzasPago.value || 0);

    if (!fechaPago) throw new Error("Selecciona la fecha de pago.");
    if (!modalidadPago) throw new Error("Selecciona la modalidad de pago.");
    if (isNaN(horasExtra) || Number(horasExtra) < 0) throw new Error("Ingresa un número válido de horas extra.");
    if (isNaN(tardanzas) || Number(tardanzas) < 0) throw new Error("El descuento por tardanzas/faltas no puede ser negativo.");

    const emp = pagoEmpleadoSeleccionado;
    const pago = new Pago({
      empleadoId: emp.id, dni: emp.dni, nombre: emp.nombre, cargo: emp.cargo,
      sueldoBase: emp.sueldoBase, regimen: emp.regimen,
      fechaPago, modalidadPago, horasExtra, tardanzas
    }, config);

    historial.agregar(pago);
    guardarHistorial();

    bloquearFormularioPago(true);
    renderPayslipEn(pago, "payslipPago");
    renderBoletas();
  } catch (error) {
    alert(error.message);
  }
});

btnLimpiarPago.addEventListener("click", () => {
  formPago.reset();
  inputFechaPago.value = new Date().toISOString().slice(0, 10);
  selectModalidadPago.value = "Mensual";
  actualizarVisibilidadModalidadPago();
  pagoEmpleadoSeleccionado = null;
  hintPagoEmpleado.textContent = "";
  hintPagoEmpleado.className = "hint";
});

btnNuevoPago.addEventListener("click", () => {
  bloquearFormularioPago(false);
  formPago.reset();
  inputFechaPago.value = new Date().toISOString().slice(0, 10);
  selectModalidadPago.value = "Mensual";
  actualizarVisibilidadModalidadPago();
  pagoEmpleadoSeleccionado = null;
  hintPagoEmpleado.textContent = "";
  hintPagoEmpleado.className = "hint";
  payslipPago.innerHTML = `<p class="payslip-placeholder">Completa el formulario y pulsa «Procesar Pago» para ver la boleta.</p>`;
});

/* ==========================================================================
   BOLETA DE PAGO (markup compartido entre Procesar Pago y Boletas de Pago)
   ========================================================================== */
function renderPayslipEn(pago, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  if (!pago) {
    target.innerHTML = `<p class="payslip-placeholder">Selecciona una boleta para verla.</p>`;
    return;
  }

  const fecha = new Date(pago.fechaPago + "T00:00:00").toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const esQuincena = pago.modalidadPago === "Quincena";

  const seccionIngresosDescuentos = esQuincena
    ? `
    <div class="payslip-section">
      <h4>Adelanto Quincenal</h4>
      <div class="payslip-line"><span>Sueldo Básico</span><span>S/ ${pago.sueldoBase.toFixed(2)}</span></div>
      <div class="payslip-line"><span>Adelanto (40% del básico)</span><span>S/ ${pago.neto.toFixed(2)}</span></div>
    </div>
    <p class="hint ok" style="margin:0 0 14px;">Sin descuentos de ley — este monto se regulariza en el pago de fin de mes.</p>
    `
    : `
    <div class="payslip-section">
      <h4>Ingresos</h4>
      <div class="payslip-line"><span>Sueldo Básico</span><span>S/ ${pago.sueldoBase.toFixed(2)}</span></div>
      <div class="payslip-line"><span>Horas Extra (${pago.horasExtra}h)</span><span>S/ ${pago.ingresoExtra.toFixed(2)}</span></div>
      <div class="payslip-line" style="font-weight:700;"><span>Sueldo Bruto</span><span>S/ ${pago.bruto.toFixed(2)}</span></div>
    </div>

    <div class="payslip-section">
      <h4>Descuentos</h4>
      <div class="payslip-line discount"><span>Adelanto Quincenal (40%)</span><span>S/ ${pago.adelanto.toFixed(2)}</span></div>
      <div class="payslip-line discount"><span>${pago.regimen} (${pago.tasaPension}%)</span><span>S/ ${pago.pension.toFixed(2)}</span></div>
      ${pago.tardanzas > 0 ? `<div class="payslip-line discount"><span>Tardanzas / Faltas</span><span>S/ ${pago.tardanzas.toFixed(2)}</span></div>` : ""}
    </div>
    `;

  target.innerHTML = `
    <div class="payslip-company">
      <div class="payslip-company-logo">${inicialesEmpresa(config.empresaNombre)}</div>
      <div class="payslip-company-info">
        <p class="payslip-company-name">${config.empresaNombre}</p>
        <p class="payslip-company-ruc">RUC: ${config.empresaRuc}</p>
      </div>
    </div>

    <span class="payslip-modalidad ${esQuincena ? "is-quincena" : ""}">${esQuincena ? "Adelanto Quincenal" : "Pago Fin de Mes"} · ${fecha}</span>

    <div class="payslip-header">
      <div class="payslip-avatar" data-initials="${pago.iniciales()}" style="background:${colorFromString(pago.nombre)}">
        <img src="${pago.avatarUrl()}" alt="${pago.nombre}" onerror="this.remove()">
      </div>
      <div>
        <h3>${pago.nombre}</h3>
        <p>${pago.cargo}</p>
      </div>
    </div>

    <div class="payslip-section">
      <h4>Información del Empleado</h4>
      <div class="payslip-line"><span>Nombre:</span><span>${pago.nombre}</span></div>
      <div class="payslip-line"><span>DNI:</span><span>${pago.dni}</span></div>
      <div class="payslip-line"><span>Fecha de Pago:</span><span>${fecha}</span></div>
    </div>

    ${seccionIngresosDescuentos}

    <div class="payslip-neto">
      <span>${esQuincena ? "Adelanto a Pagar" : "Sueldo Neto a Pagar"}</span>
      <span>S/ ${pago.neto.toFixed(2)}</span>
    </div>

    <button class="btn btn-primary payslip-print" id="btnImprimir${targetId}">Imprimir Boleta</button>
  `;

  document.getElementById(`btnImprimir${targetId}`).addEventListener("click", () => imprimirBoleta(targetId));
}

function imprimirBoleta(targetId) {
  const origen = document.getElementById(targetId);
  const printArea = document.getElementById("printArea");
  printArea.innerHTML = origen.innerHTML;
  const btnEnClon = printArea.querySelector(".payslip-print");
  if (btnEnClon) btnEnClon.remove();
  window.print();
}

/* ==========================================================================
   MODULO 3: BOLETAS DE PAGO (historial + filtros)
   ========================================================================== */
const listaBoletas = document.getElementById("listaBoletas");
const emptyMsgBoletas = document.getElementById("emptyMsgBoletas");
const filtroFechaBoleta = document.getElementById("filtroFechaBoleta");
const filtroTextoBoleta = document.getElementById("filtroTextoBoleta");
const btnLimpiarFiltrosBoletas = document.getElementById("btnLimpiarFiltrosBoletas");

function renderBoletas() {
  const filtro = { fecha: filtroFechaBoleta.value, texto: filtroTextoBoleta.value };
  const lista = historial.filtrar(filtro);

  listaBoletas.innerHTML = "";
  if (lista.length === 0) {
    emptyMsgBoletas.hidden = false;
    emptyMsgBoletas.textContent = historial.pagos.length === 0
      ? "Aún no se ha procesado ningún pago."
      : "Ningún resultado coincide con los filtros.";
  } else {
    emptyMsgBoletas.hidden = true;
    lista.forEach(pago => listaBoletas.appendChild(crearFilaBoleta(pago)));
  }

  if (boletaSeleccionadaId && lista.some(p => p.id === boletaSeleccionadaId)) {
    renderPayslipEn(historial.obtener(boletaSeleccionadaId), "payslip");
  } else {
    boletaSeleccionadaId = null;
    renderPayslipEn(null, "payslip");
  }
}

function crearFilaBoleta(pago) {
  const li = document.createElement("li");
  li.className = "emp-row";
  if (pago.id === boletaSeleccionadaId) li.classList.add("emp-row-active");
  const fecha = new Date(pago.fechaPago + "T00:00:00").toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });

  li.innerHTML = `
    <div class="emp-avatar" data-initials="${pago.iniciales()}" style="background:${colorFromString(pago.nombre)}">
      <img src="${pago.avatarUrl()}" alt="${pago.nombre}" onerror="this.remove()">
    </div>
    <div class="emp-info">
      <p class="emp-name">${pago.nombre}</p>
      <p class="emp-role">DNI ${pago.dni} · ${fecha}</p>
    </div>
    <span class="badge-modalidad ${pago.modalidadPago === "Quincena" ? "badge-quincena" : ""}">${pago.modalidadPago}</span>
    <button class="btn btn-primary btn-sm" data-id="${pago.id}">Ver Boleta</button>
  `;
  li.querySelector("button").addEventListener("click", () => {
    boletaSeleccionadaId = pago.id;
    renderBoletas();
  });
  return li;
}

[filtroFechaBoleta, filtroTextoBoleta].forEach(el => el.addEventListener("input", renderBoletas));
btnLimpiarFiltrosBoletas.addEventListener("click", () => {
  filtroFechaBoleta.value = "";
  filtroTextoBoleta.value = "";
  renderBoletas();
});

/* ==========================================================================
   DASHBOARD
   ========================================================================== */
function renderDashboard() {
  const totales = planilla.totales(config);
  document.getElementById("statBruto").textContent = `S/ ${totales.bruto.toFixed(2)}`;
  document.getElementById("statDescuentos").textContent = `S/ ${totales.descuentos.toFixed(2)}`;
  document.getElementById("statNeto").textContent = `S/ ${totales.neto.toFixed(2)}`;

  const propBruto = document.getElementById("propBruto");
  const propDescuentos = document.getElementById("propDescuentos");
  const propNeto = document.getElementById("propNeto");
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
  document.getElementById("barAfp").style.width = `${regimen.afp}%`;
  document.getElementById("barOnp").style.width = `${regimen.onp}%`;

  const mayor = planilla.mayorSueldo(config);
  const menor = planilla.menorSueldo(config);
  pintarMiniCard("cardMayor", mayor);
  pintarMiniCard("cardMenor", menor);
  document.getElementById("cardMayor").disabled = !mayor;
  document.getElementById("cardMenor").disabled = !menor;
}

document.querySelectorAll(".regimen-clickable").forEach(btn => {
  btn.addEventListener("click", () => {
    const r = btn.dataset.regimen;
    filtroRegimenActivo = (filtroRegimenActivo === r) ? null : r;
    irAVista("registrar");
  });
});

document.querySelectorAll(".mini-card-clickable").forEach(btn => {
  btn.addEventListener("click", () => {
    const emp = btn.dataset.role === "mayor" ? planilla.mayorSueldo(config) : planilla.menorSueldo(config);
    if (!emp) return;
    // Lleva al usuario a Procesar Pago con el empleado ya buscado
    irAVista("pago");
    inputBuscarPago.value = `${emp.dni} — ${emp.nombre}`;
    inputBuscarPago.dispatchEvent(new Event("input"));
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

document.getElementById("btnExportar").addEventListener("click", () => {
  const blob = new Blob([planilla.toJSON()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "planilla.json";
  a.click();
  URL.revokeObjectURL(url);
});

/* ==========================================================================
   CONFIGURACION
   ========================================================================== */
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
  cfgImpuesto.value = config.tasaImpuesto;
  cfgEmpresa.value = config.empresaNombre;
  cfgRuc.value = config.empresaRuc;
}

document.getElementById("btnGuardarConfig").addEventListener("click", () => {
  try {
    const afp = Number(cfgAfp.value);
    const onp = Number(cfgOnp.value);
    const salud = Number(cfgSalud.value);
    const hora = Number(cfgHora.value);
    const impuesto = Number(cfgImpuesto.value);
    const empresaNombre = cfgEmpresa.value.trim() || config.empresaNombre;
    const empresaRuc = cfgRuc.value.trim();

    if ([afp, onp, salud, hora, impuesto].some(v => isNaN(v) || v < 0)) {
      throw new Error("Todos los valores deben ser números positivos.");
    }

    config = { tasaAfp: afp, tasaOnp: onp, tasaSalud: salud, valorHoraExtra: hora, tasaImpuesto: impuesto, empresaNombre, empresaRuc };
    guardarConfig();
    cfgMsg.textContent = "Configuración guardada correctamente.";
    cfgMsg.className = "hint ok";
    renderAll();
  } catch (error) {
    cfgMsg.textContent = error.message;
    cfgMsg.className = "hint error";
  }
});

document.getElementById("btnResetData").addEventListener("click", () => {
  if (confirm("Esto borrará todos los empleados y boletas guardadas. ¿Continuar?")) {
    localStorage.removeItem("planillaEmpleados");
    localStorage.removeItem("planillaPagos");
    planilla = new Planilla();
    historial = new HistorialPagos();
    boletaSeleccionadaId = null;
    renderAll();
  }
});

/* ---------------------- RENDER GLOBAL (reactividad) ---------------------- */
function renderAll() {
  actualizarSelectCargo();
  actualizarListaDatalistPago();
  renderListaPrincipal();
  renderBoletas();
  renderDashboard();
}

/* ---------------------- INICIALIZACION ---------------------- */
function init() {
  cargarFormConfig();
  renderAll();
}

init();