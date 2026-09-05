# Employee Payroll Management 💼

Sistema de planillas (nómina) de una sola página, construido con **JavaScript puro (Vanilla JS)**, **HTML5** y **CSS3** — sin frameworks ni librerías externas. Simula cómo un área de Recursos Humanos registraría empleados, calcularía sus descuentos y generaría boletas de pago, con un dashboard gerencial en vivo.

Proyecto desarrollado como práctica integradora del curso de **JavaScript Avanzado**, aplicando los temas vistos a lo largo de 4 semanas de clase.

## ✨ Características

- **Registro de empleados** con validación en tiempo real (nombre, DNI, sueldo, régimen de pensión).
- **Lista de empleados** filtrable por cargo y por rango salarial.
- **Boleta de pago** generada dinámicamente, con desglose de ingresos, descuentos (AFP/ONP, EsSalud, Impuesto a la Renta) y sueldo neto.
- **Impresión de boleta** aislada (solo el tiquet, con el logo y datos de la empresa — no imprime el resto de la pantalla).
- **Dashboard gerencial en tiempo real**: total bruto pagado, total de descuentos, total neto, distribución de empleados por régimen (AFP/ONP), y empleado con mayor/menor sueldo — todo interactivo (haz clic en una barra o en una tarjeta para filtrar o ver el detalle).
- **Configuración editable**: tasas de AFP, ONP, EsSalud, Impuesto a la Renta, valor de la hora extra, y datos de la empresa (nombre y RUC).
- **Persistencia local** con `localStorage` — los datos no se pierden al recargar la página.
- **Exportación** de la planilla completa a un archivo `.json`.
- Diseño **responsive** y **dark UI**, con fotos de perfil generadas automáticamente por empleado.

## 🖥️ Vista previa

La pantalla principal muestra tres secciones simultáneas: registro y lista de empleados, boleta de pago en vivo, y dashboard — todo sincronizado en tiempo real. Un menú lateral permite navegar a vistas ampliadas de cada sección (Lista, Boletas, Dashboard, Configuración).

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura semántica de la aplicación |
| **CSS3** | Diseño dark UI, grid/flexbox, responsive, estilos de impresión (`@media print`) |
| **JavaScript (ES6+)** | Toda la lógica de negocio, sin frameworks ni dependencias |

## 📂 Estructura del proyecto

```
payroll/
├── index.html          # Estructura de la aplicación (todas las vistas)
├── css/
│   └── style.css       # Estilos (dark theme, layout, impresión)
├── js/
│   └── app.js          # Lógica: clases, cálculos, validaciones, render, localStorage
├── assets/              # Recursos estáticos adicionales (opcional)
└── README.md
```

## 🚀 Cómo ejecutarlo

No requiere instalación ni servidor. Basta con abrir el archivo directamente en el navegador:

```bash
git clone https://github.com/tu-usuario/employee-payroll-management.git
cd employee-payroll-management
```

Luego abre `index.html` con doble clic, o sírvelo con cualquier servidor estático:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## 📚 Conceptos de JavaScript aplicados

Este proyecto fue diseñado para poner en práctica, de forma integrada, los temas cubiertos durante el curso:

- **Semana 1** — Tipos de datos, estructuras de control (`if`, `switch`, `try/catch`), funciones, eventos del DOM (`addEventListener`, `submit`, `input`, `click`).
- **Semana 2** — Operadores matemáticos y de asignación, el objeto `Math` (`round`, `max`), cálculo de sueldos y descuentos.
- **Semana 3** — Manejo de cadenas y expresiones regulares (validación de nombre y DNI), *template literals* para renderizar la UI dinámicamente.
- **Semana 4** — Clases y objetos (`Empleado`, `Planilla`), arreglos y sus métodos (`forEach`, `map`, `filter`, `find`, `reduce`), `Map`/`Set`, `JSON.stringify`/`JSON.parse` para la persistencia.

## ⚙️ Configuración por defecto

| Parámetro | Valor por defecto |
|---|---|
| Tasa AFP | 12% |
| Tasa ONP | 13% |
| Tasa EsSalud | 9% |
| Impuesto a la Renta | 5% |
| Valor hora extra | $10.00 |

Todos estos valores son editables desde la sección **Configuración** de la aplicación.

## 📄 Licencia

Proyecto académico de uso libre para fines educativos.
