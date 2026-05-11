<script lang="ts">
    import { onMount } from 'svelte';
    import PageHeader from "$lib/components/PageHeader.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import StatusBadge from "$lib/components/StatusBadge.svelte";

    const API = "https://gestion-de-horarios-1.onrender.com";

    let docentes = $state<any[]>([]);
    let cargando = $state(true);
    let error = $state("");

    const headers = [
        { label: "Docente", class: "ps-4" },
        { label: "Correo" },
        { label: "Programa / Facultad" },
        { label: "Estado" }
    ];

    const getHeaders = () => ({
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    });

    async function cargarDatos() {
        cargando = true;
        try {
            const res = await fetch(`${API}/users/teachers`, { headers: getHeaders() });
            if (res.ok) docentes = await res.json();
            else error = "No se pudieron cargar los docentes";
        } catch (e) {
            error = "Error de conexión con el servidor";
        } finally {
            cargando = false;
        }
    }

    onMount(cargarDatos);
</script>

<PageHeader 
    title="Docentes" 
    subtitle="Listado de docentes — Universidad CUL"
/>

{#if cargando}
    <LoadingSpinner />
{:else if error}
    <div class="alert alert-danger border-0 shadow-sm">{error}</div>
{:else}
    <DataTable {headers} data={docentes}>
        {#snippet rowTemplate(u)}
            <tr>
                <td class="ps-4">
                    <div class="fw-bold text-dark">{u.first_name} {u.last_name}</div>
                </td>
                <td class="text-muted small">{u.email}</td>
                <td>
                    <div class="fw-semibold text-primary small">{u.program_name || 'N/A'}</div>
                    <div class="text-muted small">{u.faculty_name || 'N/A'}</div>
                </td>
                <td><StatusBadge active={u.is_active} /></td>
            </tr>
        {/snippet}
    </DataTable>
{/if}
