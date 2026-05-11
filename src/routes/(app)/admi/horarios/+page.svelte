<script lang="ts">
    import { onMount } from 'svelte';
    import PageHeader from "$lib/components/PageHeader.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import TableAction from "$lib/components/TableAction.svelte";
    import FormModal from "$lib/components/FormModal.svelte";
    import ConfirmDeleteModal from "$lib/components/ConfirmDeleteModal.svelte";

    const API = "https://gestion-de-horarios-1.onrender.com";

    // --- ESTADOS ---
    let horarios = $state<any[]>([]);
    let docentes = $state<any[]>([]);
    let materias = $state<any[]>([]);
    let periodos = $state<any[]>([]);
    let cargando = $state(true);
    let editando = $state(false);
    let idSeleccionado = $state<number | null>(null);
    let itemAEliminar = $state("");

    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    let formulario = $state({
        teacher_id: "",
        subject_id: "",
        period_id: "",
        day_of_week: "",
        block_label: "",
        group_code: "A"
    });

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
            console.error("Error de conexión CUL:", e);
        } finally {
            cargando = false;
        }
    }

    function prepararNuevo() {
        editando = false;
        idSeleccionado = null;
        formulario = {
            teacher_id: "", subject_id: "", period_id: "",
            day_of_week: "", block_label: "", group_code: "A"
        };
    }

    function prepararEdicion(h: any) {
        editando = true;
        idSeleccionado = h.id;
        formulario = {
            teacher_id: h.teacher_id,
            subject_id: h.subject_id,
            period_id: h.period_id,
            day_of_week: h.day_of_week,
            block_label: h.block_label,
            group_code: h.group_code || "A"
        };
    }

    async function guardar() {
        const url = editando
            ? `${API}/schedules/${idSeleccionado}`
            : `${API}/schedules/`;

        const res = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: getHeaders(),
            body: JSON.stringify(formulario)
        });

        if (res.ok) await cargarDatos();
    }

    async function eliminar() {
        const res = await fetch(`${API}/schedules/${idSeleccionado}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        if (res.ok) await cargarDatos();
    }

    onMount(cargarDatos);
</script>

<PageHeader 
    title="Horarios Docentes" 
    subtitle="Sistema de Gestión - Universidad CUL" 
    buttonText="Nuevo Horario" 
    onButtonClick={prepararNuevo} 
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
                        onEdit={() => prepararEdicion(h)}
                        onDelete={() => { 
                            idSeleccionado = h.id; 
                            itemAEliminar = `${h.subject_name} (${h.teacher_name})`; 
                        }}
                    />
                </td>
            </tr>
        {/snippet}
    </DataTable>
{/if}

<FormModal id="modalPrincipal" title="Horario" isEdit={editando} onSave={guardar}>
    <div class="row g-3 text-start">
        <div class="col-12">
            <label for="teacher_id" class="form-label small fw-bold text-muted">DOCENTE</label>
            <select id="teacher_id" class="form-select" bind:value={formulario.teacher_id} required>
                <option value="" disabled>Seleccione un docente...</option>
                {#each docentes as d}
                    <option value={d.id}>{d.first_name} {d.last_name}</option>
                {/each}
            </select>
        </div>

        <div class="col-md-6">
            <label for="subject_id" class="form-label small fw-bold text-muted">ASIGNATURA</label>
            <select id="subject_id" class="form-select" bind:value={formulario.subject_id} required>
                <option value="" disabled>Seleccione materia...</option>
                {#each materias as m}
                    <option value={m.id}>{m.name}</option>
                {/each}
            </select>
        </div>

        <div class="col-md-6">
            <label for="period_id" class="form-label small fw-bold text-muted">PERIODO</label>
            <select id="period_id" class="form-select" bind:value={formulario.period_id} required>
                <option value="" disabled>Seleccione periodo...</option>
                {#each periodos as p}
                    <option value={p.id}>{p.name}</option>
                {/each}
            </select>
        </div>

        <div class="col-md-4">
            <label for="day_of_week" class="form-label small fw-bold text-muted">DÍA</label>
            <select id="day_of_week" class="form-select" bind:value={formulario.day_of_week} required>
                <option value="" disabled>Seleccione día...</option>
                {#each diasSemana as dia}
                    <option value={dia}>{dia}</option>
                {/each}
            </select>
        </div>

        <div class="col-md-4">
            <label for="block_label" class="form-label small fw-bold text-muted">BLOQUE HORARIO</label>
            <input type="text" id="block_label" class="form-control"
                   bind:value={formulario.block_label}
                   placeholder="Ej: 07:00-09:00" required>
        </div>

        <div class="col-md-4">
            <label for="group_code" class="form-label small fw-bold text-muted">GRUPO</label>
            <input type="text" id="group_code" class="form-control"
                   bind:value={formulario.group_code}
                   placeholder="Ej: A, BN, AN" />
        </div>
    </div>
</FormModal>

<ConfirmDeleteModal 
    id="modalEliminar" 
    itemName={`el horario de ${itemAEliminar}`} 
    onDelete={eliminar} 
/>
