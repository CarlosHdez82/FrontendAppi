<script lang="ts">
    import { onMount } from 'svelte';
    import { userRole, userName } from "$lib/stores/user";
    import StatsGrid from '$lib/components/StatsGrid.svelte';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    const API = "https://gestion-de-horarios-1.onrender.com";

    let stats = $state({ docentes: 0, materias: 0, horarios: 0, disponibilidades: 0 });
    let periodoActivo = $state<string | null>(null);
    let cargando = $state(true);
    let role = $derived($userRole);
    let name = $derived($userName);

    async function cargarDatos() {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API}/stats/summary`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                stats = data;
                periodoActivo = data.periodo_actual ?? null;
            }
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
    <div class="mb-4">
        <h4 class="fw-bold mb-0">Bienvenido, {name ?? 'Docente'}</h4>
        <p class="text-muted small">Panel Docente — Universidad CUL</p>
    </div>

    <StatsGrid {role} data={stats} />

    <div class="row mt-4">
        <div class="col-md-6 mb-3">
            <div class="card border-0 shadow-sm p-4 h-100">
                <h5 class="fw-bold mb-2" style="color: #222F56;">
                    <i class="bi bi-clock me-2"></i>Mi Disponibilidad
                </h5>
                <p class="text-muted small mb-3">
                    Registra los bloques horarios en los que estás disponible para el periodo activo.
                </p>
                <a href="/teacher/disponibilidad" class="btn btn-sm text-white" style="background-color: #222F56;">
                    Registrar disponibilidad
                </a>
            </div>
        </div>
        <div class="col-md-6 mb-3">
            <div class="card border-0 shadow-sm p-4 h-100">
                <h5 class="fw-bold mb-2 text-success">
                    <i class="bi bi-calendar-week me-2"></i>Mi Horario
                </h5>
                <p class="text-muted small mb-3">
                    Consulta el horario oficial asignado por la coordinación para el periodo vigente.
                </p>
                <div class="d-flex gap-2">
                    <a href="/teacher/horarios" class="btn btn-success btn-sm">Ver mi horario</a>
                    <a href="/teacher/materias" class="btn btn-outline-secondary btn-sm">Mis materias</a>
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
                </div>
            </div>
        </div>
        {/if}
    </div>
{/if}
