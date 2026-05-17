<script lang="ts">
    // ============================================================
    // faculty/docentes/+page.svelte — Docentes (Solo lectura)
    // ============================================================
    // Vista de consulta de docentes para el Coordinador.
    // Muestra nombre, correo, programa/facultad y estado.
    // No permite crear, editar ni eliminar docentes.
    // ============================================================
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
        // Sin columna Acciones → solo lectura
    ];

    const getHeaders = () => ({
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    });

    async function cargarDatos() {
        cargando = true;
        try {
            // GET /users/teachers filtra solo usuarios con rol docente
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
    buttonText=""
    onButtonClick={() => {}}
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
                    <!-- program_name y faculty_name obtenidos por JOIN triple en la API -->
                    <div class="fw-semibold text-primary small">{u.program_name || 'N/A'}</div>
                    <div class="text-muted small">{u.faculty_name || 'N/A'}</div>
                </td>
                <td><StatusBadge active={u.is_active} /></td>
            </tr>
        {/snippet}
    </DataTable>
{/if}