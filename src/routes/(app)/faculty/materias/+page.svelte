<script lang="ts">
    import { onMount } from 'svelte';
    import PageHeader from "$lib/components/PageHeader.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

    const API = "https://gestion-de-horarios-1.onrender.com";

    let materias = $state<any[]>([]);
    let cargando = $state(true);
    let error = $state("");

    const headers = [
        { label: "Materia", class: "ps-4" },
        { label: "Créditos" },
        { label: "Programa" }
    ];

    async function cargarDatos() {
        cargando = true;
        try {
            const res = await fetch(`${API}/subjects/`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) materias = await res.json();
            else error = "No se pudieron cargar las materias";
        } catch (e) {
            error = "Error de conexión";
        } finally {
            cargando = false;
        }
    }

    onMount(cargarDatos);
</script>

<PageHeader 
    title="Materias" 
    subtitle="Catálogo de asignaturas — Universidad CUL"
/>

{#if cargando}
    <LoadingSpinner />
{:else if error}
    <div class="alert alert-danger border-0 shadow-sm">{error}</div>
{:else}
    <DataTable {headers} data={materias}>
        {#snippet rowTemplate(m)}
            <tr>
                <td class="ps-4 fw-bold text-primary">{m.name}</td>
                <td><span class="badge bg-secondary">{m.credits} Créditos</span></td>
                <td class="text-muted">{m.program_name || 'N/A'}</td>
            </tr>
        {/snippet}
    </DataTable>
{/if}
