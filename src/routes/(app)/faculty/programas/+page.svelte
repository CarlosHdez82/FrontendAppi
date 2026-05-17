<script lang="ts">
    // ============================================================
    // faculty/programas/+page.svelte — Programas (Solo lectura)
    // ============================================================
    // Vista de consulta de programas académicos para el Coordinador.
    // No permite crear, editar ni eliminar registros.
    // Muestra nombre, facultad y estado de cada programa.
    // ============================================================
    import { onMount } from 'svelte';
    import PageHeader from "$lib/components/PageHeader.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import StatusBadge from "$lib/components/StatusBadge.svelte";

    let programas = $state<any[]>([]);
    let cargando = $state(true);

    const headers = [
        { label: "Nombre de la Carrera", class: "ps-4" },
        { label: "Facultad" },
        { label: "Estado", class: "text-center" }
        // Sin columna Acciones → solo lectura
    ];

    async function cargarDatos() {
        const token = localStorage.getItem('token');
        const h = { "Authorization": `Bearer ${token}` };
        try {
            const res = await fetch("https://gestion-de-horarios-1.onrender.com/programs/", { headers: h });
            if (res.ok) programas = await res.json();
        } catch (e) {
            console.error("Error al conectar con la API de la CUL");
        } finally {
            cargando = false;
        }
    }

    onMount(cargarDatos);
</script>

<!-- buttonText vacío → no muestra botón de acción -->
<PageHeader
    title="Programas Académicos"
    subtitle="Configuración de carreras por facultad - Universidad CUL"
    buttonText=""
    onButtonClick={() => {}}
/>

{#if cargando}
    <LoadingSpinner />
{:else}
    <DataTable {headers} data={programas}>
        {#snippet rowTemplate(p)}
            <tr>
                <td class="ps-4 fw-bold text-dark">{p.name}</td>
                <td>
                    <!-- faculty_name obtenido por JOIN en la API -->
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
                        <i class="bi bi-building me-1"></i> {p.faculty_name}
                    </span>
                </td>
                <td class="text-center">
                    <StatusBadge active={p.is_active} />
                </td>
                <!-- Sin columna de acciones → solo lectura -->
            </tr>
        {/snippet}
    </DataTable>
{/if}