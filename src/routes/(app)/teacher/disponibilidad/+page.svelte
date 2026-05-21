<script lang="ts">
    // ============================================================
    // teacher/disponibilidad/+page.svelte — Disponibilidad del Docente
    // ============================================================
    // Permite al docente registrar su disponibilidad horaria
    // usando un grid interactivo. El docente hace clic o arrastra
    // para marcar los bloques en que está disponible.
    //
    // Flujo de guardado:
    // 1. DELETE /availability/clear/{teacher_id}/{period_id}
    //    → Limpia toda la disponibilidad anterior del docente
    // 2. POST /availability/ por cada bloque seleccionado
    //    → Guarda cada bloque nuevo en paralelo con Promise.all
    //
    // Este enfoque de "limpiar y reescribir" simplifica la lógica
    // evitando calcular diferencias entre el estado anterior y el nuevo.
    //
    // $effect() recarga la disponibilidad cuando cambia el periodo.
    // ============================================================
    import { onMount } from 'svelte';
    import AvailabilityGrid from '$lib/components/AvailabilityGrid.svelte';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    const API = "https://gestion-de-horarios-1.onrender.com";

    // Set con claves "Día-bloque" de los bloques seleccionados en el grid
    let disponibilidadSeleccionada = $state(new Set<string>());
    // Array derivado del Set para enviar a la API
    let listaParaEnviar = $derived(Array.from(disponibilidadSeleccionada));
    // Bloques que ya tienen horario asignado por el coordinador
    let bloquesAsignados = $state(new Set<string>());
    // Bloques disponibles sin clase asignada (los amarillos del grid)
    let disponiblesLibres = $derived(
        [...disponibilidadSeleccionada].filter(b => !bloquesAsignados.has(b)).length
    );

    let periodos = $state<any[]>([]);
    let periodoSeleccionado = $state<number | null>(null);
    let cargando = $state(true);
    let guardando = $state(false);
    let mensaje = $state<{ tipo: string; texto: string } | null>(null);

    const getHeaders = () => ({
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
    });

    // Obtiene el ID del docente autenticado desde localStorage
    const teacherId = () => localStorage.getItem('user_id');

    // ------------------------------------------------------------
    // Carga los periodos disponibles y preselecciona el activo
    // ------------------------------------------------------------
    async function cargarPeriodos() {
        const res = await fetch(`${API}/academic-periods/`, { headers: getHeaders() });
        if (res.ok) {
            periodos = await res.json();
            const activo = periodos.find(p => p.is_active);
            if (activo) periodoSeleccionado = activo.id;
        }
    }

    // ------------------------------------------------------------
    // Carga la disponibilidad guardada del docente en el periodo
    // Reconstruye el Set con formato "Día-bloque" que usa el grid
    // El backend retorna {day, block} → los une con el separador '-'
    // ------------------------------------------------------------
    async function cargarDisponibilidad() {
        if (!periodoSeleccionado || !teacherId()) return;
        cargando = true;
        try {
            const [resDisp, resHorarios] = await Promise.all([
                fetch(`${API}/availability/teacher/${teacherId()}/${periodoSeleccionado}`, { headers: getHeaders() }),
                fetch(`${API}/schedules/`, { headers: getHeaders() })
            ]);

            if (resDisp.ok) {
                const data = await resDisp.json();
                disponibilidadSeleccionada = new Set(data.map((d: any) => `${d.day}-${d.block}`));
            }

            if (resHorarios.ok) {
                const horarios = await resHorarios.json();
                const tid = Number(teacherId());
                const pid = periodoSeleccionado;
                bloquesAsignados = new Set(
                    horarios
                        .filter((h: any) => h.teacher_id === tid && h.period_id === pid)
                        .map((h: any) => `${h.day_of_week}-${h.block_label}`)
                );
            }
        } catch (e) {
            console.error("Error cargando disponibilidad:", e);
        } finally {
            cargando = false;
        }
    }

    // ------------------------------------------------------------
    // Guarda la disponibilidad usando el patrón "limpiar y reescribir"
    // 1. Elimina todos los bloques anteriores del docente en el periodo
    // 2. Crea todos los bloques seleccionados en paralelo
    // Reporta cuántos se guardaron exitosamente
    // ------------------------------------------------------------
    async function guardarDisponibilidad() {
        if (!periodoSeleccionado) {
            mensaje = { tipo: "warning", texto: "Selecciona un periodo académico primero." };
            return;
        }
        if (disponibilidadSeleccionada.size === 0) {
            mensaje = { tipo: "warning", texto: "Selecciona al menos un bloque de disponibilidad." };
            return;
        }

        guardando = true;
        mensaje = null;
        try {
            // Paso 1: Limpiar disponibilidad anterior
            await fetch(
                `${API}/availability/clear/${teacherId()}/${periodoSeleccionado}`,
                { method: "DELETE", headers: getHeaders() }
            );

            // Paso 2: Construir los objetos para cada bloque seleccionado
            // La clave es "Lunes-06:00 - 08:00"
            // Se separa por el primer '-' para extraer día y bloque
            const bloques = Array.from(disponibilidadSeleccionada).map(id => {
                const separador = id.indexOf('-');
                const dia = id.substring(0, separador);
                const bloque = id.substring(separador + 1);
                return {
                    teacher_id: Number(teacherId()),
                    period_id: periodoSeleccionado,
                    day_of_week: dia,
                    block_label: bloque
                };
            });

            // Paso 3: Guardar todos los bloques en paralelo con Promise.all
            const resultados = await Promise.all(
                bloques.map(b => fetch(`${API}/availability/`, {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify(b)
                }))
            );

            const fallidos = resultados.filter(r => !r.ok).length;
            if (fallidos === 0) {
                mensaje = { tipo: "success", texto: `✅ Se guardaron ${bloques.length} bloques de disponibilidad.` };
            } else {
                mensaje = { tipo: "warning", texto: `Se guardaron ${bloques.length - fallidos} de ${bloques.length} bloques. Algunos ya existían.` };
            }
        } catch (e) {
            mensaje = { tipo: "danger", texto: "Error de conexión. Intenta nuevamente." };
        } finally {
            guardando = false;
        }
    }

    // Limpia la selección del grid sin afectar la BD.
    // Los bloques con clase asignada no se pueden quitar.
    async function limpiarSeleccion() {
        disponibilidadSeleccionada = new Set(bloquesAsignados);
        mensaje = null;
    }

    // $effect: recarga disponibilidad automáticamente al cambiar el periodo
    $effect(() => {
        if (periodoSeleccionado) cargarDisponibilidad();
    });

    onMount(async () => {
        await cargarPeriodos();
    });
</script>

<div class="container-fluid py-4 h-100 d-flex flex-column">
    <!-- Encabezado con selector de periodo y botones de acción -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-3 gap-3">
        <div>
            <h2 class="fw-bold mb-1">Mi Disponibilidad Horaria</h2>
            <p class="text-muted mb-0">Marca los bloques en los que estarás disponible para el periodo seleccionado.</p>
        </div>
        <div class="d-flex gap-2 align-items-start flex-wrap">
            <!-- Selector de periodo: preselecciona el activo automáticamente -->
            <select class="form-select form-select-sm shadow-sm" style="min-width: 160px;"
                    bind:value={periodoSeleccionado}>
                <option value={null} disabled>Selecciona periodo...</option>
                {#each periodos as p}
                    <option value={p.id}>
                        {p.name}{p.is_active ? ' (activo)' : ''}
                    </option>
                {/each}
            </select>
            <!-- Limpiar: resetea el grid sin guardar en la BD -->
            <button class="btn btn-outline-danger btn-sm" onclick={limpiarSeleccion} disabled={guardando}>
                <i class="bi bi-trash me-1"></i>Limpiar
            </button>
            <!-- Guardar: ejecuta el flujo limpiar + reescribir -->
            <button class="btn btn-sm text-white px-3 shadow-sm"
                    style="background-color: #222F56;"
                    onclick={guardarDisponibilidad}
                    disabled={guardando}>
                {#if guardando}
                    <span class="spinner-border spinner-border-sm me-1"></span>Guardando...
                {:else}
                    <i class="bi bi-save me-1"></i>Guardar Cambios
                {/if}
            </button>
        </div>
    </div>

    <!-- Mensaje de éxito, advertencia o error después de guardar -->
    {#if mensaje}
        <div class="alert alert-{mensaje.tipo} border-0 shadow-sm py-2 mb-3" role="alert">
            {mensaje.texto}
        </div>
    {/if}

    <!-- Instrucciones de uso del grid interactivo -->
    <div class="alert alert-info border-0 shadow-sm mb-2 py-2 d-flex align-items-center" role="alert">
        <i class="bi bi-info-circle-fill fs-5 me-2 text-primary"></i>
        <small><strong>Instrucciones:</strong> Haz clic en una celda para seleccionarla o <strong>mantén presionado y arrastra</strong> para marcar múltiples bloques.</small>
    </div>

    <!-- Leyenda de colores -->
    <div class="d-flex gap-3 flex-wrap mb-3">
        <span class="d-flex align-items-center gap-1 small">
            <span class="d-inline-block rounded" style="width:16px;height:16px;background:#F3B105;border:1px solid #d99e04;"></span>
            Disponible
        </span>
        <span class="d-flex align-items-center gap-1 small">
            <span class="d-inline-block rounded" style="width:16px;height:16px;background:#198754;border:1px solid #146c43;"></span>
            Con clase asignada
        </span>
        <span class="d-flex align-items-center gap-1 small">
            <span class="d-inline-block rounded" style="width:16px;height:16px;background:#ffffff;border:1px solid #dee2e6;"></span>
            No disponible
        </span>
    </div>

    <!-- Grid interactivo de disponibilidad -->
    {#if cargando}
        <LoadingSpinner />
    {:else}
        <div class="flex-grow-1 overflow-hidden">
            <AvailabilityGrid bind:seleccion={disponibilidadSeleccionada} {bloquesAsignados} />
        </div>
    {/if}

    <!-- Resumen de bloques seleccionados y horas totales -->
    <div class="mt-3 p-3 bg-white border-top shadow-sm rounded-top d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div class="d-flex flex-wrap gap-3 align-items-center">
            <span class="small">
                <span class="text-muted me-1">Disponibles:</span>
                <span class="badge" style="background-color: #F3B105; color: #000;">{disponiblesLibres}</span>
            </span>
            <span class="small">
                <span class="text-muted me-1">Con clase asignada:</span>
                <span class="badge bg-success">{bloquesAsignados.size}</span>
            </span>
            <span class="small">
                <span class="text-muted me-1">Horas disponibles:</span>
                <!-- Cada bloque equivale a 2 horas según el modelo de la CUL -->
                <span class="badge" style="background-color: #222F56;">{disponiblesLibres * 2} hrs</span>
            </span>
        </div>
        <div class="text-muted small">Zona horaria: Colombia (UTC-5)</div>
    </div>
</div>