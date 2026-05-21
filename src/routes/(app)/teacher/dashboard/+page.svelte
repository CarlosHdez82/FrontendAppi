<script lang="ts">
    // ============================================================
    // teacher/dashboard/+page.svelte — Dashboard del Docente
    // ============================================================
    // Página principal del docente. Muestra métricas relevantes
    // y accesos rápidos a disponibilidad, horario y materias.
    // También muestra el periodo académico activo si existe.
    // ============================================================
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
        const tid = Number(localStorage.getItem('user_id'));
        const headers = { "Authorization": `Bearer ${token}` };
        try {
            // Paso 1: stats generales + periodos en paralelo
            const [resStats, resPeriodos] = await Promise.all([
                fetch(`${API}/stats/summary`, { headers }),
                fetch(`${API}/academic-periods/`, { headers })
            ]);

            if (resStats.ok) {
                const data = await resStats.json();
                stats = data;
                periodoActivo = data.periodo_actual ?? null;
            }

            // Obtener el ID del periodo activo para los endpoints de docente
            let periodoActivoId: number | null = null;
            if (resPeriodos.ok) {
                const periodos = await resPeriodos.json();
                const activo = periodos.find((p: any) => p.is_active);
                if (activo) periodoActivoId = activo.id;
            }

            // Paso 2: disponibilidad + horarios del docente en paralelo
            // Solo si hay periodo activo e ID de docente válidos
            if (periodoActivoId && tid) {
                const [resDisp, resHorarios] = await Promise.all([
                    fetch(`${API}/availability/teacher/${tid}/${periodoActivoId}`, { headers }),
                    fetch(`${API}/schedules/`, { headers })
                ]);

                let disponibilidad = new Set<string>();
                let asignados = new Set<string>();

                if (resDisp.ok) {
                    const data = await resDisp.json();
                    disponibilidad = new Set(data.map((d: any) => `${d.day}-${d.block}`));
                }

                let horasAsignadas = 0;
                let materiasUnicas = 0;

                if (resHorarios.ok) {
                    const horarios = await resHorarios.json();
                    const misHorarios = horarios.filter(
                        (h: any) => h.teacher_id === tid && h.period_id === periodoActivoId
                    );

                    asignados = new Set(misHorarios.map((h: any) => `${h.day_of_week}-${h.block_label}`));

                    // Cada bloque equivale a 2 horas según el modelo de la CUL
                    horasAsignadas = misHorarios.length * 2;

                    // Materias únicas por subject_id (un docente puede tener varios grupos de la misma materia)
                    materiasUnicas = new Set(misHorarios.map((h: any) => h.subject_id)).size;
                }

                // Bloques disponibles sin clase asignada (equivale a los amarillos del grid)
                const libres = [...disponibilidad].filter(b => !asignados.has(b)).length;
                stats = { ...stats, disponibilidades: libres, horarios: horasAsignadas, materias: materiasUnicas };
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
    <!-- Saludo personalizado con el nombre del docente -->
    <div class="mb-4">
        <h4 class="fw-bold mb-0">Bienvenido, {name ?? 'Docente'}</h4>
        <p class="text-muted small">Panel Docente — Universidad CUL</p>
    </div>

    <!-- Tarjetas de métricas filtradas por rol docente -->
    <StatsGrid {role} data={stats} />

    <div class="row mt-4">
        <!-- Acceso rápido a disponibilidad del docente -->
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
        <!-- Acceso rápido a horario y materias -->
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
        <!-- Banner del periodo activo: visible solo si la API retorna periodo_actual -->
        {#if periodoActivo}
        <div class="col-12 mb-3">
            <div class="card border-0 shadow-sm p-3">
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