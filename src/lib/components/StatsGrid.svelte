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
    <!--
        Administrador: 6 tarjetas
        xs: 1/fila · sm: 2/fila · lg: 3/fila · xl: 6/fila
    -->
    {#if role === 'admi' || role === 'admin' || role === 'Administrador' || role === 'administrador'}
        {@const col = 'col-12 col-sm-6 col-lg-4 col-xl-2'}
        <DashboardCard title="Usuarios"   value={data.usuarios}   icon="bi-people"          color="primary"   link="/admi/usuarios"   linkText="Gestionar" colClass={col} />
        <DashboardCard title="Facultades" value={data.facultades} icon="bi-building"         color="success"   link="/admi/facultades" linkText="Ver"       colClass={col} />
        <DashboardCard title="Programas"  value={data.programas}  icon="bi-journal-bookmark" color="info"      link="/admi/programas"  linkText="Ver"       colClass={col} />
        <DashboardCard title="Docentes"   value={data.docentes}   icon="bi-person-badge"     color="warning"   link="/admi/docentes"   linkText="Asignar"   colClass={col} />
        <DashboardCard title="Materias"   value={data.materias}   icon="bi-journal-text"     color="danger"    link="/admi/materias"   linkText="Ver"       colClass={col} />
        <DashboardCard title="Horarios"   value={data.horarios}   icon="bi-calendar-week"    color="secondary" link="/admi/horarios"   linkText="Ver"       colClass={col} />

    <!--
        Coordinador: 4 tarjetas
        xs: 1/fila · sm: 2/fila · lg: 4/fila
    -->
    {:else if role === 'faculty' || role === 'Faculty'}
        {@const col = 'col-12 col-sm-6 col-lg-3'}
        <DashboardCard title="Docentes"   value={data.docentes}   icon="bi-person-badge"     color="primary" link="/faculty/docentes"   linkText="Ver docentes"  colClass={col} />
        <DashboardCard title="Programas"  value={data.programas}  icon="bi-journal-bookmark" color="info"    link="/faculty/programas"  linkText="Ver programas" colClass={col} />
        <DashboardCard title="Facultades" value={data.facultades} icon="bi-building"          color="success" link="/faculty/facultades" linkText="Ver facultades" colClass={col} />
        <DashboardCard title="Materias"   value={data.materias}   icon="bi-journal-text"      color="warning" link="/faculty/materias"   linkText="Ver materias"  colClass={col} />

    <!--
        Docente: 3 tarjetas
        xs: 1/fila · sm: 2/fila (primera ocupa fila completa al haber 3) · md: 3/fila
    -->
    {:else if role === 'teacher' || role === 'Teacher' || role === 'Docente' || role === 'docente'}
        {@const col = 'col-12 col-sm-6 col-md-4'}
        <DashboardCard title="Bloques libres"   value={data.disponibilidades ?? 0} icon="bi-clock"        color="warning" link="/teacher/disponibilidad" linkText="Configurar" colClass={col} />
        <DashboardCard title="Materias"         value={data.materias}              icon="bi-journal-text" color="success" link="/teacher/materias"       linkText="Ver"        colClass={col} />
        <DashboardCard title="Horas asignadas"  value={data.horarios}              icon="bi-calendar-week" color="info"   link="/teacher/horarios"       linkText="Revisar"    colClass={col} />
    {/if}
</div>