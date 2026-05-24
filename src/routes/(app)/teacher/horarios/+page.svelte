<script lang="ts">
    // ============================================================
    // teacher/horarios/+page.svelte — Horario del Docente
    // ============================================================
    // Muestra el horario oficial asignado al docente por la
    // coordinación usando el componente ScheduleGrid.
    //
    // Proceso de construcción del horario:
    // 1. Carga todos los horarios del sistema (GET /schedules/)
    // 2. Filtra los del docente autenticado en el periodo seleccionado
    // 3. Asigna un color único por materia para diferenciación visual
    // 4. Construye el objeto 'horarioAsignado' con clave "Día-bloque"
    //    que espera el componente ScheduleGrid
    //
    // $effect() recarga el horario al cambiar el periodo.
    // Incluye estilos de impresión para ocultar la UI al imprimir.
    // ============================================================
    import { onMount } from 'svelte';
    import ScheduleGrid from '$lib/components/ScheduleGrid.svelte';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
    import { userName } from '$lib/stores/user';

    const API = "https://gestion-de-horarios-1.onrender.com";

    // Paleta de colores institucionales para diferenciar materias visualmente
    const COLORES = [
        '#222F56', '#F3B105', '#2E86AB', '#A23B72',
        '#F18F01', '#44BBA4', '#E94F37', '#393E41'
    ];

    // Objeto indexado por "Día-bloque" con datos de cada clase
    let horarioAsignado = $state<Record<string, any>>({});
    let periodos = $state<any[]>([]);
    let periodoSeleccionado = $state<number | null>(null);
    let cargando = $state(true);
    let sinHorario = $state(false); // true cuando no hay clases en el periodo

    const getHeaders = () => ({
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    });

    const teacherId = () => localStorage.getItem('user_id');

    async function cargarPeriodos() {
        const res = await fetch(`${API}/academic-periods/`, { headers: getHeaders() });
        if (res.ok) {
            periodos = await res.json();
            // Preselecciona el periodo activo automáticamente
            const activo = periodos.find(p => p.is_active);
            if (activo) periodoSeleccionado = activo.id;
        }
    }

    // ------------------------------------------------------------
    // Carga y construye el horario del docente para el periodo
    // 1. Obtiene todos los horarios del sistema
    // 2. Filtra por teacher_id y period_id del docente autenticado
    // 3. Asigna colores únicos por materia usando colorMap
    // 4. Construye el objeto grid indexado por "Día-bloque"
    // ------------------------------------------------------------
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

                // Asignar un color fijo por materia usando su subject_id como clave
                // El módulo (%) evita que se agoten los colores si hay más de 8 materias
                const colorMap: Record<number, string> = {};
                let colorIdx = 0;
                misPeriodo.forEach((h: any) => {
                    if (!colorMap[h.subject_id]) {
                        colorMap[h.subject_id] = COLORES[colorIdx % COLORES.length];
                        colorIdx++;
                    }
                });

                // Construir objeto con formato que espera ScheduleGrid
                // Clave: "Día-bloque" → Valor: { materia, color, grupo }
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

    // $effect: recarga el horario automáticamente al cambiar el periodo
    $effect(() => {
        if (periodoSeleccionado) cargarHorario();
    });

    onMount(async () => {
        await cargarPeriodos();
    });

    // Imprime el horario usando el diálogo de impresión del navegador
    function imprimirHorario() {
        window.print();
    }
</script>

<div class="container-fluid py-4 h-100 d-flex flex-column">
    <!-- Header con selector de periodo y botón de impresión -->
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
                <i class="bi bi-printer me-1"></i>Imprimir / PDF
            </button>
        </div>
    </div>

    {#if cargando}
        <LoadingSpinner />
    {:else if sinHorario}
        <!-- Estado vacío: el docente no tiene clases en el periodo -->
        <div class="alert alert-warning border-0 shadow-sm d-flex align-items-center">
            <i class="bi bi-calendar-x fs-4 me-3"></i>
            <div>
                <strong>Sin horario asignado</strong>
                <div class="small text-muted">No tienes clases asignadas para este periodo. Contacta a tu coordinador.</div>
            </div>
        </div>
    {:else}
        <!-- Confirmación de horario oficial -->
        <div class="alert alert-success border-0 shadow-sm mb-4 py-2 d-flex align-items-center">
            <i class="bi bi-check-circle-fill fs-5 me-2"></i>
            <small><strong>Horario Confirmado:</strong> Si encuentras alguna inconsistencia, contacta a tu Coordinador de Facultad.</small>
        </div>

        <!-- Leyenda visual: un badge por materia con su color asignado -->
        <!-- filter + findIndex deduplica materias por nombre -->
        <div class="d-flex flex-wrap gap-2 mb-3">
            {#each Object.values(horarioAsignado).filter((v, i, arr) => arr.findIndex(x => x.materia === v.materia) === i) as clase}
                <span class="badge px-3 py-2" style="background-color: {clase.color};">
                    {clase.materia}
                </span>
            {/each}
        </div>

        <!-- Encabezado visible solo al imprimir con nombre del docente -->
        <div class="encabezado-impresion mb-3">
            <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
                <div>
                    <strong style="font-size: 1.1rem;">Docente:</strong>
                    <span style="font-size: 1.1rem;"> {$userName}</span>
                </div>
                <img src="/logo.png" alt="Logo CUL" style="height: 40px;" />
            </div>
        </div>

        <!-- Grid visual del horario (tabla escritorio + tarjetas móvil) -->
        <div class="flex-grow-1">
            <ScheduleGrid horario={horarioAsignado} />
        </div>
    {/if}
</div>

<style>
    /* Oculto en pantalla, visible solo al imprimir (controlado desde app.css global) */
    .encabezado-impresion { display: none; }

    @media print {
        .encabezado-impresion { display: block !important; }
    }
</style>