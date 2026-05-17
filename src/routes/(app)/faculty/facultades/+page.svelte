<script lang="ts">
    // ============================================================
    // faculty/facultades/+page.svelte — Facultades (Solo lectura)
    // ============================================================
    // Vista de consulta de facultades para el Coordinador.
    // No permite crear, editar ni eliminar registros.
    // Solo muestra nombre y estado de cada facultad.
    // ============================================================
    import { onMount } from 'svelte';
    import PageHeader from "$lib/components/PageHeader.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import StatusBadge from "$lib/components/StatusBadge.svelte";

    let facultades = $state<any[]>([]);
    let cargando = $state(true);
    let error = $state("");

    const headers = [
        { label: "Nombre de la Facultad" },
        { label: "Estado" }
        // Sin columna Acciones → solo lectura
    ];

    async function cargar() {
        try {
            const res = await fetch("https://gestion-de-horarios-1.onrender.com/faculties/", {
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            facultades = Array.isArray(data) ? data : [];
        } catch (err) {
            error = "Error al conectar con el servidor";
        } finally {
            cargando = false;
        }
    }

    onMount(cargar);
</script>

<!-- buttonText vacío y onButtonClick vacío → no muestra botón de acción -->
<PageHeader
    title="Facultades"
    subtitle="Unidades Académicas Universidad CUL"
    buttonText=""
    onButtonClick={() => {}}
/>

{#if cargando}
    <LoadingSpinner />
{:else if error}
    <div class="alert alert-danger border-0 shadow-sm">{error}</div>
{:else}
    <DataTable {headers} data={facultades}>
        {#snippet rowTemplate(f)}
            <tr>
                <td>
                    <div class="fw-bold">{f.name}</div>
                    <small class="text-muted">CUL - Sede Principal</small>
                </td>
                <td><StatusBadge active={f.is_active} /></td>
                <!-- Sin columna de acciones → solo lectura -->
            </tr>
        {/snippet}
    </DataTable>
{/if}