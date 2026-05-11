<script lang="ts">
    import { onMount } from 'svelte';
    import PageHeader from "$lib/components/PageHeader.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import StatusBadge from "$lib/components/StatusBadge.svelte";

    const API = "https://gestion-de-horarios-1.onrender.com";

    let periodos = $state<any[]>([]);
    let cargando = $state(true);
    let error = $state("");

    const headers = [
        { label: "Nombre", class: "ps-4" },
        { label: "Fecha Inicio" },
        { label: "Fecha Fin" },
        { label: "Estado", class: "text-center" }
    ];

    async function cargarDatos() {
        cargando = true;
        try {
            const res = await fetch(`${API}/academic-periods/`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) periodos = await res.json();
            else error = "No se pudieron cargar los periodos";
        } catch (e) {
            error = "Error de conexión";
        } finally {
            cargando = false;
        }
    }

    onMount(cargarDatos);
</script>

<PageHeader 
    title="Periodos Académicos" 
    subtitle="Semestres vigentes — Universidad CUL"
/>

{#if cargando}
    <LoadingSpinner />
{:else if error}
    <div class="alert alert-danger border-0 shadow-sm">{error}</div>
{:else}
    <DataTable {headers} data={periodos}>
        {#snippet rowTemplate(p)}
            <tr>
                <td class="ps-4 fw-bold text-dark">{p.name}</td>
                <td>
                    {#if p.start_date}
                        <i class="bi bi-calendar-event me-1 text-muted"></i>{p.start_date}
                    {:else}
                        <span class="text-muted small">Sin fecha</span>
                    {/if}
                </td>
                <td>
                    {#if p.end_date}
                        <i class="bi bi-calendar-check me-1 text-muted"></i>{p.end_date}
                    {:else}
                        <span class="text-muted small">Sin fecha</span>
                    {/if}
                </td>
                <td class="text-center"><StatusBadge active={p.is_active} /></td>
            </tr>
        {/snippet}
    </DataTable>
{/if}
