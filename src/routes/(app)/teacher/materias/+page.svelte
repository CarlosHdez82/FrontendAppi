<script lang="ts">
    // ============================================================
    // teacher/materias/+page.svelte — Materias del Docente
    // ============================================================
    // Muestra las materias asignadas al docente en el periodo
    // seleccionado usando tarjetas visuales (SubjectsCard).
    //
    // Proceso de construcción:
    // 1. Carga todos los horarios del sistema
    // 2. Filtra los del docente autenticado en el periodo
    // 3. Deduplica por materia usando Map (un docente puede tener
    //    varios grupos de la misma materia)
    // 4. Acumula bloques y calcula intensidad (2 horas por bloque)
    //
    // Incluye búsqueda reactiva con $derived para filtrar materias
    // en tiempo real sin llamadas adicionales a la API.
    // ============================================================
    import { onMount } from 'svelte';
    import SubjectsCard from '$lib/components/SubjectsCard.svelte';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    const API = "https://gestion-de-horarios-1.onrender.com";

    let materias = $state<any[]>([]);
    let periodos = $state<any[]>([]);
    let periodoSeleccionado = $state<number | null>(null);
    let cargando = $state(true);
    let filtro = $state(''); // Texto del buscador

    // Filtra materias reactivamente según el texto del buscador
    // $derived recalcula automáticamente cuando filtro o materias cambian
    let materiasFiltradas = $derived(
        materias.filter(m => m.nombre.toLowerCase().includes(filtro.toLowerCase()))
    );

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

    // ------------------------------------------------------------
    // Carga y construye las materias del docente para el periodo
    // Usa Map para deduplicar: un docente puede tener múltiples
    // grupos de la misma materia (Grupo A, Grupo B, etc.)
    // Por cada horario acumula bloques y suma 2 horas de intensidad
    // ------------------------------------------------------------
    async function cargarMaterias() {
        if (!periodoSeleccionado || !teacherId()) return;
        cargando = true;
        try {
            const res = await fetch(`${API}/schedules/`, { headers: getHeaders() });
            if (res.ok) {
                const todos = await res.json();

                // Filtrar horarios del docente en el periodo seleccionado
                const misHorarios = todos.filter((h: any) =>
                    String(h.teacher_id) === teacherId() &&
                    h.period_id === periodoSeleccionado
                );

                // Map para deduplicar materias por subject_id
                const materiasMap = new Map();
                misHorarios.forEach((h: any) => {
                    if (!materiasMap.has(h.subject_id)) {
                        materiasMap.set(h.subject_id, {
                            id: h.subject_id,
                            nombre: h.subject_name || 'Sin nombre',
                            codigo: h.subject_code || '---',
                            programa: h.period_name || '',
                            intensidad: 0,  // Se acumula por cada bloque
                            grupo: h.group_code || 'A',
                            bloques: []     // Lista de "Día Bloque" para mostrar
                        });
                    }
                    // Acumular bloques y calcular intensidad horaria
                    const mat = materiasMap.get(h.subject_id);
                    mat.bloques.push(`${h.day_of_week} ${h.block_label}`);
                    mat.intensidad += 2; // Cada bloque = 2 horas académicas
                });

                materias = Array.from(materiasMap.values());
            }
        } catch (e) {
            console.error("Error:", e);
        } finally {
            cargando = false;
        }
    }

    // $effect: recarga materias automáticamente al cambiar el periodo
    $effect(() => {
        if (periodoSeleccionado) cargarMaterias();
    });

    onMount(async () => {
        await cargarPeriodos();
    });
</script>

<div class="container-fluid py-4">
    <!-- Encabezado con selector de periodo y buscador -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
            <h2 class="fw-bold mb-1">Mis Materias</h2>
            <p class="text-muted mb-0">Carga académica del periodo seleccionado.</p>
        </div>
        <div class="d-flex gap-2 flex-wrap align-items-center">
            <!-- Selector de periodo: preselecciona el activo -->
            <select class="form-select form-select-sm shadow-sm" style="min-width: 160px;"
                    bind:value={periodoSeleccionado}>
                <option value={null} disabled>Selecciona periodo...</option>
                {#each periodos as p}
                    <option value={p.id}>{p.name}{p.is_active ? ' (activo)' : ''}</option>
                {/each}
            </select>
            <!-- Buscador reactivo: filtra en tiempo real sin llamadas a la API -->
            <div class="input-group input-group-sm shadow-sm rounded-pill overflow-hidden" style="min-width: 240px;">
                <span class="input-group-text bg-white border-end-0">
                    <i class="bi bi-search text-muted"></i>
                </span>
                <input type="text" class="form-control border-start-0"
                       placeholder="Buscar materia..."
                       bind:value={filtro} />
            </div>
        </div>
    </div>

    {#if cargando}
        <LoadingSpinner />
    {:else if materiasFiltradas.length > 0}
        <!-- Grid de tarjetas: 1 col móvil, 2 col tablet, 3 col escritorio -->
        <div class="row g-4">
            {#each materiasFiltradas as materia (materia.id)}
                <div class="col-12 col-md-6 col-xl-4">
                    <SubjectsCard {materia} />
                </div>
            {/each}
        </div>
    {:else if materias.length === 0}
        <!-- Estado vacío: sin materias asignadas en el periodo -->
        <div class="text-center py-5">
            <i class="bi bi-journal-x fs-1 text-muted"></i>
            <p class="mt-3 text-muted">No tienes materias asignadas para este periodo.</p>
            <small class="text-muted">Contacta a tu coordinador si crees que esto es un error.</small>
        </div>
    {:else}
        <!-- Estado sin resultados: el filtro no encontró coincidencias -->
        <div class="text-center py-5">
            <i class="bi bi-search fs-1 text-muted"></i>
            <p class="mt-3 text-muted">No encontramos materias que coincidan con "{filtro}"</p>
        </div>
    {/if}
</div>