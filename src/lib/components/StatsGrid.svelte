<script lang="ts">
    // ============================================================
    // StatsGrid.svelte — Grilla de tarjetas del Dashboard
    // ============================================================
    // Renderiza las tarjetas de métricas según el rol del usuario.
    // Cada rol ve un conjunto diferente de estadísticas relevantes:
    //   - admi:    usuarios, facultades, programas, docentes, materias, horarios
    //   - faculty: docentes, programas, facultades, materias
    //   - teacher: disponibilidad, materias, horarios
    //
    // Los datos vienen de la API: GET /stats/summary
    // ============================================================
    import DashboardCard from './DashboardCard.svelte';

    // role: rol del usuario autenticado
    // data: objeto con los conteos retornados por la API
    let { role, data } = $props();
</script>

<div class="row g-4">
    <!-- Tarjetas del Administrador: visión completa del sistema -->
    {#if role === 'admi' || role === 'admin' || role === 'Administrador' || role === 'administrador'}
        <DashboardCard title="Usuarios"   value={data.usuarios}   icon="bi-people"           color="primary"   link="/admi/usuarios"   linkText="Gestionar" />
        <DashboardCard title="Facultades" value={data.facultades} icon="bi-building"          color="success"   link="/admi/facultades" linkText="Ver" />
        <DashboardCard title="Programas"  value={data.programas}  icon="bi-journal-bookmark"  color="info"      link="/admi/programas"  linkText="Ver" />
        <DashboardCard title="Docentes"   value={data.docentes}   icon="bi-person-badge"      color="warning"   link="/admi/docentes"   linkText="Asignar" />
        <DashboardCard title="Materias"   value={data.materias}   icon="bi-journal-text"      color="danger"    link="/admi/materias"   linkText="Ver" />
        <DashboardCard title="Horarios"   value={data.horarios}   icon="bi-calendar-week"     color="secondary" link="/admi/horarios"   linkText="Ver" />

    <!-- Tarjetas del Coordinador: visión académica de su área -->
    {:else if role === 'faculty' || role === 'Faculty'}
        <DashboardCard title="Docentes"   value={data.docentes}   icon="bi-person-badge"      color="primary" link="/faculty/docentes"   linkText="Ver docentes" />
        <DashboardCard title="Programas"  value={data.programas}  icon="bi-journal-bookmark"  color="info"    link="/faculty/programas"  linkText="Ver programas" />
        <DashboardCard title="Facultades" value={data.facultades} icon="bi-building"           color="success" link="/faculty/facultades" linkText="Ver facultades" />
        <DashboardCard title="Materias"   value={data.materias}   icon="bi-journal-text"       color="warning" link="/faculty/materias"   linkText="Ver materias" />

    <!-- Tarjetas del Docente: solo su actividad personal -->
    {:else if role === 'teacher' || role === 'Teacher' || role === 'Docente' || role === 'docente'}
        <DashboardCard title="Disponibilidad" value={data.disponibilidades ?? 0} icon="bi-clock"         color="warning" link="/teacher/disponibilidad" linkText="Configurar" />
        <DashboardCard title="Materias"       value={data.materias}              icon="bi-journal-text"  color="success" link="/teacher/materias"       linkText="Ver" />
        <DashboardCard title="Horarios"       value={data.horarios}              icon="bi-calendar-week" color="info"    link="/teacher/horarios"       linkText="Revisar" />
    {/if}
</div>