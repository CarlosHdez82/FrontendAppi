export type MenuItem = {
  icon: string;
  label: string;
  href: string;
};

export type Menus = {
  admi: MenuItem[];
  faculty: MenuItem[];
  teacher: MenuItem[];
  student: MenuItem[];
};

export const menus: Menus = {
  admi: [
    { icon: "bi bi-speedometer2", label: "Dashboard", href: "/admi/dashboard" },
    { icon: "bi bi-people", label: "Usuarios", href: "/admi/usuarios" },
    { icon: "bi bi-building", label: "Facultades", href: "/admi/facultades" },
    { icon: "bi bi-clipboard2", label: "Programas", href: "/admi/programas" },
    { icon: "bi bi-person", label: "Docentes", href: "/admi/docentes" },
    { icon: "bi bi-book", label: "Materias", href: "/admi/materias" },
    { icon: "bi bi-calendar", label: "Periodos", href: "/admi/periodos" },
    { icon: "bi bi-clock", label: "Disponibilidad", href: "/admi/disponibilidad" },
    { icon: "bi bi-calendar-week", label: "Horarios", href: "/admi/horarios" }
  ],
  faculty: [
    { icon: "bi bi-speedometer2", label: "Dashboard", href: "/faculty/dashboard" },
    { icon: "bi bi-building", label: "Facultades", href: "/faculty/facultades" },
    { icon: "bi bi-clipboard2", label: "Programas", href: "/faculty/programas" },
    { icon: "bi bi-person", label: "Docentes", href: "/faculty/docentes" },
    { icon: "bi bi-book", label: "Materias", href: "/faculty/materias" },
    { icon: "bi bi-calendar", label: "Periodos", href: "/faculty/periodos" },
    { icon: "bi bi-clock", label: "Disponibilidad", href: "/faculty/disponibilidad" },
    { icon: "bi bi-calendar-week", label: "Horarios", href: "/faculty/horarios" }
  ],
  teacher: [
    { icon: "bi bi-speedometer2", label: "Dashboard", href: "/teacher/dashboard" },
    { icon: "bi bi-clock", label: "Disponibilidad", href: "/teacher/disponibilidad" },
    { icon: "bi bi-calendar-week", label: "Horarios", href: "/teacher/horarios" }
  ],
  student: [
    { icon: "bi bi-speedometer2", label: "Dashboard", href: "/student/dashboard" },
    { icon: "bi bi-calendar-week", label: "Horarios", href: "/student/horarios" }
  ]
};