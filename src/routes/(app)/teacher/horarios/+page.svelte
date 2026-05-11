<script lang="ts">
    import { onMount } from 'svelte';
    import ScheduleGrid from '$lib/components/ScheduleGrid.svelte';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    const API = "https://gestion-de-horarios-1.onrender.com";

    // Colores para diferenciar materias visualmente
    const COLORES = [
        '#222F56', '#F3B105', '#2E86AB', '#A23B72',
        '#F18F01', '#44BBA4', '#E94F37', '#393E41'
    ];

    let horarioAsignado = $state<Record<string, any>>({});
    let periodos = $state<any[]>([]);
    let periodoSeleccionado = $state<number | null>(null);
    let cargando = $state(true);
    let sinHorario = $state(false);

    const getHeaders = () => ({
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    });

    const teacherId = () => localStorage.getItem('user_id');

    async function cargarPeriodos() {
        const res = await fetch(`${API}/academic-periods/`, { headers: getHeaders() });
        if (res.ok) {
            periodos = await res.json();
            const activo = periodos.find(p => p.is_active);
            if (activo) periodoSeleccionado = activo.id;
        }
    }

    async function cargarHorario() {
        if (!periodoSeleccionado || !teacherId()) return;
        cargando = true;
        sinHorario = false;
        try {
            const res = await fetch(`${API}/schedules/`, { headers: getHeaders() });
            if (res.ok) {
                const todos = await res.json();
                // Filtrar solo los horarios de este docente y periodo
                const misPeriodo = todos.filter((h: any) =>
                    String(h.teacher_id) === teacherId() &&
                    h.period_id === periodoSeleccionado
                );

                if (misPeriodo.length === 0) {
                    horarioAsignado = {};
                    sinHorario = true;
                    return;
                }

                // Asignar un color fijo por materia
                const colorMap: Record<number, string> = {};
                let colorIdx = 0;
                misPeriodo.forEach((h: any) => {
                    if (!colorMap[h.subject_id]) {
                        colorMap[h.subject_id] = COLORES[colorIdx % COLORES.length];
                        colorIdx++;
                    }
                });

                // Construir el objeto que espera ScheduleGrid: 'Día-bloque' => {materia, color, grupo}
                const grid: Record<string, any> = {};
                misPeriodo.forEach((h: any) => {
                    const key = `${h.day_of_week}-${h.block_label}`;
                    grid[key] = {
                        materia: h.subject_name || 'Materia',
                        color: colorMap[h.subject_id],
                        grupo: h.group_code || 'A'
                    };
                });
                horarioAsignado = grid;
            }
        } catch (e) {
            console.error("Error cargando horario:", e);
        } finally {
            cargando = false;
        }
    }

    $effect(() => {
        if (periodoSeleccionado) cargarHorario();
    });

    onMount(async () => {
        await cargarPeriodos();
    });

    function imprimirHorario() {
        window.print();
    }
</script>

<div class="container-fluid py-4 h-100 d-flex flex-column">
    <!-- Header -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
            <h2 class="fw-bold mb-1">Mi Horario de Clases</h2>
            <p class="text-muted mb-0">Universidad CUL — Horario oficial asignado por coordinación</p>
        </div>
        <div class="d-flex gap-2 align-items-center flex-wrap">
            <select class="form-select form-select-sm shadow-sm" style="min-width: 160px;"
                    bind:value={periodoSeleccionado}>
                <option value={null} disabled>Selecciona periodo...</option>
                {#each periodos as p}
                    <option value={p.id}>{p.name}{p.is_active ? ' (activo)' : ''}</option>
                {/each}
            </select>
            <button class="btn btn-outline-primary btn-sm shadow-sm" onclick={imprimirHorario}>
                <i class="bi bi-printer me-1"></i>Imprimir
            </button>
        </div>
    </div>

    {#if cargando}
        <LoadingSpinner />
    {:else if sinHorario}
        <div class="alert alert-warning border-0 shadow-sm d-flex align-items-center">
            <i class="bi bi-calendar-x fs-4 me-3"></i>
            <div>
                <strong>Sin horario asignado</strong>
                <div class="small text-muted">No tienes clases asignadas para este periodo. Contacta a tu coordinador.</div>
            </div>
        </div>
    {:else}
        <!-- Alert de estado -->
        <div class="alert alert-success border-0 shadow-sm mb-4 py-2 d-flex align-items-center">
            <i class="bi bi-check-circle-fill fs-5 me-2"></i>
            <small><strong>Horario Confirmado:</strong> Si encuentras alguna inconsistencia, contacta a tu Coordinador de Facultad.</small>
        </div>

        <!-- Leyenda de materias -->
        <div class="d-flex flex-wrap gap-2 mb-3">
            {#each Object.values(horarioAsignado).filter((v, i, arr) => arr.findIndex(x => x.materia === v.materia) === i) as clase}
                <span class="badge px-3 py-2" style="background-color: {clase.color};">
                    {clase.materia}
                </span>
            {/each}
        </div>

        <!-- Grid visual -->
        <div class="flex-grow-1">
            <ScheduleGrid horario={horarioAsignado} />
        </div>
    {/if}
</div>

<style>
    @media print {
        :global(.sidebar-custom), :global(.header-custom), .btn, .alert, select {
            display: none !important;
        }
        .container-fluid { padding: 0 !important; }
    }
</style>
