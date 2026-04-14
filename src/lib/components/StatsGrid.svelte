<script lang="ts">
    import DashboardCard from './DashboardCard.svelte';
    
    let { role, data } = $props();
</script>

<div class="row g-4">
    {#if role === 'admi'}
        <DashboardCard title="Usuarios" value={data.usuarios} icon="bi-people" color="primary" link="/admi/usuarios" linkText="Gestionar" />
        <DashboardCard title="Facultades" value={data.facultades} icon="bi-building" color="success" link="/admi/facultades" linkText="Ver" />
        <DashboardCard title="Docentes" value={data.docentes} icon="bi-person-badge" color="info" link="/admi/docentes" linkText="Asignar" />
        <DashboardCard title="Horarios" value={data.horarios} icon="bi-calendar-week" color="warning" link="/admi/horarios" linkText="Revisar" />
    
    {:else if role === 'faculty'}
        <DashboardCard title="Facultades" value={data.facultades} icon="bi-building" color="success" link="/admi/facultades" linkText="Ver" />
        <DashboardCard title="Docentes" value={data.docentes} icon="bi-person-badge" color="info" link="/admi/docentes" linkText="Asignar" />
        <DashboardCard title="Horarios" value={data.horarios} icon="bi-calendar-week" color="warning" link="/admi/horarios" linkText="Revisar" />
    
    {:else if role === 'teacher'}
        <DashboardCard title="Mis Horarios" value={data.mis_horarios} icon="bi-calendar-check" color="primary" link="/teacher/horarios" linkText="Ver mi agenda" />
        <DashboardCard title="Tutorías Hoy" value={data.tutorias_pendientes} icon="bi-clock-history" color="warning" link="/teacher/tutorias" linkText="Atender" />
    
    {:else if role === 'student'}
        <DashboardCard title="Clases Hoy" value={data.clases_hoy} icon="bi-book" color="info" link="/student/clases" linkText="Ver aula" />
    {/if}
</div>