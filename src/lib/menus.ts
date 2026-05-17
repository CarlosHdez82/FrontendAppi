// ============================================================
// menus.ts — Configuración de navegación por rol
// ============================================================
// Define los ítems del menú lateral (Sidebar) para cada rol
// del sistema. Cada rol tiene su propio conjunto de rutas
// accesibles según sus permisos.
//
// Estructura de cada ítem:
// - icon:  clase de Bootstrap Icons para el ícono visual
// - label: texto que aparece en el menú
// - href:  ruta de SvelteKit a la que navega al hacer clic
// ============================================================

// ------------------------------------------------------------
// Tipo MenuItem — estructura de cada ítem del menú
// ------------------------------------------------------------
export type MenuItem = {
  icon: string;   // Clase Bootstrap Icons (ej: "bi bi-speedometer2")
  label: string;  // Texto visible en el menú (ej: "Dashboard")
  href: string;   // Ruta de navegación (ej: "/admi/dashboard")
};

// ------------------------------------------------------------
// Tipo Menus — agrupa los menús de todos los roles
// Se usa como keyof en AppLayout para acceder al menú
// correcto según el rol del usuario autenticado.
// ------------------------------------------------------------
export type Menus = {
  admi: MenuItem[];     // Menú del Administrador
  faculty: MenuItem[];  // Menú del Coordinador
  teacher: MenuItem[];  // Menú del Docente
};

// ------------------------------------------------------------
// Objeto menus — definición de rutas por rol
// Cada clave corresponde al valor exacto que retorna la API
// en el campo 'role' al hacer login.
// ------------------------------------------------------------
export const menus: Menus = {

  // Administrador — acceso completo a todos los módulos
  admi: [
    { icon: "bi bi-speedometer2",  label: "Dashboard",      href: "/admi/dashboard" },
    { icon: "bi bi-people",        label: "Usuarios",       href: "/admi/usuarios" },
    { icon: "bi bi-building",      label: "Facultades",     href: "/admi/facultades" },
    { icon: "bi bi-clipboard2",    label: "Programas",      href: "/admi/programas" },
    { icon: "bi bi-person",        label: "Docentes",       href: "/admi/docentes" },
    { icon: "bi bi-book",          label: "Materias",       href: "/admi/materias" },
    { icon: "bi bi-calendar",      label: "Periodos",       href: "/admi/periodos" },
    { icon: "bi bi-clock",         label: "Disponibilidad", href: "/admi/disponibilidad" },
    { icon: "bi bi-calendar-week", label: "Horarios",       href: "/admi/horarios" }
  ],

  // Coordinador — gestión académica, sin acceso a configuración
  faculty: [
    { icon: "bi bi-speedometer2",  label: "Dashboard",      href: "/faculty/dashboard" },
    { icon: "bi bi-person-badge",  label: "Docentes",       href: "/faculty/docentes" },
    { icon: "bi bi-clock",         label: "Disponibilidad", href: "/faculty/disponibilidad" },
    { icon: "bi bi-calendar-week", label: "Horarios",       href: "/faculty/horarios" },
    { icon: "bi bi-book",          label: "Materias",       href: "/faculty/materias" },
    { icon: "bi bi-calendar",      label: "Periodos",       href: "/faculty/periodos" }
  ],

  // Docente — solo consulta y su propia disponibilidad
  teacher: [
    { icon: "bi bi-speedometer2",  label: "Dashboard",      href: "/teacher/dashboard" },
    { icon: "bi bi-clock",         label: "Disponibilidad", href: "/teacher/disponibilidad" },
    { icon: "bi bi-book",          label: "Materias",       href: "/teacher/materias" },
    { icon: "bi bi-calendar-week", label: "Horarios",       href: "/teacher/horarios" }
  ]
};