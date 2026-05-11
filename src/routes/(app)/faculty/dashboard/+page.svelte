<script lang="ts">
    import { onMount } from 'svelte';
    import { userRole, userName } from "$lib/stores/user";
    import StatsGrid from '$lib/components/StatsGrid.svelte';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    const API = "https://gestion-de-horarios-1.onrender.com";

    let stats = $state({
        docentes: 0, materias: 0, horarios: 0,
        disponibilidades: 0, periodos: 0
    });
    let periodoActivo = $state<string | null>(null);
    let cargando = $state(true);
    let role = $derived($userRole);
    let name = $derived($userName);

    async function cargarDatos() {
        const token = localStorage.getItem('token');
        const h = { "Authorization": `Bearer ${token}` };
        try {
            const res = await fetch(`${API}/stats/summary`, { headers: h });
            if (res.ok) {
                const data = await res.json();
                stats = data;
                periodoActivo = data.periodo_actual ?? null;
            }
        } catch (error) {
            console.error("Error stats:", error);
        } finally {
            cargando = false;
        }
    }

    onMount(cargarDatos);
</script>

{#if cargando}
    <LoadingSpinner />
{:else}
    <div class="mb-4">
        <h4 class="fw-bold mb-0">Bienvenido, {name ?? 'Coordinador'}</h4>
        <p class="text-muted small">Panel de Coordinación — Universidad CUL</p>
    </div>

    <StatsGrid {role} data={stats} />

    <div class="row mt-4">
        <div class="col-md-6 mb-3">
            <div class="card border-0 shadow-sm p-4 h-100">
                <h5 class="fw-bold mb-2 text-primary">
                    <i class="bi bi-clock me-2"></i>Gestión de Disponibilidad
                </h5>
                <p class="text-muted small mb-3">
                    Consulta y administra los bloques de disponibilidad registrados por los docentes para el periodo activo.
                </p>
                <div class="d-flex gap-2">
                    <a href="/faculty/disponibilidad" class="btn btn-primary btn-sm">Ver disponibilidad</a>
                </div>
            </div>
        </div>
        <div class="col-md-6 mb-3">
            <div class="card border-0 shadow-sm p-4 h-100">
                <h5 class="fw-bold mb-2 text-success">
                    <i class="bi bi-calendar-week me-2"></i>Asignación de Horarios
                </h5>
                <p class="text-muted small mb-3">
                    Asigna materias y bloques horarios a los docentes según su disponibilidad registrada.
                </p>
                <div class="d-flex gap-2">
                    <a href="/faculty/horarios" class="btn btn-success btn-sm">Gestionar horarios</a>
                    <a href="/faculty/docentes" class="btn btn-outline-secondary btn-sm">Ver docentes</a>
                </div>
            </div>
        </div>
        {#if periodoActivo}
        <div class="col-12 mb-3">
            <div class="card border-0 shadow-sm p-3 bg-light">
                <div class="d-flex align-items-center gap-3">
                    <i class="bi bi-calendar-check fs-4 text-warning"></i>
                    <div>
                        <span class="small text-warning fw-bold">PERIODO ACADÉMICO ACTIVO</span>
                        <div class="fw-bold">{periodoActivo}</div>
                    </div>
                    <a href="/faculty/periodos" class="btn btn-outline-warning btn-sm ms-auto">Ver periodos</a>
                </div>
            </div>
        </div>
        {/if}
    </div>
{/if}
