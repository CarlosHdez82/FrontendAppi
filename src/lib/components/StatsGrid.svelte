<script lang="ts">
    import DashboardCard from './DashboardCard.svelte';
    
    let { role, data } = $props();
</script>

<div class="row g-4">
    {#if role === 'admi'}
        <DashboardCard title="Usuarios" value={data.usuarios} icon="bi-people" color="primary" link="/admi/usuarios" linkText="Gestionar" />
        <DashboardCard title="Facultades" value={data.facultades} icon="bi-building" color="success" link="/admi/facultades" linkText="Ver" />
        <DashboardCard title="Programas" value={data.programas} icon="bi-journal-bookmark" color="info" link="/admi/programas" linkText="Ver" />
        <DashboardCard title="Docentes" value={data.docentes} icon="bi-person-badge" color="warning" link="/admi/docentes" linkText="Asignar" />
    
    {:else if role === 'faculty'}
        <DashboardCard title="Facultades" value={data.facultades} icon="bi-building" color="primary" link="/admi/facultades" linkText="Ver" />
        <DashboardCard title="Programas" value={data.programas} icon="bi-journal-bookmark" color="success" link="/admi/programas" linkText="Ver" />
        <DashboardCard title="Docentes" value={data.docentes} icon="bi-person-badge" color="info" link="/admi/docentes" linkText="Asignar" />
        <DashboardCard title="Materias" value={data.materias} icon="bi-journal-text" color="warning" link="/admi/materias" linkText="Ver" />
    
    {:else if role === 'teacher'}
        <DashboardCard title="Programas" value={data.programas} icon="bi-journal-bookmark" color="primary" link="/admi/programas" linkText="Ver" />
        <DashboardCard title="Materias" value={data.materias} icon="bi-journal-text" color="success" link="/admi/materias" linkText="Ver" />
        <DashboardCard title="Horarios" value={data.horarios} icon="bi-calendar-week" color="info" link="/admi/horarios" linkText="Revisar" />
        <DashboardCard title="Disponibilidad" value={data.horarios} icon="bi-clock" color="warning" link="/teacher/disponibilidad" linkText="Configurar" />
    {/if}
</div>