<script lang="ts">
    import { onMount } from 'svelte';
    import { userRole } from "$lib/stores/user";
    import StatsGrid from '$lib/components/StatsGrid.svelte';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    let stats = $state({
        usuarios: 0, facultades: 0, programas: 0,
        docentes: 0, materias: 0, horarios: 0
    });
    let cargando = $state(true);
    let role = $derived($userRole);

    async function cargarDatos() {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch("https://gestion-de-horarios-final.onrender.com/stats/summary", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            stats = await res.json();
        } catch (error) {
            console.error("Error:", error);
        } finally {
            cargando = false;
        }
    }

    onMount(cargarDatos);
</script>

{#if cargando}
    <LoadingSpinner />
{:else}
    <StatsGrid {role} data={stats} />

    {#if role === 'admi'}
        <div class="row mt-4">
            <div class="col-md-6 mb-3">
                <div class="card border-0 shadow-sm p-4 h-100">
                    <h5 class="fw-bold mb-3 text-primary">Configuración Académica</h5>
                    <p class="text-muted small">Define programas y materias de la Universidad CUL.</p>
                    <div class="d-flex gap-2">
                        <a href="/admi/programas" class="btn btn-primary btn-sm">Programas</a>
                        <a href="/admi/materias" class="btn btn-outline-primary btn-sm">Materias</a>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <div class="card border-0 shadow-sm p-4 h-100">
                    <h5 class="fw-bold mb-3 text-secondary">Control de Periodo</h5>
                    <div class="d-flex align-items-center">
                        <div class="badge bg-dark p-2 me-3">2026-1</div>
                        <p class="mb-0 text-muted small">Estado: <strong>Activo para asignación</strong></p>
                    </div>
                </div>
            </div>
        </div>
    {/if}
{/if}