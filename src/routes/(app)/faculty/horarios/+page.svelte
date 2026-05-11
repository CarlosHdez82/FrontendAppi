<script lang="ts">
    import { onMount } from 'svelte';
    import PageHeader from "$lib/components/PageHeader.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import TableAction from "$lib/components/TableAction.svelte";
    import ConfirmDeleteModal from "$lib/components/ConfirmDeleteModal.svelte";
    import AvailabilityGridReadOnly from "$lib/components/AvailabilityGridReadOnly.svelte";

    const API = "https://gestion-de-horarios-1.onrender.com";

    // --- DATOS ---
    let horarios = $state<any[]>([]);
    let docentes = $state<any[]>([]);
    let materias = $state<any[]>([]);
    let periodos = $state<any[]>([]);
    let cargando = $state(true);

    // --- MODAL FORMULARIO ---
    let modalAbierto = $state(false);
    let editando = $state(false);
    let idSeleccionado = $state<number | null>(null);
    let itemAEliminar = $state("");
    let guardando = $state(false);
    let errorForm = $state("");

    // --- DISPONIBILIDAD DEL DOCENTE SELECCIONADO ---
    let disponibilidadDocente = $state(new Set<string>());
    let cargandoDisponibilidad = $state(false);

    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    let formulario = $state({
        teacher_id: "" as any,
        subject_id: "" as any,
        period_id: "" as any,
        day_of_week: "",
        block_label: "",
        group_code: "A"
    });

    // Clave del bloque seleccionado en el form para resaltarlo en el grid
    let bloqueEnForm = $derived(
        formulario.day_of_week && formulario.block_label
            ? `${formulario.day_of_week}-${formulario.block_label}`
            : ""
    );

    // Bloques ya asignados al docente en ese periodo (para mostrarlos en verde en el grid)
    let bloquesAsignados = $derived(
        (!formulario.teacher_id || !formulario.period_id)
            ? new Set<string>()
            : new Set<string>(
                horarios
                    .filter((h: any) =>
                        String(h.teacher_id) === String(formulario.teacher_id) &&
                        String(h.period_id) === String(formulario.period_id) &&
                        (!editando || h.id !== idSeleccionado)
                    )
                    .map((h: any) => `${h.day_of_week}-${h.block_label}`)
              )
    );

    const headers = [
        { label: "Horario", class: "ps-4" },
        { label: "Docente" },
        { label: "Materia" },
        { label: "Periodo" },
        { label: "Acciones", class: "text-end pe-4" }
    ];

    const getHeaders = () => ({
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
    });

    // --- CARGA INICIAL ---
    async function cargarDatos() {
        cargando = true;
        try {
            const [rH, rD, rM, rP] = await Promise.all([
                fetch(`${API}/schedules/`, { headers: getHeaders() }),
                fetch(`${API}/users/teachers`, { headers: getHeaders() }),
                fetch(`${API}/subjects/`, { headers: getHeaders() }),
                fetch(`${API}/academic-periods/`, { headers: getHeaders() })
            ]);
            if (rH.ok) horarios = await rH.json();
            if (rD.ok) docentes = await rD.json();
            if (rM.ok) materias = await rM.json();
            if (rP.ok) periodos = await rP.json();
        } catch (e) {
            console.error("Error:", e);
        } finally {
            cargando = false;
        }
    }

    // --- CARGAR DISPONIBILIDAD DEL DOCENTE ---
    async function cargarDisponibilidadDocente() {
        if (!formulario.teacher_id || !formulario.period_id) {
            disponibilidadDocente = new Set();
            return;
        }
        cargandoDisponibilidad = true;
        try {
            const res = await fetch(
                `${API}/availability/teacher/${formulario.teacher_id}/${formulario.period_id}`,
                { headers: getHeaders() }
            );
            if (res.ok) {
                const data = await res.json();
                disponibilidadDocente = new Set(data.map((d: any) => `${d.day}-${d.block}`));
            }
        } catch (e) {
            console.error("Error disponibilidad:", e);
        } finally {
            cargandoDisponibilidad = false;
        }
    }

    // Recargar disponibilidad cuando cambia docente o periodo
    $effect(() => {
        if (formulario.teacher_id && formulario.period_id) {
            cargarDisponibilidadDocente();
        }
    });

    // --- ACCIONES ---
    function abrirNuevo() {
        editando = false;
        idSeleccionado = null;
        errorForm = "";
        disponibilidadDocente = new Set();
        formulario = { teacher_id: "", subject_id: "", period_id: "", day_of_week: "", block_label: "", group_code: "A" };
        modalAbierto = true;
    }

    function abrirEdicion(h: any) {
        editando = true;
        idSeleccionado = h.id;
        errorForm = "";
        formulario = {
            teacher_id: h.teacher_id,
            subject_id: h.subject_id,
            period_id: h.period_id,
            day_of_week: h.day_of_week,
            block_label: h.block_label,
            group_code: h.group_code || "A"
        };
        modalAbierto = true;
    }

    async function guardar() {
        errorForm = "";
        if (!formulario.teacher_id || !formulario.subject_id || !formulario.period_id || !formulario.day_of_week || !formulario.block_label) {
            errorForm = "Completa todos los campos obligatorios.";
            return;
        }
        guardando = true;
        try {
            const url = editando ? `${API}/schedules/${idSeleccionado}` : `${API}/schedules/`;
            const res = await fetch(url, {
                method: editando ? "PUT" : "POST",
                headers: getHeaders(),
                body: JSON.stringify(formulario)
            });
            if (res.ok) {
                modalAbierto = false;
                await cargarDatos();
            } else {
                const err = await res.json();
                errorForm = err.detail || "Error al guardar el horario.";
            }
        } catch (e) {
            errorForm = "Error de conexión.";
        } finally {
            guardando = false;
        }
    }

    async function eliminar() {
        const res = await fetch(`${API}/schedules/${idSeleccionado}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        if (res.ok) await cargarDatos();
    }

    // Seleccionar bloque haciendo click en el grid
    function seleccionarBloque(bloqueId: string) {
        if (!disponibilidadDocente.has(bloqueId)) return; // solo si está disponible
        const sep = bloqueId.indexOf('-');
        formulario.day_of_week = bloqueId.substring(0, sep);
        formulario.block_label = bloqueId.substring(sep + 1);
    }

    onMount(cargarDatos);
</script>

<PageHeader 
    title="Horarios Docentes" 
    subtitle="Coordinación — Universidad CUL" 
    buttonText="Nuevo Horario" 
    onButtonClick={abrirNuevo} 
/>

{#if cargando}
    <LoadingSpinner />
{:else}
    <DataTable {headers} data={horarios}>
        {#snippet rowTemplate(h)}
            <tr>
                <td class="ps-4">
                    <span class="fw-bold d-block">{h.day_of_week}</span>
                    <span class="badge bg-light text-primary border">
                        <i class="bi bi-clock me-1"></i>{h.block_label}
                    </span>
                    {#if h.group_code}
                        <span class="badge bg-secondary ms-1">Grupo {h.group_code}</span>
                    {/if}
                </td>
                <td class="fw-medium text-secondary">{h.teacher_name || 'N/A'}</td>
                <td>
                    <div class="fw-semibold text-dark">{h.subject_name || 'N/A'}</div>
                    {#if h.subject_code}
                        <small class="text-muted">{h.subject_code}</small>
                    {/if}
                </td>
                <td class="text-muted small">{h.period_name || 'N/A'}</td>
                <td class="text-end pe-4">
                    <TableAction 
                        itemName={`Horario de ${h.subject_name || 'materia'}`}
                        onEdit={() => abrirEdicion(h)}
                        onDelete={() => { idSeleccionado = h.id; itemAEliminar = `${h.subject_name} (${h.teacher_name})`; }}
                    />
                </td>
            </tr>
        {/snippet}
    </DataTable>
{/if}

<!-- ===== MODAL DE ASIGNACIÓN ===== -->
{#if modalAbierto}
<div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg">

            <!-- Header -->
            <div class="modal-header border-0 pb-0" style="background-color: #222F56;">
                <div>
                    <h5 class="modal-title text-white fw-bold mb-0">
                        <i class="bi bi-calendar-plus me-2"></i>
                        {editando ? 'Editar Horario' : 'Asignar Nuevo Horario'}
                    </h5>
                    <small class="text-white-50">Selecciona docente y periodo para ver su disponibilidad</small>
                </div>
                <button class="btn-close btn-close-white" onclick={() => modalAbierto = false}></button>
            </div>

            <div class="modal-body p-0">
                <div class="row g-0" style="min-height: 500px;">

                    <!-- ===== COLUMNA IZQUIERDA: FORMULARIO ===== -->
                    <div class="col-lg-4 border-end p-4" style="background: #f8f9fa;">
                        <h6 class="fw-bold text-muted text-uppercase small mb-3">
                            <i class="bi bi-pencil-square me-1"></i>Datos del Horario
                        </h6>

                        {#if errorForm}
                            <div class="alert alert-danger py-2 small border-0">{errorForm}</div>
                        {/if}

                        <div class="row g-3">
                            <!-- Docente -->
                            <div class="col-12">
                                <label class="form-label small fw-bold">DOCENTE *</label>
                                <select class="form-select form-select-sm" bind:value={formulario.teacher_id} required>
                                    <option value="" disabled>Seleccione docente...</option>
                                    {#each docentes as d}
                                        <option value={d.id}>{d.first_name} {d.last_name}</option>
                                    {/each}
                                </select>
                            </div>

                            <!-- Periodo -->
                            <div class="col-12">
                                <label class="form-label small fw-bold">PERIODO *</label>
                                <select class="form-select form-select-sm" bind:value={formulario.period_id} required>
                                    <option value="" disabled>Seleccione periodo...</option>
                                    {#each periodos as p}
                                        <option value={p.id}>{p.name}{p.is_active ? ' (activo)' : ''}</option>
                                    {/each}
                                </select>
                            </div>

                            <!-- Materia -->
                            <div class="col-12">
                                <label class="form-label small fw-bold">ASIGNATURA *</label>
                                <select class="form-select form-select-sm" bind:value={formulario.subject_id} required>
                                    <option value="" disabled>Seleccione materia...</option>
                                    {#each materias as m}
                                        <option value={m.id}>{m.name}</option>
                                    {/each}
                                </select>
                            </div>

                            <!-- Día -->
                            <div class="col-12">
                                <label class="form-label small fw-bold">DÍA *</label>
                                <select class="form-select form-select-sm" bind:value={formulario.day_of_week} required>
                                    <option value="" disabled>Seleccione día...</option>
                                    {#each diasSemana as dia}
                                        <option value={dia}>{dia}</option>
                                    {/each}
                                </select>
                            </div>

                            <!-- Bloque -->
                            <div class="col-12">
                                <label class="form-label small fw-bold">BLOQUE HORARIO *</label>
                                <input type="text" class="form-control form-control-sm"
                                    bind:value={formulario.block_label}
                                    placeholder="Ej: 06:00 - 08:00" />
                                {#if disponibilidadDocente.size > 0}
                                    <small class="text-muted">
                                        <i class="bi bi-info-circle me-1"></i>
                                        También puedes hacer clic en un bloque amarillo del grid
                                    </small>
                                {/if}
                            </div>

                            <!-- Grupo -->
                            <div class="col-12">
                                <label class="form-label small fw-bold">GRUPO</label>
                                <input type="text" class="form-control form-control-sm"
                                    bind:value={formulario.group_code}
                                    placeholder="Ej: A, BN, AN" />
                            </div>

                            <!-- Resumen -->
                            {#if formulario.day_of_week && formulario.block_label}
                                <div class="col-12">
                                    <div class="p-2 rounded border border-primary-subtle bg-primary-subtle small">
                                        <i class="bi bi-calendar-check me-1 text-primary"></i>
                                        <strong>{formulario.day_of_week}</strong> · {formulario.block_label}
                                        {#if formulario.group_code} · Grupo <strong>{formulario.group_code}</strong>{/if}
                                        {#if !disponibilidadDocente.has(bloqueEnForm) && disponibilidadDocente.size > 0}
                                            <div class="text-warning mt-1">
                                                <i class="bi bi-exclamation-triangle me-1"></i>
                                                El docente no marcó disponibilidad en este bloque
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>

                    <!-- ===== COLUMNA DERECHA: GRID DE DISPONIBILIDAD ===== -->
                    <div class="col-lg-8 p-4">
                        <h6 class="fw-bold text-muted text-uppercase small mb-3">
                            <i class="bi bi-grid-3x3-gap me-1"></i>
                            Disponibilidad del Docente
                            {#if formulario.teacher_id && formulario.period_id}
                                <span class="text-dark ms-1">
                                    — {docentes.find(d => d.id == formulario.teacher_id)?.first_name}
                                    {docentes.find(d => d.id == formulario.teacher_id)?.last_name}
                                </span>
                            {/if}
                        </h6>

                        {#if !formulario.teacher_id || !formulario.period_id}
                            <div class="d-flex flex-column align-items-center justify-content-center h-75 text-muted">
                                <i class="bi bi-person-lines-fill fs-1 opacity-25 mb-3"></i>
                                <p class="text-center">Selecciona un <strong>docente</strong> y un <strong>periodo</strong><br>para ver su disponibilidad registrada.</p>
                            </div>

                        {:else if cargandoDisponibilidad}
                            <div class="d-flex align-items-center justify-content-center h-75 text-muted">
                                <span class="spinner-border spinner-border-sm me-2"></span> Cargando disponibilidad...
                            </div>

                        {:else if disponibilidadDocente.size === 0}
                            <div class="alert alert-warning border-0 d-flex align-items-center">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                <div>
                                    <strong>Sin disponibilidad registrada</strong>
                                    <div class="small">Este docente no ha registrado disponibilidad para el periodo seleccionado.</div>
                                </div>
                            </div>

                        {:else}
                            <!-- Grid clicable: al hacer clic en un bloque disponible, lo rellena en el form -->
                            <div class="grid-clickable">
                                <AvailabilityGridReadOnly 
                                    disponibilidad={disponibilidadDocente}
                                    bloqueSeleccionado={bloqueEnForm}
                                    bloquesAsignados={bloquesAsignados}
                                    onBloqueClick={seleccionarBloque}
                                />
                            </div>
                            <!-- Overlay de clicks sobre el grid -->
                            <div class="mt-2 small text-muted">
                                <i class="bi bi-hand-index me-1"></i>
                                Haz clic en un bloque <span class="badge" style="background:#F3B105;color:#000;">Libre</span> para seleccionarlo automáticamente
                            </div>
                        {/if}
                    </div>

                </div>
            </div>

            <!-- Footer -->
            <div class="modal-footer border-0 bg-light">
                <button class="btn btn-outline-secondary btn-sm" onclick={() => modalAbierto = false}>
                    Cancelar
                </button>
                <button class="btn btn-sm text-white px-4 shadow-sm"
                        style="background-color: #222F56;"
                        onclick={guardar}
                        disabled={guardando}>
                    {#if guardando}
                        <span class="spinner-border spinner-border-sm me-1"></span>Guardando...
                    {:else}
                        <i class="bi bi-check-lg me-1"></i>{editando ? 'Guardar Cambios' : 'Asignar Horario'}
                    {/if}
                </button>
            </div>
        </div>
    </div>
</div>
{/if}

<ConfirmDeleteModal 
    id="modalEliminar" 
    itemName={`el horario de ${itemAEliminar}`} 
    onDelete={eliminar} 
/>