<script lang="ts">
    import { onMount } from 'svelte';
    import SubjectsCard from '$lib/components/SubjectsCard.svelte';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    const API = "https://gestion-de-horarios-1.onrender.com";

    let materias = $state<any[]>([]);
    let periodos = $state<any[]>([]);
    let periodoSeleccionado = $state<number | null>(null);
    let cargando = $state(true);
    let filtro = $state('');

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

    async function cargarMaterias() {
        if (!periodoSeleccionado || !teacherId()) return;
        cargando = true;
        try {
            const res = await fetch(`${API}/schedules/`, { headers: getHeaders() });
            if (res.ok) {
                const todos = await res.json();
                // Filtrar horarios de este docente y periodo
                const misHorarios = todos.filter((h: any) =>
                    String(h.teacher_id) === teacherId() &&
                    h.period_id === periodoSeleccionado
                );

                // Deduplicar por materia y armar el formato para SubjectsCard
                const materiasMap = new Map();
                misHorarios.forEach((h: any) => {
                    if (!materiasMap.has(h.subject_id)) {
                        materiasMap.set(h.subject_id, {
                            id: h.subject_id,
                            nombre: h.subject_name || 'Sin nombre',
                            codigo: h.subject_code || '---',
                            programa: h.period_name || '',
                            intensidad: 0,
                            grupo: h.group_code || 'A',
                            bloques: []
                        });
                    }
                    // Acumular bloques y calcular intensidad
                    const mat = materiasMap.get(h.subject_id);
                    mat.bloques.push(`${h.day_of_week} ${h.block_label}`);
                    mat.intensidad += 2; // cada bloque = 2 horas
                });

                materias = Array.from(materiasMap.values());
            }
        } catch (e) {
            console.error("Error:", e);
        } finally {
            cargando = false;
        }
    }

    $effect(() => {
        if (periodoSeleccionado) cargarMaterias();
    });

    onMount(async () => {
        await cargarPeriodos();
    });
</script>

<div class="container-fluid py-4">
    <!-- Encabezado y controles -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
            <h2 class="fw-bold mb-1">Mis Materias</h2>
            <p class="text-muted mb-0">Carga académica del periodo seleccionado.</p>
        </div>
        <div class="d-flex gap-2 flex-wrap align-items-center">
            <!-- Selector de periodo -->
            <select class="form-select form-select-sm shadow-sm" style="min-width: 160px;"
                    bind:value={periodoSeleccionado}>
                <option value={null} disabled>Selecciona periodo...</option>
                {#each periodos as p}
                    <option value={p.id}>{p.name}{p.is_active ? ' (activo)' : ''}</option>
                {/each}
            </select>
            <!-- Buscador -->
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

    <!-- Contenido -->
    {#if cargando}
        <LoadingSpinner />
    {:else if materiasFiltradas.length > 0}
        <div class="row g-4">
            {#each materiasFiltradas as materia (materia.id)}
                <div class="col-12 col-md-6 col-xl-4">
                    <SubjectsCard {materia} />
                </div>
            {/each}
        </div>
    {:else if materias.length === 0}
        <div class="text-center py-5">
            <i class="bi bi-journal-x fs-1 text-muted"></i>
            <p class="mt-3 text-muted">No tienes materias asignadas para este periodo.</p>
            <small class="text-muted">Contacta a tu coordinador si crees que esto es un error.</small>
        </div>
    {:else}
        <div class="text-center py-5">
            <i class="bi bi-search fs-1 text-muted"></i>
            <p class="mt-3 text-muted">No encontramos materias que coincidan con "{filtro}"</p>
        </div>
    {/if}
</div>
